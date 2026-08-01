const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const auditLogger = require("./middleware/auditLogger");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const barRoutes = require("./routes/barRoutes");
const stockRoutes = require("./routes/stockRoutes");
const financeRoutes = require("./routes/financeRoutes");
const hrRoutes = require("./routes/hrRoutes");
const crmRoutes = require("./routes/crmRoutes");
const qrRoutes = require("./routes/qrRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const conciergeRoutes = require("./routes/conciergeRoutes");
const activityRoutes = require("./routes/activityRoutes");
const eventRoutes = require("./routes/eventRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const chatRoutes = require("./routes/chatRoutes");
const auditRoutes = require("./routes/auditRoutes");
const clientAuthRoutes = require("./routes/clientAuthRoutes");
const hallRoutes = require("./routes/hallRoutes");
const paymentGatewayRoutes = require("./routes/paymentGatewayRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const syncRoutes = require("./routes/syncRoutes");
const lockRoutes = require("./routes/lockRoutes");
const { stripeWebhook } = require("./controllers/paymentGatewayController");

const app = express();

// Sécurité & middlewares globaux
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));

// IMPORTANT: le webhook Stripe doit être monté AVANT express.json(), car Stripe exige
// le corps brut (non parsé) de la requête pour vérifier la signature cryptographique.
app.post("/api/payments/gateway/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(auditLogger); // Journalisation complète des actions d'écriture (§15 Sécurité)

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use("/api", limiter);

// Fichiers uploadés (images chambres, plats, boissons, activités...)
app.use("/uploads", express.static(require("path").join(__dirname, "../uploads")));

// Healthcheck
app.get("/api/health", (req, res) => res.json({ success: true, message: "SHMS API opérationnelle" }));

// Routes des modules
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/bar", barRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/concierge", conciergeRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/client-auth", clientAuthRoutes);
app.use("/api/halls", hallRoutes);
app.use("/api/payments/gateway", paymentGatewayRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/locks", lockRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
