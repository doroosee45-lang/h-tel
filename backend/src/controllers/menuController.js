const asyncHandler = require("../middleware/asyncHandler");
const MenuCategory = require("../models/MenuCategory");
const MenuItem = require("../models/MenuItem");
const Table = require("../models/Table");
const TableReservation = require("../models/TableReservation");
const { generateQRCode } = require("../utils/qrGenerator");
const { generateReference } = require("../utils/reference");
const { notify } = require("../utils/notify");

// Contrôleur générique utilisé pour "restaurant" (type=restaurant) et "bar" (type=bar)

// @route GET /api/:module/categories   (module = restaurant | bar)
const getCategories = asyncHandler(async (req, res) => {
  const type = req.baseUrl.includes("bar") ? "bar" : "restaurant";
  const categories = await MenuCategory.find({ type }).sort({ order: 1 });
  res.json({ success: true, data: categories });
});

// @route POST /api/:module/categories
const createCategory = asyncHandler(async (req, res) => {
  const type = req.baseUrl.includes("bar") ? "bar" : "restaurant";
  const category = await MenuCategory.create({ ...req.body, type });
  res.status(201).json({ success: true, data: category });
});

// @route GET /api/:module/items
const getItems = asyncHandler(async (req, res) => {
  const type = req.baseUrl.includes("bar") ? "bar" : "restaurant";
  const { category, search, available, page = 1, limit = 50 } = req.query;
  const filter = { type };
  if (category) filter.category = category;
  if (available !== undefined) filter.isAvailable = available === "true";
  if (search) filter.name = new RegExp(search, "i");

  const items = await MenuItem.find(filter)
    .populate("category")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ isFeatured: -1, name: 1 });

  const total = await MenuItem.countDocuments(filter);

  res.json({ success: true, count: items.length, total, data: items });
});

// @route GET /api/:module/items/popular
const getPopularItems = asyncHandler(async (req, res) => {
  const type = req.baseUrl.includes("bar") ? "bar" : "restaurant";
  const items = await MenuItem.find({ type }).sort({ salesCount: -1 }).limit(10);
  res.json({ success: true, data: items });
});

// @route GET /api/:module/items/:id
const getItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate("category");
  if (!item) {
    res.status(404);
    throw new Error("Article non trouvé");
  }
  res.json({ success: true, data: item });
});

// @route POST /api/:module/items
const createItem = asyncHandler(async (req, res) => {
  const type = req.baseUrl.includes("bar") ? "bar" : "restaurant";
  const item = await MenuItem.create({ ...req.body, type });
  res.status(201).json({ success: true, data: item });
});

// @route PUT /api/:module/items/:id
const updateItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error("Article non trouvé");
  }
  res.json({ success: true, data: item });
});

// @route DELETE /api/:module/items/:id
const deleteItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, { isAvailable: false }, { new: true });
  if (!item) {
    res.status(404);
    throw new Error("Article non trouvé");
  }
  res.json({ success: true, message: "Article désactivé" });
});

// ---------- Tables (restaurant) ----------

// @route GET /api/restaurant/tables
const getTables = asyncHandler(async (req, res) => {
  const tables = await Table.find().sort({ number: 1 });
  res.json({ success: true, data: tables });
});

// @route POST /api/restaurant/tables
const createTable = asyncHandler(async (req, res) => {
  const table = await Table.create(req.body);
  table.qrCode = await generateQRCode({ type: "table", tableId: table._id.toString(), number: table.number });
  await table.save();
  res.status(201).json({ success: true, data: table });
});

// @route PATCH /api/restaurant/tables/:id/status
const updateTableStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const table = await Table.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!table) {
    res.status(404);
    throw new Error("Table non trouvée");
  }
  res.json({ success: true, data: table });
});

// ---------- Réservations de table ----------

// @route GET /api/restaurant/tables/reservations
const getTableReservations = asyncHandler(async (req, res) => {
  const { date, status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }
  const reservations = await TableReservation.find(filter)
    .populate("table", "number zone capacity")
    .populate("client", "firstName lastName phone")
    .sort({ date: 1, time: 1 });
  res.json({ success: true, data: reservations });
});

// @route POST /api/restaurant/tables/:id/reservations
// Client connecté (app mobile) OU réception/manager restaurant (body.client)
const createTableReservation = asyncHandler(async (req, res) => {
  const { date, time, partySize, notes } = req.body;
  const clientId = req.client?._id || req.body.client;
  if (!clientId) {
    res.status(400);
    throw new Error("Client requis (connectez-vous ou précisez l'ID client)");
  }

  const table = await Table.findById(req.params.id);
  if (!table) {
    res.status(404);
    throw new Error("Table non trouvée");
  }

  // Vérifie qu'aucune autre réservation active n'existe déjà pour cette table
  // à la même date et à la même heure (évite le double-booking).
  const conflict = await TableReservation.findOne({
    table: table._id,
    date: new Date(date),
    time,
    status: { $in: ["pending", "confirmed", "seated"] },
  });
  if (conflict) {
    res.status(400);
    throw new Error("Cette table est déjà réservée à ce créneau");
  }

  const reservation = await TableReservation.create({
    reference: generateReference("TBL"),
    table: table._id,
    client: clientId,
    date,
    time,
    partySize: partySize || 2,
    notes,
  });

  await Table.findByIdAndUpdate(table._id, { status: "reserved" });

  await notify(
    req,
    {
      recipientClient: clientId,
      title: "Table réservée",
      message: `Table ${table.number} réservée le ${new Date(date).toLocaleDateString("fr-FR")} à ${time}.`,
      type: "general",
      data: { reservationId: reservation._id },
    },
    clientId.toString()
  );

  res.status(201).json({ success: true, data: reservation });
});

// @route PATCH /api/restaurant/tables/reservations/:id/status
const updateTableReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const reservation = await TableReservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!reservation) {
    res.status(404);
    throw new Error("Réservation non trouvée");
  }
  if (["completed", "cancelled", "no_show"].includes(status)) {
    await Table.findByIdAndUpdate(reservation.table, { status: "free" });
  }
  res.json({ success: true, data: reservation });
});

module.exports = {
  getCategories,
  createCategory,
  getItems,
  getPopularItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getTables,
  createTable,
  updateTableStatus,
  getTableReservations,
  createTableReservation,
  updateTableReservationStatus,
};
