const express = require("express");
const router = express.Router();
const { issueDigitalKey, getMyKeys, validateKey, revokeKey } = require("../controllers/lockController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { protectClient, requireClientOrStaff } = require("../middleware/clientAuth");
const { requireHardwareSecret } = require("../middleware/hardwareAuth");

// Appelé par la passerelle matérielle de la serrure (clé partagée, pas JWT)
router.post("/validate", requireHardwareSecret, validateKey);

// Client: consulter ses propres clés
router.get("/mine", protectClient, getMyKeys);

// Émission: automatique au check-in (voir reservationController) ou manuelle par la réception
router.post("/issue", protect, authorize("admin", "receptionist"), issueDigitalKey);

// Révocation: le client (perte de téléphone) ou la réception
router.post("/:id/revoke", requireClientOrStaff, revokeKey);

module.exports = router;
