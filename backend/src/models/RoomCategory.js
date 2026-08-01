const mongoose = require("mongoose");

const roomCategorySchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    name: { type: String, required: true }, // Standard, VIP, Suite, Familiale...
    description: { type: String },
    basePrice: { type: Number, required: true },
    weekendPrice: { type: Number },
    seasonalPrices: [
      {
        label: String,
        startDate: Date,
        endDate: Date,
        price: Number,
      },
    ],
    promotions: [
      {
        label: String, // ex: "Offre été -20%"
        discountPercent: Number,
        startDate: Date,
        endDate: Date,
        isActive: { type: Boolean, default: true },
      },
    ],
    capacity: { type: Number, default: 2 },
    amenities: [{ type: String }], // WiFi, Climatisation, Coffre-fort, Mini-bar...
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomCategory", roomCategorySchema);
