const asyncHandler = require("../middleware/asyncHandler");
const jwt = require("jsonwebtoken");
const Client = require("../models/Client");
const Reservation = require("../models/Reservation");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const ConciergeRequest = require("../models/ConciergeRequest");
const ActivityBooking = require("../models/ActivityBooking");

const generateClientToken = (id) =>
  jwt.sign({ id, purpose: "client" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

const generateClientRefreshToken = (id) =>
  jwt.sign({ id, purpose: "client" }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });

// @desc    Inscription self-service depuis l'application mobile client
// @route   POST /api/client-auth/register
const registerClient = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, nationality } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Le mot de passe doit contenir au moins 6 caractères");
  }

  const existing = await Client.findOne({ email });
  if (existing && existing.hasAccount) {
    res.status(400);
    throw new Error("Un compte existe déjà avec cet email");
  }

  let client;
  if (existing && !existing.hasAccount) {
    // Le client existait déjà côté réception (ex: séjour passé) mais n'avait pas de compte
    existing.password = password;
    existing.hasAccount = true;
    existing.phone = phone || existing.phone;
    client = await existing.save();
  } else {
    client = await Client.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      nationality,
      hasAccount: true,
    });
  }

  const accessToken = generateClientToken(client._id);
  const refreshToken = generateClientRefreshToken(client._id);
  client.refreshToken = refreshToken;
  await client.save();

  res.status(201).json({
    success: true,
    data: {
      id: client._id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Connexion client (app mobile)
// @route   POST /api/client-auth/login
const loginClient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const client = await Client.findOne({ email, hasAccount: true }).select("+password");
  if (!client || !(await client.matchPassword(password))) {
    res.status(401);
    throw new Error("Email ou mot de passe incorrect");
  }
  if (!client.isActive) {
    res.status(403);
    throw new Error("Ce compte a été désactivé");
  }

  const accessToken = generateClientToken(client._id);
  const refreshToken = generateClientRefreshToken(client._id);
  client.refreshToken = refreshToken;
  await client.save();

  res.json({
    success: true,
    data: {
      id: client._id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      vipStatus: client.vipStatus,
      loyaltyPoints: client.loyaltyPoints,
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Rafraîchir le token client
// @route   POST /api/client-auth/refresh
const refreshClientToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(401);
    throw new Error("Aucun refresh token fourni");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (e) {
    res.status(401);
    throw new Error("Refresh token invalide ou expiré");
  }
  if (decoded.purpose !== "client") {
    res.status(401);
    throw new Error("Token invalide");
  }

  const client = await Client.findById(decoded.id).select("+refreshToken");
  if (!client || client.refreshToken !== refreshToken) {
    res.status(401);
    throw new Error("Refresh token invalide");
  }

  const accessToken = generateClientToken(client._id);
  res.json({ success: true, data: { accessToken } });
});

// @desc    Profil du client connecté
// @route   GET /api/client-auth/me
const getClientMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.client });
});

// @desc    Mise à jour du profil (nom, téléphone, photo...)
// @route   PUT /api/client-auth/me
const updateClientMe = asyncHandler(async (req, res) => {
  const { password, email, hasAccount, ...updates } = req.body; // champs sensibles non modifiables ici
  const client = await Client.findByIdAndUpdate(req.client._id, updates, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: client });
});

// @desc    Déconnexion
// @route   POST /api/client-auth/logout
const logoutClient = asyncHandler(async (req, res) => {
  req.client.refreshToken = null;
  await req.client.save();
  res.json({ success: true, message: "Déconnecté" });
});

// @desc    Historique complet du client connecté: séjours, commandes, factures,
//          demandes de conciergerie, activités réservées. Répond à "Historique séjours"
//          et "Consulter sa facture" de l'app mobile client.
// @route   GET /api/client-auth/me/history
const getClientHistory = asyncHandler(async (req, res) => {
  const clientId = req.client._id;

  const [reservations, orders, invoices, conciergeRequests, activityBookings] = await Promise.all([
    Reservation.find({ client: clientId })
      .populate({ path: "room", populate: "category" })
      .sort({ checkInDate: -1 }),
    Order.find({ client: clientId }).sort({ createdAt: -1 }).limit(50),
    Invoice.find({ client: clientId }).sort({ createdAt: -1 }),
    ConciergeRequest.find({ client: clientId }).sort({ createdAt: -1 }),
    ActivityBooking.find({ client: clientId }).populate("activity", "name category price").sort({ date: -1 }),
  ]);

  res.json({
    success: true,
    data: { reservations, orders, invoices, conciergeRequests, activityBookings },
  });
});

// @desc    Factures du client connecté uniquement (raccourci pratique)
// @route   GET /api/client-auth/me/invoices
const getClientInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ client: req.client._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: invoices });
});

module.exports = {
  registerClient,
  loginClient,
  refreshClientToken,
  getClientMe,
  updateClientMe,
  logoutClient,
  getClientHistory,
  getClientInvoices,
};
