# Smart Hotel 360 — Application mobile client

Application Expo (SDK 51) / React Native 0.74 pour les clients de l'hôtel.

## Stack
React Navigation (stack + bottom tabs), axios, AsyncStorage, `@expo/vector-icons`.

## Authentification client séparée
Les clients ont leur propre compte et leur propre JWT (`purpose: "client"`), distinct du
personnel. Les tokens (access + refresh) sont stockés dans AsyncStorage ; l'intercepteur axios
ajoute le token et rafraîchit automatiquement la session sur 401 (`/client-portal/refresh`).

## Installation
```bash
cd mobile
npm install
npx expo start        # puis scanner le QR code avec Expo Go
```

## Configuration de l'API
Pour un téléphone physique, copiez `.env.example` vers `.env` puis remplacez `EXPO_PUBLIC_API_URL`
par l'**IP locale de la machine qui héberge le backend** (pas `localhost` sur un téléphone).
Par défaut, l'émulateur Android utilise `10.0.2.2` et le simulateur iOS utilise `localhost`.
Surcharge possible sans modifier le code :
```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:5000 npx expo start
```
`BASE_URL = API_URL + "/api"`. Le téléphone et le serveur doivent être sur le même réseau.

Les jetons d'accès et de renouvellement sont conservés avec Expo SecureStore ; les anciennes
installations migrent leurs jetons AsyncStorage lors de leur première lecture.

## Écrans
Login, Register, Home (raccourcis + commandes en cours), Rooms (filtre par dates), RoomDetail
(devis de prix + réservation), MenuOrder (Restaurant, Bar, Room service), Concierge, Bookings
(séjours, commandes, factures), Profile (édition + notifications).

## Endpoints utilisés
`POST /api/client-portal/register|login|refresh|logout`, `GET|PUT /client-portal/me`,
`GET /client-portal/rooms`, `/rooms/:id`, `/rooms/:id/price-quote`, `POST /client-portal/book-room`,
`GET /client-portal/my-reservations`, `POST /client-portal/order`, `GET /client-portal/my-orders`,
`POST /client-portal/concierge-request`, `GET /client-portal/my-concierge-requests`,
`GET /client-portal/my-invoices`, `GET /client-portal/my-notifications`,
`PATCH /client-portal/my-notifications/:id/read`, `GET /api/menu`, `GET /api/drinks`.

## Notifications
Mise à jour par **sondage** (15–20 s) des commandes, réservations, demandes de conciergerie et
notifications (badge sur l'onglet Profil). **Limite** : pas de notifications push (FCM/APNs) ;
elles nécessiteraient `expo-notifications`, un projet Firebase et l'enregistrement de tokens côté backend
(`backend/src/utils/notify.js` est le point d'extension prévu).

## Autres limites
Pas de paiement natif, pas de déverrouillage de chambre par QR, pas de mode hors ligne.
Les icônes/splash ne sont pas fournies (couleurs seulement dans `app.json`).
