const asyncHandler = require("../middleware/asyncHandler");
const Event = require("../models/Event");
const Hall = require("../models/Hall");
const { generateReference } = require("../utils/reference");

// @route GET /api/events
const getEvents = asyncHandler(async (req, res) => {
  const { status, type, from, to } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (from || to) {
    filter.startDate = {};
    if (from) filter.startDate.$gte = new Date(from);
    if (to) filter.startDate.$lte = new Date(to);
  }

  const events = await Event.find(filter).populate("client", "firstName lastName phone").sort({ startDate: 1 });
  res.json({ success: true, data: events });
});

// @route GET /api/events/:id
const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("client");
  if (!event) {
    res.status(404);
    throw new Error("Événement non trouvé");
  }
  res.json({ success: true, data: event });
});

// @route GET /api/events/availability?hallName=&startDate=&endDate=
const checkHallAvailability = asyncHandler(async (req, res) => {
  const { hallName, startDate, endDate } = req.query;
  if (!hallName || !startDate || !endDate) {
    res.status(400);
    throw new Error("hallName, startDate et endDate sont requis");
  }
  const conflict = await Event.findOne({
    hallName,
    status: { $in: ["inquiry", "confirmed", "in_progress"] },
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) },
  });
  res.json({ success: true, available: !conflict });
});

// @route POST /api/events
const createEvent = asyncHandler(async (req, res) => {
  const { hall, startDate, endDate } = req.body;
  let { hallName } = req.body;
  const client = req.client?._id || req.body.client;
  if (!client) {
    res.status(400);
    throw new Error("Client requis (connectez-vous ou précisez l'ID client)");
  }

  if (hall && !hallName) {
    const hallDoc = await Hall.findById(hall);
    if (!hallDoc) {
      res.status(404);
      throw new Error("Salle du catalogue non trouvée");
    }
    hallName = hallDoc.name;
  }

  const conflict = await Event.findOne({
    hallName,
    status: { $in: ["inquiry", "confirmed", "in_progress"] },
    startDate: { $lt: new Date(endDate) },
    endDate: { $gt: new Date(startDate) },
  });
  if (conflict) {
    res.status(400);
    throw new Error("Cette salle n'est pas disponible sur cette période");
  }

  const event = await Event.create({
    ...req.body,
    hallName,
    client,
    reference: generateReference("EVT"),
    // Un client crée une simple demande ("inquiry"), la réception confirme ensuite
    status: req.client ? "inquiry" : req.body.status || "inquiry",
    createdBy: req.user?._id,
  });

  res.status(201).json({ success: true, data: event });
});

// @route PUT /api/events/:id
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!event) {
    res.status(404);
    throw new Error("Événement non trouvé");
  }
  res.json({ success: true, data: event });
});

// @route PATCH /api/events/:id/status
const updateEventStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!event) {
    res.status(404);
    throw new Error("Événement non trouvé");
  }
  res.json({ success: true, data: event });
});

module.exports = { getEvents, getEvent, checkHallAvailability, createEvent, updateEvent, updateEventStatus };
