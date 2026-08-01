const mongoose = require("mongoose");

// Réservation d'une table de restaurant à une date/heure donnée
// (cahier des charges §5: "Gestion des tables: Plan des tables, Réservation table")
const tableReservationSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    reference: { type: String, required: true, unique: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // ex: "19:30"
    partySize: { type: Number, required: true, default: 2 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "seated", "completed", "cancelled", "no_show"],
      default: "confirmed",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TableReservation", tableReservationSchema);
