const mongoose = require("mongoose");

// Catalogue des salles (Salle de conférence, Salle de fête...) — chaque salle a sa propre
// fiche complète (photos, capacité, tarifs) consultable AVANT de faire une demande
// d'événement, comme demandé explicitement dans le "Catalogue Central Intelligent".
const hallSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    name: { type: String, required: true }, // ex: "Salle de conférence Atlas"
    type: { type: String, enum: ["conference_room", "banquet_hall", "meeting_room", "other"], required: true },
    description: { type: String },
    images: [{ type: String }],
    capacity: { type: Number, required: true },
    surfaceM2: { type: Number },
    pricePerHour: { type: Number },
    pricePerDay: { type: Number },
    amenities: [{ type: String }], // ex: vidéoprojecteur, sonorisation, wifi, climatisation
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hall", hallSchema);
