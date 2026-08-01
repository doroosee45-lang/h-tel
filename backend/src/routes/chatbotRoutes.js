const express = require("express");
const router = express.Router();
const { sendMessage, getHistory } = require("../controllers/chatbotController");
const { optionalClientAuth } = require("../middleware/clientAuth");

// Accessible au client connecté (app mobile) OU en mode anonyme via sessionId
// (ex: borne d'accueil / site web sans compte)
router.post("/message", optionalClientAuth, sendMessage);
router.get("/history", optionalClientAuth, getHistory);

module.exports = router;
