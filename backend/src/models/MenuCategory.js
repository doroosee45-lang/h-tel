const mongoose = require("mongoose");

const menuCategorySchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    type: { type: String, enum: ["restaurant", "bar"], required: true },
    name: { type: String, required: true }, // Entrées, Plats, Desserts, Cocktails, Vins...
    order: { type: Number, default: 0 },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuCategory", menuCategorySchema);
