const asyncHandler = require("../middleware/asyncHandler");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const StockItem = require("../models/StockItem");
const StockMovement = require("../models/StockMovement");
const Table = require("../models/Table");
const Reservation = require("../models/Reservation");
const { generateReference } = require("../utils/reference");
const { notify } = require("../utils/notify");

// Contrôleur commun aux commandes Restaurant (origin=restaurant) et Bar (origin=bar)

// @route GET /api/:module/orders
const getOrders = asyncHandler(async (req, res) => {
  const origin = req.orderOrigin || (req.baseUrl.includes("bar") ? "bar" : "restaurant");
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
  const origin = req.orderOrigin || (req.baseUrl.includes("bar") ? "bar" : "restaurant");
  const orders = await Order.find({ origin, status: { $in: ["new", "preparing", "ready"] } })
    .populate("table")
    .populate("room")
    .sort({ createdAt: 1 });
  res.json({ success: true, data: orders });
});

// @route POST /api/:module/orders
const createOrder = asyncHandler(async (req, res) => {
  const origin = req.orderOrigin || (req.baseUrl.includes("bar") ? "bar" : "restaurant");
  const { table, room, items, channel, notes } = req.body;
  // Un client connecté ne peut ni s'attribuer de remise ni agir pour un autre client
  const isClientCaller = !!req.client;
  const discount = isClientCaller ? 0 : req.body.discount;
  const chargedToRoom = req.body.chargedToRoom;
  const client = req.client?._id || req.body.client;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("La commande doit contenir au moins un article");
  }

  // Un client ne peut commander "en chambre" que pour une chambre où il est actuellement hébergé
  if (isClientCaller && (room || chargedToRoom)) {
    const stay = room && (await Reservation.findOne({ client, room, status: "checked_in" }));
    if (!stay) {
      res.status(403);
      throw new Error("Commande en chambre possible uniquement pour votre chambre (check-in effectué)");
    }
  }

  const orderItems = [];
  let subtotal = 0;

  for (const line of items) {
    const menuItem = await MenuItem.findById(line.menuItem);
    if (!menuItem || !menuItem.isAvailable) {
      res.status(400);
      throw new Error(`Article indisponible: ${line.menuItem}`);
    }
    const quantity = line.quantity === undefined ? 1 : Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      res.status(400);
      throw new Error("Quantité invalide");
    }
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

  // Temps réel: file d'attente cuisine/bar + dashboard
  const io = req.app.get("io");
  if (io) {
    io.to(origin === "bar" ? "bar" : "kitchen").emit("order:new", order);
    io.to("dashboard").emit("order:new", order);
  }
  await notify(
    req,
    {
      title: "Nouvelle commande",
      message: `Commande ${order.orderNumber} (${origin}) — ${total}`,
      type: "general",
      data: { orderId: order._id },
    },
    origin === "bar" ? "bar" : "kitchen"
  );

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

  const io = req.app.get("io");
  if (io) {
    io.to(order.origin === "bar" ? "bar" : "kitchen").emit("order:updated", order);
    io.to("dashboard").emit("order:updated", order);
  }

  if (order.client) {
    const labels = { preparing: "en préparation", ready: "prête", served: "servie", cancelled: "annulée" };
    if (labels[status]) {
      await notify(
        req,
        {
          recipientClient: order.client,
          title: status === "ready" ? "Commande prête" : "Mise à jour de commande",
          message: `Votre commande ${order.orderNumber} est ${labels[status]}.`,
          type: status === "ready" ? "order_ready" : "general",
          data: { orderId: order._id, status },
        },
        order.client.toString()
      );
    }
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
