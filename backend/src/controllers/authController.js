const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const { generateQRCode } = require("../utils/qrGenerator");

// @desc    Inscription (créé par un admin en général, ou self-service client)
// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Un utilisateur avec cet email existe déjà");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: role || "employee",
  });

  res.status(201).json({
    success: true,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Connexion (étape 1). Si le 2FA est activé, ne renvoie pas de token final
//          mais un "pendingToken" de courte durée à utiliser sur POST /api/auth/2fa/verify-login
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +twoFactorSecret");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Email ou mot de passe incorrect");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Ce compte a été désactivé");
  }

  if (user.twoFactorEnabled) {
    // Jeton temporaire (2 minutes) prouvant que email/mot de passe sont corrects,
    // sans encore donner accès à l'API tant que le code OTP n'est pas vérifié.
    const pendingToken = jwt.sign({ id: user._id, purpose: "2fa_pending" }, process.env.JWT_SECRET, {
      expiresIn: "2m",
    });
    return res.json({
      success: true,
      twoFactorRequired: true,
      data: { pendingToken },
    });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      accessToken,
    },
  });
});

// @desc    Connexion (étape 2, uniquement si le 2FA est activé) — vérifie le code OTP
//          et délivre les tokens finaux.
// @route   POST /api/auth/2fa/verify-login
const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { pendingToken, code } = req.body;

  let decoded;
  try {
    decoded = jwt.verify(pendingToken, process.env.JWT_SECRET);
  } catch (e) {
    res.status(401);
    throw new Error("Session de connexion expirée, veuillez vous reconnecter");
  }
  if (decoded.purpose !== "2fa_pending") {
    res.status(401);
    throw new Error("Jeton invalide");
  }

  const user = await User.findById(decoded.id).select("+twoFactorSecret");
  if (!user || !user.twoFactorEnabled) {
    res.status(400);
    throw new Error("2FA non activé pour ce compte");
  }

  const isValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: code,
    window: 1, // tolère un léger décalage d'horloge (±30s)
  });
  if (!isValid) {
    res.status(401);
    throw new Error("Code de vérification invalide");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      accessToken,
    },
  });
});

// @desc    Démarre l'activation du 2FA: génère un secret TOTP + QR code à scanner
//          (Google Authenticator, Authy...). Le 2FA n'est activé qu'après confirmation.
// @route   POST /api/auth/2fa/enable
const enable2FA = asyncHandler(async (req, res) => {
  const secret = speakeasy.generateSecret({
    name: `SmartHotel (${req.user.email})`,
  });

  req.user.twoFactorSecret = secret.base32;
  await req.user.save();

  const qrCode = await generateQRCode(secret.otpauth_url);

  res.json({
    success: true,
    message: "Scannez ce QR code avec Google Authenticator/Authy, puis confirmez avec POST /api/auth/2fa/confirm",
    data: { qrCode, manualEntryKey: secret.base32 },
  });
});

// @desc    Confirme l'activation du 2FA après vérification d'un premier code
// @route   POST /api/auth/2fa/confirm
const confirm2FA = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const user = await User.findById(req.user._id).select("+twoFactorSecret");

  if (!user.twoFactorSecret) {
    res.status(400);
    throw new Error("Aucune procédure d'activation 2FA en cours. Appelez d'abord /2fa/enable");
  }

  const isValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: code,
    window: 1,
  });
  if (!isValid) {
    res.status(401);
    throw new Error("Code invalide");
  }

  user.twoFactorEnabled = true;
  await user.save();

  res.json({ success: true, message: "2FA activé avec succès" });
});

// @desc    Désactive le 2FA (nécessite le mot de passe pour confirmation)
// @route   POST /api/auth/2fa/disable
const disable2FA = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Mot de passe incorrect");
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  await user.save();

  res.json({ success: true, message: "2FA désactivé" });
});

// @desc    Rafraîchir le token d'accès
// @route   POST /api/auth/refresh
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error("Aucun refresh token fourni");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (e) {
    res.status(401);
    throw new Error("Refresh token invalide ou expiré");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    res.status(401);
    throw new Error("Refresh token invalide");
  }

  const accessToken = generateAccessToken(user._id);
  res.json({ success: true, data: { accessToken } });
});

// @desc    Déconnexion
// @route   POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    req.user.refreshToken = null;
    await req.user.save();
  }
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Déconnecté" });
});

// @desc    Profil de l'utilisateur connecté
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = {
  register,
  login,
  verifyLoginOtp,
  enable2FA,
  confirm2FA,
  disable2FA,
  refreshToken,
  logout,
  getMe,
};
