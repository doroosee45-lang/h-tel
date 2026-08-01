const mongoose = require("mongoose");

// Module Conciergerie: taxi, navette aéroport, location voiture, excursion,
// guide touristique, livraison colis, réservation restaurant, blanchisserie...
const conciergeRequestSchema = new mongoose.Schema(
  {
    hotelId: { type: String, default: process.env.HOTEL_ID || "hotel_main", index: true },
    reference: { type: String, required: true, unique: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    type: {
      type: String,
      enum: [
        "taxi",
        "airport_shuttle",
        "car_rental",
        "excursion",
        "tour_guide",
        "parcel_delivery",
        "restaurant_reservation",
        "laundry",
        "other",
      ],
      required: true,
    },
    details: { type: String },
    scheduledFor: { type: Date },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    cost: { type: Number, default: 0 },
    isBilledToRoom: { type: Boolean, default: false },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConciergeRequest", conciergeRequestSchema);
