const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const csrfProtection = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method) || !req.cookies?.refreshToken) {
    return next();
  }

  const origin = req.get("origin");
  const explicitlyAllowed = origin && allowedOrigins.includes(origin);
  const developmentFallback =
    process.env.NODE_ENV !== "production" &&
    (allowedOrigins.length === 0 || allowedOrigins.includes("*"));

  if (!explicitlyAllowed && !developmentFallback) {
    return res.status(403).json({ success: false, message: "Origine non autorisée pour cette requête" });
  }

  return next();
};

module.exports = csrfProtection;
