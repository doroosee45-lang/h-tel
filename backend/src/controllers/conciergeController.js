const asyncHandler = require("../middleware/asyncHandler");
const ConciergeRequest = require("../models/ConciergeRequest");
const { generateReference } = require("../utils/reference");
const { notify } = require("../utils/notify");

// @route GET /api/concierge/requests
const getRequests = asyncHandler(async (req, res) => {
  const { status, type, client, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (client) filter.client = client;

  const requests = await ConciergeRequest.find(filter)
    .populate("client", "firstName lastName phone")
    .populate("room", "number")
    .populate("assignedTo", "firstName lastName")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await ConciergeRequest.countDocuments(filter);
  res.json({ success: true, count: requests.length, total, data: requests });
});

// @route GET /api/concierge/requests/:id
const getRequest = asyncHandler(async (req, res) => {
  const request = await ConciergeRequest.findById(req.params.id)
    .populate("client")
    .populate("room")
    .populate("assignedTo", "firstName lastName");
  if (!request) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }
  res.json({ success: true, data: request });
});

// @route POST /api/concierge/requests
// Le client (via app mobile) ou la réception peuvent créer une demande
const createRequest = asyncHandler(async (req, res) => {
  const { room, type, details, scheduledFor, cost, isBilledToRoom } = req.body;
  const client = req.client?._id || req.body.client;

  if (!client) {
    res.status(400);
    throw new Error("Client requis (connectez-vous ou précisez l'ID client)");
  }

  const request = await ConciergeRequest.create({
    reference: generateReference("CNC"),
    client,
    room,
    type,
    details,
    scheduledFor,
    // Le tarif est fixé par le personnel: ignoré si la demande vient d'un client
    cost: req.client ? 0 : cost || 0,
    isBilledToRoom: req.client ? false : !!isBilledToRoom,
    createdBy: req.user?._id,
  });

  await notify(
    req,
    {
      title: "Nouvelle demande de conciergerie",
      message: `${type} — ${details || ""}`.trim(),
      type: "general",
      data: { requestId: request._id },
    },
    "concierge"
  );

  res.status(201).json({ success: true, data: request });
});

// @route PATCH /api/concierge/requests/:id/status
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, assignedTo } = req.body;
  const allowed = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Statut invalide");
  }

  const update = { status };
  if (assignedTo) update.assignedTo = assignedTo;

  const request = await ConciergeRequest.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!request) {
    res.status(404);
    throw new Error("Demande non trouvée");
  }

  if (status === "completed" && request.client) {
    await notify(
      req,
      {
        recipientClient: request.client,
        title: "Votre demande a été traitée",
        message: `Votre demande (${request.type}) est terminée.`,
        type: "general",
      },
      request.client.toString()
    );
  }

  res.json({ success: true, data: request });
});

module.exports = { getRequests, getRequest, createRequest, updateRequestStatus };
