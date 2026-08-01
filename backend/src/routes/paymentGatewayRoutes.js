const express = require("express");
const router = express.Router();
const {
  createStripeIntent, refundStripePayment, createPaypalOrder, capturePaypalOrder,
  initiateMobileMoneyPayment, mobileMoneyWebhook,
} = require("../controllers/paymentGatewayController");
const { requireClientOrStaff } = require("../middleware/clientAuth");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

// NOTE: la route POST /stripe/webhook n'est PAS ici — elle est montée séparément
// dans app.js avec express.raw() car Stripe exige le corps brut pour la signature.

// Le client (app mobile, paiement en ligne depuis le QR menu ou sa facture) OU la
// réception peuvent déclencher un paiement.
router.post("/stripe/create-intent", requireClientOrStaff, createStripeIntent);
router.post("/paypal/create-order", requireClientOrStaff, createPaypalOrder);
router.post("/paypal/capture/:orderId", requireClientOrStaff, capturePaypalOrder);
router.post("/mobile-money/initiate", requireClientOrStaff, initiateMobileMoneyPayment);

// Remboursement: réservé au personnel autorisé (jamais au client lui-même)
router.post("/stripe/refund", protect, authorize("admin", "accountant"), refundStripePayment);

// Webhook mobile money: appelé par l'agrégateur, pas par un utilisateur authentifié
router.post("/mobile-money/webhook", mobileMoneyWebhook);

module.exports = router;
