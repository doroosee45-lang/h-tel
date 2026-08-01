const express = require("express");
const router = express.Router();
const {
  getReservations, getReservation, createReservation, updateReservation,
  cancelReservation, checkIn, checkOut,
} = require("../controllers/reservationController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { requireClientOrStaff } = require("../middleware/clientAuth");

// Réservation: client authentifié (app mobile, réservation en ligne) OU réception (staff + body.client)
router.post("/", requireClientOrStaff, createReservation);

router.get("/", protect, getReservations);
router.get("/:id", protect, getReservation);
router.put("/:id", protect, authorize("admin", "receptionist"), updateReservation);
router.post("/:id/cancel", protect, authorize("admin", "receptionist"), cancelReservation);
router.post("/:id/checkin", protect, authorize("admin", "receptionist"), checkIn);
router.post("/:id/checkout", protect, authorize("admin", "receptionist"), checkOut);

module.exports = router;
