const asyncHandler = require("../middleware/asyncHandler");
const AuditLog = require("../models/AuditLog");

// @route GET /api/audit-logs
const getAuditLogs = asyncHandler(async (req, res) => {
  const { user, method, path, from, to, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (user) filter.user = user;
  if (method) filter.method = method;
  if (path) filter.path = new RegExp(path, "i");
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const logs = await AuditLog.find(filter)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await AuditLog.countDocuments(filter);
  res.json({ success: true, count: logs.length, total, data: logs });
});

module.exports = { getAuditLogs };
