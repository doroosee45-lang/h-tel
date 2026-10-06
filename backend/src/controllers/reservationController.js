const asyncHandler = require("../middleware/asyncHandler");
const Client = require("../models/Client");
const Reservation = require("../models/Reservation");
const Room = require("../models/Room");
const Invoice = require("../models/Invoice");
const { generateReference } = require("../utils/reference");
const { generateQRCode } = require("../utils/qrGenerator");
const { notify } = require("../utils/notify");
const { issueKeyForReservation, revokeKeysForReservation } = require("../services/digitalKeyService");
const { calculateStayPrice } = require("../utils/pricing");
const { parseStayDates, parseManualDiscount } = require("../utils/reservationValidation");

// @route GET /api/reservations
const getReservations = asyncHandler(async (req, res) => {
  const { status, client, room, from, to, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (client) filter.client = client;
  if (room) filter.room = room;
  if (from || to) {
    filter.checkInDate = {};
    if (from) filter.checkInDate.$gte = new Date(from);
    if (to) filter.checkInDate.$lte = new Date(to);
  }

  const reservations = await Reservation.find(filter)
    .populate("client", "firstName lastName phone email")
    .populate({ path: "room", populate: { path: "category" } })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ checkInDate: -1 });

  const total = await Reservation.countDocuments(filter);

  res.json({ success: true, count: reservations.length, total, data: reservations });
});

// @route GET /api/reservations/:id
const getReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id)
    .populate("client")
    .populate({ path: "room", populate: { path: "category" } });
  if (!reservation) {
    res.status(404);
    throw new Error("Réservation non trouvée");
  }
  res.json({ success: true, data: reservation });
});

// @route POST /api/reservations
const createReservation = asyncHandler(async (req, res) => {
  const { room: roomId, checkInDate, checkOutDate, adults, children, source, notes, discount } = req.body;
  const client = req.client?._id || req.body.client;

  if (!client) {
    res.status(400);
    throw new Error("Client requis (connectez-vous ou précisez l'ID client)");
  }
  if (!(await Client.exists({ _id: client }))) {
    res.status(404);
    throw new Error("Client non trouvé");
  }

  const dates = parseStayDates(checkInDate, checkOutDate);
  if (!dates) {
    res.status(400);
    throw new Error("Dates invalides: le départ doit être après l'arrivée");
  }
  const { checkIn, checkOut } = dates;

  // Vérifie le conflit de disponibilité
  const conflict = await Reservation.findOne({
    room: roomId,
    status: { $in: ["pending", "confirmed", "checked_in"] },
    checkInDate: { $lt: checkOut },
    checkOutDate: { $gt: checkIn },
  });
  if (conflict) {
    res.status(400);
    throw new Error("Cette chambre n'est pas disponible sur cette période");
  }

  const room = await Room.findById(roomId).populate("category");
  if (!room) {
    res.status(404);
    throw new Error("Chambre non trouvée");
  }
  if (!room.isActive || room.status === "maintenance") {
    res.status(400);
    throw new Error("Cette chambre n'est pas réservable");
  }

  // Calcul du prix réel: tarif saisonnier > tarif week-end > tarif de base, nuit par
  // nuit, puis application de la meilleure promotion active sur la catégorie.
  const priceCalc = calculateStayPrice(room.category, checkIn, checkOut);
  const manualDiscount = req.user ? parseManualDiscount(discount, priceCalc.subtotal, priceCalc.promotionDiscount) : 0;
  if (manualDiscount === null) {
    res.status(400);
    throw new Error("Remise manuelle invalide");
  }
  const totalDiscount = priceCalc.promotionDiscount + manualDiscount;
  const totalAmount = priceCalc.subtotal - totalDiscount;

  const reservation = await Reservation.create({
    reference: generateReference("RES"),
    client,
    room: roomId,
    source: source || (req.client ? "mobile" : "reception"),
    checkInDate: checkIn,
    checkOutDate: checkOut,
    adults,
    children,
    pricePerNight: priceCalc.averagePricePerNight,
    nights: priceCalc.nights,
    totalAmount,
    discount: totalDiscount,
    notes,
    status: "confirmed",
    createdBy: req.user?._id,
  });

  if (room.status === "available") {
    await Room.findByIdAndUpdate(roomId, { status: "reserved" });
  }

  await notify(
    req,
    {
      recipientClient: client,
      title: "Réservation confirmée",
      message: `Chambre ${room.number} réservée du ${checkIn.toLocaleDateString("fr-FR")} au ${checkOut.toLocaleDateString("fr-FR")}.`,
      type: "reservation_confirmed",
      data: { reservationId: reservation._id },
    },
    client
  );

  res.status(201).json({ success: true, data: reservation });
});

// @route PUT /api/reservations/:id
const updateReservation = asyncHandler(async (req, res) => {
  const allowedFields = ["notes", "adults", "children"];
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
  const unexpectedFields = Object.keys(body).filter((field) => !allowedFields.includes(field));
  if (unexpectedFields.length) {
    res.status(400);
    throw new Error(`Champs non modifiables: ${unexpectedFields.join(", ")}`);
  }

  const updates = {};
  if (body.notes !== undefined) {
    if (typeof body.notes !== "string" || body.notes.length > 2000) {
      res.status(400);
      throw new Error("Notes invalides");
    }
    updates.notes = body.notes;
  }
  for (const field of ["adults", "children"]) {
    if (body[field] !== undefined) {
      const value = Number(body[field]);
      const minimum = field === "adults" ? 1 : 0;
      if (!Number.isInteger(value) || value < minimum) {
        res.status(400);
        throw new Error(`${field} invalide`);
      }
      updates[field] = value;
    }
  }
  if (!Object.keys(updates).length) {
    res.status(400);
    throw new Error("Aucun champ modifiable fourni");
  }

  const reservation = await Reservation.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!reservation) {
    res.status(404);
    throw new Error("Réservation non trouvée");
  }
  res.json({ success: true, data: reservation });
});

// @route POST /api/reservations/:id/cancel
const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    { status: "cancelled" },
    { new: true }
  );
  if (!reservation) {
    res.status(404);
    throw new Error("Réservation non trouvée");
  }
  const room = await Room.findById(reservation.room);
  if (room?.status === "reserved") {
    const [checkedIn, confirmed] = await Promise.all([
      Reservation.exists({ room: room._id, status: "checked_in" }),
      Reservation.exists({ room: room._id, status: { $in: ["pending", "confirmed"] } }),
    ]);
    room.status = checkedIn ? "occupied" : confirmed ? "reserved" : "available";
    await room.save();
  }
  res.json({ success: true, data: reservation });
});

// @route POST /api/reservations/:id/checkin
// Body optionnel: idDocumentScan, digitalSignature
const checkIn = asyncHandler(async (req, res) => {
  const { idDocumentScan, digitalSignature } = req.body;
  const reservation = await Reservation.findById(req.params.id).populate("room");
  if (!reservation) {
    res.status(404);
    throw new Error("Réservation non trouvée");
  }
  if (reservation.status === "checked_in") {
    res.status(400);
    throw new Error("Le check-in a déjà été effectué");
  }

  reservation.status = "checked_in";
  reservation.actualCheckIn = new Date();
  if (idDocumentScan) reservation.idDocumentScan = idDocumentScan;
  if (digitalSignature) reservation.digitalSignature = digitalSignature;
  await reservation.save();

  await Room.findByIdAndUpdate(reservation.room._id, { status: "occupied" });

  // Émission automatique de la clé numérique (déverrouillage QR/BLE de la chambre)
  let digitalKey = null;
  try {
    const result = await issueKeyForReservation(req, reservation, reservation.room);
    digitalKey = result.key;
  } catch (err) {
    console.error("Émission de clé numérique échouée (check-in maintenu):", err.message);
  }

  res.json({ success: true, data: reservation, digitalKey });
});

// @route POST /api/reservations/:id/checkout
// Calcule et génère automatiquement la facture finale
const checkOut = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id).populate("room");
  if (!reservation) {
    res.status(404);
    throw new Error("Réservation non trouvée");
  }
  if (reservation.status !== "checked_in") {
    res.status(400);
    throw new Error("Le client n'a pas encore effectué le check-in");
  }

  reservation.status = "checked_out";
  reservation.actualCheckOut = new Date();
  await reservation.save();

  await Room.findByIdAndUpdate(reservation.room._id, { status: "cleaning" });
  await revokeKeysForReservation(reservation._id);

  const subtotal = reservation.totalAmount;
  const invoice = await Invoice.create({
    invoiceNumber: generateReference("INV"),
    type: "room",
    client: reservation.client,
    reservation: reservation._id,
    lines: [
      {
        description: `Séjour chambre ${reservation.room.number} (${reservation.nights} nuit(s))`,
        quantity: reservation.nights,
        unitPrice: reservation.pricePerNight,
        total: subtotal,
      },
    ],
    subtotal,
    discount: reservation.discount,
    total: subtotal,
    status: reservation.paidAmount >= subtotal ? "paid" : "unpaid",
  });
  invoice.qrCode = await generateQRCode({ type: "invoice", invoiceId: invoice._id.toString() });
  await invoice.save();

  res.json({ success: true, data: { reservation, invoice } });
});

module.exports = {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  cancelReservation,
  checkIn,
  checkOut,
};
