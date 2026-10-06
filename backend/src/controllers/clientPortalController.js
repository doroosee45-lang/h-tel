const asyncHandler = require("../middleware/asyncHandler");
const Room = require("../models/Room");
const Reservation = require("../models/Reservation");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const ConciergeRequest = require("../models/ConciergeRequest");
const Notification = require("../models/Notification");

// Toutes ces routes sont protégées par protectClient: req.client est toujours défini
// et chaque requête est strictement limitée aux données de ce client.

// @route GET /api/client-portal/rooms?checkInDate=&checkOutDate=&category=
// Chambres réservables; si les dates sont fournies, seules les chambres libres sont renvoyées.
const getPortalRooms = asyncHandler(async (req, res) => {
  const { checkInDate, checkOutDate, category } = req.query;
  const filter = { isActive: true, status: { $nin: ["maintenance", "out_of_service"] } };
  if (category) filter.category = category;

  if (checkInDate || checkOutDate) {
    const from = new Date(checkInDate);
    const to = new Date(checkOutDate);
    if (isNaN(from) || isNaN(to) || to <= from) {
      res.status(400);
      throw new Error("Dates invalides");
    }
    const busy = await Reservation.find({
      status: { $in: ["pending", "confirmed", "checked_in"] },
      checkInDate: { $lt: to },
      checkOutDate: { $gt: from },
    }).distinct("room");
    filter._id = { $nin: busy };
  }

  const rooms = await Room.find(filter).populate("category").select("-qrCode").sort({ number: 1 });
  res.json({ success: true, count: rooms.length, data: rooms });
});

// @route GET /api/client-portal/rooms/:id
const getPortalRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ _id: req.params.id, isActive: true }).populate("category").select("-qrCode");
  if (!room) {
    res.status(404);
    throw new Error("Chambre non trouvée");
  }
  res.json({ success: true, data: room });
});

// @route GET /api/client-portal/my-reservations
const getMyReservations = asyncHandler(async (req, res) => {
  const data = await Reservation.find({ client: req.client._id })
    .populate({ path: "room", populate: { path: "category" } })
    .sort({ checkInDate: -1 });
  res.json({ success: true, count: data.length, data });
});

// @route GET /api/client-portal/my-orders
const getMyOrders = asyncHandler(async (req, res) => {
  const data = await Order.find({ client: req.client._id }).sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, count: data.length, data });
});

// @route GET /api/client-portal/my-invoices
const getMyInvoices = asyncHandler(async (req, res) => {
  const data = await Invoice.find({ client: req.client._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: data.length, data });
});

// @route GET /api/client-portal/my-concierge-requests
const getMyConciergeRequests = asyncHandler(async (req, res) => {
  const data = await ConciergeRequest.find({ client: req.client._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: data.length, data });
});

// @route GET /api/client-portal/my-notifications
const getMyNotifications = asyncHandler(async (req, res) => {
  const data = await Notification.find({ recipientClient: req.client._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, count: data.length, unreadCount: data.filter((n) => !n.isRead).length, data });
});

// @route PATCH /api/client-portal/my-notifications/:id/read
const markMyNotificationRead = asyncHandler(async (req, res) => {
  const n = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipientClient: req.client._id },
    { isRead: true },
    { new: true }
  );
  if (!n) {
    res.status(404);
    throw new Error("Notification non trouvée");
  }
  res.json({ success: true, data: n });
});

module.exports = {
  getPortalRooms,
  getPortalRoom,
  getMyReservations,
  getMyOrders,
  getMyInvoices,
  getMyConciergeRequests,
  getMyNotifications,
  markMyNotificationRead,
};
