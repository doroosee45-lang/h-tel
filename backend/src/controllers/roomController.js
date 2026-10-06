const asyncHandler = require("../middleware/asyncHandler");
const Room = require("../models/Room");
const RoomCategory = require("../models/RoomCategory");
const Reservation = require("../models/Reservation");
const { generateQRCode } = require("../utils/qrGenerator");
const { notify } = require("../utils/notify");
const { calculateStayPrice } = require("../utils/pricing");
const { parseStayDates } = require("../utils/reservationValidation");

// ---------- Catégories de chambres ----------

// @route GET /api/rooms/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await RoomCategory.find();
  res.json({ success: true, data: categories });
});

// @route POST /api/rooms/categories
const createCategory = asyncHandler(async (req, res) => {
  const category = await RoomCategory.create(req.body);
  res.status(201).json({ success: true, data: category });
});

// @route PUT /api/rooms/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const category = await RoomCategory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    res.status(404);
    throw new Error("Catégorie non trouvée");
  }
  res.json({ success: true, data: category });
});

// @route POST /api/rooms/categories/:id/promotions
const addPromotion = asyncHandler(async (req, res) => {
  const { label, discountPercent, startDate, endDate } = req.body;
  const category = await RoomCategory.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Catégorie non trouvée");
  }
  category.promotions.push({ label, discountPercent, startDate, endDate, isActive: true });
  await category.save();
  res.status(201).json({ success: true, data: category });
});

// ---------- Chambres ----------

// @route GET /api/rooms
const getRooms = asyncHandler(async (req, res) => {
  const { status, category, floor, page = 1, limit = 50 } = req.query;
  const filter = { isActive: true };
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (floor) filter.floor = floor;

  const rooms = await Room.find(filter)
    .populate("category")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ number: 1 });

  const total = await Room.countDocuments(filter);

  res.json({ success: true, count: rooms.length, total, data: rooms });
});

// @route GET /api/rooms/:id
const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate("category");
  if (!room) {
    res.status(404);
    throw new Error("Chambre non trouvée");
  }
  res.json({ success: true, data: room });
});

// @route GET /api/rooms/:id/price-quote?checkInDate=&checkOutDate=
// Renvoie le prix exact (tarifs saisonniers/week-end/promotions inclus) AVANT réservation,
// pour que le client voie le même montant que celui qui sera effectivement facturé.
const getPriceQuote = asyncHandler(async (req, res) => {
  const { checkInDate, checkOutDate } = req.query;
  const dates = parseStayDates(checkInDate, checkOutDate);
  if (!dates) {
    res.status(400);
    throw new Error("Dates invalides: checkInDate et checkOutDate doivent définir un séjour valide");
  }

  const room = await Room.findById(req.params.id).populate("category");
  if (!room) {
    res.status(404);
    throw new Error("Chambre non trouvée");
  }

  const quote = calculateStayPrice(room.category, dates.checkIn, dates.checkOut);
  res.json({ success: true, data: quote });
});

// @route GET /api/rooms/:id/availability?startDate=&endDate=
const checkAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const dates = parseStayDates(startDate, endDate);
  if (!dates) {
    res.status(400);
    throw new Error("Dates invalides: startDate et endDate doivent définir un séjour valide");
  }

  const conflict = await Reservation.findOne({
    room: req.params.id,
    status: { $in: ["pending", "confirmed", "checked_in"] },
    checkInDate: { $lt: dates.checkOut },
    checkOutDate: { $gt: dates.checkIn },
  });

  res.json({ success: true, available: !conflict });
});

// @route POST /api/rooms
const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);

  // Génère automatiquement le QR code de la chambre (utilisé par l'app mobile client)
  const qrPayload = { type: "room", roomId: room._id.toString(), number: room.number };
  room.qrCode = await generateQRCode(qrPayload);
  await room.save();

  res.status(201).json({ success: true, data: room });
});

// @route PUT /api/rooms/:id
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!room) {
    res.status(404);
    throw new Error("Chambre non trouvée");
  }
  res.json({ success: true, data: room });
});

// @route PATCH /api/rooms/:id/status
const updateRoomStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["available", "occupied", "cleaning", "maintenance", "reserved"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Statut invalide");
  }
  const room = await Room.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!room) {
    res.status(404);
    throw new Error("Chambre non trouvée");
  }

  // "Chambre prête": la chambre redevient disponible et un client arrive aujourd'hui
  if (status === "available") {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const upcomingReservation = await Reservation.findOne({
      room: room._id,
      status: "confirmed",
      checkInDate: { $gte: todayStart, $lte: todayEnd },
    });

    if (upcomingReservation) {
      await notify(
        req,
        {
          recipientClient: upcomingReservation.client,
          title: "Votre chambre est prête",
          message: `La chambre ${room.number} est prête pour votre arrivée.`,
          type: "room_ready",
          data: { roomId: room._id, reservationId: upcomingReservation._id },
        },
        upcomingReservation.client.toString()
      );
    }
  }

  res.json({ success: true, data: room });
});

// @route DELETE /api/rooms/:id
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!room) {
    res.status(404);
    throw new Error("Chambre non trouvée");
  }
  res.json({ success: true, message: "Chambre désactivée" });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  addPromotion,
  getRooms,
  getRoom,
  getPriceQuote,
  checkAvailability,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
};
