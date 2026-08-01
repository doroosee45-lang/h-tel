# Smart Hotel 360° — Frontend (React + Material UI)

Frontend web complet, construit pour être branché sur une API REST Node.js/Express +
MongoDB (architecture MERN décrite dans le cahier des charges). Ce livrable couvre
uniquement le frontend, avec des données de démonstration dans `src/data/mockData.js`
à remplacer par vos appels API.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrez http://localhost:5173

## Build de production

```bash
npm run build
npm run preview
```

## Ce qui est inclus

- **Dashboard temps réel** — occupation, recettes/dépenses, ventes restaurant & bar, répartition des revenus (graphiques Recharts)
- **Réservations** — liste filtrable, statuts, création rapide
- **Chambres** — catalogue en cartes (photos, statut, prix), filtres par statut
- **Check-in / Check-out** — étapes digitales (scan pièce d'identité, signature, attribution) + facture automatique
- **Restaurant** — menu digital par catégories + écran cuisine (nouvelle → en préparation → prête → servie)
- **Bar** — fiches boissons avec suivi de stock
- **Conciergerie** — services à la demande (taxi, navette, excursions…)
- **Activités** — spa, piscine, excursions avec réservation
- **CRM Client** — fiches clients, fidélité, historique de dépenses
- **Aperçu App Client** — maquette interactive de l'application mobile (accueil + extras), fidèle aux références partagées
- **Portail Client (web)** — espace personnel du client connecté : chambre et séjour en cours, déverrouillage, facture en temps réel avec réduction fidélité, demandes en cours, historique des séjours, notifications et progression du programme de fidélité
- **Stock & Achats** — inventaire avec alertes seuil critique, et module Achats dédié (demande → validation → bon de commande → réception)
- **Finance** — journal de caisse, recettes vs dépenses
- **Ressources Humaines** — effectif, présence, fiches employés
- **Room Service** — commandes en cours (nouvelle → livraison → livrée) + catalogue accessible par QR Code
- **Événements** — mariages, séminaires, conférences, anniversaires, avec salle/traiteur/facturation
- **QR Code** — génération et suivi des QR par chambre, menu, facture et activité
- **Notifications** — journal des notifications push (réservation confirmée, chambre prête, commande prête, paiement reçu…)
- **Module IA** — prévisions d'occupation, clients VIP, produits populaires, détection d'anomalies, assistant virtuel
- **Multi-Hôtels** — gestion centralisée et rapports consolidés du groupe
- **Rapports** — exports d'occupation, financier, RH et stock
- **Paramètres** — profil de l'établissement, utilisateurs & rôles (RBAC), sécurité, moyens de paiement, préférences de notification

## Points de complétude vérifiés contre le cahier des charges

- **Chambres** — fiche détaillée (dialogue) avec galerie complète, description, équipements et services associés, en plus des cartes du catalogue
- **Réservations** — calendrier de disponibilités sur 14 jours, en plus de la liste et de la création rapide
- **Restaurant** — plan des tables (statuts Libre/Occupée/Réservée) en plus du menu digital et de l'écran cuisine ; catégories alignées sur le cahier des charges (Entrées, Salades, Soupes, Viandes, Poissons, Pizzas, Fast Food, Desserts, Menus Spéciaux)
- **Bar** — filtres par catégorie (Cocktails, Whisky, Vin, Champagne, Jus, Eau, Bière, Soft Drinks)
- **Stock** — chaque produit a désormais une photo et un prix d'achat, comme demandé
- **RH** — onglets Effectif / Présence (pointage + géolocalisation) / Paie (salaire, primes, déductions) / Congés
- **CRM** — historique complet par client (chambres, repas, boissons, paiements) accessible en un clic
- **Finance** — ajout du bénéfice net et du flux de trésorerie, en plus des recettes/dépenses
- **Mode hors-ligne** — bannière réactive à la connectivité réelle du navigateur (`navigator.onLine`), visible sur tout l'écran quand la connexion est coupée
- **Menu digital** — chaque plat a désormais sa description, ses ingrédients et ses allergènes affichés
- **Bar** — chaque boisson a sa marque, son volume et sa description
- **Activités** — chaque activité a sa description
- **Chambres** — promotions affichées sur les cartes concernées
- **CRM** — photo réelle par client + points de fidélité affichés
- **Module IA** — prévision des ventes Restaurant & Bar ajoutée en complément de la prévision d'occupation
- **Finance** — bloc Caisse (ouverture/fermeture, solde initial/actuel)
- **Dashboard** — ajout des indicateurs "Réservations du jour" et "Satisfaction client"

## Système de design

- **Couleurs** — bleu marine profond (`#0B2545`) + or (`#C9A24B`) sur fond crème (`#F6F3EC`), dans l'esprit de la référence "Park Hotel"
- **Typographies** — Fraunces (titres), Inter (interface), IBM Plex Mono (données chiffrées, références, codes chambre)
- **Motif signature** — cadre "coins de QR Code" (`QRFrame`) autour des visuels clés (chambres, plats, boissons, activités), rappel du rôle central du QR Code dans le cahier des charges (check-in, menu, facture, accès chambre)

## Prochaines étapes suggérées

1. Brancher chaque page sur l'API REST (remplacer `src/data/mockData.js`)
2. Ajouter l'authentification JWT + 2FA et le RBAC par rôle (Réception, Manager Restaurant, Comptable, RH…)
3. Ajouter le mode hors-ligne (cache local + synchronisation)
4. Construire l'application mobile React Native (client + personnel) en réutilisant la palette et les composants
5. Brancher les paiements (Mobile Money, carte, Stripe/PayPal)
