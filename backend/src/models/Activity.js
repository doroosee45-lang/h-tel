const mongoose = require("mongoose");

// Catalogue: Spa, Massage, Piscine, Salle de sport, Excursions, Soirées, Conférences, Coworking...
const activitySchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["spa", "massage", "pool", "gym", "excursion", "evening_event", "conference", "coworking", "other"],
      required: true,
    },
    description: { type: String },
    images: [{ type: String }],
    price: { type: Number, required: true },
    durationMinutes: { type: Number },
    capacity: { type: Number },
    schedule: [
      {
        dayOfWeek: { type: String }, // ex: "monday"
        startTime: { type: String }, // ex: "09:00"
        endTime: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
    qrCode: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
