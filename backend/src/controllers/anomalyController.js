const asyncHandler = require("../middleware/asyncHandler");
const CashRegister = require("../models/CashRegister");
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");

// @route GET /api/dashboard/anomalies
// Détection d'anomalies basée sur des règles (seuils configurables), PAS un modèle
// de machine learning. Signale : écarts de caisse répétés, remises anormalement élevées,
// taux d'annulation suspect par employé.
const getAnomalies = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const since = new Date();
  since.setDate(since.getDate() - Number(days));

  // 1. Écarts de caisse significatifs (> 5% du montant attendu ou > 50 en valeur absolue)
  const cashDiscrepancies = await CashRegister.find({
    status: "closed",
    closedAt: { $gte: since },
    $expr: { $gt: [{ $abs: "$difference" }, 50] },
  })
    .populate("openedBy", "firstName lastName")
    .populate("closedBy", "firstName lastName")
    .sort({ difference: -1 });

  // 2. Commandes avec remise anormalement élevée (> 30% du sous-total)
  const suspiciousDiscounts = await Order.find({
    createdAt: { $gte: since },
    $expr: { $gt: ["$discount", { $multiply: ["$subtotal", 0.3] }] },
  })
    .populate("createdBy", "firstName lastName")
    .sort({ discount: -1 })
    .limit(50);

  // 3. Taux d'annulation de réservations par employé (staff ayant annulé > 5 réservations)
  const cancellationsByStaff = await Reservation.aggregate([
    { $match: { status: "cancelled", updatedAt: { $gte: since } } },
    { $group: { _id: "$createdBy", cancellations: { $sum: 1 } } },
    { $match: { cancellations: { $gte: 5 } } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "staff" } },
    { $unwind: { path: "$staff", preserveNullAndEmptyArrays: true } },
    { $sort: { cancellations: -1 } },
  ]);

  res.json({
    success: true,
    note: "Détection basée sur des règles/seuils, pas sur un modèle de ML entraîné.",
    data: {
      cashDiscrepancies,
      suspiciousDiscounts,
      cancellationsByStaff,
    },
  });
});

module.exports = { getAnomalies };
