const asyncHandler = require("../middleware/asyncHandler");
const stripeGateway = require("../services/paymentGateways/stripeGateway");
const paypalGateway = require("../services/paymentGateways/paypalGateway");
const mobileMoneyGateway = require("../services/paymentGateways/mobileMoneyGateway");
const Invoice = require("../models/Invoice");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const { notify } = require("../utils/notify");

// Marque une facture/commande comme payée une fois le paiement confirmé par la passerelle
// (webhook ou capture synchrone) — factorisé pour être appelé par les 3 passerelles.
const finalizePayment = async (req, { invoiceId, orderId, amount, method, reference }) => {
  const payment = await Payment.create({
    invoice: invoiceId,
    amount,
    method,
    reference,
    status: "completed",
  });

  if (invoiceId) {
    const invoice = await Invoice.findById(invoiceId);
    if (invoice) {
      const totalPaid = (
        await Payment.find({ invoice: invoiceId, status: { $in: ["completed", "refunded"] } })
      ).reduce((s, p) => s + p.amount, 0);
      invoice.status = totalPaid >= invoice.total ? "paid" : "partial";
      await invoice.save();

      if (invoice.client) {
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
    const order = await Order.findByIdAndUpdate(orderId, { isPaid: true, paymentMethod: method }, { new: true });
    if (order?.client) {
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
  const { amount, currency, invoiceId, orderId } = req.body;

  const intent = await stripeGateway.createPaymentIntent({
    amount,
    currency,
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
    throw new Error(`Signature webhook Stripe invalide: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const { invoiceId, orderId } = intent.metadata || {};
    await finalizePayment(req, {
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
  const { amount, currency, invoiceId, orderId } = req.body;
  const reference = invoiceId || orderId || `PAY-${Date.now()}`;

  const order = await paypalGateway.createOrder({ amount, currency, reference });
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
    await finalizePayment(req, {
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
  const { amount, phone, currency, invoiceId, orderId } = req.body;
  const reference = invoiceId || orderId || `PAY-${Date.now()}`;
  const callbackUrl = `${req.protocol}://${req.get("host")}/api/payments/gateway/mobile-money/webhook`;

  const result = await mobileMoneyGateway.initiatePayment({ amount, currency, phone, reference, callbackUrl });

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
  const { status, amount, order_reference, payment_id } = req.body;

  if (status === "success" || status === "SUCCESS" || status === "completed") {
    // order_reference contient l'invoiceId OU orderId passé à l'initiation
    await finalizePayment(req, {
      invoiceId: order_reference,
      amount,
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
