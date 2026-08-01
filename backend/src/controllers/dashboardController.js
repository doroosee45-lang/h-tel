const asyncHandler = require("../middleware/asyncHandler");
const Room = require("../models/Room");
const Reservation = require("../models/Reservation");
const Order = require("../models/Order");
const StockItem = require("../models/StockItem");
const Invoice = require("../models/Invoice");
const Client = require("../models/Client");
const MenuItem = require("../models/MenuItem");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Expense = require("../models/Expense");

// @route GET /api/dashboard/overview
// Indicateurs temps réel affichés sur le tableau de bord administrateur
const getOverview = asyncHandler(async (req, res) => {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));

  const [
    totalRooms,
    occupiedRooms,
    availableRooms,
    cleaningRooms,
    maintenanceRooms,
    todaysArrivals,
    todaysDepartures,
    restaurantSalesToday,
    barSalesToday,
    lowStockItems,
    invoicesToday,
    presentEmployees,
    expensesToday,
  ] = await Promise.all([
    Room.countDocuments({ isActive: true }),
    Room.countDocuments({ status: "occupied" }),
    Room.countDocuments({ status: "available" }),
    Room.countDocuments({ status: "cleaning" }),
    Room.countDocuments({ status: "maintenance" }),
    Reservation.countDocuments({ checkInDate: { $gte: todayStart, $lte: todayEnd }, status: { $in: ["confirmed", "checked_in"] } }),
    Reservation.countDocuments({ checkOutDate: { $gte: todayStart, $lte: todayEnd }, status: "checked_in" }),
    Order.aggregate([
      { $match: { origin: "restaurant", createdAt: { $gte: todayStart, $lte: todayEnd }, isPaid: true } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.aggregate([
      { $match: { origin: "bar", createdAt: { $gte: todayStart, $lte: todayEnd }, isPaid: true } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    StockItem.find({ isActive: true }).then((items) => items.filter((i) => i.quantity <= i.minThreshold).length),
    Invoice.find({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
    Attendance.countDocuments({ checkIn: { $gte: todayStart, $lte: todayEnd }, checkOut: null }),
    Expense.aggregate([
      { $match: { date: { $gte: todayStart, $lte: todayEnd }, status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const revenueToday = invoicesToday.reduce((s, inv) => s + (inv.status === "paid" ? inv.total : 0), 0);
  const expensesTodayTotal = expensesToday[0]?.total || 0;
  const occupancyRate = totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  res.json({
    success: true,
    data: {
      rooms: {
        total: totalRooms,
        occupied: occupiedRooms,
        available: availableRooms,
        cleaning: cleaningRooms,
        maintenance: maintenanceRooms,
        occupancyRate,
      },
      reservations: { todaysArrivals, todaysDepartures },
      sales: {
        restaurantToday: restaurantSalesToday[0]?.total || 0,
        barToday: barSalesToday[0]?.total || 0,
      },
      finance: {
        revenueToday,
        expensesToday: expensesTodayTotal,
        netProfitToday: revenueToday - expensesTodayTotal,
        invoicesToday: invoicesToday.length,
      },
      stock: { lowStockItems },
      hr: { presentEmployees },
    },
  });
});

// @route GET /api/dashboard/popular
const getPopularContent = asyncHandler(async (req, res) => {
  const popularRooms = await Reservation.aggregate([
    { $group: { _id: "$room", bookings: { $sum: 1 } } },
    { $sort: { bookings: -1 } },
    { $limit: 5 },
    { $lookup: { from: "rooms", localField: "_id", foreignField: "_id", as: "room" } },
    { $unwind: "$room" },
  ]);

  const popularMeals = await MenuItem.find({ type: "restaurant" }).sort({ salesCount: -1 }).limit(5);
  const popularDrinks = await MenuItem.find({ type: "bar" }).sort({ salesCount: -1 }).limit(5);

  const topClients = await Client.find().sort({ totalSpent: -1 }).limit(5);

  res.json({
    success: true,
    data: { popularRooms, popularMeals, popularDrinks, topClients },
  });
});

// @route GET /api/dashboard/revenue-breakdown?from=&to=
const getRevenueBreakdown = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const filter = {};
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const invoices = await Invoice.find({ ...filter, status: "paid" });
  const breakdown = invoices.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.total;
    return acc;
  }, {});

  res.json({ success: true, data: breakdown });
});

// @route GET /api/dashboard/multi-hotel
// Comparaison de performance entre hôtels (chaque document possède un champ hotelId)
const getMultiHotelComparison = asyncHandler(async (req, res) => {
  const roomsByHotel = await Room.aggregate([
    { $group: { _id: "$hotelId", total: { $sum: 1 }, occupied: { $sum: { $cond: [{ $eq: ["$status", "occupied"] }, 1, 0] } } } },
  ]);

  const revenueByHotel = await Invoice.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: "$hotelId", revenue: { $sum: "$total" } } },
  ]);

  const comparison = roomsByHotel.map((r) => {
    const rev = revenueByHotel.find((x) => x._id === r._id);
    return {
      hotelId: r._id,
      totalRooms: r.total,
      occupiedRooms: r.occupied,
      occupancyRate: r.total ? Math.round((r.occupied / r.total) * 100) : 0,
      totalRevenue: rev?.revenue || 0,
    };
  });

  res.json({ success: true, data: comparison });
});

// @route GET /api/dashboard/occupancy-forecast
// Prévision simple basée sur la tendance des 14 derniers jours (moyenne mobile,
// PAS un modèle de machine learning — à remplacer par un vrai modèle si besoin).
const getOccupancyForecast = asyncHandler(async (req, res) => {
  const days = 14;
  const start = new Date();
  start.setDate(start.getDate() - days);

  const dailyArrivals = await Reservation.aggregate([
    { $match: { checkInDate: { $gte: start }, status: { $in: ["confirmed", "checked_in", "checked_out"] } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$checkInDate" } },
        arrivals: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const totalRooms = await Room.countDocuments({ isActive: true });
  const avgDailyArrivals =
    dailyArrivals.reduce((sum, d) => sum + d.arrivals, 0) / (dailyArrivals.length || 1);

  // Projection naïve : moyenne des arrivées journalières récentes appliquée aux 7 prochains jours
  const forecast = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      date: date.toISOString().split("T")[0],
      estimatedArrivals: Math.round(avgDailyArrivals),
      estimatedOccupancyRate: totalRooms ? Math.min(100, Math.round((avgDailyArrivals / totalRooms) * 100)) : 0,
    };
  });

  res.json({
    success: true,
    note: "Projection basée sur une moyenne mobile des 14 derniers jours, pas un modèle prédictif entraîné.",
    data: { history: dailyArrivals, forecast },
  });
});

module.exports = {
  getOverview,
  getPopularContent,
  getRevenueBreakdown,
  getMultiHotelComparison,
  getOccupancyForecast,
};
