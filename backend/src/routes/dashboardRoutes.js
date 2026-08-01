const express = require("express");
const router = express.Router();
const {
  getOverview, getPopularContent, getRevenueBreakdown, getMultiHotelComparison, getOccupancyForecast,
} = require("../controllers/dashboardController");
const { getAnomalies } = require("../controllers/anomalyController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.use(protect);
router.use(authorize("admin", "accountant", "receptionist", "restaurant_manager", "hr_manager"));

router.get("/overview", getOverview);
router.get("/popular", getPopularContent);
router.get("/revenue-breakdown", getRevenueBreakdown);
router.get("/multi-hotel", authorize("admin"), getMultiHotelComparison);
router.get("/occupancy-forecast", getOccupancyForecast);
router.get("/anomalies", authorize("admin", "accountant"), getAnomalies);

module.exports = router;
