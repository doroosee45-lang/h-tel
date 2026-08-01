const asyncHandler = require("../middleware/asyncHandler");
const Activity = require("../models/Activity");
const ActivityBooking = require("../models/ActivityBooking");
const { generateReference } = require("../utils/reference");
const { notify } = require("../utils/notify");
const { generateQRCode } = require("../utils/qrGenerator");

// ---------- Catalogue Activités (Spa, Piscine, Salle de sport, Excursions...) ----------

// @route GET /api/activities
const getActivities = asyncHandler(async (req, res) => {
  const { category, active = "true" } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (active !== "all") filter.isActive = active === "true";

  const activities = await Activity.find(filter).sort({ name: 1 });
  res.json({ success: true, data: activities });
});

// @route GET /api/activities/:id
const getActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) {
    res.status(404);
    throw new Error("Activité non trouvée");
  }
  res.json({ success: true, data: activity });
});

// @route POST /api/activities
const createActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.create(req.body);
  activity.qrCode = await generateQRCode({ type: "activity", activityId: activity._id.toString() });
  await activity.save();
  res.status(201).json({ success: true, data: activity });
});

// @route PUT /api/activities/:id
const updateActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!activity) {
    res.status(404);
    throw new Error("Activité non trouvée");
  }
  res.json({ success: true, data: activity });
});

// @route DELETE /api/activities/:id
const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!activity) {
    res.status(404);
    throw new Error("Activité non trouvée");
  }
  res.json({ success: true, message: "Activité désactivée" });
});

// ---------- Réservations d'activités ----------

// @route GET /api/activities/bookings/all
const getBookings = asyncHandler(async (req, res) => {
  const { status, activity, client } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (activity) filter.activity = activity;
  if (client) filter.client = client;

  const bookings = await ActivityBooking.find(filter)
    .populate("activity", "name category price")
    .populate("client", "firstName lastName phone")
    .sort({ date: -1 });

  res.json({ success: true, data: bookings });
});

// @route POST /api/activities/:id/bookings
const createBooking = asyncHandler(async (req, res) => {
  const { date, participants } = req.body;
  const clientId = req.client?._id || req.body.client;
  if (!clientId) {
    res.status(400);
    throw new Error("Client requis (connectez-vous ou précisez l'ID client)");
  }

  const activity = await Activity.findById(req.params.id);
  if (!activity || !activity.isActive) {
    res.status(404);
    throw new Error("Activité non trouvée ou indisponible");
  }

  if (activity.capacity) {
    const existingCount = await ActivityBooking.aggregate([
      { $match: { activity: activity._id, date: new Date(date), status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$participants" } } },
    ]);
    const alreadyBooked = existingCount[0]?.total || 0;
    if (alreadyBooked + (participants || 1) > activity.capacity) {
      res.status(400);
      throw new Error("Capacité maximale atteinte pour ce créneau");
    }
  }

  const totalAmount = activity.price * (participants || 1);

  const booking = await ActivityBooking.create({
    reference: generateReference("ACT"),
    activity: activity._id,
    client: clientId,
    date,
    participants: participants || 1,
    totalAmount,
    status: "confirmed",
  });

  await notify(
    req,
    {
      recipientClient: clientId,
      title: "Activité réservée",
      message: `${activity.name} confirmée pour le ${new Date(date).toLocaleDateString("fr-FR")}`,
      type: "general",
      data: { bookingId: booking._id },
    },
    clientId.toString()
  );

  res.status(201).json({ success: true, data: booking });
});

// @route PATCH /api/activities/bookings/:id/status
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await ActivityBooking.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!booking) {
    res.status(404);
    throw new Error("Réservation non trouvée");
  }
  res.json({ success: true, data: booking });
});

module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getBookings,
  createBooking,
  updateBookingStatus,
};
