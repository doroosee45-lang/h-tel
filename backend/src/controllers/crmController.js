const asyncHandler = require("../middleware/asyncHandler");
const Client = require("../models/Client");
const Reservation = require("../models/Reservation");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");

// @route GET /api/crm/clients
const getClients = asyncHandler(async (req, res) => {
  const { search, vip, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (vip !== undefined) filter.vipStatus = vip === "true";
  if (search) filter.$text = { $search: search };

  const clients = await Client.find(filter)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await Client.countDocuments(filter);
  res.json({ success: true, count: clients.length, total, data: clients });
});

// @route GET /api/crm/clients/:id
const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error("Client non trouvé");
  }

  const reservations = await Reservation.find({ client: client._id })
    .populate({ path: "room", populate: "category" })
    .sort({ checkInDate: -1 });
  const orders = await Order.find({ client: client._id }).sort({ createdAt: -1 }).limit(20);
  const invoices = await Invoice.find({ client: client._id }).sort({ createdAt: -1 });

  res.json({ success: true, data: { client, reservations, orders, invoices } });
});

// @route POST /api/crm/clients
const createClient = asyncHandler(async (req, res) => {
  // Si un email est fourni et correspond à un client déjà connu (ex: séjour précédent),
  // on réutilise sa fiche plutôt que de planter sur l'index unique ou créer un doublon.
  if (req.body.email) {
    const existing = await Client.findOne({ email: req.body.email.toLowerCase().trim() });
    if (existing) {
      return res.status(200).json({ success: true, data: existing, reused: true });
    }
  }

  const client = await Client.create(req.body);
  res.status(201).json({ success: true, data: client });
});

// @route PUT /api/crm/clients/:id
const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!client) {
    res.status(404);
    throw new Error("Client non trouvé");
  }
  res.json({ success: true, data: client });
});

// @route POST /api/crm/clients/:id/loyalty
// Ajoute/retire des points fidélité, et bascule le statut VIP au-delà d'un seuil
const updateLoyaltyPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;
  const client = await Client.findById(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error("Client non trouvé");
  }
  client.loyaltyPoints = Math.max(0, client.loyaltyPoints + points);
  if (client.loyaltyPoints >= 1000) client.vipStatus = true;
  await client.save();
  res.json({ success: true, data: client });
});

module.exports = { getClients, getClient, createClient, updateClient, updateLoyaltyPoints };
