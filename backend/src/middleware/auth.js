const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");

// Vérifie le JWT (header Authorization: Bearer <token>)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Non autorisé, aucun token fourni");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || !req.user.isActive) {
      res.status(401);
      throw new Error("Compte introuvable ou désactivé");
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Non autorisé, token invalide ou expiré");
  }
});

module.exports = { protect };
