const mongoose = require("mongoose");

const purchaseOrderItemSchema = new mongoose.Schema(
  {
    stockItem: { type: mongoose.Schema.Types.ObjectId, ref: "StockItem", required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const purchaseOrderSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    reference: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    items: [purchaseOrderItemSchema],
    status: {
      type: String,
      enum: ["draft", "pending_validation", "validated", "received", "cancelled"],
      default: "draft",
    },
    totalAmount: { type: Number, required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receivedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
