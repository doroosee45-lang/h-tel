const express = require("express");
const router = express.Router();
const { pullChanges, pushActions } = require("../controllers/syncController");
const { protect } = require("../middleware/auth");

// Réservé au personnel (app mobile personnel: réception, restaurant, bar, stock —
// exactement les 4 modules cités au cahier des charges pour le mode hors ligne).
router.use(protect);
router.get("/pull", pullChanges);
router.post("/push", pushActions);

module.exports = router;
