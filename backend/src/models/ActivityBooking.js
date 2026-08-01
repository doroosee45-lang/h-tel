const mongoose = require("mongoose");

const activityBookingSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    reference: { type: String, required: true, unique: true },
    activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    date: { type: Date, required: true },
    participants: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityBooking", activityBookingSchema);
