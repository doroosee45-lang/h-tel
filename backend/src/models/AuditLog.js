const mongoose = require("mongoose");

// Journalisation complète (cahier des charges §15 Sécurité: "Logs complets")
// Enregistre toute action d'écriture (POST/PUT/PATCH/DELETE) effectuée par le personnel.
const auditLogSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userEmail: { type: String },
    method: { type: String, required: true },
    path: { type: String, required: true },
    statusCode: { type: Number },
    ip: { type: String },
    bodySummary: { type: mongoose.Schema.Types.Mixed }, // body sans champs sensibles (mot de passe exclu)
    durationMs: { type: Number },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
