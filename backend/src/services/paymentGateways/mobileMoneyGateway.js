const axios = require("axios");

// Mobile Money: il n'existe PAS d'API universelle (contrairement à Stripe/PayPal) —
// chaque pays/opérateur a son propre agrégateur (Flouci et D17 en Tunisie, Orange Money,
// MTN MoMo, M-Pesa...). Ce module est un ADAPTATEUR GÉNÉRIQUE fonctionnel qui suit le
// pattern REST utilisé par la majorité de ces agrégateurs (initier → webhook de
// confirmation → vérifier le statut). Pour passer en production :
//   1. Remplacez MOBILE_MONEY_API_URL par l'endpoint de votre agrégateur
//   2. Adaptez le format du corps de requête `initiatePayment` à sa documentation
//   3. Adaptez le parsing de la réponse dans `verifyPayment` / le webhook
// La structure (créer → vérifier → callback) reste valable pour la quasi-totalité
// des agrégateurs du marché.

const isConfigured = () => !!(process.env.MOBILE_MONEY_API_URL && process.env.MOBILE_MONEY_API_KEY);

const initiatePayment = async ({ amount, currency, phone, reference, callbackUrl }) => {
  if (!isConfigured()) {
    throw new Error(
      "Mobile Money n'est pas configuré (MOBILE_MONEY_API_URL/KEY manquants dans .env)"
    );
  }

  const response = await axios.post(
    `${process.env.MOBILE_MONEY_API_URL}/payments/init`,
    {
      merchant_id: process.env.MOBILE_MONEY_MERCHANT_ID,
      amount,
      currency: currency || "TND",
      customer_phone: phone,
      order_reference: reference,
      callback_url: callbackUrl,
    },
    { headers: { Authorization: `Bearer ${process.env.MOBILE_MONEY_API_KEY}` } }
  );

  // Format typique: { payment_id, payment_url (à afficher/rediriger le client), status }
  return response.data;
};

const verifyPayment = async (paymentId) => {
  if (!isConfigured()) throw new Error("Mobile Money n'est pas configuré");
  const response = await axios.get(
    `${process.env.MOBILE_MONEY_API_URL}/payments/${paymentId}/status`,
    { headers: { Authorization: `Bearer ${process.env.MOBILE_MONEY_API_KEY}` } }
  );
  return response.data; // Format typique: { status: "success"|"pending"|"failed", amount, ... }
};

module.exports = { isConfigured, initiatePayment, verifyPayment };
