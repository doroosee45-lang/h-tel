const express = require("express");
const router = express.Router();
const {
  getConversation, getActiveConversations, sendClientMessage, sendStaffReply, markConversationRead,
} = require("../controllers/chatController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { optionalClientAuth } = require("../middleware/clientAuth");

// Le client (app mobile, sans compte staff) doit pouvoir lire/écrire sa propre conversation
router.get("/:clientId", getConversation);
router.post("/:clientId", optionalClientAuth, sendClientMessage);

// Vues et réponses réservées au personnel de réception
router.get("/", protect, authorize("admin", "receptionist"), getActiveConversations);
router.post("/:clientId/reply", protect, authorize("admin", "receptionist"), sendStaffReply);
router.patch("/:clientId/read", protect, authorize("admin", "receptionist"), markConversationRead);

module.exports = router;
