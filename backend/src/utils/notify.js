const Notification = require("../models/Notification");

/**
 * Crée une notification en base + l'émet en temps réel via Socket.io.
 * Prêt à être étendu avec Firebase Cloud Messaging (push mobile) :
 * il suffirait d'appeler ici l'envoi FCM en plus de la création Mongo.
 *
 * @param {import("express").Request} req  - utilisé pour accéder à req.app.get("io")
 * @param {Object} payload
 * @param {String} [payload.recipient]        - ID User (personnel)
 * @param {String} [payload.recipientClient]  - ID Client (app mobile client)
 * @param {String} payload.title
 * @param {String} payload.message
 * @param {String} payload.type - reservation_confirmed | room_ready | order_ready | payment_received | low_stock | general
 * @param {Object} [payload.data]
 * @param {String} [channel] - room Socket.io à cibler (ex: "dashboard", "kitchen", "bar", ou l'ID user/client)
 */
const notify = async (req, payload, channel) => {
  const notification = await Notification.create(payload);

  const io = req.app?.get("io");
  if (io) {
    const target = channel || payload.recipient?.toString() || payload.recipientClient?.toString();
    if (target) {
      io.to(target).emit("notification", notification);
    }
    // Toujours diffuser aussi sur le canal "dashboard" pour le suivi temps réel admin
    io.to("dashboard").emit("notification", notification);
  }

  return notification;
};

module.exports = { notify };
