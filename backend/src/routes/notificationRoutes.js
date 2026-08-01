const express = require("express");
const router = express.Router();
const {
  getMyNotifications, getClientNotifications, markAsRead, markAllAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

router.get("/client/:clientId", getClientNotifications); // app mobile client (public par simplicité)

router.use(protect);
router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

module.exports = router;
