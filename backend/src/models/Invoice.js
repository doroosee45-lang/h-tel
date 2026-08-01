const mongoose = require("mongoose");

const invoiceLineSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    invoiceNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["room", "restaurant", "bar", "event", "other"], required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    lines: [invoiceLineSchema],
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ["unpaid", "partial", "paid", "cancelled"], default: "unpaid" },
    qrCode: { type: String }, // QR de vérification de facture
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
