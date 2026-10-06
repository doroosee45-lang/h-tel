# Smart Hotel 360° — Frontend

Frontend Vite/React branché sur l'API Express/Mongo/Socket.io du projet.

## Configuration

Copiez `.env.example` vers `.env` puis adaptez si nécessaire:

```bash
cp .env.example .env
```

Variable disponible:

- `VITE_API_URL` — URL racine du backend (défaut recommandé: `http://localhost:5000`)

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Intégrations principales

- Auth staff: `/api/auth/*`
- Auth client: `/api/client-auth/*`
- Portail client: `/api/client-portal/*`
- Notifications temps réel: Socket.io (`notification`)
- Modules branchés en priorité: dashboard, chambres, réservations, check-in/out, restaurant, bar, stock, finance, RH, CRM, conciergerie, notifications, admin utilisateurs, portail client

## Notes

- Les pages sans endpoint backend dédié affichent désormais un état vide explicite au lieu de données fictives.
- `src/data/mockData.js` reste présent tant que certains écrans non prioritaires ne sont pas encore migrés.
