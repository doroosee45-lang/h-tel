const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipientClient: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["reservation_confirmed", "room_ready", "order_ready", "payment_received", "low_stock", "general"],
      default: "general",
    },
    isRead: { type: Boolean, default: false },
    data: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
