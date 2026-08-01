const axios = require("axios");

// Intégration PayPal RÉELLE via l'API REST Orders v2 (pas un SDK tiers, pas de stub) :
// https://developer.paypal.com/docs/api/orders/v2/
const BASE_URL =
  (process.env.PAYPAL_MODE || "sandbox") === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const isConfigured = () => !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);

// Récupère un token OAuth2 (valable ~9h, non mis en cache ici pour rester simple —
// à optimiser en production avec un cache mémoire/Redis si le volume est élevé)
const getAccessToken = async () => {
  if (!isConfigured()) {
    throw new Error("PayPal n'est pas configuré (PAYPAL_CLIENT_ID/SECRET manquants dans .env)");
  }
  const response = await axios.post(
    `${BASE_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: { username: process.env.PAYPAL_CLIENT_ID, password: process.env.PAYPAL_CLIENT_SECRET },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return response.data.access_token;
};

// Crée une commande PayPal. Le frontend (PayPal JS SDK / React Native SDK) utilise
// l'orderId retourné pour afficher le bouton de paiement.
const createOrder = async ({ amount, currency, reference }) => {
  const token = await getAccessToken();
  const response = await axios.post(
    `${BASE_URL}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: reference,
          amount: { currency_code: currency || "EUR", value: amount.toFixed(2) },
        },
      ],
    },
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );
  return response.data; // contient .id (orderId PayPal) et .links (approval url)
};

// Capture le paiement une fois que le client a approuvé la commande côté PayPal
const captureOrder = async (orderId) => {
  const token = await getAccessToken();
  const response = await axios.post(
    `${BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {},
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );
  return response.data;
};

module.exports = { isConfigured, createOrder, captureOrder };
