const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

// @route GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { firstName: new RegExp(search, "i") },
      { lastName: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
    ];
  }

  const users = await User.find(filter)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  res.json({ success: true, count: users.length, total, page: Number(page), data: users });
});

// @route GET /api/users/:id
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }
  res.json({ success: true, data: user });
});

// @route PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const { password, ...updates } = req.body; // le mot de passe se change via une route dédiée
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }
  res.json({ success: true, data: user });
});

// @route DELETE /api/users/:id (désactivation plutôt que suppression physique)
const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }
  res.json({ success: true, message: "Utilisateur désactivé", data: user });
});

module.exports = { getUsers, getUser, updateUser, deactivateUser };
