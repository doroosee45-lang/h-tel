// Script de seed: crée un compte administrateur et un client de démonstration
// Usage: npm run seed
require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Client = require("../models/Client");
const RoomCategory = require("../models/RoomCategory");
const Room = require("../models/Room");
const Table = require("../models/Table");

const run = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ email: "admin@smarthotel.com" });
  if (!existingAdmin) {
    await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: "admin@smarthotel.com",
      phone: "+21600000000",
      password: "Admin123!",
      role: "admin",
    });
    console.log("✅ Administrateur créé: admin@smarthotel.com / Admin123!");
  } else {
    console.log("ℹ️  L'administrateur existe déjà.");
  }

  const existingClient = await Client.findOne({ email: "client@demo.com" });
  if (!existingClient) {
    await Client.create({
      firstName: "Client",
      lastName: "Démo",
      email: "client@demo.com",
      phone: "+21611111111",
      password: "Client123!",
      nationality: "Tunisienne",
      hasAccount: true,
    });
    console.log("✅ Client de démo créé: client@demo.com / Client123! (via POST /api/client-auth/login)");
  } else {
    console.log("ℹ️  Le client de démo existe déjà.");
  }

  const staff = [
    ["Réception", "Démo", "reception@smarthotel.com", "receptionist"],
    ["Chef", "Restaurant", "restaurant@smarthotel.com", "restaurant_manager"],
    ["Barman", "Démo", "bar@smarthotel.com", "barman"],
  ];
  for (const [firstName, lastName, email, role] of staff) {
    if (!(await User.findOne({ email }))) {
      await User.create({ firstName, lastName, email, password: "Staff123!", role });
      console.log(`✅ Staff créé: ${email} / Staff123! (${role})`);
    }
  }

  if ((await RoomCategory.countDocuments()) === 0) {
    const [standard, deluxe, suite] = await RoomCategory.create([
      { name: "Standard", description: "Chambre confortable", basePrice: 90, weekendPrice: 110, capacity: 2, amenities: ["WiFi", "Climatisation", "TV"] },
      { name: "Deluxe", description: "Chambre spacieuse avec vue", basePrice: 140, weekendPrice: 170, capacity: 3, amenities: ["WiFi", "Climatisation", "Mini-bar", "Balcon"] },
      { name: "Suite", description: "Suite avec salon", basePrice: 260, weekendPrice: 300, capacity: 4, amenities: ["WiFi", "Climatisation", "Mini-bar", "Jacuzzi", "Salon"] },
    ]);
    const cats = [standard, deluxe, suite];
    const rooms = [];
    for (let i = 1; i <= 9; i++) {
      rooms.push({ number: String(100 + i), floor: "1", category: cats[(i - 1) % 3]._id, description: `Chambre ${100 + i}` });
    }
    await Room.create(rooms);
    console.log("✅ 3 catégories et 9 chambres de démo créées");
  }

  if ((await Table.countDocuments()) === 0) {
    await Table.create([1, 2, 3, 4, 5, 6].map((n) => ({ number: `T${n}`, zone: n <= 3 ? "salle" : "terrasse", capacity: 4 })));
    console.log("✅ 6 tables créées");
  }

  console.log("ℹ️  Menu restaurant/bar: npm run seed:products");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
