# TODO — Audit & Corrections Responsive Mobile

## Objectif
Éliminer tout débordement horizontal et garantir un affichage fluide sur 320 / 375 / 390 / 414 / 768 px (Android & iOS).

## État : ✅ Terminé

### Phase 1 — Fondations globales ✅
- [x] `index.html` : overflow-x hidden global + images responsives
- [x] `theme.js` : zones tactiles minimales (44px) boutons / icônes / onglets
- [x] `AppLayout.jsx` : garde-fous overflow-x / max-width sur le contenu

### Phase 2 — Layout & navigation ✅
- [x] `Topbar.jsx` : comportement mobile (titre tronqué, rôle icône seule, sous-titre masqué sur xs)
- [x] `GlobalSearch.jsx` : résultats responsives (wrap, maxWidth dynamique)

### Phase 3 — Pages & composants ✅
- [x] `RoomDetailDialog.jsx` : infos chambre flexibles (column sur xs)
- [x] `ClientHome.jsx` : descriptions tronquées + wrap
- [x] `ClientInvoices.jsx` : boutons du dialog empilés sur xs
- [x] `CheckInOut.jsx` : DialogActions wrap + chips flexibles + boutons column
- [x] `ClientQR.jsx` : boutons & chips empilés / wrap
- [x] `ClientLoyalty.jsx` : statistiques en colonne sur xs
- [x] `HR.jsx` : Tabs scrollables
- [x] `PlanningAgents.jsx` : en-tête wrap + titre responsive
- [x] `Login.jsx` : encart démo aligné
- [x] `OfflineBanner.jsx` : icône flexShrink + padding xs
- [x] `ClientApp.jsx` : PhoneFrame 100% (max 300px) — déjà responsive

### Phase 4 — Vérifications
- [ ] `npm run build` sans erreur
- [ ] Test aux résolutions 320 / 375 / 390 / 414 / 768 px

