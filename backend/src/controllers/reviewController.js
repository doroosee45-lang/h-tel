const asyncHandler = require("../middleware/asyncHandler");
const Review = require("../models/Review");
const MenuItem = require("../models/MenuItem");

// @route GET /api/reviews/item/:menuItemId
const getItemReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ menuItem: req.params.menuItemId })
    .populate("client", "firstName lastName")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
});

// @route POST /api/reviews  (utilisé depuis le QR Menu: "Noter le repas")
const createReview = asyncHandler(async (req, res) => {
  const { menuItem, order, rating, comment } = req.body;
  const client = req.client?._id || req.body.client;

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("La note doit être comprise entre 1 et 5");
  }

  const review = await Review.create({ menuItem, order, client, rating, comment });

  // Recalcule la note moyenne de l'article
  const item = await MenuItem.findById(menuItem);
  if (item) {
    const newCount = item.ratingCount + 1;
    const newAverage = (item.averageRating * item.ratingCount + rating) / newCount;
    item.ratingCount = newCount;
    item.averageRating = Math.round(newAverage * 10) / 10;
    await item.save();
  }

  res.status(201).json({ success: true, data: review });
});

module.exports = { getItemReviews, createReview };
