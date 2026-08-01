const stripe = require("../../config/stripe");

// Intégration Stripe RÉELLE (pas un stub) : crée un vrai PaymentIntent via l'API Stripe.
// Fonctionne dès que STRIPE_SECRET_KEY est renseignée dans .env.
const isConfigured = () => !!stripe;

/**
 * Crée un PaymentIntent Stripe pour un montant donné.
 * Le frontend/app mobile utilise le `clientSecret` retourné avec Stripe.js /
 * Stripe React Native SDK pour finaliser le paiement (3D Secure inclus).
 */
const createPaymentIntent = async ({ amount, currency, metadata }) => {
  if (!isConfigured()) {
    throw new Error("Stripe n'est pas configuré (STRIPE_SECRET_KEY manquante dans .env)");
  }
  // Stripe attend les montants en plus petite unité monétaire (centimes)
  const amountInCents = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: currency || process.env.STRIPE_CURRENCY || "eur",
    automatic_payment_methods: { enabled: true },
    metadata,
  });

  return {
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    status: paymentIntent.status,
  };
};

const retrievePaymentIntent = async (id) => {
  if (!isConfigured()) throw new Error("Stripe n'est pas configuré");
  return stripe.paymentIntents.retrieve(id);
};

/**
 * Vérifie la signature d'un webhook Stripe et retourne l'événement parsé.
 * NÉCESSITE le corps brut (raw body) de la requête, pas le JSON déjà parsé —
 * voir le montage spécial de cette route dans app.js.
 */
const constructWebhookEvent = (rawBody, signature) => {
  if (!isConfigured()) throw new Error("Stripe n'est pas configuré");
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET manquant dans .env");
  }
  return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
};

const refundPayment = async (paymentIntentId, amount) => {
  if (!isConfigured()) throw new Error("Stripe n'est pas configuré");
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
  });
};

module.exports = { isConfigured, createPaymentIntent, retrievePaymentIntent, constructWebhookEvent, refundPayment };
