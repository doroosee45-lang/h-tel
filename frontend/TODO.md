# TODO — Correction du style premium de la page d'accueil client (ClientHome)

## Objectif
Retrouver l'élégance du design original (fond crème, cartes blanches, accents or/navy)
tout en conservant les nouvelles fonctionnalités (carrousels, compteurs animés, marquee,
FAQ, CTA), avec une expérience optimale sur mobile, tablette et ordinateur.

## État : ✅ Terminé

### Étape 1 — Animations plus discrètes ✅
- [x] `src/components/client/Reveal.jsx` — offsets réduits (28px → 16px) et durée réduite (600ms → 450ms), easing doux
- [x] `AnimatedCounter.jsx` — conservé (déclenchement au scroll, fluide)

### Étape 2 — Refonte du design de ClientHome.jsx ✅
- [x] **Hero** : contraste renforcé (double overlay + text-shadow), badge or, ligne de confiance (note 4,6/5), flèches/dots accessibles, images premium
- [x] **Chiffres clés** : cartes blanches élégantes avec liseré or, compteurs animés conservés, radius 18px
- [x] **Nos services** : cartes blanches premium (image + texte), hover discret (translateY -4px), radius harmonisés
- [x] **Pourquoi nous choisir ? / L'excellence** : section claire élégante (fond crème dégradé, cartes blanches, icônes or, liseré animé au hover)
- [x] **Comment ça marche ?** : étapes harmonisées, connecteurs discrets en pointillés
- [x] **Chambres populaires** : cartes blanches, bouton "Réserver" accessible, image responsive
- [x] **Restaurant & Bar** : sections jumelles épurées, images adaptatives (64/72px)
- [x] **Activités** : cartes avec image, tailles uniformisées, prix Inclus/FC
- [x] **Galerie** : images arrondies 16px, hover zoom subtil (scale 1.05)
- [x] **Ils nous font confiance / Nos partenaires** : marquee sur fond clair (#FBF8F1), cartes blanches fines, masque dégradé
- [x] **Témoignages** : **refonte complète** (carrousel 1/2/3 par vue, guillemets décoratifs, avatar cerclé or, note, "Séjour vérifié", date, pagination corrigée)
- [x] **Offre de bienvenue – 10 %** : CTA navy raffiné, double bouton, badge dégradé or
- [x] **FAQ** : accordéons harmonisés (bordure gold au focus, fond goldSoft)
- [x] **Contact** : carte blanche harmonisée, boutons adaptés mobile, icônes cerclées

### Étape 3 — Optimisation responsive ✅
- [x] Aucun débordement horizontal (`overflowX: hidden` sur le wrapper + conteneurs masqués)
- [x] Espacements adaptés (xs/sm/md) partout
- [x] Images `objectFit: cover` correctement dimensionnées
- [x] Cartes empilées proprement sur mobile (xs=12)
- [x] Boutons 44px minimum au toucher (déjà dans le thème)
- [x] Carrousels sans débordement (flexShrink: 0, width %, padding contrôlé)

### Étape 4 — Vérifications ✅
- [x] `npm run build` sans erreur (1944 modules transformés)
- [x] Test responsive (xs/sm/md/lg breakpoints)

