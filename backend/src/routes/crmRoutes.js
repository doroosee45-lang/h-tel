const express = require("express");
const router = express.Router();
const { getClients, getClient, createClient, updateClient, updateLoyaltyPoints } = require("../controllers/crmController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.use(protect);
router.use(authorize("admin", "receptionist", "restaurant_manager", "barman"));

router.get("/clients", getClients);
router.get("/clients/:id", getClient);
router.post("/clients", createClient);
router.put("/clients/:id", updateClient);
router.post("/clients/:id/loyalty", authorize("admin", "receptionist"), updateLoyaltyPoints);

module.exports = router;
