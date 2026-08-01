const asyncHandler = require("../middleware/asyncHandler");
const ChatMessage = require("../models/ChatMessage");
const { notify } = require("../utils/notify");

// @route GET /api/chat/:clientId  -> historique de la conversation d'un client
const getConversation = asyncHandler(async (req, res) => {
  const messages = await ChatMessage.find({ client: req.params.clientId })
    .populate("staffUser", "firstName lastName")
    .sort({ createdAt: 1 });
  res.json({ success: true, data: messages });
});

// @route GET /api/chat  -> liste des conversations actives (vue réception), triées par dernier message
const getActiveConversations = asyncHandler(async (req, res) => {
  const conversations = await ChatMessage.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$client",
        lastMessage: { $first: "$message" },
        lastSender: { $first: "$sender" },
        lastAt: { $first: "$createdAt" },
        unreadFromClient: {
          $sum: { $cond: [{ $and: [{ $eq: ["$sender", "client"] }, { $eq: ["$isRead", false] }] }, 1, 0] },
        },
      },
    },
    { $sort: { lastAt: -1 } },
    { $lookup: { from: "clients", localField: "_id", foreignField: "_id", as: "client" } },
    { $unwind: "$client" },
  ]);
  res.json({ success: true, data: conversations });
});

// @route POST /api/chat/:clientId  -> le client envoie un message (public, app mobile client)
const sendClientMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const clientId = req.params.clientId;

  // Si un client est authentifié, il ne peut écrire que dans SA propre conversation
  if (req.client && req.client._id.toString() !== clientId) {
    res.status(403);
    throw new Error("Vous ne pouvez pas envoyer de message au nom d'un autre client");
  }

  const chatMessage = await ChatMessage.create({ client: clientId, sender: "client", message });

  const io = req.app.get("io");
  if (io) {
    io.to(clientId).emit("chat_message", chatMessage);
    io.to("reception").emit("chat_message", chatMessage);
  }

  await notify(
    req,
    {
      title: "Nouveau message client",
      message: message.slice(0, 80),
      type: "general",
      data: { clientId },
    },
    "reception"
  );

  res.status(201).json({ success: true, data: chatMessage });
});

// @route POST /api/chat/:clientId/reply  -> le personnel (authentifié) répond au client
const sendStaffReply = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const clientId = req.params.clientId;

  const chatMessage = await ChatMessage.create({
    client: clientId,
    sender: "staff",
    staffUser: req.user._id,
    message,
  });

  const io = req.app.get("io");
  if (io) {
    io.to(clientId).emit("chat_message", chatMessage);
    io.to("reception").emit("chat_message", chatMessage);
  }

  await notify(
    req,
    {
      recipientClient: clientId,
      title: "Réponse de la réception",
      message: message.slice(0, 80),
      type: "general",
    },
    clientId
  );

  res.status(201).json({ success: true, data: chatMessage });
});

// @route PATCH /api/chat/:clientId/read  -> marque les messages du client comme lus (côté réception)
const markConversationRead = asyncHandler(async (req, res) => {
  await ChatMessage.updateMany(
    { client: req.params.clientId, sender: "client", isRead: false },
    { isRead: true }
  );
  res.json({ success: true });
});

module.exports = {
  getConversation,
  getActiveConversations,
  sendClientMessage,
  sendStaffReply,
  markConversationRead,
};
