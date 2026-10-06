require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const corsOptions = require("./src/config/cors");
const { authenticateSocket, canJoin } = require("./src/utils/socketAuth");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

// Socket.io: temps réel pour cuisine, notifications, dashboard live
const io = new Server(server, {
  cors: corsOptions,
});

io.use(authenticateSocket);

io.on("connection", (socket) => {
  console.log(`🔌 Client connecté: ${socket.id}`);

  // Le client rejoint une "room" socket.io (ex: "kitchen", "bar", "dashboard").
  // Les rooms du personnel exigent un token staff; un client ne peut rejoindre que sa propre room.
  socket.on("join", (channel) => {
    if (canJoin(socket, channel)) socket.join(String(channel));
    else socket.emit("join:denied", channel);
  });

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
