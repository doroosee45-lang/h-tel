const express = require("express");
const router = express.Router();
const {
  getActivities, getActivity, createActivity, updateActivity, deleteActivity,
  getBookings, createBooking, updateBookingStatus,
} = require("../controllers/activityController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { requireClientOrStaff } = require("../middleware/clientAuth");

// Catalogue public (l'app mobile client doit pouvoir consulter sans forcément être admin)
router.get("/", getActivities);
router.get("/:id", getActivity);

// Réservation: client authentifié (app mobile) OU réception (staff JWT + body.client)
router.post("/:id/bookings", requireClientOrStaff, createBooking);

router.post("/", protect, authorize("admin"), createActivity);
router.put("/:id", protect, authorize("admin"), updateActivity);
router.delete("/:id", protect, authorize("admin"), deleteActivity);

router.get("/bookings/all", protect, authorize("admin", "receptionist"), getBookings);
router.patch("/bookings/:id/status", protect, authorize("admin", "receptionist"), updateBookingStatus);

module.exports = router;
