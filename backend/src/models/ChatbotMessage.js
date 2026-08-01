const mongoose = require("mongoose");

// Historique des conversations avec le chatbot IA (distinct du chat humain ChatMessage)
const chatbotMessageSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    // sessionId permet aux visiteurs non connectés (kiosque, site web) d'avoir un historique
    // sans compte ; si le client est connecté, client est renseigné à la place.
    sessionId: { type: String, index: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    escalatedToReception: { type: Boolean, default: false },
  },
  { timestamps: true }
);

chatbotMessageSchema.index({ sessionId: 1, createdAt: 1 });
chatbotMessageSchema.index({ client: 1, createdAt: 1 });

module.exports = mongoose.model("ChatbotMessage", chatbotMessageSchema);
