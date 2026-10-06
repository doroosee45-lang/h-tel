// CORS pour le web (CLIENT_URL, plusieurs origines séparées par des virgules) et le mobile
// (les apps natives n'envoient pas d'en-tête Origin: elles sont toujours acceptées).
const allowed = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    if (process.env.NODE_ENV !== "production" && (allowed.length === 0 || allowed.includes("*"))) {
      return cb(null, true);
    }
    return cb(null, false);
  },
  credentials: true,
};

module.exports = corsOptions;
