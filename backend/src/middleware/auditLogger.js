const AuditLog = require("../models/AuditLog");

const SENSITIVE_FIELDS = ["password", "token", "refreshToken", "accessToken", "twoFactorSecret"];

const sanitizeBody = (body) => {
  if (!body || typeof body !== "object") return undefined;
  const clean = { ...body };
  for (const field of SENSITIVE_FIELDS) delete clean[field];
  return clean;
};

// Journalise automatiquement toute requête qui modifie des données (POST/PUT/PATCH/DELETE).
// Ne bloque jamais la réponse : l'écriture du log se fait après l'envoi de la réponse (res.on("finish")).
const auditLogger = (req, res, next) => {
  const writeMethods = ["POST", "PUT", "PATCH", "DELETE"];
  if (!writeMethods.includes(req.method)) return next();

  // Exclut les routes bruyantes / non pertinentes pour l'audit métier
  const skipPaths = ["/api/auth/login", "/api/auth/refresh"];
  if (skipPaths.includes(req.path)) return next();

  const start = Date.now();

  res.on("finish", () => {
    AuditLog.create({
      user: req.user?._id,
      userEmail: req.user?.email,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
      bodySummary: sanitizeBody(req.body),
      durationMs: Date.now() - start,
    }).catch((err) => console.error("Erreur audit log:", err.message));
  });

  next();
};

module.exports = auditLogger;
