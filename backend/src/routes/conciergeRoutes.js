const express = require("express");
const router = express.Router();
const { getRequests, getRequest, createRequest, updateRequestStatus } = require("../controllers/conciergeController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { requireClientOrStaff } = require("../middleware/clientAuth");

// Création accessible au client authentifié (app mobile) OU à la réception (staff JWT + body.client)
router.post("/requests", requireClientOrStaff, createRequest);

// Consultation/gestion réservées au personnel
router.get("/requests", protect, authorize("admin", "receptionist"), getRequests);
router.get("/requests/:id", protect, getRequest);
router.patch("/requests/:id/status", protect, authorize("admin", "receptionist"), updateRequestStatus);

module.exports = router;
