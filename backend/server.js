require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

// Socket.io: temps réel pour cuisine, notifications, dashboard live
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*", credentials: true },
});

io.on("connection", (socket) => {
  console.log(`🔌 Client connecté: ${socket.id}`);

  // Le client rejoint une "room" socket.io (ex: "kitchen", "bar", "dashboard")
  socket.on("join", (channel) => socket.join(channel));

  socket.on("disconnect", () => {
    console.log(`🔌 Client déconnecté: ${socket.id}`);
  });
});

// Rend io accessible partout via req.app.get("io") dans les contrôleurs
app.set("io", io);

server.listen(PORT, () => {
  console.log(`🚀 Smart Hotel Management System API démarrée sur le port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Erreur non gérée: ${err.message}`);
  server.close(() => process.exit(1));
});
