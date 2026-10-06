const asyncHandler = require("../middleware/asyncHandler");
const Notification = require("../models/Notification");

// @route GET /api/notifications  (notifications du personnel connecté)
const getMyNotifications = asyncHandler(async (req, res) => {
  const { unreadOnly, page = 1, limit = 30 } = req.query;
  const filter = { recipient: req.user._id };
  if (unreadOnly === "true") filter.isRead = false;

  const notifications = await Notification.find(filter)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

  res.json({ success: true, unreadCount, data: notifications });
});

// @route GET /api/notifications/client/:clientId  (notifications d'un client, app mobile)
const getClientNotifications = asyncHandler(async (req, res) => {
  if (req.client && req.client._id.toString() !== req.params.clientId) {
    res.status(403);
    throw new Error("Accès refusé");
  }
  const notifications = await Notification.find({ recipientClient: req.params.clientId }).sort({
    createdAt: -1,
  });
  res.json({ success: true, data: notifications });
});

// @route PATCH /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!notification) {
    res.status(404);
    throw new Error("Notification non trouvée");
  }
  res.json({ success: true, data: notification });
});

// @route PATCH /api/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: "Toutes les notifications ont été marquées comme lues" });
});

module.exports = { getMyNotifications, getClientNotifications, markAsRead, markAllAsRead };
