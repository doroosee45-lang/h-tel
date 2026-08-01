const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    status: { type: String, enum: ["present", "late", "absent", "half_day"], default: "present" },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
