import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import theme from './theme.js';
import AppLayout from './components/Layout/AppLayout.jsx';
import { AppProvider, AppContext } from './context/AppContext.jsx';
import { getHomePath, hasAnyRole, STAFF_ROLES } from './utils/auth.js';

// Pages globales / admin
import Dashboard from './pages/Dashboard.jsx';
import DashboardManager from './pages/DashboardManager.jsx';
import Reservations from './pages/Reservations.jsx';
import Rooms from './pages/Rooms.jsx';
import CheckInOut from './pages/CheckInOut.jsx';
import Restaurant from './pages/Restaurant.jsx';
import Bar from './pages/Bar.jsx';
import Concierge from './pages/Concierge.jsx';
import Activities from './pages/Activities.jsx';
import CRM from './pages/CRM.jsx';
import Stock from './pages/Stock.jsx';
import Finance from './pages/Finance.jsx';
import HR from './pages/HR.jsx';
import QRCodeModule from './pages/QRCodeModule.jsx';
import Notifications from './pages/Notifications.jsx';
import AI from './pages/AI.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import AuditLogs from './pages/AuditLogs.jsx';
import Support from './pages/Support.jsx';
import Profile from './pages/Profile.jsx';
import Payments from './pages/Payments.jsx';
import PlanningAgents from './pages/PlanningAgents.jsx';
import UsersManagement from './pages/admin/UsersManagement.jsx';
import RolesPermissions from './pages/admin/RolesPermissions.jsx';
import Events from './pages/Events.jsx';
import RoomService from './pages/RoomService.jsx';
import Purchases from './pages/Purchases.jsx';
import MultiHotels from './pages/MultiHotels.jsx';
import Login from './pages/Login.jsx';

// Pages client
import ClientHome from './pages/client/ClientHome.jsx';
import ClientReservations from './pages/client/ClientReservations.jsx';
import ClientOrders from './pages/client/ClientOrders.jsx';
import ClientActivities from './pages/client/ClientActivities.jsx';
import ClientInvoices from './pages/client/ClientInvoices.jsx';
import ClientLoyalty from './pages/client/ClientLoyalty.jsx';
import ClientAI from './pages/client/ClientAI.jsx';
import ClientQR from './pages/client/ClientQR.jsx';
import ClientProfile from './pages/client/ClientProfile.jsx';
import ClientNotifications from './pages/client/ClientNotifications.jsx';
import ClientSupport from './pages/client/ClientSupport.jsx';
import ClientConcierge from './pages/client/ClientConcierge.jsx';

/**
 * Garde de rôle : redirige vers le dashboard du rôle si l'utilisateur
 * tente d'accéder à une zone réservée à un autre rôle.
 */
function RoleGuard({ allowed, children, fallback }) {
  const { userRole } = useContext(AppContext);
  if (hasAnyRole(userRole, allowed)) return children;
  return <Navigate to={fallback || getHomePath(userRole)} replace />;
}

function HomeRouter() {
  const { userRole } = useContext(AppContext);
  return <Navigate to={getHomePath(userRole)} replace />;
}

const ADMIN = ['admin'];
const STAFF = STAFF_ROLES;
const DASHBOARD_STAFF = ['admin', 'accountant', 'receptionist', 'restaurant_manager', 'hr_manager'];
const OPERATIONS_STAFF = ['admin', 'receptionist'];
const RESTAURANT_STAFF = ['admin', 'restaurant_manager', 'waiter', 'receptionist'];
const BAR_STAFF = ['admin', 'barman', 'receptionist'];
const CRM_STAFF = ['admin', 'receptionist', 'restaurant_manager', 'barman'];
const FINANCE_STAFF = ['admin', 'accountant', 'receptionist'];
const HR_STAFF = ['admin', 'hr_manager', 'accountant'];
const STOCK_STAFF = ['admin', 'stock_manager'];
const CLIENT = ['client'];

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomeRouter /> },

      // ---- Super Admin / Manager (opérations partagées) ----
      {
        path: '/dashboard',
        element: <RoleGuard allowed={DASHBOARD_STAFF}><Dashboard /></RoleGuard>,
        handle: { title: 'Dashboard Global', subtitle: 'Vue temps réel de l’ensemble des opérations' }
      },
      {
        path: '/manager',
        element: <RoleGuard allowed={STAFF}><DashboardManager /></RoleGuard>,
        handle: { title: 'Dashboard Manager', subtitle: 'Supervision des opérations quotidiennes et des équipes' }
      },
      {
        path: '/reservations',
        element: <RoleGuard allowed={OPERATIONS_STAFF}><Reservations /></RoleGuard>,
        handle: { title: 'Réservations', subtitle: 'Web, mobile, réception et téléphone — centralisées' }
      },
      {
        path: '/chambres',
        element: <RoleGuard allowed={STAFF}><Rooms /></RoleGuard>,
        handle: { title: 'Chambres', subtitle: 'Catalogue, statuts et disponibilités en direct' }
      },
      {
        path: '/checkin',
        element: <RoleGuard allowed={OPERATIONS_STAFF}><CheckInOut /></RoleGuard>,
        handle: { title: 'Check-in / Check-out', subtitle: 'Arrivées, départs et facturation automatique' }
      },
      {
        path: '/restaurant',
        element: <RoleGuard allowed={RESTAURANT_STAFF}><Restaurant /></RoleGuard>,
        handle: { title: 'Restaurant', subtitle: 'Menu digital, commandes et écran cuisine' }
      },
      {
        path: '/bar',
        element: <RoleGuard allowed={BAR_STAFF}><Bar /></RoleGuard>,
        handle: { title: 'Bar', subtitle: 'Cartes boissons et suivi de stock en temps réel' }
      },
      {
        path: '/concierge',
        element: <RoleGuard allowed={OPERATIONS_STAFF}><Concierge /></RoleGuard>,
        handle: { title: 'Conciergerie', subtitle: 'Services à la demande pour les clients' }
      },
      {
        path: '/activites',
        element: <RoleGuard allowed={STAFF}><Activities /></RoleGuard>,
        handle: { title: 'Activités', subtitle: 'Spa, piscine, excursions et loisirs' }
      },
      {
        path: '/crm',
        element: <RoleGuard allowed={CRM_STAFF}><CRM /></RoleGuard>,
        handle: { title: 'CRM Client', subtitle: 'Profils, fidélité et historique de séjour' }
      },
      {
        path: '/stock',
        element: <RoleGuard allowed={STOCK_STAFF}><Stock /></RoleGuard>,
        handle: { title: 'Stock & Achats', subtitle: 'Inventaire, seuils critiques et fournisseurs' }
      },
      {
        path: '/finance',
        element: <RoleGuard allowed={FINANCE_STAFF}><Finance /></RoleGuard>,
        handle: { title: 'Finance & Facturation', subtitle: 'Recettes, dépenses et journal de caisse' }
      },
      {
        path: '/paiements',
        element: <RoleGuard allowed={FINANCE_STAFF}><Payments /></RoleGuard>,
        handle: { title: 'Paiements', subtitle: 'Toutes les transactions : réservations, commandes, activités' }
      },
      {
        path: '/rh',
        element: <RoleGuard allowed={HR_STAFF}><HR /></RoleGuard>,
        handle: { title: 'Ressources Humaines', subtitle: 'Personnel, présence et paie' }
      },
      {
        path: '/planning',
        element: <RoleGuard allowed={HR_STAFF}><PlanningAgents /></RoleGuard>,
        handle: { title: 'Planning des Agents', subtitle: 'Shifts, tâches et suivi d’équipe' }
      },
      {
        path: '/evenements',
        element: <RoleGuard allowed={OPERATIONS_STAFF}><Events /></RoleGuard>,
        handle: { title: 'Événements', subtitle: 'Mariages, séminaires, conférences et célébrations' }
      },
      {
        path: '/room-service',
        element: <RoleGuard allowed={STAFF}><RoomService /></RoleGuard>,
        handle: { title: 'Room Service', subtitle: 'Commandes chambres et catalogue QR Code' }
      },
      {
        path: '/achats',
        element: <RoleGuard allowed={STOCK_STAFF}><Purchases /></RoleGuard>,
        handle: { title: 'Achats & Fournisseurs', subtitle: 'Demandes d’achat, validation et réception' }
      },
      {
        path: '/multi-hotels',
        element: <RoleGuard allowed={ADMIN}><MultiHotels /></RoleGuard>,
        handle: { title: 'Multi-Hôtels', subtitle: 'Pilotage consolidé du groupe' }
      },
      {
        path: '/rapports',
        element: <RoleGuard allowed={FINANCE_STAFF}><Reports /></RoleGuard>,
        handle: { title: 'Rapports & Statistiques', subtitle: 'Exports et rapports consolidés' }
      },
      {
        path: '/qr-code',
        element: <RoleGuard allowed={ADMIN}><QRCodeModule /></RoleGuard>,
        handle: { title: 'QR Code Hôtel', subtitle: 'Chambre, menu, facture et activités' }
      },
      {
        path: '/notifications',
        element: <RoleGuard allowed={STAFF}><Notifications /></RoleGuard>,
        handle: { title: 'Notifications', subtitle: 'Journal des notifications push envoyées' }
      },
      {
        path: '/ia',
        element: <RoleGuard allowed={ADMIN}><AI /></RoleGuard>,
        handle: { title: 'Intelligence Artificielle', subtitle: 'Prévisions, analyses et assistant virtuel' }
      },
      {
        path: '/audit-logs',
        element: <RoleGuard allowed={ADMIN}><AuditLogs /></RoleGuard>,
        handle: { title: 'Journal d’Audit', subtitle: 'Suivi des connexions et actions administratives' }
      },
      {
        path: '/parametres',
        element: <RoleGuard allowed={ADMIN}><Settings /></RoleGuard>,
        handle: { title: 'Paramètres Système', subtitle: 'Établissement, utilisateurs, sécurité et notifications' }
      },
      {
        path: '/support',
        element: <RoleGuard allowed={STAFF}><Support /></RoleGuard>,
        handle: { title: 'Support', subtitle: 'Assistance, tickets et demandes' }
      },
      {
        path: '/profile',
        element: <RoleGuard allowed={STAFF}><Profile /></RoleGuard>,
        handle: { title: 'Mon profil', subtitle: 'Informations personnelles du compte' }
      },

      // ---- Admin - Super Admin uniquement ----
      {
        path: '/admin/utilisateurs',
        element: <RoleGuard allowed={['admin', 'hr_manager']}><UsersManagement /></RoleGuard>,
        handle: { title: 'Gestion des Utilisateurs', subtitle: 'Création, activation et affectation des comptes' }
      },
      {
        path: '/admin/roles',
        element: <RoleGuard allowed={ADMIN}><RolesPermissions /></RoleGuard>,
        handle: { title: 'Rôles & Permissions', subtitle: 'Matrice de permissions par rôle (RBAC)' }
      },

      // ---- Espace Client ----
      {
        path: '/client',
        element: <RoleGuard allowed={CLIENT}><ClientHome /></RoleGuard>,
        handle: { title: 'Accueil', subtitle: 'Bienvenue à l’Hôtel Fleuve — Kinshasa' }
      },
      {
        path: '/client/chambres',
        element: <RoleGuard allowed={CLIENT}><Rooms /></RoleGuard>,
        handle: { title: 'Chambres', subtitle: 'Nos chambres et suites' }
      },
      {
        path: '/client/reservations',
        element: <RoleGuard allowed={CLIENT}><ClientReservations /></RoleGuard>,
        handle: { title: 'Mes Réservations', subtitle: 'Vos séjours et réservations' }
      },
      {
        path: '/client/restaurant',
        element: <RoleGuard allowed={CLIENT}><Restaurant /></RoleGuard>,
        handle: { title: 'Restaurant', subtitle: 'Menu digital & commandes' }
      },
      {
        path: '/client/bar',
        element: <RoleGuard allowed={CLIENT}><Bar /></RoleGuard>,
        handle: { title: 'Bar', subtitle: 'Cocktails, vins et boissons' }
      },
      {
        path: '/client/activites',
        element: <RoleGuard allowed={CLIENT}><ClientActivities /></RoleGuard>,
        handle: { title: 'Mes Activités', subtitle: 'Spa, piscine, excursions, coworking' }
      },
      {
        path: '/client/concierge',
        element: <RoleGuard allowed={CLIENT}><ClientConcierge /></RoleGuard>,
        handle: { title: 'Conciergerie', subtitle: 'Services à la demande' }
      },
      {
        path: '/client/commandes',
        element: <RoleGuard allowed={CLIENT}><ClientOrders /></RoleGuard>,
        handle: { title: 'Mes Commandes', subtitle: 'Restaurant & Bar' }
      },
      {
        path: '/client/factures',
        element: <RoleGuard allowed={CLIENT}><ClientInvoices /></RoleGuard>,
        handle: { title: 'Mes Factures', subtitle: 'Télécharger, imprimer, historique' }
      },
      {
        path: '/client/paiements',
        element: <RoleGuard allowed={CLIENT}><Payments /></RoleGuard>,
        handle: { title: 'Paiements', subtitle: 'M-Pesa, Orange Money, cartes, virement, espèces' }
      },
      {
        path: '/client/qr',
        element: <RoleGuard allowed={CLIENT}><ClientQR /></RoleGuard>,
        handle: { title: 'QR Code Personnel', subtitle: 'Check-in rapide et accès aux services' }
      },
      {
        path: '/client/fidelite',
        element: <RoleGuard allowed={CLIENT}><ClientLoyalty /></RoleGuard>,
        handle: { title: 'Programme de Fidélité', subtitle: 'Points, réductions et récompenses' }
      },
      {
        path: '/client/ia',
        element: <RoleGuard allowed={CLIENT}><ClientAI /></RoleGuard>,
        handle: { title: 'Assistant IA', subtitle: 'Votre concierge virtuel 24h/24' }
      },
      {
        path: '/client/profil',
        element: <RoleGuard allowed={CLIENT}><ClientProfile /></RoleGuard>,
        handle: { title: 'Mon Profil', subtitle: 'Informations personnelles & préférences' }
      },
      {
        path: '/client/notifications',
        element: <RoleGuard allowed={CLIENT}><ClientNotifications /></RoleGuard>,
        handle: { title: 'Notifications', subtitle: 'Alertes et promotions personnalisées' }
      },
      {
        path: '/client/support',
        element: <RoleGuard allowed={CLIENT}><ClientSupport /></RoleGuard>,
        handle: { title: 'Support', subtitle: 'Contacter l’hôtel et assistance' }
      },

      // 404
      {
        path: '*',
        element: <HomeRouter />,
        handle: { title: 'Page introuvable', subtitle: 'Redirection automatique' }
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AppProvider>
  </React.StrictMode>
);
