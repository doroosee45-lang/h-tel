const mongoose = require("mongoose");

// Clé numérique associée à un séjour, permettant le déverrouillage de la chambre
// via QR code / NFC / Bluetooth selon le matériel installé (cahier des charges:
// "Déverrouiller sa chambre via QR Code ou clé numérique").
const digitalKeySchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    // Jeton secret transmis au téléphone du client (jamais renvoyé en clair après création,
    // sauf via l'endpoint dédié protégé par le compte client)
    token: { type: String, required: true, unique: true },
    qrCode: { type: String }, // data URL du QR contenant le token, pour affichage/scan
    deviceId: { type: String }, // identifiant de la serrure physique de la chambre (fabricant)
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    status: { type: String, enum: ["active", "revoked", "expired"], default: "active" },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null si auto-émise au check-in
    revokedAt: { type: Date },
    lastUsedAt: { type: Date },
    useCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

digitalKeySchema.index({ room: 1, status: 1 });

module.exports = mongoose.model("DigitalKey", digitalKeySchema);
