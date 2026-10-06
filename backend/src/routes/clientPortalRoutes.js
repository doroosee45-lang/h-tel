const express = require("express");
const router = express.Router();
const {
  registerClient, loginClient, refreshClientToken, getClientMe, updateClientMe, logoutClient,
} = require("../controllers/clientAuthController");
const {
  getPortalRooms, getPortalRoom, getMyReservations, getMyOrders, getMyInvoices,
  getMyConciergeRequests, getMyNotifications, markMyNotificationRead,
} = require("../controllers/clientPortalController");
const { getPriceQuote } = require("../controllers/roomController");
const { createReservation } = require("../controllers/reservationController");
const { createOrder } = require("../controllers/orderController");
const { createRequest } = require("../controllers/conciergeController");
const { protectClient } = require("../middleware/clientAuth");

// Auth client dédiée (JWT purpose=client, distinct du JWT staff)
router.post("/register", registerClient);
router.post("/login", loginClient);
router.post("/refresh", refreshClientToken);

router.use(protectClient);

router.get("/me", getClientMe);
router.put("/me", updateClientMe);
router.post("/logout", logoutClient);

router.get("/rooms", getPortalRooms);
router.get("/rooms/:id/price-quote", getPriceQuote);
router.get("/rooms/:id", getPortalRoom);
router.post("/book-room", createReservation);
router.get("/my-reservations", getMyReservations);

// Commande restaurant/bar: body.origin = "restaurant" | "bar" (défaut: restaurant)
router.post(
  "/order",
  (req, res, next) => {
    req.orderOrigin = req.body.origin === "bar" ? "bar" : "restaurant";
    next();
  },
  createOrder
);
router.get("/my-orders", getMyOrders);

router.post("/concierge-request", createRequest);
router.get("/my-concierge-requests", getMyConciergeRequests);

router.get("/my-invoices", getMyInvoices);

router.get("/my-notifications", getMyNotifications);
router.patch("/my-notifications/:id/read", markMyNotificationRead);

module.exports = router;
