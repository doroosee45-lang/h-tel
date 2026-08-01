const express = require("express");
const router = express.Router();
const {
  getCategories, createCategory, getItems, getPopularItems, getItem, createItem, updateItem, deleteItem,
  getTables, createTable, updateTableStatus,
  getTableReservations, createTableReservation, updateTableReservationStatus,
} = require("../controllers/menuController");
const { getOrders, getKitchenQueue, createOrder, updateOrderStatus, payOrder } = require("../controllers/orderController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { requireClientOrStaff } = require("../middleware/clientAuth");

// Menu: consultation publique (QR menu scanné par le client, sans compte requis)
router.get("/categories", getCategories);
router.get("/items/popular", getPopularItems);
router.get("/items", getItems);
router.get("/items/:id", getItem);

// Commande & paiement: client connecté (QR menu → "Commander directement, Payer en ligne")
// OU personnel connecté (salle/chambre)
router.post("/orders", requireClientOrStaff, createOrder);
router.post("/orders/:id/pay", requireClientOrStaff, payOrder);

router.post("/categories", protect, authorize("admin", "restaurant_manager"), createCategory);
router.post("/items", protect, authorize("admin", "restaurant_manager"), createItem);
router.put("/items/:id", protect, authorize("admin", "restaurant_manager"), updateItem);
router.delete("/items/:id", protect, authorize("admin", "restaurant_manager"), deleteItem);

// Réservation de table: client connecté (app mobile) OU réception/manager restaurant
router.post("/tables/:id/reservations", requireClientOrStaff, createTableReservation);
router.get("/tables/reservations", protect, getTableReservations);
router.patch("/tables/reservations/:id/status", protect, authorize("admin", "restaurant_manager", "waiter"), updateTableReservationStatus);

// Tables
router.get("/tables", protect, getTables);
router.post("/tables", protect, authorize("admin", "restaurant_manager"), createTable);
router.patch("/tables/:id/status", protect, authorize("admin", "restaurant_manager", "waiter"), updateTableStatus);

// Suivi des commandes: réservé au personnel
router.get("/orders/kitchen", protect, getKitchenQueue);
router.get("/orders", protect, getOrders);
router.patch("/orders/:id/status", protect, authorize("admin", "restaurant_manager", "waiter"), updateOrderStatus);

module.exports = router;
