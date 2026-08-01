const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    number: { type: String, required: true, unique: true },
    zone: { type: String }, // salle, terrasse, VIP...
    capacity: { type: Number, default: 4 },
    status: { type: String, enum: ["free", "occupied", "reserved", "cleaning"], default: "free" },
    qrCode: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
