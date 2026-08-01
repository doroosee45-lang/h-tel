// Script de seed: crée 100 produits pour chaque module (restaurant et bar)
// Usage: npm run seed:products
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const MenuCategory = require("../models/MenuCategory");
const MenuItem = require("../models/MenuItem");

const HOTEL_ID = process.env.HOTEL_ID || "hotel_main";
const TARGET_PER_MODULE = 100;

const restaurantCategories = [
  { name: "Entrées", order: 1 },
  { name: "Plats Chauds", order: 2 },
  { name: "Plats Grill", order: 3 },
  { name: "Pâtes & Risottos", order: 4 },
  { name: "Sandwiches", order: 5 },
  { name: "Salades", order: 6 },
  { name: "Desserts", order: 7 },
  { name: "Petit Déjeuner", order: 8 },
  { name: "Accompagnements", order: 9 },
  { name: "Spécialités", order: 10 },
];

const barCategories = [
  { name: "Mocktails", order: 1 },
  { name: "Soft Drinks", order: 2 },
  { name: "Cafés", order: 3 },
  { name: "Thés", order: 4 },
  { name: "Cocktails", order: 5 },
  { name: "Vins", order: 6 },
  { name: "Bières", order: 7 },
  { name: "Spiritueux", order: 8 },
  { name: "Shots", order: 9 },
  { name: "Boissons Chaudes", order: 10 },
];

const restaurantTemplates = restaurantCategories.flatMap((category, categoryIndex) =>
  Array.from({ length: 10 }, (_, itemIndex) => {
    const number = String(itemIndex + 1).padStart(2, "0");
    const basePrice = 10 + categoryIndex * 2 + itemIndex * 1.25;
    return {
      type: "restaurant",
      categoryName: category.name,
      name: `${category.name} ${number}`,
      description: `Préparation signature ${category.name.toLowerCase()} proposée à la carte.`,
      ingredients: [
        categoryIndex % 2 === 0 ? "herbes fraîches" : "épices maison",
        itemIndex % 2 === 0 ? "produits locaux" : "sauce maison",
        "garniture artisanale",
      ],
      allergens: itemIndex % 3 === 0 ? ["gluten", "lactose"] : itemIndex % 2 === 0 ? ["lactose"] : [],
      preparationTimeMinutes: 12 + ((categoryIndex + itemIndex) % 6) * 3,
      price: Number(basePrice.toFixed(2)),
      isFeatured: itemIndex % 5 === 0,
      salesCount: 10 + itemIndex * 3,
      averageRating: Number((4 + (itemIndex % 4) * 0.25).toFixed(2)),
      ratingCount: 20 + itemIndex * 5,
    };
  })
);

const barTemplates = barCategories.flatMap((category, categoryIndex) =>
  Array.from({ length: 10 }, (_, itemIndex) => {
    const number = String(itemIndex + 1).padStart(2, "0");
    const isAlcoholic = category.name !== "Mocktails" && category.name !== "Soft Drinks" && category.name !== "Cafés" && category.name !== "Thés" && category.name !== "Boissons Chaudes";
    const volumeMl = 250 + (itemIndex % 4) * 250;
    return {
      type: "bar",
      categoryName: category.name,
      name: `${category.name} ${number}`,
      description: `Boisson ${category.name.toLowerCase()} servie avec soin et présentation soignée.`,
      ingredients: [
        categoryIndex % 2 === 0 ? "zeste d'agrumes" : "sirop artisanal",
        itemIndex % 2 === 0 ? "glaçons" : "mélange maison",
        "service frais",
      ],
      allergens: category.name === "Cafés" || category.name === "Thés" ? ["lactose"] : [],
      preparationTimeMinutes: 5 + ((categoryIndex + itemIndex) % 4) * 2,
      price: Number((4 + categoryIndex * 1.5 + itemIndex * 0.8).toFixed(2)),
      brand: category.name === "Vins" ? "Maison du Vin" : category.name === "Bières" ? "Brasserie Locale" : "House Brand",
      volumeMl,
      alcoholic: isAlcoholic,
      isFeatured: itemIndex % 4 === 0,
      salesCount: 8 + itemIndex * 2,
      averageRating: Number((4.2 + (itemIndex % 5) * 0.15).toFixed(2)),
      ratingCount: 15 + itemIndex * 4,
    };
  })
);

const ensureCategories = async (type, categories) => {
  const created = [];
  for (const categoryData of categories) {
    let category = await MenuCategory.findOne({ hotelId: HOTEL_ID, type, name: categoryData.name });
    if (!category) {
      category = await MenuCategory.create({ hotelId: HOTEL_ID, type, ...categoryData });
    }
    created.push(category);
  }
  return created;
};

const ensureProducts = async (type, templates) => {
  const categories = await MenuCategory.find({ hotelId: HOTEL_ID, type });
  const categoryMap = new Map(categories.map((category) => [category.name, category]));
  let createdCount = 0;

  for (const template of templates) {
    const existing = await MenuItem.findOne({ hotelId: HOTEL_ID, type, name: template.name });
    if (existing) {
      continue;
    }

    const category = categoryMap.get(template.categoryName);
    if (!category) {
      continue;
    }

    await MenuItem.create({
      hotelId: HOTEL_ID,
      type,
      category: category._id,
      name: template.name,
      description: template.description,
      ingredients: template.ingredients,
      allergens: template.allergens,
      preparationTimeMinutes: template.preparationTimeMinutes,
      price: template.price,
      brand: template.brand,
      volumeMl: template.volumeMl,
      alcoholic: template.alcoholic,
      isAvailable: true,
      isFeatured: template.isFeatured,
      salesCount: template.salesCount,
      averageRating: template.averageRating,
      ratingCount: template.ratingCount,
    });

    createdCount += 1;
  }

  const finalCount = await MenuItem.countDocuments({ hotelId: HOTEL_ID, type });
  return { createdCount, finalCount };
};

const run = async () => {
  await connectDB();

  try {
    await ensureCategories("restaurant", restaurantCategories);
    await ensureCategories("bar", barCategories);

    const restaurantResult = await ensureProducts("restaurant", restaurantTemplates);
    const barResult = await ensureProducts("bar", barTemplates);

    console.log(`✅ Seed produits terminé.`);
    console.log(`🍽️ Restaurant: ${restaurantResult.finalCount} produits (créés: ${restaurantResult.createdCount})`);
    console.log(`🍸 Bar: ${barResult.finalCount} produits (créés: ${barResult.createdCount})`);
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((err) => {
  console.error("❌ Erreur lors du seed des produits:", err);
  process.exit(1);
});
