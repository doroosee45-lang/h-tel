const asyncHandler = require("../middleware/asyncHandler");
const ChatbotMessage = require("../models/ChatbotMessage");
const { getChatbotReply } = require("../services/chatbotService");
const { notify } = require("../utils/notify");

// @route POST /api/chatbot/message
// Body: { message, sessionId? }  (sessionId requis si le client n'est pas connecté)
const sendMessage = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;
  const clientId = req.client?._id;

  if (!message || !message.trim()) {
    res.status(400);
    throw new Error("Le message ne peut pas être vide");
  }
  if (!clientId && !sessionId) {
    res.status(400);
    throw new Error("sessionId requis pour une conversation sans compte");
  }

  const filter = clientId ? { client: clientId } : { sessionId };

  // Récupère les 10 derniers messages pour donner du contexte au modèle
  const previousMessages = await ChatbotMessage.find(filter).sort({ createdAt: -1 }).limit(10);
  const history = previousMessages
    .reverse()
    .map((m) => ({ role: m.role, content: m.content }));

  await ChatbotMessage.create({ ...filter, role: "user", content: message });

  const { reply, escalate, configured } = await getChatbotReply(message, history);

  await ChatbotMessage.create({ ...filter, role: "assistant", content: reply, escalatedToReception: escalate });

  if (escalate && clientId) {
    await notify(
      req,
      {
        title: "Le chatbot a transmis une demande client",
        message: message.slice(0, 100),
        type: "general",
        data: { clientId },
      },
      "reception"
    );
  }

  res.status(configured ? 201 : 503).json({
    success: true,
    data: { reply, escalatedToReception: escalate },
  });
});

// @route GET /api/chatbot/history?sessionId=
const getHistory = asyncHandler(async (req, res) => {
  const { sessionId } = req.query;
  const clientId = req.client?._id;
  const filter = clientId ? { client: clientId } : { sessionId };

  if (!clientId && !sessionId) {
    res.status(400);
    throw new Error("sessionId requis pour une conversation sans compte");
  }

  const messages = await ChatbotMessage.find(filter).sort({ createdAt: 1 });
  res.json({ success: true, data: messages });
});

module.exports = { sendMessage, getHistory };
