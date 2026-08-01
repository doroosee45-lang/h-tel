const mongoose = require("mongoose");

// Chat client <-> réception (app mobile client: "Dialoguer avec la réception")
// Une conversation = un fil unique par client (simple et suffisant pour un hôtel).
const chatMessageSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true, index: true },
    sender: { type: String, enum: ["client", "staff"], required: true },
    staffUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // si sender = "staff"
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

chatMessageSchema.index({ client: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
