const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    number: { type: String, required: true, unique: true },
    name: { type: String },
    floor: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "RoomCategory", required: true },
    status: {
      type: String,
      enum: ["available", "occupied", "cleaning", "maintenance", "reserved"],
      default: "available",
    },
    description: { type: String },
    images: {
      main: { type: String },
      bathroom: { type: String },
      balcony: { type: String },
      pool: { type: String },
      exteriorView: { type: String },
      gallery: [{ type: String }],
    },
    equipment: [{ type: String }],
    qrCode: { type: String }, // data URL / URL du QR code de la chambre
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
