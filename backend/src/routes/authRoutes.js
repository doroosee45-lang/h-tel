const express = require("express");
const router = express.Router();
const {
  register, login, verifyLoginOtp, enable2FA, confirm2FA, disable2FA, refreshToken, logout, getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const authRateLimit = require("../middleware/authRateLimit");

router.post("/register", protect, authorize("admin", "hr_manager"), register); // création réservée admin/RH
router.post("/login", authRateLimit, login);
router.post("/2fa/verify-login", authRateLimit, verifyLoginOtp);
router.post("/refresh", refreshToken);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

// Gestion du 2FA (l'utilisateur connecté active/désactive son propre 2FA)
router.post("/2fa/enable", protect, enable2FA);
router.post("/2fa/confirm", protect, confirm2FA);
router.post("/2fa/disable", protect, disable2FA);

module.exports = router;
