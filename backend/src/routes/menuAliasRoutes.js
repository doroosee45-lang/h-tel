const express = require("express");
const { getCategories, getItems, getPopularItems, getItem } = require("../controllers/menuController");

// Consultation publique du menu: /api/menu (restaurant) et /api/drinks (bar).
const build = (type) => {
  const router = express.Router();
  router.use((req, res, next) => {
    req.menuType = type;
    next();
  });
  router.get("/", getItems);
  router.get("/categories", getCategories);
  router.get("/popular", getPopularItems);
  router.get("/:id", getItem);
  return router;
};

module.exports = { menuRoutes: build("restaurant"), drinksRoutes: build("bar") };
