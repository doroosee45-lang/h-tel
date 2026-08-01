// Données de démonstration — à remplacer par les appels API REST (Node/Express + MongoDB)

export const kpis = {
  chambresOccupees: 84,
  chambresLibres: 22,
  chambresNettoyage: 7,
  chambresMaintenance: 3,
  reservationsJour: 23,
  arriveesPrevues: 18,
  departsPrevues: 12,
  ventesRestaurant: 4_320_000,
  ventesBar: 1_180_000,
  recettesJour: 9_640_000,
  depensesJour: 2_150_000,
  alertesStock: 5,
  satisfactionClient: 4.6
};

export const occupationSemaine = [
  { jour: 'Lun', taux: 72 },
  { jour: 'Mar', taux: 78 },
  { jour: 'Mer', taux: 81 },
  { jour: 'Jeu', taux: 75 },
  { jour: 'Ven', taux: 90 },
  { jour: 'Sam', taux: 96 },
  { jour: 'Dim', taux: 84 }
];

export const revenusParModule = [
  { name: 'Chambres', value: 5_400_000 },
  { name: 'Restaurant', value: 4_320_000 },
  { name: 'Bar', value: 1_180_000 },
  { name: 'Activités & Spa', value: 940_000 },
  { name: 'Événements', value: 1_760_000 }
];

export const rooms = [
  {
    id: 'R101', nom: 'Suite Présidentielle', etage: 1, categorie: 'Suite VIP', statut: 'Occupée', prix: 480000,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80', client: 'M. Kanyinda Tshibola',
    surface: 68, lits: 'Lit King Size', description: 'Notre suite la plus prestigieuse, avec salon séparé, vue panoramique sur le fleuve et jacuzzi privé.',
    equipements: ['Smart TV 65"', 'WiFi haut débit', 'Climatisation', 'Coffre-fort', 'Mini-bar', 'Jacuzzi'],
    services: ['Room Service', 'Blanchisserie', 'Spa', 'Transport'],
    gallery: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=700&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=80'
    ]
  },
  {
    id: 'R102', nom: 'Chambre Deluxe Vue Piscine', etage: 1, categorie: 'Deluxe', statut: 'Libre', prix: 210000,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
    surface: 34, lits: '1 lit Queen Size', description: 'Chambre lumineuse avec balcon donnant directement sur la piscine extérieure.',
    equipements: ['TV', 'WiFi', 'Climatisation', 'Coffre-fort', 'Mini-bar'],
    services: ['Room Service', 'Blanchisserie'],
    promotion: '-15% dès 3 nuits',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=700&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=80'
    ]
  },
  {
    id: 'R203', nom: 'Chambre Standard Twin', etage: 2, categorie: 'Standard', statut: 'Nettoyage', prix: 120000,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80',
    surface: 24, lits: '2 lits simples', description: 'Chambre confortable et fonctionnelle, idéale pour un séjour d’affaires.',
    equipements: ['TV', 'WiFi', 'Climatisation'],
    services: ['Room Service', 'Blanchisserie'],
    gallery: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=700&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80'
    ]
  },
  {
    id: 'R204', nom: 'Chambre Familiale', etage: 2, categorie: 'Familiale', statut: 'Réservée', prix: 260000,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', client: 'Famille Muyaya',
    surface: 42, lits: '1 lit Queen + 2 lits simples', description: 'Espace généreux pensé pour les familles, avec coin salon et double salle de bain.',
    equipements: ['TV', 'WiFi', 'Climatisation', 'Coffre-fort', 'Mini-bar'],
    services: ['Room Service', 'Blanchisserie', 'Transport'],
    promotion: '-10% séjour 5 nuits et +',
    gallery: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&q=80'
    ]
  },
  {
    id: 'R305', nom: 'Suite Junior', etage: 3, categorie: 'Suite', statut: 'Maintenance', prix: 320000,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
    surface: 48, lits: 'Lit King Size', description: 'Suite élégante avec espace bureau, parfaite pour les longs séjours.',
    equipements: ['Smart TV', 'WiFi haut débit', 'Climatisation', 'Coffre-fort', 'Mini-bar'],
    services: ['Room Service', 'Blanchisserie', 'Spa'],
    gallery: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=700&q=80'
    ]
  },
  {
    id: 'R306', nom: 'Chambre Deluxe City View', etage: 3, categorie: 'Deluxe', statut: 'Occupée', prix: 230000,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80', client: 'Mme. Aline Bofando',
    surface: 36, lits: '1 lit Queen Size', description: 'Vue imprenable sur les lumières de la ville, idéale pour un séjour urbain.',
    equipements: ['TV', 'WiFi', 'Climatisation', 'Coffre-fort', 'Mini-bar'],
    services: ['Room Service', 'Blanchisserie', 'Transport'],
    gallery: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=700&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700&q=80'
    ]
  }
];

export const reservations = [
  { id: 'RS-13082', client: 'M. Kanyinda Tshibola', chambre: 'Suite Présidentielle', arrivee: '2026-08-03', depart: '2026-08-07', statut: 'Confirmée', canal: 'Mobile' },
  { id: 'RS-13083', client: 'Famille Muyaya', chambre: 'Chambre Familiale', arrivee: '2026-08-04', depart: '2026-08-06', statut: 'Confirmée', canal: 'Web' },
  { id: 'RS-13084', client: 'Mme. Aline Bofando', chambre: 'Deluxe City View', arrivee: '2026-07-30', depart: '2026-08-02', statut: 'En cours', canal: 'Réception' },
  { id: 'RS-13085', client: 'M. Serge Okito', chambre: 'Chambre Standard Twin', arrivee: '2026-08-05', depart: '2026-08-08', statut: 'En attente', canal: 'Téléphone' },
  { id: 'RS-13086', client: 'Mme. Grace Ilunga', chambre: 'Suite Junior', arrivee: '2026-08-10', depart: '2026-08-14', statut: 'Confirmée', canal: 'Web' },
  { id: 'RS-13071', client: 'M. Kanyinda Tshibola', chambre: 'Deluxe City View', arrivee: '2026-03-14', depart: '2026-03-17', statut: 'Terminée', canal: 'Mobile' },
  { id: 'RS-13065', client: 'Mme. Grace Ilunga', chambre: 'Suite Présidentielle', arrivee: '2026-05-02', depart: '2026-05-04', statut: 'Terminée', canal: 'Web' }
];

export const menuCategories = ['Entrées', 'Salades', 'Soupes', 'Viandes', 'Poissons', 'Pizzas', 'Fast Food', 'Desserts', 'Menus Spéciaux'];

export const menuItems = [
  { id: 'D1', nom: 'Poulet Braisé', categorie: 'Viandes', prix: 18000, temps: '25 min', image: 'https://images.unsplash.com/photo-1598515213692-5f252f77d2b8?w=500&q=80', dispo: true, description: 'Poulet fermier mariné aux épices congolaises, braisé au feu de bois.', ingredients: ['Poulet fermier', 'Ail', 'Piment', 'Tomate'], allergenes: [] },
  { id: 'D2', nom: 'Salade César', categorie: 'Salades', prix: 9000, temps: '10 min', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80', dispo: true, description: 'Laitue romaine, copeaux de parmesan, croûtons maison et sauce César.', ingredients: ['Laitue romaine', 'Parmesan', 'Croûtons', 'Poulet grillé'], allergenes: ['Gluten', 'Lactose', 'Œuf'] },
  { id: 'D3', nom: 'Pizza Margherita', categorie: 'Pizzas', prix: 15000, temps: '18 min', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80', dispo: true, description: 'Pâte fine, sauce tomate maison, mozzarella fraîche et basilic.', ingredients: ['Pâte à pizza', 'Tomate', 'Mozzarella', 'Basilic'], allergenes: ['Gluten', 'Lactose'] },
  { id: 'D4', nom: 'Filet de Tilapia Grillé', categorie: 'Poissons', prix: 22000, temps: '22 min', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80', dispo: true, description: 'Tilapia du fleuve Congo grillé, riz parfumé et légumes sautés.', ingredients: ['Tilapia', 'Riz', 'Légumes de saison'], allergenes: ['Poisson'] },
  { id: 'D5', nom: 'Fondant au Chocolat', categorie: 'Desserts', prix: 8000, temps: '8 min', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&q=80', dispo: true, description: 'Cœur coulant au chocolat noir 70%, servi tiède avec glace vanille.', ingredients: ['Chocolat noir', 'Beurre', 'Œufs', 'Farine'], allergenes: ['Gluten', 'Lactose', 'Œuf'] },
  { id: 'D6', nom: 'Menu Découverte Congolaise', categorie: 'Menus Spéciaux', prix: 32000, temps: '30 min', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80', dispo: false, description: 'Assortiment de spécialités locales : liboke, saka-saka et fufu.', ingredients: ['Poisson', 'Feuilles de manioc', 'Farine de manioc'], allergenes: ['Poisson'] },
  { id: 'D7', nom: 'Samoussas aux légumes', categorie: 'Entrées', prix: 7000, temps: '12 min', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80', dispo: true, description: 'Feuilletés croustillants garnis de légumes épicés.', ingredients: ['Pâte feuilletée', 'Carotte', 'Petits pois', 'Épices'], allergenes: ['Gluten'] },
  { id: 'D8', nom: 'Soupe de Poisson Fumé', categorie: 'Soupes', prix: 11000, temps: '15 min', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80', dispo: true, description: 'Bouillon parfumé au poisson fumé et légumes racines.', ingredients: ['Poisson fumé', 'Oignon', 'Gingembre'], allergenes: ['Poisson'] },
  { id: 'D9', nom: 'Brochettes de Bœuf', categorie: 'Viandes', prix: 20000, temps: '20 min', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&q=80', dispo: true, description: 'Brochettes marinées grillées au charbon, sauce arachide.', ingredients: ['Bœuf', 'Arachide', 'Oignon', 'Poivron'], allergenes: ['Arachide'] },
  { id: 'D10', nom: 'Capitaine Grillé', categorie: 'Poissons', prix: 26000, temps: '24 min', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80', dispo: true, description: 'Capitaine entier grillé, citron vert et légumes vapeur.', ingredients: ['Capitaine', 'Citron vert', 'Légumes vapeur'], allergenes: ['Poisson'] },
  { id: 'D11', nom: 'Cheeseburger Royal', categorie: 'Fast Food', prix: 13000, temps: '14 min', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', dispo: true, description: 'Bœuf haché, cheddar fondu, oignons caramélisés, pain brioché.', ingredients: ['Bœuf haché', 'Cheddar', 'Pain brioché', 'Oignon'], allergenes: ['Gluten', 'Lactose'] },
  { id: 'D12', nom: 'Frites Maison', categorie: 'Fast Food', prix: 6000, temps: '10 min', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80', dispo: true, description: 'Pommes de terre fraîches coupées et frites maison, sel fin.', ingredients: ['Pommes de terre', 'Huile', 'Sel'], allergenes: [] }
];

export const kitchenOrders = [
  { id: '#1281', table: 'Table 05 · Ch. 306', items: ['Poulet Braisé x1', 'Salade César x2'], statut: 'Nouvelle', heure: '12:04' },
  { id: '#1282', table: 'Room Service · Ch. 101', items: ['Filet de Tilapia x1', 'Fondant au Chocolat x1'], statut: 'En préparation', heure: '11:52' },
  { id: '#1283', table: 'Table 02', items: ['Pizza Margherita x2'], statut: 'Prête', heure: '11:47' },
  { id: '#1284', table: 'Table 08', items: ['Menu Découverte x1'], statut: 'Servie', heure: '11:30' }
];

export const restaurantTables = [
  { id: 'T01', numero: 1, capacite: 2, zone: 'Salle principale', statut: 'Libre' },
  { id: 'T02', numero: 2, capacite: 4, zone: 'Salle principale', statut: 'Occupée' },
  { id: 'T03', numero: 3, capacite: 4, zone: 'Salle principale', statut: 'Réservée' },
  { id: 'T04', numero: 4, capacite: 6, zone: 'Salle principale', statut: 'Libre' },
  { id: 'T05', numero: 5, capacite: 2, zone: 'Terrasse', statut: 'Occupée' },
  { id: 'T06', numero: 6, capacite: 4, zone: 'Terrasse', statut: 'Libre' },
  { id: 'T07', numero: 7, capacite: 8, zone: 'Salon privé', statut: 'Réservée' },
  { id: 'T08', numero: 8, capacite: 4, zone: 'Terrasse', statut: 'Occupée' }
];

export const barCategories = ['Cocktails', 'Whisky', 'Vin', 'Champagne', 'Jus', 'Eau', 'Bière', 'Soft Drinks'];

export const barItems = [
  { id: 'B1', nom: 'Mojito Premium', categorie: 'Cocktails', prix: 12000, image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80', stock: 42, marque: 'Maison', volume: '25 cl', description: 'Rhum blanc, menthe fraîche, citron vert, eau gazeuse.' },
  { id: 'B2', nom: 'Vin Rouge Bordeaux', categorie: 'Vin', prix: 25000, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80', stock: 18, marque: 'Château Larose', volume: '75 cl', description: 'Vin rouge charpenté, notes de fruits noirs et de vanille.' },
  { id: 'B3', nom: 'Champagne Brut', categorie: 'Champagne', prix: 65000, image: 'https://images.unsplash.com/photo-1594372674422-2fdb2a3c1c02?w=500&q=80', stock: 6, marque: 'Moët Impérial', volume: '75 cl', description: 'Champagne brut, bulles fines, idéal pour les célébrations.' },
  { id: 'B4', nom: 'Jus de Fruits Frais', categorie: 'Jus', prix: 5000, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80', stock: 60, marque: 'Maison', volume: '30 cl', description: 'Pressé minute selon les fruits de saison.' },
  { id: 'B5', nom: 'Whisky 12 ans', categorie: 'Whisky', prix: 35000, image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=500&q=80', stock: 3, marque: 'Glenfiddich', volume: '4 cl', description: 'Single malt écossais vieilli 12 ans, notes de poire et de miel.' },
  { id: 'B6', nom: 'Eau Minérale 50cl', categorie: 'Eau', prix: 3000, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80', stock: 96, marque: 'Kin Beverages', volume: '50 cl', description: 'Eau minérale plate, source locale.' },
  { id: 'B7', nom: 'Bière Primus', categorie: 'Bière', prix: 6000, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80', stock: 54, marque: 'Bralima', volume: '33 cl', description: 'Bière blonde locale, légère et rafraîchissante.' },
  { id: 'B8', nom: 'Coca-Cola 33cl', categorie: 'Soft Drinks', prix: 4000, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80', stock: 70, marque: 'Coca-Cola', volume: '33 cl', description: 'Soda gazeux classique, servi bien frais.' }
];

export const stockItems = [
  { id: 'ST01', produit: 'Riz parfumé (sac 25kg)', categorie: 'Alimentation', quantite: 34, seuil: 15, fournisseur: 'Congo Agro Supply', statut: 'OK', prixAchat: 42000, photo: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80' },
  { id: 'ST02', produit: 'Eau minérale (carton)', categorie: 'Boissons', quantite: 12, seuil: 20, fournisseur: 'Kin Beverages', statut: 'Critique', prixAchat: 9500, photo: 'https://images.unsplash.com/photo-1616118132534-381148898bb4?w=200&q=80' },
  { id: 'ST03', produit: 'Serviettes de bain', categorie: 'Entretien', quantite: 210, seuil: 50, fournisseur: 'Textile Plus', statut: 'OK', prixAchat: 6500, photo: 'https://images.unsplash.com/photo-1620912189876-055f8f793a01?w=200&q=80' },
  { id: 'ST04', produit: 'Détergent multi-surfaces', categorie: 'Entretien', quantite: 8, seuil: 10, fournisseur: 'CleanPro RDC', statut: 'Critique', prixAchat: 4200, photo: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=200&q=80' },
  { id: 'ST05', produit: 'Café en grains (kg)', categorie: 'Alimentation', quantite: 26, seuil: 10, fournisseur: 'Virunga Coffee', statut: 'OK', prixAchat: 18000, photo: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&q=80' },
  { id: 'ST06', produit: 'Papeterie & fournitures bureau', categorie: 'Fournitures', quantite: 45, seuil: 15, fournisseur: 'Office Plus RDC', statut: 'OK', prixAchat: 3200, photo: 'https://images.unsplash.com/photo-1568205612837-017257d2310a?w=200&q=80' }
];

export const employees = [
  { id: 'E001', nom: 'Patrick Mwamba', poste: 'Réceptionniste', departement: 'Réception', statut: 'Présent', photo: 'https://i.pravatar.cc/100?img=12', contrat: 'CDI', dateEmbauche: '2022-03-01' },
  { id: 'E002', nom: 'Sarah Nzuzi', poste: 'Chef de Rang', departement: 'Restaurant', statut: 'Présent', photo: 'https://i.pravatar.cc/100?img=32', contrat: 'CDI', dateEmbauche: '2021-09-15' },
  { id: 'E003', nom: 'David Kalonji', poste: 'Barman', departement: 'Bar', statut: 'Congé', photo: 'https://i.pravatar.cc/100?img=51', contrat: 'CDD', dateEmbauche: '2023-06-10' },
  { id: 'E004', nom: 'Chantal Ilunga', poste: 'Gouvernante', departement: 'Housekeeping', statut: 'Présent', photo: 'https://i.pravatar.cc/100?img=45', contrat: 'CDI', dateEmbauche: '2020-01-20' },
  { id: 'E005', nom: 'Joel Tshimanga', poste: 'Technicien', departement: 'Maintenance', statut: 'Absent', photo: 'https://i.pravatar.cc/100?img=15', contrat: 'CDI', dateEmbauche: '2022-11-05' }
];

export const presenceLog = [
  { id: 1, employe: 'Patrick Mwamba', arrivee: '06:58', depart: '—', lieu: 'Réception — Hôtel Fleuve', statut: 'En service' },
  { id: 2, employe: 'Sarah Nzuzi', arrivee: '07:10', depart: '—', lieu: 'Restaurant — Hôtel Fleuve', statut: 'En service' },
  { id: 3, employe: 'Chantal Ilunga', arrivee: '06:45', depart: '14:45', lieu: 'Housekeeping — Hôtel Fleuve', statut: 'Terminé' },
  { id: 4, employe: 'Joel Tshimanga', arrivee: '—', depart: '—', lieu: '—', statut: 'Absent non justifié' }
];

export const payroll = [
  { id: 1, employe: 'Patrick Mwamba', salaireBase: 320000, primes: 30000, deductions: 12000, net: 338000 },
  { id: 2, employe: 'Sarah Nzuzi', salaireBase: 340000, primes: 45000, deductions: 15000, net: 370000 },
  { id: 3, employe: 'David Kalonji', salaireBase: 290000, primes: 20000, deductions: 10000, net: 300000 },
  { id: 4, employe: 'Chantal Ilunga', salaireBase: 260000, primes: 15000, deductions: 8000, net: 267000 },
  { id: 5, employe: 'Joel Tshimanga', salaireBase: 300000, primes: 0, deductions: 20000, net: 280000 }
];

export const leaveRequests = [
  { id: 1, employe: 'David Kalonji', type: 'Congé annuel', du: '2026-07-28', au: '2026-08-04', statut: 'Validé' },
  { id: 2, employe: 'Chantal Ilunga', type: 'Congé maladie', du: '2026-08-01', au: '2026-08-02', statut: 'En attente' },
  { id: 3, employe: 'Sarah Nzuzi', type: 'Congé exceptionnel', du: '2026-08-12', au: '2026-08-13', statut: 'En attente' }
];

export const clients = [
  { id: 'C001', nom: 'M. Kanyinda Tshibola', nationalite: 'RDC', telephone: '+243 81 000 0001', email: 'k.tshibola@mail.cd', sejours: 6, depensesTotales: 2_450_000, fidelite: 'Or', pointsFidelite: 2450, photo: 'https://i.pravatar.cc/100?img=33' },
  { id: 'C002', nom: 'Mme. Aline Bofando', nationalite: 'RDC', telephone: '+243 89 000 0002', email: 'a.bofando@mail.cd', sejours: 3, depensesTotales: 1_120_000, fidelite: 'Argent', pointsFidelite: 1120, photo: 'https://i.pravatar.cc/100?img=47' },
  { id: 'C003', nom: 'M. Serge Okito', nationalite: 'Belgique', telephone: '+32 470 000 003', email: 's.okito@mail.be', sejours: 1, depensesTotales: 340_000, fidelite: 'Standard', pointsFidelite: 340, photo: 'https://i.pravatar.cc/100?img=59' },
  { id: 'C004', nom: 'Mme. Grace Ilunga', nationalite: 'RDC', telephone: '+243 82 000 0004', email: 'g.ilunga@mail.cd', sejours: 9, depensesTotales: 3_980_000, fidelite: 'Platine', pointsFidelite: 3980, photo: 'https://i.pravatar.cc/100?img=44' }
];

export const fideliteReductions = {
  Platine: 15,
  Or: 10,
  Argent: 5,
  Standard: 0
};

export const clientHistory = {
  C001: {
    chambres: ['Suite Présidentielle (3 nuits, juil. 2026)', 'Deluxe City View (2 nuits, mars 2026)'],
    repas: ['Poulet Braisé x2', 'Menu Découverte Congolaise x1'],
    boissons: ['Champagne Brut x1', 'Whisky 12 ans x2'],
    paiements: ['Carte bancaire — 690 000 FC', 'Mobile Money — 210 000 FC']
  },
  C002: {
    chambres: ['Deluxe City View (3 nuits, juil. 2026)'],
    repas: ['Fondant au Chocolat x2', 'Filet de Tilapia x1'],
    boissons: ['Mojito Premium x3'],
    paiements: ['Mobile Money — 420 000 FC']
  },
  C003: {
    chambres: ['Chambre Standard Twin (3 nuits, août 2026)'],
    repas: ['Cheeseburger Royal x1'],
    boissons: ['Bière Primus x2'],
    paiements: ['Espèces — 340 000 FC']
  },
  C004: {
    chambres: ['Suite Junior (4 nuits, août 2026)', 'Suite Présidentielle (2 nuits, mai 2026)'],
    repas: ['Capitaine Grillé x2', 'Salade César x2'],
    boissons: ['Champagne Brut x2', 'Jus de Fruits Frais x4'],
    paiements: ['Carte bancaire — 1 240 000 FC', 'Stripe — 380 000 FC']
  }
};

export const financeJournal = [
  { id: 1, date: '2026-07-29', libelle: 'Encaissement chambres', type: 'Recette', montant: 5_400_000 },
  { id: 2, date: '2026-07-29', libelle: 'Ventes Restaurant', type: 'Recette', montant: 4_320_000 },
  { id: 3, date: '2026-07-29', libelle: 'Ventes Bar', type: 'Recette', montant: 1_180_000 },
  { id: 4, date: '2026-07-29', libelle: 'Achats Alimentation', type: 'Dépense', montant: -1_250_000 },
  { id: 5, date: '2026-07-29', libelle: 'Salaires & Primes', type: 'Dépense', montant: -900_000 }
];

export const financeTrend = [
  { mois: 'Fév', recettes: 62, depenses: 38 },
  { mois: 'Mar', recettes: 68, depenses: 40 },
  { mois: 'Avr', recettes: 71, depenses: 41 },
  { mois: 'Mai', recettes: 75, depenses: 44 },
  { mois: 'Juin', recettes: 80, depenses: 46 },
  { mois: 'Juil', recettes: 88, depenses: 49 }
];

export const financeIndicateurs = {
  beneficeNet: 48_600_000,
  margeBeneficiaire: 32,
  fluxTresorerieJour: 3_620_000,
  fluxTresorerieMois: 42_800_000
};

export const caisse = {
  statut: 'Ouverte',
  ouvertePar: 'Patrick Mwamba',
  heureOuverture: '06:30',
  soldeInitial: 500000,
  soldeActuel: 4120000
};

export const concierge = [
  { id: 1, service: 'Taxi', description: 'Course en ville ou vers l’aéroport', icon: 'taxi' },
  { id: 2, service: 'Navette Aéroport', description: 'Transfert programmé 24h/24', icon: 'shuttle' },
  { id: 3, service: 'Location Voiture', description: 'Véhicules avec ou sans chauffeur', icon: 'car' },
  { id: 4, service: 'Excursion Guidée', description: 'Découverte de la région avec guide', icon: 'tour' },
  { id: 5, service: 'Livraison de Colis', description: 'Coursier vers toute la ville', icon: 'package' },
  { id: 6, service: 'Réservation Restaurant', description: 'Table dans nos partenaires', icon: 'restaurant' }
];

export const activities = [
  { id: 1, nom: 'Spa & Massage', horaire: '09h00 – 20h00', prix: 45000, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80', description: 'Massage relaxant ou tonifiant par nos praticiens certifiés, dans un cadre apaisant.' },
  { id: 2, nom: 'Piscine Extérieure', horaire: '06h00 – 22h00', prix: 0, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80', description: 'Piscine chauffée avec bar flottant et transats, accès libre pour les résidents.' },
  { id: 3, nom: 'Salle de Sport', horaire: '05h00 – 23h00', prix: 0, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', description: 'Équipements cardio et musculation dernière génération, coach disponible sur demande.' },
  { id: 4, nom: 'Excursion Fleuve Congo', horaire: '08h00 – 16h00', prix: 60000, image: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=600&q=80', description: 'Sortie en bateau guidée sur le fleuve Congo avec déjeuner inclus.' },
  { id: 5, nom: 'Soirée à Thème', horaire: '19h00 – 23h00', prix: 25000, image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80', description: 'Soirée à thème animée en terrasse, buffet et musique live.' },
  { id: 6, nom: 'Espace Coworking', horaire: '07h00 – 21h00', prix: 15000, image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80', description: 'Espace de travail calme avec WiFi haut débit, imprimante et salle de réunion.' }
];

export const currency = (n) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' FC';

// ---------------------------------------------------------------------------
// Room Service
// ---------------------------------------------------------------------------
export const roomServiceOrders = [
  { id: 'RSV-401', chambre: 'R101', client: 'M. Kanyinda Tshibola', items: ['Filet de Tilapia x1', 'Jus de Fruits Frais x2'], statut: 'Nouvelle', heure: '12:10', montant: 32000 },
  { id: 'RSV-402', chambre: 'R306', client: 'Mme. Aline Bofando', items: ['Fondant au Chocolat x2', 'Café en grains'], statut: 'En livraison', heure: '11:55', montant: 21000 },
  { id: 'RSV-403', chambre: 'R204', client: 'Famille Muyaya', items: ['Menu Découverte Congolaise x2', 'Eau minérale x2'], statut: 'Livrée', heure: '11:20', montant: 74000 }
];

export const roomServiceCatalog = [
  { id: 'RSC1', nom: 'Petit-déjeuner Continental', categorie: 'Repas', prix: 14000, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&q=80' },
  { id: 'RSC2', nom: 'Plateau de Fruits Frais', categorie: 'Repas', prix: 9000, image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=500&q=80' },
  { id: 'RSC3', nom: 'Kit Blanchisserie Express', categorie: 'Blanchisserie', prix: 12000, image: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=500&q=80' },
  { id: 'RSC4', nom: 'Set Bienvenue (savon, shampoing)', categorie: 'Produits d’accueil', prix: 5000, image: 'https://images.unsplash.com/photo-1522336284037-91f7da073525?w=500&q=80' }
];

// ---------------------------------------------------------------------------
// Événements
// ---------------------------------------------------------------------------
export const events = [
  { id: 'EV-01', type: 'Mariage', client: 'Famille Kalubi', salle: 'Salle Fleuve (200 pers.)', date: '2026-08-15', traiteur: 'Interne', statut: 'Confirmé', montant: 4_200_000 },
  { id: 'EV-02', type: 'Séminaire', client: 'Banque Centrale RDC', salle: 'Salle Baobab (80 pers.)', date: '2026-08-09', traiteur: 'Interne', statut: 'Confirmé', montant: 1_850_000 },
  { id: 'EV-03', type: 'Conférence', client: 'ONG WaterAid', salle: 'Salle Congo (120 pers.)', date: '2026-08-22', traiteur: 'Externe', statut: 'En option', montant: 2_600_000 },
  { id: 'EV-04', type: 'Anniversaire', client: 'M. Serge Okito', salle: 'Terrasse Piscine', date: '2026-08-05', traiteur: 'Interne', statut: 'En attente', montant: 680_000 }
];

// ---------------------------------------------------------------------------
// Achats
// ---------------------------------------------------------------------------
export const purchaseRequests = [
  { id: 'PA-118', produit: 'Eau minérale (carton x24)', quantite: 80, demandeur: 'Responsable Stock', etape: 'Demande', fournisseur: 'Kin Beverages' },
  { id: 'PA-119', produit: 'Détergent multi-surfaces', quantite: 40, demandeur: 'Gouvernante', etape: 'Validation', fournisseur: 'CleanPro RDC' },
  { id: 'PA-120', produit: 'Riz parfumé (sac 25kg)', quantite: 20, demandeur: 'Chef Cuisine', etape: 'Bon de commande', fournisseur: 'Congo Agro Supply' },
  { id: 'PA-121', produit: 'Serviettes de bain', quantite: 100, demandeur: 'Gouvernante', etape: 'Réception', fournisseur: 'Textile Plus' }
];

export const purchaseSteps = ['Demande', 'Validation', 'Bon de commande', 'Réception'];

// ---------------------------------------------------------------------------
// QR Code
// ---------------------------------------------------------------------------
export const qrCodes = [
  { id: 'QR-CH-101', type: 'Chambre', cible: 'Chambre R101', scans: 128, statut: 'Actif' },
  { id: 'QR-MENU-RS', type: 'Menu Restaurant', cible: 'Menu digital salle & chambre', scans: 964, statut: 'Actif' },
  { id: 'QR-FACT-402', type: 'Facture', cible: 'Facture RSV-402', scans: 3, statut: 'Actif' },
  { id: 'QR-ACT-SPA', type: 'Activité', cible: 'Spa & Massage', scans: 211, statut: 'Actif' },
  { id: 'QR-CH-305', type: 'Chambre', cible: 'Chambre R305', scans: 0, statut: 'Inactif' }
];

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const notifications = [
  { id: 1, titre: 'Réservation confirmée', destinataire: 'Mme. Grace Ilunga', canal: 'Push + Email', heure: '08:12', statut: 'Envoyée' },
  { id: 2, titre: 'Chambre prête', destinataire: 'M. Serge Okito', canal: 'Push', heure: '10:40', statut: 'Envoyée' },
  { id: 3, titre: 'Commande prête', destinataire: 'Ch. 306 — Restaurant', canal: 'Push', heure: '11:47', statut: 'Lue' },
  { id: 4, titre: 'Paiement reçu', destinataire: 'Famille Muyaya', canal: 'Email', heure: '11:52', statut: 'Envoyée' },
  { id: 5, titre: 'Stock critique — Eau minérale', destinataire: 'Responsable Stock', canal: 'Push interne', heure: '09:05', statut: 'En attente' }
];

// ---------------------------------------------------------------------------
// Intelligence Artificielle
// ---------------------------------------------------------------------------
export const previsionOccupation = [
  { jour: 'Ven', reel: 90, prevision: 90 },
  { jour: 'Sam', reel: 96, prevision: 96 },
  { jour: 'Dim', reel: 84, prevision: 84 },
  { jour: 'Lun', reel: null, prevision: 74 },
  { jour: 'Mar', reel: null, prevision: 79 },
  { jour: 'Mer', reel: null, prevision: 88 }
];

export const previsionVentes = [
  { jour: 'Ven', restaurant: 4_800_000, bar: 1_400_000 },
  { jour: 'Sam', restaurant: 5_600_000, bar: 1_950_000 },
  { jour: 'Dim', restaurant: 4_100_000, bar: 1_100_000 },
  { jour: 'Lun', restaurant: 3_400_000, bar: 780_000 },
  { jour: 'Mar', restaurant: 3_700_000, bar: 860_000 },
  { jour: 'Mer', restaurant: 4_300_000, bar: 1_050_000 }
];

export const produitsPopulaires = [
  { nom: 'Poulet Braisé', ventes: 214 },
  { nom: 'Mojito Premium', ventes: 176 },
  { nom: 'Pizza Margherita', ventes: 158 },
  { nom: 'Filet de Tilapia Grillé', ventes: 121 }
];

export const clientsVIP = [
  { nom: 'Mme. Grace Ilunga', score: 96, sejours: 9, depenses: 3_980_000 },
  { nom: 'M. Kanyinda Tshibola', score: 89, sejours: 6, depenses: 2_450_000 },
  { nom: 'Mme. Aline Bofando', score: 71, sejours: 3, depenses: 1_120_000 }
];

export const alertesFraude = [
  { id: 1, description: 'Écart de caisse de 45 000 FC détecté au shift du soir', niveau: 'Élevé', heure: '20:14' },
  { id: 2, description: 'Trois annulations de facture sur le même poste en 1h', niveau: 'Moyen', heure: '15:02' }
];

// ---------------------------------------------------------------------------
// Multi-Hôtels
// ---------------------------------------------------------------------------
export const hotels = [
  { id: 'H1', nom: 'Hôtel Fleuve — Kinshasa', chambres: 116, occupation: 84, revenus: 9_640_000, actif: true },
  { id: 'H2', nom: 'Hôtel Lac Kivu — Goma', chambres: 64, occupation: 71, revenus: 4_120_000, actif: true },
  { id: 'H3', nom: 'Hôtel Baobab — Lubumbashi', chambres: 88, occupation: 63, revenus: 5_380_000, actif: true }
];

// ---------------------------------------------------------------------------
// Rapports
// ---------------------------------------------------------------------------
export const paymentMethods = [
  'M-Pesa',
  'Orange Money',
  'Airtel Money',
  'Africell Money',
  'Visa',
  'Mastercard',
  'Virement bancaire',
  'Espèces',
  'Autre'
];

export const auditLogs = [
  { id: 1, timestamp: '2026-08-01 08:12', user: 'Super Admin', action: 'Création utilisateur', module: 'Utilisateurs', status: 'Réussi' },
  { id: 2, timestamp: '2026-08-01 09:03', user: 'Manager', action: 'Validation réservation', module: 'Réservations', status: 'Réussi' },
  { id: 3, timestamp: '2026-08-01 09:45', user: 'Super Admin', action: 'Modification rôle', module: 'Rôles & Permissions', status: 'Réussi' },
  { id: 4, timestamp: '2026-08-01 10:22', user: 'Manager', action: 'Clôture facture', module: 'Facturation', status: 'Réussi' },
  { id: 5, timestamp: '2026-08-01 10:48', user: 'Manager', action: 'Paiement en attente détecté', module: 'Paiements', status: 'Réussi' }
];

export const portalClient = { clientId: 'C001', roomId: 'R101' };

export const clientInvoice = [
  { label: 'Hébergement — Suite Présidentielle (4 nuits)', montant: 1_920_000 },
  { label: 'Room Service', montant: 32000 },
  { label: 'Spa & Massage', montant: 45000 },
  { label: 'Mini-bar', montant: 18000 }
];

export const myRequests = [
  { id: 1, type: 'Room Service', detail: 'Filet de Tilapia x1, Jus de Fruits Frais x2', statut: 'Nouvelle', heure: '12:10' },
  { id: 2, type: 'Spa & Massage', detail: 'Réservé pour 16h00 aujourd’hui', statut: 'Confirmé', heure: '09:20' },
  { id: 3, type: 'Taxi', detail: 'Départ aéroport prévu à 18h00', statut: 'En attente', heure: '08:00' }
];

export const rapports = [
  { id: 1, nom: 'Rapport d’occupation mensuel', periode: 'Juillet 2026', genere: '2026-07-28', format: 'PDF' },
  { id: 2, nom: 'Chiffre d’affaires consolidé', periode: 'Juillet 2026', genere: '2026-07-28', format: 'Excel' },
  { id: 3, nom: 'Rapport RH & présence', periode: 'Juillet 2026', genere: '2026-07-27', format: 'PDF' },
  { id: 4, nom: 'Rapport de stock & pertes', periode: 'Semaine 30', genere: '2026-07-26', format: 'Excel' }
];

// ---------------------------------------------------------------------------
// Paiements (Super Admin & Manager) — reliés aux réservations / commandes
// ---------------------------------------------------------------------------
export const payments = [
  { id: 'PAY-1001', reference: 'RS-13082', client: 'M. Kanyinda Tshibola', type: 'Réservation', methode: 'Visa', montant: 1_920_000, statut: 'Payé', date: '2026-07-29' },
  { id: 'PAY-1002', reference: 'CMD-221', client: 'Famille Muyaya', type: 'Restaurant', methode: 'M-Pesa', montant: 84_000, statut: 'Payé', date: '2026-07-29' },
  { id: 'PAY-1003', reference: 'RS-13084', client: 'Mme. Aline Bofando', type: 'Réservation', methode: 'Orange Money', montant: 920_000, statut: 'En attente', date: '2026-07-29' },
  { id: 'PAY-1004', reference: 'BAR-158', client: 'M. Serge Okito', type: 'Bar', methode: 'Airtel Money', montant: 23_000, statut: 'Payé', date: '2026-07-30' },
  { id: 'PAY-1005', reference: 'ACT-221', client: 'Mme. Grace Ilunga', type: 'Activité', methode: 'Mastercard', montant: 90_000, statut: 'En attente', date: '2026-07-30' },
  { id: 'PAY-1006', reference: 'RS-13086', client: 'Mme. Grace Ilunga', type: 'Réservation', methode: 'Virement bancaire', montant: 1_280_000, statut: 'Payé', date: '2026-07-28' },
  { id: 'PAY-1007', reference: 'CMD-224', client: 'M. Kanyinda Tshibola', type: 'Restaurant', methode: 'Espèces', montant: 36_000, statut: 'Payé', date: '2026-07-30' },
  { id: 'PAY-1008', reference: 'RS-13085', client: 'M. Serge Okito', type: 'Réservation', methode: 'Africell Money', montant: 360_000, statut: 'Payé', date: '2026-07-29' }
];

export const revenusMensuels = [
  { mois: 'Jan', chambres: 4_200_000, restaurant: 2_900_000, bar: 740_000 },
  { mois: 'Fév', chambres: 4_600_000, restaurant: 3_100_000, bar: 810_000 },
  { mois: 'Mar', chambres: 4_950_000, restaurant: 3_400_000, bar: 900_000 },
  { mois: 'Avr', chambres: 5_100_000, restaurant: 3_600_000, bar: 960_000 },
  { mois: 'Mai', chambres: 5_350_000, restaurant: 3_900_000, bar: 1_020_000 },
  { mois: 'Juin', chambres: 5_200_000, restaurant: 4_100_000, bar: 1_100_000 },
  { mois: 'Juil', chambres: 5_400_000, restaurant: 4_320_000, bar: 1_180_000 }
];

export const reservationsParMois = [
  { mois: 'Jan', reservations: 148 },
  { mois: 'Fév', reservations: 162 },
  { mois: 'Mar', reservations: 178 },
  { mois: 'Avr', reservations: 184 },
  { mois: 'Mai', reservations: 201 },
  { mois: 'Juin', reservations: 196 },
  { mois: 'Juil', reservations: 213 }
];

export const repartitionPaiements = [
  { name: 'M-Pesa', value: 28 },
  { name: 'Orange Money', value: 18 },
  { name: 'Visa', value: 16 },
  { name: 'Mastercard', value: 12 },
  { name: 'Airtel Money', value: 9 },
  { name: 'Espèces', value: 10 },
  { name: 'Virement', value: 5 },
  { name: 'Africell', value: 2 }
];

export const consommationRestoBar = [
  { jour: 'Lun', restaurant: 3_100_000, bar: 720_000 },
  { jour: 'Mar', restaurant: 3_400_000, bar: 810_000 },
  { jour: 'Mer', restaurant: 3_750_000, bar: 900_000 },
  { jour: 'Jeu', restaurant: 3_900_000, bar: 1_020_000 },
  { jour: 'Ven', restaurant: 4_500_000, bar: 1_350_000 },
  { jour: 'Sam', restaurant: 5_300_000, bar: 1_850_000 },
  { jour: 'Dim', restaurant: 4_100_000, bar: 1_100_000 }
];

// ---------------------------------------------------------------------------
// Gestion des utilisateurs & permissions
// ---------------------------------------------------------------------------
export const systemUsers = [
  { id: 'U001', nom: 'Patrick Mwamba', email: 'p.mwamba@sh360.cd', role: 'Super Admin', statut: 'Actif', derniereConnexion: '2026-07-30 08:12' },
  { id: 'U002', nom: 'Sarah Nzuzi', email: 's.nzuzi@sh360.cd', role: 'Manager', statut: 'Actif', derniereConnexion: '2026-07-30 07:40' },
  { id: 'U003', nom: 'David Kalonji', email: 'd.kalonji@sh360.cd', role: 'Manager', statut: 'Actif', derniereConnexion: '2026-07-29 18:22' },
  { id: 'U004', nom: 'Chantal Ilunga', email: 'c.ilunga@sh360.cd', role: 'Manager', statut: 'Inactif', derniereConnexion: '2026-07-27 15:03' }
];

export const permissionMatrix = {
  'Super Admin': { full: true, label: 'Accès complet — tous les modules', modules: ['Dashboard', 'Utilisateurs', 'Rôles', 'Chambres', 'Réservations', 'Restaurant', 'Bar', 'Activités', 'Conciergerie', 'Check-in/out', 'Facturation', 'Paiements', 'Stocks', 'RH', 'Rapports', 'QR Code', 'Paramètres', 'Audit', 'Notifications', 'Support'] },
  Manager: { full: false, label: 'Accès opérationnel — pas de gestion système', modules: ['Dashboard', 'Réservations', 'Chambres', 'Restaurant', 'Bar', 'Activités', 'Conciergerie', 'Check-in/out', 'Clients', 'Facturation', 'Paiements', 'Personnel', 'Planning', 'Rapports', 'Notifications', 'Profil', 'Support'] },
  Client: { full: false, label: 'Espace personnel — séjour, commandes, factures', modules: ['Accueil', 'Chambres', 'Réservations', 'Restaurant', 'Bar', 'Activités', 'Conciergerie', 'Commandes', 'Factures', 'Paiements', 'Profil', 'Notifications', 'Support'] }
};

// ---------------------------------------------------------------------------
// Planning des agents (Manager)
// ---------------------------------------------------------------------------
export const agentShifts = [
  { id: 1, employe: 'Patrick Mwamba', poste: 'Réceptionniste', jour: 'Lun', creneau: '06h – 14h', tache: 'Accueil & check-in', statut: 'Planifié' },
  { id: 2, employe: 'Patrick Mwamba', poste: 'Réceptionniste', jour: 'Mar', creneau: '14h – 22h', tache: 'Standard', statut: 'Planifié' },
  { id: 3, employe: 'Sarah Nzuzi', poste: 'Chef de Rang', jour: 'Lun', creneau: '10h – 18h', tache: 'Service déjeuner', statut: 'Confirmé' },
  { id: 4, employe: 'Sarah Nzuzi', poste: 'Chef de Rang', jour: 'Mer', creneau: '18h – 23h', tache: 'Service dîner', statut: 'En attente' },
  { id: 5, employe: 'David Kalonji', poste: 'Barman', jour: 'Lun', creneau: '16h – 00h', tache: 'Bar soirée', statut: 'Confirmé' },
  { id: 6, employe: 'Chantal Ilunga', poste: 'Gouvernante', jour: 'Lun', creneau: '06h – 14h', tache: 'Nettoyage étage 1', statut: 'Planifié' },
  { id: 7, employe: 'Chantal Ilunga', poste: 'Gouvernante', jour: 'Mar', creneau: '06h – 14h', tache: 'Nettoyage étage 2', statut: 'Planifié' },
  { id: 8, employe: 'Joel Tshimanga', poste: 'Technicien', jour: 'Mer', creneau: '08h – 16h', tache: 'Maintenance préventive', statut: 'En attente' }
];

export const teamTasks = [
  { id: 1, tache: 'Préparer l’arrivée famille Muyaya (ch. R204)', responsable: 'Chantal Ilunga', statut: 'En cours', priorite: 'Haute' },
  { id: 2, tache: 'Vérifier le mini-bar ch. R101', responsable: 'David Kalonji', statut: 'À faire', priorite: 'Moyenne' },
  { id: 3, tache: 'Finaliser le rapport d’occupation', responsable: 'Patrick Mwamba', statut: 'En cours', priorite: 'Haute' },
  { id: 4, tache: 'Commande fournisseur — eau minérale', responsable: 'Sarah Nzuzi', statut: 'En attente', priorite: 'Basse' }
];

// ---------------------------------------------------------------------------
// Espace Client — vitrine & premium
// ---------------------------------------------------------------------------
export const testimonials = [
  { id: 1, nom: 'M. Kanyinda Tshibola', note: 5, avis: 'Service impeccable, suite magnifique et personnel aux petits soins. Une expérience digne des plus grands palaces.', date: '2026-07-20' },
  { id: 2, nom: 'Mme. Grace Ilunga', note: 5, avis: 'Le spa et le restaurant sont exceptionnels. Je recommande vivement l’excursion sur le fleuve !', date: '2026-07-15' },
  { id: 3, nom: 'Famille Muyaya', note: 4, avis: 'Chambre familiale spacieuse, idéale avec des enfants. La piscine est superbe.', date: '2026-07-10' },
  { id: 4, nom: 'M. Serge Okito', note: 5, avis: 'Cadre professionnel parfait pour un séjour d’affaires. Le wifi est très rapide.', date: '2026-07-02' }
];

export const gallery = [
  { id: 1, titre: 'Vue extérieure', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=700&q=80' },
  { id: 2, titre: 'Suite Présidentielle', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700&q=80' },
  { id: 3, titre: 'Piscine', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=80' },
  { id: 4, titre: 'Restaurant', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80' },
  { id: 5, titre: 'Bar', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=700&q=80' },
  { id: 6, titre: 'Spa', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=700&q=80' }
];

export const hotelContact = {
  telephone: '+243 81 555 0101',
  email: 'contact@hotelfleuve.cd',
  adresse: 'Avenue du Fleuve, Gombe — Kinshasa, RDC',
  mapsUrl: 'https://www.google.com/maps?q=Kinshasa+Gombe+Avenue+du+Fleuve',
  reseaux: [
    { nom: 'Facebook', url: 'https://facebook.com' },
    { nom: 'Instagram', url: 'https://instagram.com' },
    { nom: 'X (Twitter)', url: 'https://x.com' },
    { nom: 'LinkedIn', url: 'https://linkedin.com' }
  ]
};

export const clientOrdersData = [
  { id: 'CMD-221', type: 'Restaurant', items: [{ nom: 'Poulet Braisé', quantite: 1, prix: 18000 }, { nom: 'Salade César', quantite: 2, prix: 9000 }], total: 36000, statut: 'Livrée', date: '2026-07-29', methode: 'M-Pesa' },
  { id: 'CMD-223', type: 'Restaurant', items: [{ nom: 'Fondant au Chocolat', quantite: 2, prix: 8000 }], total: 16000, statut: 'En préparation', date: '2026-07-30', methode: 'Espèces' },
  { id: 'BAR-158', type: 'Bar', items: [{ nom: 'Mojito Premium', quantite: 2, prix: 12000 }], total: 24000, statut: 'Livrée', date: '2026-07-29', methode: 'Airtel Money' },
  { id: 'BAR-160', type: 'Bar', items: [{ nom: 'Jus de Fruits Frais', quantite: 3, prix: 5000 }], total: 15000, statut: 'En attente', date: '2026-07-30', methode: 'Orange Money' }
];

export const clientActivitiesData = [
  { id: 'ACT-219', nom: 'Spa & Massage', date: '2026-07-28', statut: 'Terminée', montant: 45000, methode: 'Mastercard' },
  { id: 'ACT-221', nom: 'Excursion Fleuve Congo', date: '2026-08-02', statut: 'Confirmée', montant: 60000, methode: 'Mastercard' },
  { id: 'ACT-224', nom: 'Espace Coworking', date: '2026-08-03', statut: 'En attente', montant: 15000, methode: 'En attente' }
];

export const clientInvoicesData = [
  { id: 'INV-2026-07', periode: 'Séjour — Juillet 2026', date: '2026-07-30', lignes: clientInvoice, total: clientInvoice.reduce((s, l) => s + l.montant, 0), statut: 'En attente', methode: 'Visa' },
  { id: 'INV-2026-06', periode: 'Séjour — Juin 2026', date: '2026-06-28', lignes: [{ label: 'Hébergement — Deluxe City View (3 nuits)', montant: 690_000 }, { label: 'Restaurant', montant: 52_000 }, { label: 'Spa', montant: 45_000 }], total: 787_000, statut: 'Payée', methode: 'Visa' },
  { id: 'INV-2026-05', periode: 'Séjour — Mai 2026', date: '2026-05-30', lignes: [{ label: 'Hébergement — Suite Présidentielle (2 nuits)', montant: 960_000 }, { label: 'Bar', montant: 78_000 }], total: 1_038_000, statut: 'Payée', methode: 'Virement bancaire' }
];

export const loyaltyTiers = [
  { nom: 'Standard', pointsRequis: 0, reduction: 0, avantages: ['Enregistrement standard', 'Accès WiFi'] },
  { nom: 'Argent', pointsRequis: 1000, reduction: 5, avantages: ['-5% sur l’hébergement', 'Check-in prioritaire', 'Bienvenue offerte'] },
  { nom: 'Or', pointsRequis: 2000, reduction: 10, avantages: ['-10% sur tous les services', 'Surclassement possible', 'Late check-out offert'] },
  { nom: 'Platine', pointsRequis: 4000, reduction: 15, avantages: ['-15% sur tous les services', 'Suite offerte 1 nuit/an', 'Concierge dédié', 'Accès VIP Lounge'] }
];

export const clientNotifications = [
  { id: 1, titre: 'Réservation confirmée', detail: 'Votre séjour en Suite Présidentielle est confirmé.', heure: '08:12', type: 'succes' },
  { id: 2, titre: 'Chambre prête', detail: 'Votre chambre R101 est prête, bienvenue !', heure: '10:40', type: 'info' },
  { id: 3, titre: 'Paiement reçu', detail: 'Votre paiement M-Pesa de 36 000 FC a été reçu.', heure: '11:52', type: 'succes' },
  { id: 4, titre: 'Promotion spéciale', detail: '-15% sur le spa ce week-end. Offre réservée aux membres Platine.', heure: '14:05', type: 'promo' }
];

export const aiAssistantQuestions = [
  'Quelles chambres sont disponibles ce week-end ?',
  'Que recommandez-vous au restaurant ?',
  'Quelles activités proposez-vous ?',
  'Comment accéder à ma facture ?'
];

export const clientMembership = {
  niveau: 'Or',
  points: 2450,
  pointsVersPlatine: 1550,
  totalSejours: 6,
  depensesTotales: 2_450_000,
  code: 'SH-C001',
  qrPayload: JSON.stringify({ type: 'guest', clientId: 'C001', room: 'R101', membre: 'Or', validite: '2026-12-31' })
};

export const checkinToday = [
  { id: 1, client: 'M. Kanyinda Tshibola', chambre: 'Suite Présidentielle', heure: '14:00', statut: 'Prévu' },
  { id: 2, client: 'Famille Muyaya', chambre: 'Chambre Familiale', heure: '15:30', statut: 'Prévu' },
  { id: 3, client: 'M. Serge Okito', chambre: 'Chambre Standard Twin', heure: '16:00', statut: 'Prévu' }
];

export const checkoutToday = [
  { id: 1, client: 'Mme. Aline Bofando', chambre: 'Deluxe City View', heure: '11:00', statut: 'Effectué' },
  { id: 2, client: 'M. Thomas Kalume', chambre: 'Chambre Deluxe Vue Piscine', heure: '12:30', statut: 'Prévu' }
];
