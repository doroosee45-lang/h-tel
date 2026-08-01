const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    period: { type: String, required: true }, // ex: "2026-07"
    baseSalary: { type: Number, required: true },
    bonuses: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

payrollSchema.index({ employee: 1, period: 1 }, { unique: true });

module.exports = mongoose.model("Payroll", payrollSchema);
