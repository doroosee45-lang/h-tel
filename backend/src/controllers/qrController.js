const asyncHandler = require("../middleware/asyncHandler");
const Room = require("../models/Room");
const Table = require("../models/Table");
const Invoice = require("../models/Invoice");
const MenuCategory = require("../models/MenuCategory");
const MenuItem = require("../models/MenuItem");
const Activity = require("../models/Activity");

// @route GET /api/qr/room/:id  -> ce que le client voit en scannant le QR de sa chambre
const scanRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate("category");
  if (!room) {
    res.status(404);
    throw new Error("Chambre non trouvée");
  }
  res.json({ success: true, data: room });
});

// @route GET /api/qr/table/:id -> menu accessible en scannant le QR d'une table
const scanTable = asyncHandler(async (req, res) => {
  const table = await Table.findById(req.params.id);
  if (!table) {
    res.status(404);
    throw new Error("Table non trouvée");
  }
  const categories = await MenuCategory.find({ type: "restaurant" }).sort({ order: 1 });
  const items = await MenuItem.find({ type: "restaurant", isAvailable: true });
  res.json({ success: true, data: { table, categories, items } });
});

// @route GET /api/qr/invoice/:id -> vérification de facture via QR
const scanInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate("client", "firstName lastName");
  if (!invoice) {
    res.status(404);
    throw new Error("Facture non trouvée");
  }
  res.json({
    success: true,
    data: {
      invoiceNumber: invoice.invoiceNumber,
      total: invoice.total,
      status: invoice.status,
      client: invoice.client,
      createdAt: invoice.createdAt,
    },
  });
});

// @route GET /api/qr/activity/:id -> fiche activité accessible en scannant son QR (affiche, dépliant...)
const scanActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) {
    res.status(404);
    throw new Error("Activité non trouvée");
  }
  res.json({ success: true, data: activity });
});

module.exports = { scanRoom, scanTable, scanInvoice, scanActivity };
