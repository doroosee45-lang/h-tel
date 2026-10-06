// Vérification statique du backend (utilisée par la CI): chaque fichier JS se charge sans erreur
// et l'application Express expose bien les routes clés.
process.env.JWT_SECRET = process.env.JWT_SECRET || "check";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "check";
const app = require("../src/app");

const mounted = app._router.stack.filter((l) => l.name === "router").map((l) => l.regexp.toString());
const expected = ["client-portal", "menu", "drinks", "client-auth", "reservations", "restaurant", "bar"];
const missing = expected.filter((e) => !mounted.some((m) => m.includes(e)));
if (missing.length) {
  console.error("Routes manquantes:", missing.join(", "));
  process.exit(1);
}
console.log(`OK: ${mounted.length} routeurs montés`);
process.exit(0);
