const asyncHandler = require("../middleware/asyncHandler");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const StockItem = require("../models/StockItem");
const StockMovement = require("../models/StockMovement");
const Table = require("../models/Table");
const { generateReference } = require("../utils/reference");
const { notify } = require("../utils/notify");

// Contrôleur commun aux commandes Restaurant (origin=restaurant) et Bar (origin=bar)

// @route GET /api/:module/orders
const getOrders = asyncHandler(async (req, res) => {
  const origin = req.baseUrl.includes("bar") ? "bar" : "restaurant";
  const { status, table, room, isPaid, page = 1, limit = 30 } = req.query;
  const filter = { origin };
  if (status) filter.status = status;
  if (table) filter.table = table;
  if (room) filter.room = room;
  if (isPaid !== undefined) filter.isPaid = isPaid === "true";

  const orders = await Order.find(filter)
    .populate("table")
    .populate("room")
    .populate("client", "firstName lastName")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments(filter);
  res.json({ success: true, count: orders.length, total, data: orders });
});

// @route GET /api/:module/orders/kitchen  -> file d'attente cuisine/bar en temps réel
const getKitchenQueue = asyncHandler(async (req, res) => {
  const origin = req.baseUrl.includes("bar") ? "bar" : "restaurant";
  const orders = await Order.find({ origin, status: { $in: ["new", "preparing", "ready"] } })
    .populate("table")
    .populate("room")
    .sort({ createdAt: 1 });
  res.json({ success: true, data: orders });
});

// @route POST /api/:module/orders
const createOrder = asyncHandler(async (req, res) => {
  const origin = req.baseUrl.includes("bar") ? "bar" : "restaurant";
  const { table, room, items, channel, chargedToRoom, discount, notes } = req.body;
  const client = req.client?._id || req.body.client;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("La commande doit contenir au moins un article");
  }

  const orderItems = [];
  let subtotal = 0;

  for (const line of items) {
    const menuItem = await MenuItem.findById(line.menuItem);
    if (!menuItem || !menuItem.isAvailable) {
      res.status(400);
      throw new Error(`Article indisponible: ${line.menuItem}`);
    }
    const quantity = line.quantity || 1;
    const lineTotal = menuItem.price * quantity;
    subtotal += lineTotal;

    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      quantity,
      unitPrice: menuItem.price,
      notes: line.notes,
    });

    // Décrémente le stock lié si présent
    if (menuItem.stockItem) {
      await StockItem.findByIdAndUpdate(menuItem.stockItem, { $inc: { quantity: -quantity } });
      await StockMovement.create({
        stockItem: menuItem.stockItem,
        type: "out",
        quantity,
        reason: `Vente ${origin}`,
        performedBy: req.user?._id,
      });
    }

    menuItem.salesCount += quantity;
    await menuItem.save();
  }

  const total = subtotal - (discount || 0);

  const order = await Order.create({
    orderNumber: generateReference(origin === "bar" ? "BAR" : "RES"),
    origin,
    channel: channel || (req.client ? "qr_code" : "dine_in"),
    table,
    room,
    client,
    items: orderItems,
    subtotal,
    discount: discount || 0,
    total,
    chargedToRoom: !!chargedToRoom,
    notes,
    createdBy: req.user?._id,
  });

  if (table) await Table.findByIdAndUpdate(table, { status: "occupied" });

  res.status(201).json({ success: true, data: order });
});

// @route PATCH /api/:module/orders/:id/status
// new -> preparing -> ready -> served
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["new", "preparing", "ready", "served", "cancelled"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Statut invalide");
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) {
    res.status(404);
    throw new Error("Commande non trouvée");
  }

  if (status === "ready") {
    await notify(
      req,
      {
        recipientClient: order.client,
        title: "Commande prête",
        message: `Votre commande ${order.orderNumber} est prête${order.origin === "bar" ? " au bar" : " en cuisine"}.`,
        type: "order_ready",
        data: { orderId: order._id },
      },
      order.client ? order.client.toString() : order.origin
    );
  }

  res.json({ success: true, data: order });
});

// @route POST /api/:module/orders/:id/pay
const payOrder = asyncHandler(async (req, res) => {
  const { paymentMethod } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Commande non trouvée");
  }

  // Un client connecté ne peut payer que sa propre commande
  if (req.client && (!order.client || order.client.toString() !== req.client._id.toString())) {
    res.status(403);
    throw new Error("Vous ne pouvez pas payer cette commande");
  }

  order.isPaid = true;
  order.paymentMethod = paymentMethod;
  order.status = order.status === "new" ? "served" : order.status;
  await order.save();

  if (order.table) await Table.findByIdAndUpdate(order.table, { status: "free" });

  res.json({ success: true, data: order });
});

module.exports = { getOrders, getKitchenQueue, createOrder, updateOrderStatus, payOrder };
