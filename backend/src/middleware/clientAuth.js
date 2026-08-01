const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const Client = require("../models/Client");
const User = require("../models/User");

// Vérifie un JWT "client" (distinct du JWT staff: purpose = "client").
// Bloque la requête si absent/invalide.
const protectClient = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Non autorisé, aucun token client fourni");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== "client") {
      res.status(401);
      throw new Error("Token invalide pour ce type de compte");
    }
    req.client = await Client.findById(decoded.id);
    if (!req.client || !req.client.isActive) {
      res.status(401);
      throw new Error("Compte client introuvable ou désactivé");
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Non autorisé, token invalide ou expiré");
  }
});

// Variante non bloquante: attache req.client si un token client valide est fourni,
// sinon laisse passer (utile pour les routes utilisées à la fois par les clients
// via l'app mobile ET par la réception qui agit pour un client au comptoir).
const optionalClientAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose === "client") {
      const client = await Client.findById(decoded.id);
      if (client && client.isActive) req.client = client;
    }
  } catch (e) {
    // Token invalide: on ignore silencieusement, la route reste accessible
    // en mode "réception agit pour un client" si applicable.
  }
  next();
});

// Exige qu'un token valide soit fourni, qu'il s'agisse d'un client (app mobile) ou
// d'un membre du personnel (back-office). Attache req.client OU req.user en conséquence.
// Utilisé sur les routes où client ET réception doivent pouvoir agir (ex: créer une
// réservation, une demande de conciergerie...) — évite qu'une requête totalement anonyme
// puisse agir au nom d'un client en devinant simplement son ID.
const requireClientOrStaff = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401);
    throw new Error("Non autorisé, connectez-vous (client ou personnel)");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    res.status(401);
    throw new Error("Token invalide ou expiré");
  }

  if (decoded.purpose === "client") {
    req.client = await Client.findById(decoded.id);
    if (!req.client || !req.client.isActive) {
      res.status(401);
      throw new Error("Compte client introuvable ou désactivé");
    }
  } else {
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user || !req.user.isActive) {
      res.status(401);
      throw new Error("Compte introuvable ou désactivé");
    }
  }

  next();
});

module.exports = { protectClient, optionalClientAuth, requireClientOrStaff };
