const express = require("express");
const router = express.Router();
const { getItemReviews, createReview } = require("../controllers/reviewController");
const { optionalClientAuth } = require("../middleware/clientAuth");

// Accessible publiquement: un client scanne le QR menu et note son repas.
// optionalClientAuth attache req.client si le client mobile est connecté (recommandé),
// sinon body.client reste accepté pour compatibilité (ex: borne QR sans compte).
router.get("/item/:menuItemId", getItemReviews);
router.post("/", optionalClientAuth, createReview);

module.exports = router;
