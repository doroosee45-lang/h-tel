const express = require("express");
const router = express.Router();
const {
  registerClient, loginClient, refreshClientToken, getClientMe, updateClientMe, logoutClient,
  getClientHistory, getClientInvoices,
} = require("../controllers/clientAuthController");
const { protectClient } = require("../middleware/clientAuth");
const authRateLimit = require("../middleware/authRateLimit");

router.post("/register", authRateLimit, registerClient);
router.post("/login", authRateLimit, loginClient);
router.post("/refresh", refreshClientToken);
router.get("/me", protectClient, getClientMe);
router.get("/me/history", protectClient, getClientHistory);
router.get("/me/invoices", protectClient, getClientInvoices);
router.put("/me", protectClient, updateClientMe);
router.post("/logout", protectClient, logoutClient);

module.exports = router;
