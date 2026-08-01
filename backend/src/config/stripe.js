const Stripe = require("stripe");

// N'instancie Stripe que si une clé est configurée, pour ne pas planter le serveur
// si les paiements réels ne sont pas encore configurés.
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

module.exports = stripe;
