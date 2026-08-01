# Refonte Architecture Rôles — Smart Hotel 360°

## Objectif
Restructurer l'application autour de 3 rôles : **Super Admin**, **Manager**, **Client** — avec dashboards, sidebars, permissions et pages dédiées.

## Phase 0 — Corrections de bugs existants
- [x] Fix `AppContext.jsx` : déclarer `userRole`/`setUserRole` + étendre l'état (payments, commandes client, activités client, factures client).
- [x] Fix `Reservations.jsx` : remplacer `setLocalReservations` (indéfini) par `setReservations`.

## Phase 1 — Infrastructure rôles & navigation
- [x] Créer `src/pages/Login.jsx` — sélection de rôle / connexion (Super Admin, Manager, Client).
- [x] Réécrire `Sidebar.jsx` — menus exacts par rôle + route réelle pour chaque entrée + Déconnexion.
- [x] Mettre à jour `Topbar.jsx` — sélecteur de rôle fonctionnel + déconnexion.
- [x] Mettre à jour `main.jsx` — routeur complet avec garde de rôle (`RoleRoute`), `HomeRouter` et page 404.

## Phase 2 — Super Admin
- [x] Créer `src/pages/admin/UsersManagement.jsx` — Gestion des Utilisateurs.
- [x] Créer `src/pages/admin/RolesPermissions.jsx` — Gestion des Rôles & Permissions.
- [x] Créer `src/pages/Payments.jsx` — module Paiements (8 méthodes) avec vue selon rôle.
- [x] Reconstruire `src/pages/Dashboard.jsx` — Dashboard Global (8 KPI, 5 graphiques, 6 widgets).
- [x] Étendre `mockData.js` — données paiements, revenus mensuels, réservations par mois, répartition paiements, etc.

## Phase 3 — Manager
- [x] Créer `src/pages/DashboardManager.jsx` — Dashboard Manager (KPI, gestion équipes, actions rapides).
- [x] Créer `src/pages/PlanningAgents.jsx` — Planning des Agents.
- [x] Adapter `Profile.jsx` — profil selon rôle.

## Phase 4 — Espace Client & Premium
- [x] Créer `src/pages/client/ClientHome.jsx` — vitrine hôtel (hero, chambres, restaurant, bar, activités, galerie, témoignages, contact).
- [x] Créer `src/pages/client/ClientReservations.jsx` — Mes Réservations.
- [x] Créer `src/pages/client/ClientOrders.jsx` — Mes Commandes (Restaurant / Bar).
- [x] Créer `src/pages/client/ClientActivities.jsx` — Mes Activités.
- [x] Créer `src/pages/client/ClientInvoices.jsx` — Mes Factures (voir / PDF / imprimer / historique).
- [x] Créer `src/pages/client/ClientLoyalty.jsx` — Programme de Fidélité.
- [x] Créer `src/pages/client/ClientAI.jsx` — Assistant IA Hôtel.
- [x] Créer `src/pages/client/ClientQR.jsx` — QR Code Personnel.
- [x] Rendre `Restaurant.jsx`, `Bar.jsx`, `Rooms.jsx` sensibles au rôle (vue client = commande / réservation).
- [x] Étendre `mockData.js` — témoignages, galerie, commandes client, activités client, factures client, niveaux fidélité, contact.

## Phase 5 — QA & Build
- [x] Vérifier toutes les routes, tous les boutons, la navigation par rôle, le responsive.
- [x] `npm run build` — vérification production.
- [x] `npm run dev` — test manuel final.

## Phase 6 — Rafinement rôle & fonctionnalité (audit 5 étoiles)
- [x] Rendre `Rooms.jsx` sensible au rôle : vue Client = catalogue + dialogue de réservation (dates/personnes) -> crée la réservation + redirige vers `/client/reservations` ; vue Admin/Manager inchangée.
- [x] Rendre `Restaurant.jsx` sensible au rôle : masquer « Plan des tables » et « Écran cuisine » pour le client.
- [x] Rendre `Bar.jsx` sensible au rôle : masquer les jauges/détails de stock pour le client.
- [x] Corriger `ClientHome.jsx` : « Réserver cette chambre » redirige proprement vers la vitrine chambres client (avec `?book=room` pour ouvrir le dialogue).
- [x] Améliorer `CartSummary.jsx` : « Payer » enregistre un paiement (contexte), journalise (audit) et notifie — plus de `alert`.
- [x] Corriger `Reservations.jsx` : la réservation rapide met à jour le statut chambre -> « Réservée ».
- [x] `npm run build` + `npm run dev` — vérification finale.

