const express = require("express");
const router = express.Router();
const { scanRoom, scanTable, scanInvoice, scanActivity } = require("../controllers/qrController");

// Routes publiques: un client scanne un QR code sans être connecté
router.get("/room/:id", scanRoom);
router.get("/table/:id", scanTable);
router.get("/invoice/:id", scanInvoice);
router.get("/activity/:id", scanActivity);

module.exports = router;
