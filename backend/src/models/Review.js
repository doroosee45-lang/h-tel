const mongoose = require("mongoose");

// Avis clients: noter un repas/boisson après commande (scan QR menu -> "Noter le repas")
const reviewSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
