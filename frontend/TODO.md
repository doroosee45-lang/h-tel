# Moteur de recherche global — Smart Hotel 360°

## Objectif
Rendre la recherche **entièrement fonctionnelle** dans toute l'application :
- Recherche globale (Topbar) avec raccourci clavier Ctrl/Cmd+K
- Recherche multi-critères temps réel dans chaque module
- Données réelles du contexte (pas de mock statiques)

## Étapes

### Phase 1 — Utilitaires de recherche
- [x] Optimiser `src/utils/searchUtils.js` : ajouter `filterRecords`, `multiSearchRanked`, améliorer la pertinence et le surlignage.

### Phase 2 — Recherche globale (Topbar)
- [x] Câbler `GlobalSearch` dans `Topbar.jsx` : bouton loupe + raccourci Ctrl/Cmd+K.
- [x] Étendre `GlobalSearch.jsx` : utiliser les données du contexte, ajouter les groupes manquants (fournisseurs, tables, room service, événements, achats, hôtels), corriger les routes, tri par pertinence.

### Phase 3 — Recherche par module
- [x] Chambres (`Rooms.jsx`)
- [x] Réservations (`Reservations.jsx`)
- [x] Restaurant (`Restaurant.jsx`)
- [x] Bar (`Bar.jsx`)
- [x] CRM Clients (`CRM.jsx`)
- [x] Stock (`Stock.jsx`)
- [x] RH / Employés (`HR.jsx`)
- [x] Paiements (`Payments.jsx`)
- [x] Activités (`Activities.jsx`)
- [x] Événements (`Events.jsx`)
- [x] Utilisateurs (`UsersManagement.jsx`)
- [x] Notifications (`Notifications.jsx`)
- [x] Audit (`AuditLogs.jsx`)
- [x] Finance (`Finance.jsx`)
- [x] Room Service (`RoomService.jsx`)
- [x] Achats / Commandes (`Purchases.jsx`)
- [x] Conciergerie (`Concierge.jsx`)
- [x] QR Code (`QRCodeModule.jsx`)
- [x] Rapports (`Reports.jsx`)
- [x] Multi-Hôtels (`MultiHotels.jsx`)
- [x] Planning des Agents (`PlanningAgents.jsx`)
- [x] Pages client : Commandes, Factures, Activités, Réservations

### Phase 4 — Vérification
- [x] `npm run build` — validation production

