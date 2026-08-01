const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    type: { type: String, enum: ["restaurant", "bar"], required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "MenuCategory", required: true },
    name: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }], // galerie générique (plats, présentation...)
    // Champs spécifiques boissons: photos nommées comme demandé au cahier des charges
    drinkImages: {
      bottle: { type: String },
      glass: { type: String },
      prepared: { type: String }, // cocktail préparé / servi
    },
    ingredients: [{ type: String }],
    allergens: [{ type: String }],
    preparationTimeMinutes: { type: Number },
    price: { type: Number, required: true },
    // Champs spécifiques boissons
    brand: { type: String },
    volumeMl: { type: Number },
    alcoholic: { type: Boolean, default: false },
    // Lien stock
    stockItem: { type: mongoose.Schema.Types.ObjectId, ref: "StockItem" },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    salesCount: { type: Number, default: 0 }, // utilisé par le dashboard "produits populaires"
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
