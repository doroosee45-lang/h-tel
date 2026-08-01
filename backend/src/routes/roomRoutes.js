const express = require("express");
const router = express.Router();
const {
  getCategories, createCategory, updateCategory, addPromotion,
  getRooms, getRoom, getPriceQuote, checkAvailability, createRoom, updateRoom, updateRoomStatus, deleteRoom,
} = require("../controllers/roomController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.use(protect);

router.get("/categories", getCategories);
router.post("/categories", authorize("admin"), createCategory);
router.put("/categories/:id", authorize("admin"), updateCategory);
router.post("/categories/:id/promotions", authorize("admin"), addPromotion);

router.get("/:id/availability", checkAvailability);
router.get("/:id/price-quote", getPriceQuote);
router.patch("/:id/status", authorize("admin", "receptionist", "housekeeping"), updateRoomStatus);

router.get("/", getRooms);
router.get("/:id", getRoom);
router.post("/", authorize("admin"), createRoom);
router.put("/:id", authorize("admin"), updateRoom);
router.delete("/:id", authorize("admin"), deleteRoom);

module.exports = router;
