const asyncHandler = require("../middleware/asyncHandler");
const mongoose = require("mongoose");
const stripeGateway = require("../services/paymentGateways/stripeGateway");
const paypalGateway = require("../services/paymentGateways/paypalGateway");
const mobileMoneyGateway = require("../services/paymentGateways/mobileMoneyGateway");
const Invoice = require("../models/Invoice");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { notify } = require("../utils/notify");
const { parseExactPaymentAmount, isValidPaymentReference } = require("../utils/paymentValidation");

const isObjectId = (value) => typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
const toObjectId = (value) => new mongoose.Types.ObjectId(value);

const paymentError = (res, status, message) => {
  res.status(status);
  throw new Error(message);
};

const getPaymentTarget = async (req, res, { invoiceId, orderId }) => {
  if (Boolean(invoiceId) === Boolean(orderId)) {
    paymentError(res, 400, "Précisez exactement une facture ou une commande");
  }
  if ((invoiceId && !isObjectId(invoiceId)) || (orderId && !isObjectId(orderId))) {
    paymentError(res, 400, "Identifiant de facture ou commande invalide");
  }

  const targetId = toObjectId(invoiceId || orderId);
  const invoice = invoiceId ? await Invoice.findById(targetId) : null;
  const order = orderId ? await Order.findById(targetId) : null;
  const target = invoiceId ? invoice : order;
  if (!target) paymentError(res, 404, "Facture ou commande non trouvée");
  if (req.client && (!target.client || target.client.toString() !== req.client._id.toString())) {
    paymentError(res, 404, "Facture ou commande non trouvée");
  }

  let amountDue;
  if (invoice) {
    if (invoice.status === "cancelled") paymentError(res, 400, "Cette facture ne peut pas être payée");
    const payments = await Payment.find({ invoice: invoice._id, status: { $in: ["completed", "refunded"] } });
    amountDue = invoice.total - payments.reduce((sum, payment) => sum + payment.amount, 0);
  } else {
    if (order.isPaid) paymentError(res, 400, "Cette commande est déjà payée");
    amountDue = order.total;
  }
  if (!Number.isFinite(amountDue) || amountDue <= 0) {
    paymentError(res, 400, "Aucun montant restant à payer");
  }

  return { invoice, order, amountDue };
};

const validatePaymentAmount = (res, requestedAmount, amountDue) => {
  const amount = parseExactPaymentAmount(requestedAmount, amountDue);
  if (amount === null) {
    paymentError(res, 400, "Le montant demandé ne correspond pas au solde à régler");
  }
  return amount;
};

// Marque une facture/commande comme payée une fois le paiement confirmé par la passerelle
// (webhook ou capture synchrone) — factorisé pour être appelé par les 3 passerelles.
const finalizePayment = async (req, res, { invoiceId, orderId, amount, method, reference }) => {
  if (
    Boolean(invoiceId) === Boolean(orderId) ||
    (invoiceId && !isObjectId(invoiceId)) ||
    (orderId && !isObjectId(orderId)) ||
    !["stripe", "paypal", "mobile_money"].includes(method) ||
    !isValidPaymentReference(reference)
  ) {
    paymentError(res, 400, "Référence ou cible de paiement invalide");
  }
  let payment = await Payment.findOne({ method, reference });
  let wasExisting = Boolean(payment);
  if (payment) {
    if (
      payment.invoice?.toString() !== invoiceId?.toString() ||
      payment.order?.toString() !== orderId?.toString() ||
      Math.round(Number(payment.amount) * 100) !== Math.round(Number(amount) * 100)
    ) {
      paymentError(res, 409, "Cette référence de paiement est déjà associée à une autre transaction");
    }
  } else {
    const target = await getPaymentTarget(req, res, { invoiceId, orderId });
    if (parseExactPaymentAmount(amount, target.amountDue) === null) {
      paymentError(res, 400, "Le montant confirmé ne correspond pas au solde de la facture ou commande");
    }
    try {
      payment = await Payment.create({
        invoice: invoiceId,
        order: orderId,
        amount,
        method,
        reference,
        status: "completed",
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
      payment = await Payment.findOne({ method, reference });
      if (
        !payment ||
        payment.invoice?.toString() !== invoiceId?.toString() ||
        payment.order?.toString() !== orderId?.toString() ||
        Math.round(Number(payment.amount) * 100) !== Math.round(Number(amount) * 100)
      ) {
        paymentError(res, 409, "Cette référence de paiement est déjà associée à une autre transaction");
      }
      wasExisting = true;
    }
  }

  if (invoiceId) {
    const invoiceObjectId = toObjectId(invoiceId);
    const invoice = await Invoice.findById(invoiceObjectId);
    if (invoice) {
      const totalPaid = (
        await Payment.find({ invoice: invoiceObjectId, status: { $in: ["completed", "refunded"] } })
      ).reduce((s, p) => s + p.amount, 0);
      invoice.status = totalPaid >= invoice.total ? "paid" : "partial";
      await invoice.save();

      if (invoice.client && !wasExisting) {
        await notify(
          req,
          {
            recipientClient: invoice.client,
            title: "Paiement reçu",
            message: `Paiement de ${amount} confirmé sur la facture ${invoice.invoiceNumber}.`,
            type: "payment_received",
            data: { invoiceId: invoice._id },
          },
          invoice.client.toString()
        );
      }
    }
  }

  if (orderId) {
    const order = await Order.findByIdAndUpdate(
      toObjectId(orderId),
      { isPaid: true, paymentMethod: method },
      { new: true }
    );
    if (order?.client && !wasExisting) {
      await notify(
        req,
        {
          recipientClient: order.client,
          title: "Paiement reçu",
          message: `Paiement de la commande ${order.orderNumber} confirmé.`,
          type: "payment_received",
        },
        order.client.toString()
      );
    }
  }

  return payment;
};

// ============ STRIPE ============

// @route POST /api/payments/gateway/stripe/create-intent
// Body: { amount, currency?, invoiceId?, orderId? }
const createStripeIntent = asyncHandler(async (req, res) => {
  if (!stripeGateway.isConfigured()) {
    res.status(503);
    throw new Error("Stripe n'est pas configuré côté serveur (clé API manquante)");
  }
  const { amount, invoiceId, orderId } = req.body;
  const target = await getPaymentTarget(req, res, { invoiceId, orderId });

  const intent = await stripeGateway.createPaymentIntent({
    amount: validatePaymentAmount(res, amount, target.amountDue),
    currency: process.env.STRIPE_CURRENCY || "eur",
    metadata: { invoiceId: invoiceId || "", orderId: orderId || "", clientId: req.client?._id?.toString() || "" },
  });

  res.status(201).json({ success: true, data: intent });
});

// @route POST /api/payments/gateway/stripe/webhook
// IMPORTANT: montée dans app.js AVANT express.json() avec express.raw(), car Stripe
// exige le corps brut pour vérifier la signature.
const stripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripeGateway.constructWebhookEvent(req.body, signature);
  } catch (err) {
    res.status(400);
    throw new Error("Signature webhook Stripe invalide");
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const { invoiceId, orderId } = intent.metadata || {};
    await finalizePayment(req, res, {
      invoiceId: invoiceId || undefined,
      orderId: orderId || undefined,
      amount: intent.amount_received / 100,
      method: "stripe",
      reference: intent.id,
    });
  }

  res.json({ received: true });
});

// ============ PAYPAL ============

// @route POST /api/payments/gateway/paypal/create-order
// Body: { amount, currency?, invoiceId?, orderId? }
const createPaypalOrder = asyncHandler(async (req, res) => {
  if (!paypalGateway.isConfigured()) {
    res.status(503);
    throw new Error("PayPal n'est pas configuré côté serveur");
  }
  const { amount, invoiceId, orderId } = req.body;
  const target = await getPaymentTarget(req, res, { invoiceId, orderId });
  const reference = invoiceId || orderId || `PAY-${Date.now()}`;

  const order = await paypalGateway.createOrder({
    amount: validatePaymentAmount(res, amount, target.amountDue),
    currency: (process.env.STRIPE_CURRENCY || "EUR").toUpperCase(),
    reference,
  });
  res.status(201).json({ success: true, data: order });
});

// @route POST /api/payments/gateway/paypal/capture/:orderId
// Body: { invoiceId?, orderId? } (l'ID de facture/commande hôtel liée à ce paiement)
const capturePaypalOrder = asyncHandler(async (req, res) => {
  if (!paypalGateway.isConfigured()) {
    res.status(503);
    throw new Error("PayPal n'est pas configuré côté serveur");
  }
  const { invoiceId, orderId } = req.body;

  const capture = await paypalGateway.captureOrder(req.params.orderId);
  const status = capture.status;
  const amountCaptured = parseFloat(
    capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || 0
  );

  if (status === "COMPLETED") {
    const { invoiceId, orderId } = req.body;
    const reference = invoiceId || orderId;
    const capturedReference = capture.purchase_units?.[0]?.reference_id;
    if (!reference || capturedReference !== reference) {
      paymentError(res, 400, "La commande PayPal ne correspond pas à la facture ou commande fournie");
    }
    const target = await getPaymentTarget(req, res, { invoiceId, orderId });
    validatePaymentAmount(res, amountCaptured, target.amountDue);
    await finalizePayment(req, res, {
      invoiceId,
      orderId,
      amount: amountCaptured,
      method: "paypal",
      reference: req.params.orderId,
    });
  }

  res.json({ success: true, data: { status, amountCaptured } });
});

// ============ MOBILE MONEY ============

// @route POST /api/payments/gateway/mobile-money/initiate
// Body: { amount, phone, invoiceId?, orderId?, currency? }
const initiateMobileMoneyPayment = asyncHandler(async (req, res) => {
  if (!mobileMoneyGateway.isConfigured()) {
    res.status(503);
    throw new Error("Mobile Money n'est pas configuré côté serveur");
  }
  const { amount, phone, invoiceId, orderId } = req.body;
  const target = await getPaymentTarget(req, res, { invoiceId, orderId });
  const reference = invoiceId || orderId || `PAY-${Date.now()}`;
  const callbackUrl = `${req.protocol}://${req.get("host")}/api/payments/gateway/mobile-money/webhook`;

  const result = await mobileMoneyGateway.initiatePayment({
    amount: validatePaymentAmount(res, amount, target.amountDue),
    currency: (process.env.STRIPE_CURRENCY || "EUR").toUpperCase(),
    phone,
    reference,
    callbackUrl,
  });

  res.status(201).json({
    success: true,
    data: result,
    note: invoiceId || orderId
      ? `Référence associée: ${reference}. Le paiement sera confirmé via webhook.`
      : undefined,
  });
});

// @route POST /api/payments/gateway/mobile-money/webhook
// Format du corps à adapter selon votre agrégateur réel (voir mobileMoneyGateway.js)
const mobileMoneyWebhook = asyncHandler(async (req, res) => {
  const { payment_id } = req.body;
  if (typeof payment_id !== "string" || !payment_id || payment_id.length > 200) {
    paymentError(res, 400, "Identifiant de paiement invalide");
  }
  const confirmed = await mobileMoneyGateway.verifyPayment(payment_id);
  const status = String(confirmed.status || "").toLowerCase();

  if (status === "success" || status === "completed") {
    const reference = confirmed.order_reference;
    if (!reference || (req.body.order_reference && req.body.order_reference !== reference)) {
      paymentError(res, 400, "Référence de paiement invalide");
    }
    const invoice = await Invoice.findById(reference);
    const order = invoice ? null : await Order.findById(reference);
    if (!invoice && !order) paymentError(res, 404, "Facture ou commande non trouvée");
    const target = await getPaymentTarget(req, res, {
      invoiceId: invoice ? reference : undefined,
      orderId: order ? reference : undefined,
    });
    validatePaymentAmount(res, confirmed.amount, target.amountDue);
    await finalizePayment(req, res, {
      invoiceId: invoice ? reference : undefined,
      orderId: order ? reference : undefined,
      amount: Number(confirmed.amount),
      method: "mobile_money",
      reference: payment_id,
    });
  }

  res.json({ received: true });
});

// @route POST /api/payments/gateway/stripe/refund
// Body: { paymentIntentId, amount?, invoiceId?, orderId? } — amount omis = remboursement total
const refundStripePayment = asyncHandler(async (req, res) => {
  if (!stripeGateway.isConfigured()) {
    res.status(503);
    throw new Error("Stripe n'est pas configuré côté serveur");
  }
  const { paymentIntentId, amount, invoiceId, orderId } = req.body;

  const refund = await stripeGateway.refundPayment(paymentIntentId, amount);

  // Trace le remboursement dans les paiements (montant négatif = sortie d'argent),
  // pour que le grand livre (/finance/reports/ledger) reflète correctement la réalité.
  await Payment.create({
    invoice: invoiceId || undefined,
    amount: -(amount || refund.amount / 100),
    method: "stripe",
    reference: refund.id,
    status: "refunded",
    receivedBy: req.user?._id,
  });

  // Répercute le remboursement: facture repassée en "unpaid" (ou "partial" si partiel),
  // commande repassée en "non payée"
  if (invoiceId) {
    const invoice = await Invoice.findById(invoiceId);
    if (invoice) {
      invoice.status = amount && amount < invoice.total ? "partial" : "unpaid";
      await invoice.save();
    }
  }
  if (orderId) {
    await Order.findByIdAndUpdate(orderId, { isPaid: false });
  }

  res.json({ success: true, data: refund });
});

module.exports = {
  createStripeIntent,
  stripeWebhook,
  refundStripePayment,
  createPaypalOrder,
  capturePaypalOrder,
  initiateMobileMoneyPayment,
  mobileMoneyWebhook,
};
