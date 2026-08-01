const mongoose = require("mongoose");

const cashRegisterSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    openedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    openingAmount: { type: Number, required: true },
    closingAmount: { type: Number },
    expectedAmount: { type: Number },
    difference: { type: Number }, // écart de caisse détecté
    status: { type: String, enum: ["open", "closed"], default: "open" },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CashRegister", cashRegisterSchema);
