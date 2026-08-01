// Script de seed: crée un compte administrateur et un client de démonstration
// Usage: npm run seed
require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Client = require("../models/Client");

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

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
