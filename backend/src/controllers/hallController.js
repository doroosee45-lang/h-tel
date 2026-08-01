const asyncHandler = require("../middleware/asyncHandler");
const Hall = require("../models/Hall");

// @route GET /api/halls  (catalogue public: le client consulte avant de faire une demande)
const getHalls = asyncHandler(async (req, res) => {
  const { type, minCapacity, active = "true" } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (active !== "all") filter.isActive = active === "true";
  if (minCapacity) filter.capacity = { $gte: Number(minCapacity) };

  const halls = await Hall.find(filter).sort({ name: 1 });
  res.json({ success: true, data: halls });
});

// @route GET /api/halls/:id
const getHall = asyncHandler(async (req, res) => {
  const hall = await Hall.findById(req.params.id);
  if (!hall) {
    res.status(404);
    throw new Error("Salle non trouvée");
  }
  res.json({ success: true, data: hall });
});

// @route POST /api/halls
const createHall = asyncHandler(async (req, res) => {
  const hall = await Hall.create(req.body);
  res.status(201).json({ success: true, data: hall });
});

// @route PUT /api/halls/:id
const updateHall = asyncHandler(async (req, res) => {
  const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!hall) {
    res.status(404);
    throw new Error("Salle non trouvée");
  }
  res.json({ success: true, data: hall });
});

// @route DELETE /api/halls/:id
const deleteHall = asyncHandler(async (req, res) => {
  const hall = await Hall.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!hall) {
    res.status(404);
    throw new Error("Salle non trouvée");
  }
  res.json({ success: true, message: "Salle désactivée" });
});

module.exports = { getHalls, getHall, createHall, updateHall, deleteHall };
