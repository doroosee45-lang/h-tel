const asyncHandler = require("../middleware/asyncHandler");
const DigitalKey = require("../models/DigitalKey");
const Reservation = require("../models/Reservation");
const lockGateway = require("../services/lockGateway");
const { issueKeyForReservation } = require("../services/digitalKeyService");

// @desc    Émet une clé numérique pour une réservation (appelé automatiquement au
//          check-in, ou manuellement par la réception).
// @route   POST /api/locks/issue
// Body: { reservationId, deviceId? }
const issueDigitalKey = asyncHandler(async (req, res) => {
  const { reservationId, deviceId } = req.body;

  const reservation = await Reservation.findById(reservationId).populate("room");
  if (!reservation) {
    res.status(404);
    throw new Error("Réservation non trouvée");
  }
  if (reservation.status !== "checked_in") {
    res.status(400);
    throw new Error("Le client doit avoir effectué le check-in avant l'émission d'une clé numérique");
  }

  const { key, hardwareSync } = await issueKeyForReservation(req, reservation, reservation.room, deviceId);

  res.status(201).json({ success: true, data: key, hardwareSync });
});

// @desc    Le client récupère ses clés numériques actives (pour affichage/scan dans l'app)
// @route   GET /api/locks/mine
const getMyKeys = asyncHandler(async (req, res) => {
  const keys = await DigitalKey.find({ client: req.client._id, status: "active" })
    .populate("room", "number")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: keys });
});

// @desc    Validation d'un token par la passerelle matérielle de la serrure (ou par
//          l'app personnel en mode "déverrouillage assisté" si aucune serrure connectée
//          n'est installée). Authentifié par clé partagée (LOCK_GATEWAY_SECRET), pas par
//          JWT utilisateur, car c'est le matériel/la passerelle qui appelle cet endpoint.
// @route   POST /api/locks/validate
// Header: x-lock-gateway-secret
// Body: { token, deviceId }
const validateKey = asyncHandler(async (req, res) => {
  const { token, deviceId } = req.body;

  const key = await DigitalKey.findOne({ token }).populate("room");
  if (!key) {
    return res.status(404).json({ success: false, granted: false, reason: "unknown_token" });
  }
  if (key.status !== "active") {
    return res.status(403).json({ success: false, granted: false, reason: `key_${key.status}` });
  }
  const now = new Date();
  if (now < key.validFrom || now > key.validUntil) {
    return res.status(403).json({ success: false, granted: false, reason: "outside_validity_period" });
  }
  if (deviceId && key.deviceId !== deviceId) {
    return res.status(403).json({ success: false, granted: false, reason: "wrong_device" });
  }

  key.lastUsedAt = now;
  key.useCount += 1;
  await key.save();

  res.json({ success: true, granted: true, room: key.room.number });
});

// @desc    Révoque une clé (check-out anticipé, téléphone perdu, sur demande client/staff)
// @route   POST /api/locks/:id/revoke
const revokeKey = asyncHandler(async (req, res) => {
  const key = await DigitalKey.findById(req.params.id);
  if (!key) {
    res.status(404);
    throw new Error("Clé numérique non trouvée");
  }

  if (req.client) {
    // Un client ne peut révoquer que sa propre clé
    if (key.client.toString() !== req.client._id.toString()) {
      res.status(403);
      throw new Error("Vous ne pouvez pas révoquer cette clé");
    }
  } else if (req.user) {
    // Un membre du personnel doit avoir un rôle autorisé (pas n'importe quel employé)
    const allowedStaffRoles = ["admin", "receptionist"];
    if (!allowedStaffRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Rôle non autorisé à révoquer une clé numérique");
    }
  }

  key.status = "revoked";
  key.revokedAt = new Date();
  await key.save();

  await lockGateway.revokeKeyOnDevice({ deviceId: key.deviceId, token: key.token });

  res.json({ success: true, data: key });
});

module.exports = { issueDigitalKey, getMyKeys, validateKey, revokeKey };
