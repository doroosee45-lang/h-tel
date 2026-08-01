const mongoose = require("mongoose");

// Mariages, séminaires, conférences, anniversaires...
const eventSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    reference: { type: String, required: true, unique: true },
    type: { type: String, enum: ["wedding", "seminar", "conference", "birthday", "other"], required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    hall: { type: mongoose.Schema.Types.ObjectId, ref: "Hall" }, // référence au catalogue (optionnel)
    hallName: { type: String, required: true }, // dénormalisé pour affichage rapide / compatibilité
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    guestCount: { type: Number, required: true },
    cateringRequired: { type: Boolean, default: false },
    cateringDetails: { type: String },
    totalAmount: { type: Number, required: true },
    depositPaid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["inquiry", "confirmed", "in_progress", "completed", "cancelled"],
      default: "inquiry",
    },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
