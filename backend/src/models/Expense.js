const mongoose = require("mongoose");

// Comptabilité: "Dépenses" (cahier des charges §8/§14). Distinct des commandes fournisseurs
// (PurchaseOrder = achats de stock) : couvre TOUTES les sorties d'argent de l'hôtel
// (salaires versés, factures d'électricité/eau, maintenance, marketing, loyer, divers...).
const expenseSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    reference: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["utilities", "salaries", "maintenance", "supplies", "marketing", "rent", "taxes", "insurance", "other"],
      required: true,
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "check", "mobile_money"],
      default: "bank_transfer",
    },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    relatedPurchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder" },
    receiptUrl: { type: String }, // photo/scan du justificatif (upload via /api/upload)
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
  },
  { timestamps: true }
);

expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1, date: -1 });

module.exports = mongoose.model("Expense", expenseSchema);
