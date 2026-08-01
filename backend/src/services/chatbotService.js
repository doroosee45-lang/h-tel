const axios = require("axios");
const RoomCategory = require("../models/RoomCategory");
const Activity = require("../models/Activity");
const MenuCategory = require("../models/MenuCategory");

const isConfigured = () => !!process.env.ANTHROPIC_API_KEY && process.env.CHATBOT_ENABLED !== "false";

// Construit un contexte "ancré" (grounding) à partir des VRAIES données de l'hôtel,
// pour que le chatbot ne réponde pas au hasard sur les prix/disponibilités.
const buildHotelContext = async () => {
  const [roomCategories, activities, restaurantCategories, barCategories] = await Promise.all([
    RoomCategory.find().select("name description basePrice capacity amenities").limit(20),
    Activity.find({ isActive: true }).select("name category description price durationMinutes").limit(20),
    MenuCategory.find({ type: "restaurant" }).select("name").limit(20),
    MenuCategory.find({ type: "bar" }).select("name").limit(20),
  ]);

  return `
CATÉGORIES DE CHAMBRES DISPONIBLES:
${roomCategories.map((c) => `- ${c.name}: ${c.basePrice}/nuit, capacité ${c.capacity}, équipements: ${(c.amenities || []).join(", ")}`).join("\n") || "(aucune donnée)"}

ACTIVITÉS PROPOSÉES:
${activities.map((a) => `- ${a.name} (${a.category}): ${a.price}, ${a.durationMinutes ? a.durationMinutes + " min" : ""}`).join("\n") || "(aucune donnée)"}

CATÉGORIES DE MENU RESTAURANT: ${restaurantCategories.map((c) => c.name).join(", ") || "(aucune donnée)"}
CATÉGORIES DE BOISSONS BAR: ${barCategories.map((c) => c.name).join(", ") || "(aucune donnée)"}
`.trim();
};

const SYSTEM_PROMPT_TEMPLATE = (context) => `Tu es l'assistant virtuel de l'hôtel, disponible 24h/24 pour les clients via l'application mobile.

RÈGLES STRICTES:
- Réponds UNIQUEMENT à partir des informations ci-dessous. Si une information n'y figure pas (disponibilité exacte à une date précise, réservation existante d'un client...), dis clairement que tu ne peux pas le confirmer et propose de transférer la demande à la réception.
- Pour toute réservation, modification, réclamation, urgence ou question nécessitant un accès aux données personnelles du client, indique que tu transmets la demande à la réception plutôt que d'inventer une réponse.
- Reste concis, chaleureux et professionnel. Réponds dans la langue du client.
- N'invente jamais de prix, de disponibilité ou de politique de l'hôtel non listés ci-dessous.

INFORMATIONS DE L'HÔTEL (à jour):
${context}`;

// Détection simple par mots-clés d'une demande à transmettre à la réception
// (remplace un vrai "function calling" pour rester simple ; le modèle est aussi
// instruit de le signaler explicitement dans sa réponse).
const ESCALATION_KEYWORDS = [
  "urgent", "urgence", "plainte", "réclamation", "problème grave", "parler à quelqu'un",
  "un humain", "la réception", "annuler ma réservation", "remboursement",
];
const shouldEscalate = (userMessage) =>
  ESCALATION_KEYWORDS.some((kw) => userMessage.toLowerCase().includes(kw));

/**
 * Envoie la conversation à l'API Anthropic (Claude) et retourne la réponse texte.
 * `history` est un tableau de { role: "user"|"assistant", content: string }.
 */
const getChatbotReply = async (userMessage, history = []) => {
  if (!isConfigured()) {
    return {
      reply:
        "Le chatbot IA n'est pas encore configuré sur ce serveur (clé ANTHROPIC_API_KEY manquante). " +
        "Un membre du personnel va prendre le relais dès que possible.",
      escalate: true,
      configured: false,
    };
  }

  const context = await buildHotelContext();
  const messages = [...history, { role: "user", content: userMessage }];

  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: process.env.CHATBOT_MODEL || "claude-sonnet-4-5",
      max_tokens: 500,
      system: SYSTEM_PROMPT_TEMPLATE(context),
      messages,
    },
    {
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      timeout: 15000,
    }
  );

  const reply = response.data.content?.map((block) => block.text || "").join("") || "";

  return { reply, escalate: shouldEscalate(userMessage), configured: true };
};

module.exports = { isConfigured, getChatbotReply, buildHotelContext };
