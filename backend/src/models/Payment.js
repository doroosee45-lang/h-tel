const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["cash", "card", "mobile_money", "paypal", "stripe", "bank_transfer"],
      required: true,
    },
    reference: { type: String }, // ID transaction externe
    status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "completed" },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

paymentSchema.index(
  { method: 1, reference: 1 },
  { unique: true, partialFilterExpression: { reference: { $type: "string" } } }
);

module.exports = mongoose.model("Payment", paymentSchema);
