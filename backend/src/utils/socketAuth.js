const jwt = require("jsonwebtoken");

const STAFF_CHANNELS = ["kitchen", "bar", "dashboard", "concierge", "reception"];

// Identifie le socket via handshake.auth.token (JWT staff ou client). Connexion anonyme tolérée,
// mais sans accès à aucune room.
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token;
  socket.data.identity = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.identity = { id: String(decoded.id), kind: decoded.purpose === "client" ? "client" : "staff" };
    } catch (e) {
      return next(new Error("Token socket invalide"));
    }
  }
  next();
};

const canJoin = (socket, channel) => {
  const identity = socket.data.identity;
  if (!identity || typeof channel !== "string") return false;
  if (identity.kind === "staff") return STAFF_CHANNELS.includes(channel) || channel === identity.id;
  return channel === identity.id;
};

module.exports = { authenticateSocket, canJoin };
