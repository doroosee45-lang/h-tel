const express = require("express");
const router = express.Router();
const {
  getStockItems, getStockAlerts, getStockItem, createStockItem, updateStockItem,
  createMovement, getMovements,
  getSuppliers, createSupplier,
  getPurchaseOrders, createPurchaseOrder, validatePurchaseOrder, receivePurchaseOrder,
} = require("../controllers/stockController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.use(protect);
router.use(authorize("admin", "stock_manager", "restaurant_manager", "barman", "accountant"));

router.get("/items/alerts", getStockAlerts);
router.get("/items", getStockItems);
router.get("/items/:id", getStockItem);
router.post("/items", authorize("admin", "stock_manager"), createStockItem);
router.put("/items/:id", authorize("admin", "stock_manager"), updateStockItem);

router.get("/movements", getMovements);
router.post("/movements", authorize("admin", "stock_manager"), createMovement);

router.get("/suppliers", getSuppliers);
router.post("/suppliers", authorize("admin", "stock_manager"), createSupplier);

router.get("/purchase-orders", getPurchaseOrders);
router.post("/purchase-orders", authorize("admin", "stock_manager"), createPurchaseOrder);
router.patch("/purchase-orders/:id/validate", authorize("admin"), validatePurchaseOrder);
router.post("/purchase-orders/:id/receive", authorize("admin", "stock_manager"), receivePurchaseOrder);

module.exports = router;
