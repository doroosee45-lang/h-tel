const express = require("express");
const router = express.Router();
const { getHalls, getHall, createHall, updateHall, deleteHall } = require("../controllers/hallController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

// Catalogue public: consultable par le client avant de faire une demande d'événement
router.get("/", getHalls);
router.get("/:id", getHall);

router.post("/", protect, authorize("admin", "receptionist"), createHall);
router.put("/:id", protect, authorize("admin", "receptionist"), updateHall);
router.delete("/:id", protect, authorize("admin"), deleteHall);

module.exports = router;
