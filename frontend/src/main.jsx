import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import theme from './theme.js';
import AppLayout from './components/Layout/AppLayout.jsx';
import { AppProvider, AppContext } from './context/AppContext.jsx';

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
  if (allowed.includes(userRole)) return children;
  return <Navigate to={fallback} replace />;
}

function HomeRouter() {
  const { userRole } = useContext(AppContext);
  if (userRole === 'Client') return <Navigate to="/client" replace />;
  if (userRole === 'Manager') return <Navigate to="/manager" replace />;
  return <Navigate to="/dashboard" replace />;
}

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomeRouter /> },

      // ---- Super Admin / Manager (opérations partagées) ----
      {
        path: '/dashboard',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client"><Dashboard /></RoleGuard>,
        handle: { title: 'Dashboard Global', subtitle: 'Vue temps réel de l’ensemble des opérations' }
      },
      {
        path: '/manager',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client"><DashboardManager /></RoleGuard>,
        handle: { title: 'Dashboard Manager', subtitle: 'Supervision des opérations quotidiennes et des équipes' }
      },
      {
        path: '/reservations',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client/reservations"><Reservations /></RoleGuard>,
        handle: { title: 'Réservations', subtitle: 'Web, mobile, réception et téléphone — centralisées' }
      },
      {
        path: '/chambres',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client/chambres"><Rooms /></RoleGuard>,
        handle: { title: 'Chambres', subtitle: 'Catalogue, statuts et disponibilités en direct' }
      },
      {
        path: '/checkin',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client"><CheckInOut /></RoleGuard>,
        handle: { title: 'Check-in / Check-out', subtitle: 'Arrivées, départs et facturation automatique' }
      },
      {
        path: '/restaurant',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client/restaurant"><Restaurant /></RoleGuard>,
        handle: { title: 'Restaurant', subtitle: 'Menu digital, commandes et écran cuisine' }
      },
      {
        path: '/bar',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client/bar"><Bar /></RoleGuard>,
        handle: { title: 'Bar', subtitle: 'Cartes boissons et suivi de stock en temps réel' }
      },
      {
        path: '/concierge',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client/concierge"><Concierge /></RoleGuard>,
        handle: { title: 'Conciergerie', subtitle: 'Services à la demande pour les clients' }
      },
      {
        path: '/activites',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client/activites"><Activities /></RoleGuard>,
        handle: { title: 'Activités', subtitle: 'Spa, piscine, excursions et loisirs' }
      },
      {
        path: '/crm',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client"><CRM /></RoleGuard>,
        handle: { title: 'CRM Client', subtitle: 'Profils, fidélité et historique de séjour' }
      },
      {
        path: '/stock',
        element: <RoleGuard allowed={['Super Admin']} fallback="/manager"><Stock /></RoleGuard>,
        handle: { title: 'Stock & Achats', subtitle: 'Inventaire, seuils critiques et fournisseurs' }
      },
      {
        path: '/finance',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client"><Finance /></RoleGuard>,
        handle: { title: 'Finance & Facturation', subtitle: 'Recettes, dépenses et journal de caisse' }
      },
      {
        path: '/paiements',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client/paiements"><Payments /></RoleGuard>,
        handle: { title: 'Paiements', subtitle: 'Toutes les transactions : réservations, commandes, activités' }
      },
      {
        path: '/rh',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client"><HR /></RoleGuard>,
        handle: { title: 'Ressources Humaines', subtitle: 'Personnel, présence et paie' }
      },
      {
        path: '/planning',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client"><PlanningAgents /></RoleGuard>,
        handle: { title: 'Planning des Agents', subtitle: 'Shifts, tâches et suivi d’équipe' }
      },
      {
        path: '/rapports',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client"><Reports /></RoleGuard>,
        handle: { title: 'Rapports & Statistiques', subtitle: 'Exports et rapports consolidés' }
      },
      {
        path: '/qr-code',
        element: <RoleGuard allowed={['Super Admin']} fallback="/manager"><QRCodeModule /></RoleGuard>,
        handle: { title: 'QR Code Hôtel', subtitle: 'Chambre, menu, facture et activités' }
      },
      {
        path: '/notifications',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client/notifications"><Notifications /></RoleGuard>,
        handle: { title: 'Notifications', subtitle: 'Journal des notifications push envoyées' }
      },
      {
        path: '/ia',
        element: <RoleGuard allowed={['Super Admin']} fallback="/manager"><AI /></RoleGuard>,
        handle: { title: 'Intelligence Artificielle', subtitle: 'Prévisions, analyses et assistant virtuel' }
      },
      {
        path: '/audit-logs',
        element: <RoleGuard allowed={['Super Admin']} fallback="/manager"><AuditLogs /></RoleGuard>,
        handle: { title: 'Journal d’Audit', subtitle: 'Suivi des connexions et actions administratives' }
      },
      {
        path: '/parametres',
        element: <RoleGuard allowed={['Super Admin']} fallback="/manager"><Settings /></RoleGuard>,
        handle: { title: 'Paramètres Système', subtitle: 'Établissement, utilisateurs, sécurité et notifications' }
      },
      {
        path: '/support',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client/support"><Support /></RoleGuard>,
        handle: { title: 'Support', subtitle: 'Assistance, tickets et demandes' }
      },
      {
        path: '/profile',
        element: <RoleGuard allowed={['Super Admin', 'Manager']} fallback="/client/profil"><Profile /></RoleGuard>,
        handle: { title: 'Mon profil', subtitle: 'Informations personnelles du compte' }
      },

      // ---- Admin - Super Admin uniquement ----
      {
        path: '/admin/utilisateurs',
        element: <RoleGuard allowed={['Super Admin']} fallback="/manager"><UsersManagement /></RoleGuard>,
        handle: { title: 'Gestion des Utilisateurs', subtitle: 'Création, activation et affectation des comptes' }
      },
      {
        path: '/admin/roles',
        element: <RoleGuard allowed={['Super Admin']} fallback="/manager"><RolesPermissions /></RoleGuard>,
        handle: { title: 'Rôles & Permissions', subtitle: 'Matrice de permissions par rôle (RBAC)' }
      },

      // ---- Espace Client ----
      {
        path: '/client',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientHome /></RoleGuard>,
        handle: { title: 'Accueil', subtitle: 'Bienvenue à l’Hôtel Fleuve — Kinshasa' }
      },
      {
        path: '/client/chambres',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><Rooms /></RoleGuard>,
        handle: { title: 'Chambres', subtitle: 'Nos chambres et suites' }
      },
      {
        path: '/client/reservations',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientReservations /></RoleGuard>,
        handle: { title: 'Mes Réservations', subtitle: 'Vos séjours et réservations' }
      },
      {
        path: '/client/restaurant',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><Restaurant /></RoleGuard>,
        handle: { title: 'Restaurant', subtitle: 'Menu digital & commandes' }
      },
      {
        path: '/client/bar',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><Bar /></RoleGuard>,
        handle: { title: 'Bar', subtitle: 'Cocktails, vins et boissons' }
      },
      {
        path: '/client/activites',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientActivities /></RoleGuard>,
        handle: { title: 'Mes Activités', subtitle: 'Spa, piscine, excursions, coworking' }
      },
      {
        path: '/client/concierge',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientConcierge /></RoleGuard>,
        handle: { title: 'Conciergerie', subtitle: 'Services à la demande' }
      },
      {
        path: '/client/commandes',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientOrders /></RoleGuard>,
        handle: { title: 'Mes Commandes', subtitle: 'Restaurant & Bar' }
      },
      {
        path: '/client/factures',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientInvoices /></RoleGuard>,
        handle: { title: 'Mes Factures', subtitle: 'Télécharger, imprimer, historique' }
      },
      {
        path: '/client/paiements',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><Payments /></RoleGuard>,
        handle: { title: 'Paiements', subtitle: 'M-Pesa, Orange Money, cartes, virement, espèces' }
      },
      {
        path: '/client/qr',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientQR /></RoleGuard>,
        handle: { title: 'QR Code Personnel', subtitle: 'Check-in rapide et accès aux services' }
      },
      {
        path: '/client/fidelite',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientLoyalty /></RoleGuard>,
        handle: { title: 'Programme de Fidélité', subtitle: 'Points, réductions et récompenses' }
      },
      {
        path: '/client/ia',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientAI /></RoleGuard>,
        handle: { title: 'Assistant IA', subtitle: 'Votre concierge virtuel 24h/24' }
      },
      {
        path: '/client/profil',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientProfile /></RoleGuard>,
        handle: { title: 'Mon Profil', subtitle: 'Informations personnelles & préférences' }
      },
      {
        path: '/client/notifications',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientNotifications /></RoleGuard>,
        handle: { title: 'Notifications', subtitle: 'Alertes et promotions personnalisées' }
      },
      {
        path: '/client/support',
        element: <RoleGuard allowed={['Client']} fallback="/dashboard"><ClientSupport /></RoleGuard>,
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

