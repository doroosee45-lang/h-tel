const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeCode: { type: String, required: true, unique: true },
    department: {
      type: String,
      enum: ["reception", "restaurant", "bar", "housekeeping", "maintenance", "finance", "hr", "stock", "management"],
      required: true,
    },
    position: { type: String, required: true },
    hireDate: { type: Date, required: true },
    contractType: { type: String, enum: ["cdi", "cdd", "internship", "freelance"], default: "cdi" },
    baseSalary: { type: Number, required: true },
    documents: [{ name: String, url: String }], // contrats scannés
    status: { type: String, enum: ["active", "on_leave", "terminated"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
