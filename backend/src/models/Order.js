const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true }, // snapshot du nom au moment de la commande
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    notes: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    orderNumber: { type: String, required: true, unique: true },
    origin: { type: String, enum: ["restaurant", "bar"], required: true },
    channel: { type: String, enum: ["dine_in", "room_service", "mobile", "qr_code"], default: "dine_in" },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["new", "preparing", "ready", "served", "cancelled"],
      default: "new",
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ["cash", "card", "mobile_money", "paypal", "stripe", "room_charge"] },
    chargedToRoom: { type: Boolean, default: false }, // vente liée à une chambre
    notes: { type: String }, // instructions spéciales pour l'ensemble de la commande
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Clé générée côté client mobile en mode hors ligne, pour éviter les doublons
    // lors de la synchronisation au retour de la connexion (voir /api/sync).
    offlineId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
