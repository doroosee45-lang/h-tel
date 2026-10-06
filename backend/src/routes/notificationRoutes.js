const express = require("express");
const router = express.Router();
const {
  getMyNotifications, getClientNotifications, markAsRead, markAllAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");
const { requireClientOrStaff } = require("../middleware/clientAuth");

router.get("/client/:clientId", requireClientOrStaff, getClientNotifications); // client: uniquement les siennes; personnel: toutes

router.use(protect);
router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

module.exports = router;
