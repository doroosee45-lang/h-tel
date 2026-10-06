# Rapport d’audit — Smart Hotel 360

Date de l’audit : 6 octobre 2026
Branche examinée : `copilot/copilotadd-mobile-app-client` (la branche locale diffère du nom donné dans la demande).

## Périmètre et méthode

Inspection statique des routeurs, contrôleurs, modèles, middlewares, clients API, routes web et écrans mobiles ; vérification des appels/contrats disponibles ; exécution des scripts de contrôle, lint, builds et tests présents ou ajoutés. L’application expose 29 routeurs backend. Aucun service MongoDB n’était installé ou à l’écoute sur `127.0.0.1:27017`.

## Problèmes confirmés et corrections apportées

### Backend

- **Élevé — paiements** : le montant transmis au serveur déterminait le montant Stripe/PayPal/Mobile Money ; le webhook Mobile Money faisait confiance au corps reçu ; les références de transaction n’étaient pas idempotentes. Le serveur vérifie désormais le propriétaire client, la facture/commande, le solde restant et le montant en centimes. Mobile Money vérifie le statut auprès de l’API configurée de l’agrégateur ; les paiements sont rattachés aux commandes et les références fournisseur sont uniques et rejouables sans créer un second paiement.
- **Élevé — réservations** : les dates invalides ou inversées n’étaient pas rejetées uniformément, une remise envoyée par le client pouvait diminuer le prix, et la mise à jour acceptait des champs comme statut, client, prix et montant réglé. Les dates sont strictement validées, les chambres inactives/en maintenance refusées, les remises manuelles sont bornées et réservées au personnel, le client doit exister, et la mise à jour n’accepte que notes/adultes/enfants. La disponibilité de chambre n’est plus remise à « disponible » si un autre séjour l’occupe ou la réserve.
- **Élevé — erreurs, CSRF et CORS** : le middleware d’erreur renvoyait message interne et stack en développement ; les erreurs serveur renvoient maintenant un message générique sans stack. Les écritures authentifiées par cookie de renouvellement exigent l’origine web configurée ; les origines CORS non configurées ne sont plus ouvertes en production.
- **Moyen — authentification et recherche** : ajout d’une limite aux tentatives login/inscription/2FA et au webhook Stripe (monté avant le limiteur API global), validation stricte des identifiants MongoDB exposés et échappement/limitation des paramètres de recherche utilisés comme expressions régulières.
- **Dépendances** : mises à jour compatibles semver appliquées ; les dépendances de production backend ne signalent plus d’avis `npm audit`. Trois avis élevés demeurent dans l’arbre de développement via `nodemon → chokidar → braces` ; `npm audit fix --force` propose une rétrogradation majeure de nodemon, non retenue.

### Web

- **Élevé — session** : le rafraîchissement du profil synchronisait un nouvel objet de session, ce qui relançait l’effet de revalidation à répétition. Les callbacks lisent la session persistée et l’effet ne dépend plus de l’objet entier. Les erreurs réseau/serveur ne déconnectent plus l’utilisateur ; une réponse 401 reste traitée comme une session invalide.
- **Moyen — journal d’audit** : l’écran utilisait des lignes fictives alors que `/api/audit-logs` existe. Il affiche maintenant les lignes backend, avec états chargement/erreur/vide.
- **Moyen — création réservation** : les erreurs API étaient silencieuses ; elles sont désormais affichées et l’action est désactivée tant que les champs de base ou les dates sont invalides.

### Mobile

- **Élevé — jetons** : les jetons étaient stockés en AsyncStorage. Ils sont désormais conservés dans Expo SecureStore ; les jetons d’anciennes installations sont migrés à leur première lecture. L’API par défaut cible l’émulateur Android (`10.0.2.2`) ou le simulateur iOS (`localhost`) et `.env.example` documente l’adresse LAN requise sur appareil physique.

## Vérifications effectuées

- `backend/npm test` : **9 tests réussis** (dates/remises, montant exact, recherche littérale bornée, contrôle CSRF, absence de stack/message interne).
- `backend/npm run check` : **réussi**, 29 routeurs montés.
- `frontend/npm run lint` : **réussi**, avec avertissements existants (notamment imports inutilisés, effets React et génération QR pseudo-aléatoire).
- `frontend/npm run build` : **réussi** ; avertissement de bundle principal volumineux (~1,19 Mo).
- `mobile/npx expo config --type public --json` : **réussi**.
- `mobile/npx expo export --platform android` : **réussi**.
- `npm audit` après mise à jour compatible : backend conserve 3 avis élevés de dépendances dev ; frontend 2 avis modérés dans React Router 6 ; mobile 67 avis (1 faible, 24 modérés, 41 élevés, 1 critique). Les remédiations npm proposées pour React Router et Expo/React Native impliquent une migration majeure ; elles n’ont pas été forcées.

## Points restant à traiter

1. **Pas de vérification E2E avec données persistantes** : MongoDB et les clés des passerelles ne sont pas disponibles dans cet environnement. Les flux login/CRUD/paiement réels, leurs agrégations, les permissions en base et la connectivité d’un téléphone physique ne peuvent donc pas être déclarés validés.
2. **Données fictives web toujours présentes** : plusieurs pages actives importent encore `frontend/src/data/mockData.js` (notamment IA, activités, événements, achats, rapports, planning, multi-hôtels, paramètres, profil et QR) ou gardent des actions locales/non persistées. Certaines API de ces modules existent mais ne sont pas raccordées de façon complète ; les écrans sans endpoint dédié ne peuvent pas être remplacés par des données réelles sans définir leur contrat métier. `ClientPortal.jsx` est un ancien écran distinct des routes client actuelles.
3. **Mise à jour générique dans d’autres modules backend** : des contrôleurs d’événements, RH, CRM, finance, stock, menu, salles et activités passent encore des corps de requête directement aux opérations Mongoose. Le correctif de whitelist a été appliqué au flux de réservation, pas à tous ces modules.
4. **Paiements concurrents** : l’idempotence couvre la répétition d’une même référence fournisseur, mais il n’y a pas de verrou/transaction qui empêche deux tentatives simultanées de fournisseurs différents de régler le même solde.
5. **Modules mobiles non présents** : paiement natif et notifications push restent non implémentés, conformément aux limites déjà décrites dans `mobile/README.md`. L’export Android vérifie le bundling, pas le comportement sur appareil/Expo Go.
6. **Dépendances web/mobile** : les avis React Router et Expo/React Native nécessitent une migration de version majeure et une validation dédiée ; ils restent à planifier.

En conséquence, les corrections ciblées et builds sont vérifiés, mais l’audit ne peut pas conclure que toutes les fonctionnalités de l’application sont complètes ni que l’E2E avec backend et données réelles est validé dans cet environnement.
