const mongoose = require("mongoose");

const stockItemSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["food", "beverage", "cleaning", "consumable", "other"],
      required: true,
    },
    image: { type: String },
    unit: { type: String, default: "unit" }, // kg, L, unit, box...
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    purchasePrice: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    minThreshold: { type: Number, default: 5 }, // seuil d'alerte stock critique
    location: { type: String }, // emplacement entrepôt
    expirationDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

stockItemSchema.virtual("isLowStock").get(function () {
  return this.quantity <= this.minThreshold;
});
stockItemSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("StockItem", stockItemSchema);
