const asyncHandler = require("../middleware/asyncHandler");
const Room = require("../models/Room");
const RoomCategory = require("../models/RoomCategory");
const MenuItem = require("../models/MenuItem");
const MenuCategory = require("../models/MenuCategory");
const StockItem = require("../models/StockItem");
const Table = require("../models/Table");
const Reservation = require("../models/Reservation");
const Order = require("../models/Order");
const StockMovement = require("../models/StockMovement");
const { computeStockDelta } = require("../utils/stockDelta");

// ============ PULL: télécharger les données de référence à mettre en cache localement ============
// L'app mobile personnel (réception/restaurant/bar/stock) appelle ceci en arrivant sur le
// wifi de l'hôtel, met tout en cache local (SQLite côté app), puis peut fonctionner sans
// réseau. `since` permet de ne récupérer que les changements (synchronisation incrémentale).

// @route GET /api/sync/pull?since=2026-07-01T00:00:00.000Z&modules=rooms,menu,stock,tables
const pullChanges = asyncHandler(async (req, res) => {
  const since = req.query.since ? new Date(req.query.since) : new Date(0);
  const modules = (req.query.modules || "rooms,menu,stock,tables").split(",");
  const filter = { updatedAt: { $gte: since } };

  const data = { syncedAt: new Date().toISOString() };

  if (modules.includes("rooms")) {
    data.rooms = await Room.find(filter);
    data.roomCategories = await RoomCategory.find(filter);
  }
  if (modules.includes("menu")) {
    data.menuItems = await MenuItem.find(filter);
    data.menuCategories = await MenuCategory.find(filter);
  }
  if (modules.includes("stock")) {
    data.stockItems = await StockItem.find(filter);
  }
  if (modules.includes("tables")) {
    data.tables = await Table.find(filter);
  }

  res.json({ success: true, data });
});

// ============ PUSH: envoyer les actions effectuées hors ligne, une fois reconnecté ============
// Chaque action porte un `offlineId` généré côté mobile (ex: uuid) qui garantit
// l'idempotence: si la même action est renvoyée deux fois (ex: coupure réseau pendant
// la synchronisation), elle n'est traitée qu'une seule fois.

const processReservation = async (req, payload) => {
  const existing = await Reservation.findOne({ offlineId: payload.offlineId });
  if (existing) return { status: "already_synced", data: existing };

  const reservation = await Reservation.create({ ...payload, createdBy: req.user?._id });
  return { status: "created", data: reservation };
};

const processOrder = async (req, payload) => {
  const existing = await Order.findOne({ offlineId: payload.offlineId });
  if (existing) return { status: "already_synced", data: existing };

  const order = await Order.create({ ...payload, createdBy: req.user?._id });
  return { status: "created", data: order };
};

const processStockMovement = async (req, payload) => {
  const existing = await StockMovement.findOne({ offlineId: payload.offlineId });
  if (existing) return { status: "already_synced", data: existing };

  const movement = await StockMovement.create({ ...payload, performedBy: req.user?._id });

  // Répercute la variation de stock comme le fait createMovement en mode connecté
  // (même protection contre un stock négatif, pour un comportement identique online/offline)
  const stockItem = await StockItem.findById(movement.stockItem);
  if (stockItem) {
    const delta = computeStockDelta(movement.type, movement.quantity);
    stockItem.quantity = Math.max(0, stockItem.quantity + delta);
    await stockItem.save();
  }

  return { status: "created", data: movement };
};

const PROCESSORS = {
  create_reservation: processReservation,
  create_order: processOrder,
  create_stock_movement: processStockMovement,
};

// @route POST /api/sync/push
// Body: { actions: [{ offlineId, type: "create_reservation"|"create_order"|"create_stock_movement", payload }] }
const pushActions = asyncHandler(async (req, res) => {
  const { actions } = req.body;
  if (!Array.isArray(actions) || actions.length === 0) {
    res.status(400);
    throw new Error("Le tableau 'actions' est requis et ne peut pas être vide");
  }

  const results = [];
  for (const action of actions) {
    const processor = PROCESSORS[action.type];
    if (!processor) {
      results.push({ offlineId: action.offlineId, status: "error", error: `Type d'action inconnu: ${action.type}` });
      continue;
    }
    try {
      const payload = { ...action.payload, offlineId: action.offlineId };
      const result = await processor(req, payload);
      results.push({ offlineId: action.offlineId, ...result });
    } catch (err) {
      results.push({ offlineId: action.offlineId, status: "error", error: err.message });
    }
  }

  res.json({ success: true, data: results });
});

module.exports = { pullChanges, pushActions };
