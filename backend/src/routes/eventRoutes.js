const express = require("express");
const router = express.Router();
const {
  getEvents, getEvent, checkHallAvailability, createEvent, updateEvent, updateEventStatus,
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { requireClientOrStaff } = require("../middleware/clientAuth");

// Demande d'événement/salle: client connecté (app mobile: "Réserver une salle") OU réception
router.post("/", requireClientOrStaff, createEvent);
router.get("/availability", checkHallAvailability);

router.use(protect);
router.use(authorize("admin", "receptionist"));

router.get("/", getEvents);
router.get("/:id", getEvent);
router.put("/:id", updateEvent);
router.patch("/:id/status", updateEventStatus);

module.exports = router;
