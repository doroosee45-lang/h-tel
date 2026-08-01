const express = require("express");
const router = express.Router();
const {
  getCategories, createCategory, getItems, getPopularItems, getItem, createItem, updateItem, deleteItem,
} = require("../controllers/menuController");
const { getOrders, getKitchenQueue, createOrder, updateOrderStatus, payOrder } = require("../controllers/orderController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { requireClientOrStaff } = require("../middleware/clientAuth");

router.get("/categories", getCategories);
router.get("/items/popular", getPopularItems);
router.get("/items", getItems);
router.get("/items/:id", getItem);

// Commande & paiement: client connecté (QR menu bar) OU personnel connecté
router.post("/orders", requireClientOrStaff, createOrder);
router.post("/orders/:id/pay", requireClientOrStaff, payOrder);

router.post("/categories", protect, authorize("admin", "barman"), createCategory);
router.post("/items", protect, authorize("admin", "barman"), createItem);
router.put("/items/:id", protect, authorize("admin", "barman"), updateItem);
router.delete("/items/:id", protect, authorize("admin", "barman"), deleteItem);

router.get("/orders/kitchen", protect, getKitchenQueue);
router.get("/orders", protect, getOrders);
router.patch("/orders/:id/status", protect, authorize("admin", "barman"), updateOrderStatus);

module.exports = router;
