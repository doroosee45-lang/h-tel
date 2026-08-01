const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    stockItem: { type: mongoose.Schema.Types.ObjectId, ref: "StockItem", required: true },
    type: { type: String, enum: ["in", "out", "loss", "inventory_adjustment"], required: true },
    quantity: { type: Number, required: true },
    reason: { type: String }, // vente, réception fournisseur, casse, inventaire...
    reference: { type: String }, // ex: numéro de commande liée
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    offlineId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockMovement", stockMovementSchema);
