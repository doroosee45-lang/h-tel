const crypto = require("crypto");
const DigitalKey = require("../models/DigitalKey");
const lockGateway = require("./lockGateway");
const { generateQRCode } = require("../utils/qrGenerator");
const { notify } = require("../utils/notify");

/**
 * Émet une clé numérique pour une réservation en check-in. Réutilisé par:
 *  - reservationController.checkIn (émission automatique)
 *  - lockController.issueDigitalKey (émission/réémission manuelle par la réception)
 */
const issueKeyForReservation = async (req, reservation, room, deviceId) => {
  await DigitalKey.updateMany(
    { reservation: reservation._id, status: "active" },
    { status: "revoked", revokedAt: new Date() }
  );

  const token = crypto.randomBytes(24).toString("hex");
  const qrCode = await generateQRCode({ type: "digital_key", token });

  // La clé reste valide jusqu'à la FIN de la journée de check-out (23h59), pas jusqu'à
  // minuit pile — sinon le client se retrouverait bloqué hors de sa chambre dès 00h00
  // le jour même de son départ, avant d'avoir eu l'occasion de faire le check-out.
  const validUntil = new Date(reservation.checkOutDate);
  validUntil.setHours(23, 59, 59, 999);

  const key = await DigitalKey.create({
    reservation: reservation._id,
    room: room._id,
    client: reservation.client,
    token,
    qrCode,
    deviceId: deviceId || room.number,
    validFrom: reservation.actualCheckIn || new Date(),
    validUntil,
    issuedBy: req.user?._id,
  });

  const hardwareSync = await lockGateway.pushKeyToDevice({
    deviceId: key.deviceId,
    token,
    validFrom: key.validFrom,
    validUntil: key.validUntil,
  });

  await notify(
    req,
    {
      recipientClient: reservation.client,
      title: "Votre clé numérique est prête",
      message: `Scannez le QR code dans l'app pour déverrouiller la chambre ${room.number}.`,
      type: "general",
      data: { keyId: key._id },
    },
    reservation.client.toString()
  );

  return { key, hardwareSync };
};

/** Révoque toutes les clés actives d'une réservation (ex: au check-out) */
const revokeKeysForReservation = async (reservationId) => {
  const activeKeys = await DigitalKey.find({ reservation: reservationId, status: "active" });
  for (const key of activeKeys) {
    key.status = "revoked";
    key.revokedAt = new Date();
    await key.save();
    await lockGateway.revokeKeyOnDevice({ deviceId: key.deviceId, token: key.token });
  }
  return activeKeys.length;
};

module.exports = { issueKeyForReservation, revokeKeysForReservation };
