# Smart Hotel 360

Système de gestion hôtelière : `backend/` (Node/Express/MongoDB/Socket.io, référence
fonctionnelle), `frontend/` (back-office web React/Vite) et `mobile/` (app client Expo).

## Prérequis
Node 18+ (20 recommandé), MongoDB local ou Atlas.

## Ordre de démarrage
1. **Backend**
   ```bash
   cd backend && cp .env.example .env     # renseigner MONGO_URI et des JWT_* aléatoires
   npm install
   npm run seed:all                       # admin + démo (chambres, tables, menus)
   npm start                              # http://localhost:5000/api/health
   ```
   `npm run check` vérifie le chargement de l'application sans base.
2. **Web**
   ```bash
   cd frontend && cp .env.example .env    # VITE_API_URL=http://localhost:5000
   npm install && npm run dev             # build: npm run build
   ```
3. **Mobile** : voir [`mobile/README.md`](mobile/README.md) (`EXPO_PUBLIC_API_URL` = IP locale du backend).

## Variables d'environnement
Toutes listées dans `backend/.env.example` (MONGO_URI, JWT_*, CLIENT_URL — origines web séparées
par des virgules, CLOUDINARY_*, HOTEL_ID, STRIPE_*, PAYPAL_*, MOBILE_MONEY_*, ANTHROPIC_API_KEY,
CHATBOT_*, LOCK_GATEWAY_*). Ne jamais committer `.env`. Web : `VITE_API_URL`.

## Comptes de démo (après `npm run seed:all`) — à changer en production
| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@smarthotel.com | Admin123! |
| Réception | reception@smarthotel.com | Staff123! |
| Restaurant | restaurant@smarthotel.com | Staff123! |
| Bar | bar@smarthotel.com | Staff123! |
| Client (mobile) | client@demo.com | Client123! |

## Temps réel
Socket.io : rooms `kitchen`, `bar`, `dashboard`, `concierge`. Le socket s'authentifie avec
`auth: { token }` ; seul le personnel rejoint ces rooms, un client uniquement sa propre room.
Événements : `notification`, `order:new`, `order:updated`.

## Livraison ZIP
`bash scripts/build-zip.sh` génère `smart-hotel-360.zip` (sans node_modules ni .env). Le workflow
`.github/workflows/package.yml` installe, vérifie le backend, build le web, puis publie le ZIP en artefact.

## Nécessite des clés / services externes
Stripe, PayPal, Mobile Money (adaptateur générique), Cloudinary (variables prévues, l'upload
actuel est local via multer), Anthropic (chatbot), passerelle de serrures connectées, FCM (push, non implémenté).
