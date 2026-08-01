const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    reference: { type: String, required: true, unique: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    source: { type: String, enum: ["web", "mobile", "reception", "phone"], default: "reception" },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    actualCheckIn: { type: Date },
    actualCheckOut: { type: Date },
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"],
      default: "pending",
    },
    pricePerNight: { type: Number, required: true },
    nights: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    idDocumentScan: { type: String }, // scan passeport / CNI
    digitalSignature: { type: String },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    offlineId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
