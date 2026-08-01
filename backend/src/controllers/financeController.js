const asyncHandler = require("../middleware/asyncHandler");
const CashRegister = require("../models/CashRegister");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Expense = require("../models/Expense");
const { generateReference } = require("../utils/reference");
const { generateQRCode } = require("../utils/qrGenerator");
const { notify } = require("../utils/notify");

// ---------- Caisse ----------

// @route POST /api/finance/cash-register/open
const openCashRegister = asyncHandler(async (req, res) => {
  const existingOpen = await CashRegister.findOne({ status: "open", openedBy: req.user._id });
  if (existingOpen) {
    res.status(400);
    throw new Error("Une caisse est déjà ouverte pour cet utilisateur");
  }
  const register = await CashRegister.create({
    openedBy: req.user._id,
    openingAmount: req.body.openingAmount,
  });
  res.status(201).json({ success: true, data: register });
});

// @route POST /api/finance/cash-register/:id/close
const closeCashRegister = asyncHandler(async (req, res) => {
  const { closingAmount, expectedAmount, notes } = req.body;
  const register = await CashRegister.findById(req.params.id);
  if (!register) {
    res.status(404);
    throw new Error("Caisse non trouvée");
  }
  register.closingAmount = closingAmount;
  register.expectedAmount = expectedAmount;
  register.difference = closingAmount - expectedAmount; // écart de caisse -> détection anomalie
  register.status = "closed";
  register.closedAt = new Date();
  register.closedBy = req.user._id;
  register.notes = notes;
  await register.save();

  res.json({ success: true, data: register });
});

// @route GET /api/finance/cash-register
const getCashRegisters = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const registers = await CashRegister.find(filter)
    .populate("openedBy", "firstName lastName")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: registers });
});

// ---------- Factures ----------

// @route GET /api/finance/invoices
const getInvoices = asyncHandler(async (req, res) => {
  const { status, type, client, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (client) filter.client = client;

  const invoices = await Invoice.find(filter)
    .populate("client", "firstName lastName email")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await Invoice.countDocuments(filter);
  res.json({ success: true, count: invoices.length, total, data: invoices });
});

// @route GET /api/finance/invoices/:id
const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate("client");
  if (!invoice) {
    res.status(404);
    throw new Error("Facture non trouvée");
  }
  const payments = await Payment.find({ invoice: invoice._id });
  res.json({ success: true, data: { invoice, payments } });
});

// @route POST /api/finance/invoices
const createInvoice = asyncHandler(async (req, res) => {
  const { type, client, reservation, order, lines, taxRate, discount } = req.body;
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const taxAmount = taxRate ? (subtotal * taxRate) / 100 : 0;
  const total = subtotal + taxAmount - (discount || 0);

  const invoice = await Invoice.create({
    invoiceNumber: generateReference("INV"),
    type,
    client,
    reservation,
    order,
    lines,
    subtotal,
    taxRate: taxRate || 0,
    taxAmount,
    discount: discount || 0,
    total,
  });
  invoice.qrCode = await generateQRCode({ type: "invoice", invoiceId: invoice._id.toString() });
  await invoice.save();

  res.status(201).json({ success: true, data: invoice });
});

// @route GET /api/finance/invoices/verify/:id  (utilisé par le scan QR facture)
const verifyInvoice = asyncHandler(async (req, res) => {
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

// ---------- Paiements ----------

// @route POST /api/finance/payments
const createPayment = asyncHandler(async (req, res) => {
  const { invoice: invoiceId, amount, method, reference } = req.body;

  const payment = await Payment.create({
    invoice: invoiceId,
    amount,
    method,
    reference,
    receivedBy: req.user?._id,
  });

  if (invoiceId) {
    const invoice = await Invoice.findById(invoiceId);
    if (invoice) {
      const totalPaid = (
        await Payment.find({ invoice: invoiceId, status: { $in: ["completed", "refunded"] } })
      ).reduce((sum, p) => sum + p.amount, 0);
      invoice.status = totalPaid >= invoice.total ? "paid" : totalPaid > 0 ? "partial" : "unpaid";
      await invoice.save();

      if (invoice.client) {
        await notify(
          req,
          {
            recipientClient: invoice.client,
            title: "Paiement reçu",
            message: `Paiement de ${amount} enregistré sur la facture ${invoice.invoiceNumber}.`,
            type: "payment_received",
            data: { invoiceId: invoice._id, paymentId: payment._id },
          },
          invoice.client.toString()
        );
      }
    }
  }

  res.status(201).json({ success: true, data: payment });
});

// ---------- Dépenses ----------

// @route GET /api/finance/expenses
const getExpenses = asyncHandler(async (req, res) => {
  const { category, from, to, status, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const expenses = await Expense.find(filter)
    .populate("supplier", "name")
    .populate("recordedBy", "firstName lastName")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ date: -1 });

  const total = await Expense.countDocuments(filter);
  const totalAmount = (await Expense.find(filter)).reduce((s, e) => s + e.amount, 0);

  res.json({ success: true, count: expenses.length, total, totalAmount, data: expenses });
});

// @route GET /api/finance/expenses/:id
const getExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id).populate("supplier").populate("recordedBy", "firstName lastName");
  if (!expense) {
    res.status(404);
    throw new Error("Dépense non trouvée");
  }
  res.json({ success: true, data: expense });
});

// @route POST /api/finance/expenses
const createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create({
    ...req.body,
    reference: generateReference("EXP"),
    recordedBy: req.user._id,
  });
  res.status(201).json({ success: true, data: expense });
});

// @route PUT /api/finance/expenses/:id
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!expense) {
    res.status(404);
    throw new Error("Dépense non trouvée");
  }
  res.json({ success: true, data: expense });
});

// @route PATCH /api/finance/expenses/:id/approve
const approveExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(
    req.params.id,
    { status: "approved", approvedBy: req.user._id },
    { new: true }
  );
  if (!expense) {
    res.status(404);
    throw new Error("Dépense non trouvée");
  }
  res.json({ success: true, data: expense });
});

// @route DELETE /api/finance/expenses/:id
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error("Dépense non trouvée");
  }
  res.json({ success: true, message: "Dépense supprimée" });
});

// ---------- Rapports financiers ----------

// @route GET /api/finance/reports/daily?date=YYYY-MM-DD
const getDailyReport = asyncHandler(async (req, res) => {
  const date = req.query.date ? new Date(req.query.date) : new Date();
  const start = new Date(date.setHours(0, 0, 0, 0));
  const end = new Date(date.setHours(23, 59, 59, 999));

  const invoices = await Invoice.find({ createdAt: { $gte: start, $lte: end } });
  const orders = await Order.find({ createdAt: { $gte: start, $lte: end }, isPaid: true });
  const payments = await Payment.find({
    createdAt: { $gte: start, $lte: end },
    status: { $in: ["completed", "refunded"] },
  });
  const expenses = await Expense.find({ date: { $gte: start, $lte: end }, status: "approved" });

  const revenueByType = invoices.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.total;
    return acc;
  }, {});

  const restaurantSales = orders.filter((o) => o.origin === "restaurant").reduce((s, o) => s + o.total, 0);
  const barSales = orders.filter((o) => o.origin === "bar").reduce((s, o) => s + o.total, 0);
  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const expensesByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      date: start.toISOString().split("T")[0],
      totalRevenue,
      revenueByType,
      restaurantSales,
      barSales,
      totalExpenses,
      expensesByCategory,
      netProfit: totalRevenue - totalExpenses,
      invoiceCount: invoices.length,
      paymentCount: payments.length,
    },
  });
});

// @route GET /api/finance/reports/ledger?from=&to=
// "Grand livre" simplifié: liste chronologique de toutes les recettes et dépenses sur
// une période, avec solde cumulé — plus le calcul de rentabilité (§8 "Statistiques").
const getLedger = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    res.status(400);
    throw new Error("from et to sont requis (YYYY-MM-DD)");
  }
  const start = new Date(from);
  const end = new Date(to);
  end.setHours(23, 59, 59, 999);

  // Inclut les paiements complétés ET les remboursements (montant négatif), sinon un
  // remboursement resterait invisible et fausserait le calcul de rentabilité.
  const payments = await Payment.find({
    createdAt: { $gte: start, $lte: end },
    status: { $in: ["completed", "refunded"] },
  }).sort({ createdAt: 1 });
  const expenses = await Expense.find({ date: { $gte: start, $lte: end }, status: "approved" }).sort({ date: 1 });

  const entries = [
    ...payments.map((p) => ({
      date: p.createdAt,
      type: p.status === "refunded" ? "remboursement" : "recette",
      description: p.status === "refunded" ? `Remboursement ${p.method}` : `Paiement ${p.method}`,
      amount: p.amount,
    })),
    ...expenses.map((e) => ({
      date: e.date,
      type: "depense",
      description: `${e.category}: ${e.description}`,
      amount: -e.amount,
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  let balance = 0;
  const ledger = entries.map((entry) => {
    balance += entry.amount;
    return { ...entry, balance };
  });

  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const profitMargin = totalRevenue ? Math.round(((totalRevenue - totalExpenses) / totalRevenue) * 1000) / 10 : 0;

  res.json({
    success: true,
    data: {
      period: { from, to },
      summary: {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        profitMarginPercent: profitMargin,
      },
      ledger,
    },
  });
});

module.exports = {
  openCashRegister,
  closeCashRegister,
  getCashRegisters,
  getInvoices,
  getInvoice,
  createInvoice,
  verifyInvoice,
  createPayment,
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  approveExpense,
  deleteExpense,
  getDailyReport,
  getLedger,
};
