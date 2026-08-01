const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const clientSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String },
    nationality: { type: String },
    idDocumentType: { type: String, enum: ["passport", "id_card", "driving_license"] },
    idDocumentNumber: { type: String },
    address: { type: String },
    loyaltyPoints: { type: Number, default: 0 },
    vipStatus: { type: Boolean, default: false },
    totalSpent: { type: Number, default: 0 },
    // Compte self-service pour l'application mobile client (optionnel: un client créé
    // par la réception pour un séjour physique n'a pas forcément de compte app mobile)
    password: { type: String, minlength: 6, select: false },
    hasAccount: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String, select: false },
    userAccount: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // legacy: lien vers un compte staff, si applicable
    notes: { type: String },
  },
  { timestamps: true }
);

clientSchema.index({ firstName: "text", lastName: "text", email: "text", phone: "text" });

clientSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

clientSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Client", clientSchema);
