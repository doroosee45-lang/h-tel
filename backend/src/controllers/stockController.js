const asyncHandler = require("../middleware/asyncHandler");
const StockItem = require("../models/StockItem");
const escapeRegex = require("../utils/escapeRegex");
const StockMovement = require("../models/StockMovement");
const Supplier = require("../models/Supplier");
const PurchaseOrder = require("../models/PurchaseOrder");
const { generateReference } = require("../utils/reference");
const { notify } = require("../utils/notify");
const Expense = require("../models/Expense");
const { computeStockDelta } = require("../utils/stockDelta");

// ---------- Produits ----------

// @route GET /api/stock/items
const getStockItems = asyncHandler(async (req, res) => {
  const { category, lowStock, search, page = 1, limit = 50 } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (search) filter.name = new RegExp(escapeRegex(search), "i");

  let items = await StockItem.find(filter)
    .populate("supplier", "name phone")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ name: 1 });

  if (lowStock === "true") {
    items = items.filter((i) => i.quantity <= i.minThreshold);
  }

  const total = await StockItem.countDocuments(filter);
  res.json({ success: true, count: items.length, total, data: items });
});

// @route GET /api/stock/items/alerts  -> produits en stock critique / rupture
const getStockAlerts = asyncHandler(async (req, res) => {
  const items = await StockItem.find({ isActive: true });
  const critical = items.filter((i) => i.quantity <= i.minThreshold);
  res.json({ success: true, count: critical.length, data: critical });
});

// @route GET /api/stock/items/:id
const getStockItem = asyncHandler(async (req, res) => {
  const item = await StockItem.findById(req.params.id).populate("supplier");
  if (!item) {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
  const movements = await StockMovement.find({ stockItem: item._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, data: { item, movements } });
});

// @route POST /api/stock/items
const createStockItem = asyncHandler(async (req, res) => {
  const item = await StockItem.create(req.body);
  res.status(201).json({ success: true, data: item });
});

// @route PUT /api/stock/items/:id
const updateStockItem = asyncHandler(async (req, res) => {
  const item = await StockItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error("Produit non trouvé");
  }
  res.json({ success: true, data: item });
});

// ---------- Mouvements de stock (entrée/sortie/perte/inventaire) ----------

// @route POST /api/stock/movements
const createMovement = asyncHandler(async (req, res) => {
  const { stockItem, type, quantity, reason, reference } = req.body;

  const item = await StockItem.findById(stockItem);
  if (!item) {
    res.status(404);
    throw new Error("Produit non trouvé");
  }

  const delta = computeStockDelta(type, quantity);
  item.quantity = Math.max(0, item.quantity + delta);
  await item.save();

  const movement = await StockMovement.create({
    stockItem,
    type,
    quantity,
    reason,
    reference,
    performedBy: req.user?._id,
  });

  if (item.quantity <= item.minThreshold) {
    await notify(
      req,
      {
        title: "Alerte stock critique",
        message: `${item.name} (${item.code}) est en stock critique: ${item.quantity} ${item.unit} restant(s).`,
        type: "low_stock",
        data: { stockItemId: item._id },
      },
      "stock"
    );
  }

  res.status(201).json({ success: true, data: { movement, newQuantity: item.quantity } });
});

// @route GET /api/stock/movements
const getMovements = asyncHandler(async (req, res) => {
  const { stockItem, type, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (stockItem) filter.stockItem = stockItem;
  if (type) filter.type = type;

  const movements = await StockMovement.find(filter)
    .populate("stockItem", "name code unit")
    .populate("performedBy", "firstName lastName")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  res.json({ success: true, data: movements });
});

// ---------- Fournisseurs ----------

// @route GET /api/stock/suppliers
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find({ isActive: true });
  res.json({ success: true, data: suppliers });
});

// @route POST /api/stock/suppliers
const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json({ success: true, data: supplier });
});

// ---------- Commandes fournisseurs (achats) ----------

// @route GET /api/stock/purchase-orders
const getPurchaseOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const orders = await PurchaseOrder.find(filter)
    .populate("supplier", "name")
    .populate("items.stockItem", "name unit")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// @route POST /api/stock/purchase-orders
const createPurchaseOrder = asyncHandler(async (req, res) => {
  const { supplier, items } = req.body;
  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  const order = await PurchaseOrder.create({
    reference: generateReference("PO"),
    supplier,
    items,
    totalAmount,
    requestedBy: req.user?._id,
    status: "pending_validation",
  });

  res.status(201).json({ success: true, data: order });
});

// @route PATCH /api/stock/purchase-orders/:id/validate
const validatePurchaseOrder = asyncHandler(async (req, res) => {
  const order = await PurchaseOrder.findByIdAndUpdate(
    req.params.id,
    { status: "validated", validatedBy: req.user?._id },
    { new: true }
  );
  if (!order) {
    res.status(404);
    throw new Error("Commande fournisseur non trouvée");
  }
  res.json({ success: true, data: order });
});

// @route POST /api/stock/purchase-orders/:id/receive
// Réceptionne la marchandise: incrémente automatiquement le stock
const receivePurchaseOrder = asyncHandler(async (req, res) => {
  const order = await PurchaseOrder.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Commande fournisseur non trouvée");
  }
  if (order.status === "received") {
    res.status(400);
    throw new Error("Cette commande a déjà été réceptionnée");
  }

  for (const line of order.items) {
    await StockItem.findByIdAndUpdate(line.stockItem, { $inc: { quantity: line.quantity } });
    await StockMovement.create({
      stockItem: line.stockItem,
      type: "in",
      quantity: line.quantity,
      reason: "Réception fournisseur",
      reference: order.reference,
      performedBy: req.user?._id,
    });
  }

  order.status = "received";
  order.receivedAt = new Date();
  await order.save();

  // Répercute automatiquement l'achat en Dépense (comptabilité §8/§14)
  await Expense.create({
    reference: generateReference("EXP"),
    category: "supplies",
    description: `Réception commande fournisseur ${order.reference}`,
    amount: order.totalAmount,
    date: new Date(),
    paymentMethod: "bank_transfer",
    supplier: order.supplier,
    relatedPurchaseOrder: order._id,
    recordedBy: req.user?._id,
    approvedBy: req.user?._id,
    status: "approved",
  });

  res.json({ success: true, data: order });
});

module.exports = {
  getStockItems,
  getStockAlerts,
  getStockItem,
  createStockItem,
  updateStockItem,
  createMovement,
  getMovements,
  getSuppliers,
  createSupplier,
  getPurchaseOrders,
  createPurchaseOrder,
  validatePurchaseOrder,
  receivePurchaseOrder,
};
