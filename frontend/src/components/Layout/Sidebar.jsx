import { Box, Stack, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer } from '@mui/material';
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import LocalBarRoundedIcon from '@mui/icons-material/LocalBarRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import PersonPinRoundedIcon from '@mui/icons-material/PersonPinRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import LocalActivityRoundedIcon from '@mui/icons-material/LocalActivityRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { AppContext } from '../../context/AppContext.jsx';
import { tokens } from '../../theme.js';

// ---------------------------------------------------------------------------
// Navigation exacte par rôle (conforme au cahier des charges)
// Chaque entrée possède une route réelle. Les entrées de type 'logout'
// déclenchent la déconnexion au lieu d'une navigation.
// ---------------------------------------------------------------------------
const roleNav = {
  'Super Admin': [
    { section: 'Vue d’ensemble', items: [{ to: '/dashboard', label: 'Dashboard Global', icon: <DashboardRoundedIcon /> }] },
    {
      section: 'Gestion',
      items: [
        { to: '/admin/utilisateurs', label: 'Gestion des Utilisateurs', icon: <BadgeRoundedIcon /> },
        { to: '/admin/roles', label: 'Gestion des Rôles & Permissions', icon: <GroupsRoundedIcon /> },
        { to: '/chambres', label: 'Gestion des Chambres', icon: <MeetingRoomRoundedIcon /> },
        { to: '/reservations', label: 'Gestion des Réservations', icon: <EventAvailableRoundedIcon /> }
      ]
    },
    {
      section: 'Opérations',
      items: [
        { to: '/restaurant', label: 'Restaurant', icon: <RestaurantRoundedIcon /> },
        { to: '/bar', label: 'Bar', icon: <LocalBarRoundedIcon /> },
        { to: '/activites', label: 'Activités', icon: <SpaRoundedIcon /> },
        { to: '/concierge', label: 'Conciergerie', icon: <SupportAgentRoundedIcon /> },
        { to: '/checkin', label: 'Check-in / Check-out', icon: <BadgeRoundedIcon /> }
      ]
    },
    {
      section: 'Finance & pilotage',
      items: [
        { to: '/finance', label: 'Facturation', icon: <AccountBalanceWalletRoundedIcon /> },
        { to: '/paiements', label: 'Paiements', icon: <ShoppingCartRoundedIcon /> },
        { to: '/stock', label: 'Stocks', icon: <Inventory2RoundedIcon /> },
        { to: '/rh', label: 'Ressources Humaines', icon: <GroupsRoundedIcon /> },
        { to: '/rapports', label: 'Rapports & Statistiques', icon: <DescriptionRoundedIcon /> }
      ]
    },
    {
      section: 'Support & outils',
      items: [
        { to: '/qr-code', label: 'QR Code Hôtel', icon: <QrCode2RoundedIcon /> },
        { to: '/audit-logs', label: 'Journal d’Audit', icon: <HistoryRoundedIcon /> },
        { to: '/notifications', label: 'Notifications', icon: <NotificationsRoundedIcon /> },
        { to: '/support', label: 'Support', icon: <SupportAgentRoundedIcon /> },
        { to: '/parametres', label: 'Paramètres Système', icon: <SettingsRoundedIcon /> }
      ]
    },
    {
      section: 'Session',
      items: [{ type: 'logout', label: 'Déconnexion', icon: <LogoutRoundedIcon /> }]
    }
  ],
  Manager: [
    { section: 'Vue d’ensemble', items: [{ to: '/manager', label: 'Dashboard Manager', icon: <DashboardRoundedIcon /> }] },
    {
      section: 'Opérations quotidiennes',
      items: [
        { to: '/reservations', label: 'Réservations', icon: <EventAvailableRoundedIcon /> },
        { to: '/chambres', label: 'Chambres', icon: <MeetingRoomRoundedIcon /> },
        { to: '/restaurant', label: 'Restaurant', icon: <RestaurantRoundedIcon /> },
        { to: '/bar', label: 'Bar', icon: <LocalBarRoundedIcon /> },
        { to: '/activites', label: 'Activités', icon: <SpaRoundedIcon /> },
        { to: '/concierge', label: 'Conciergerie', icon: <SupportAgentRoundedIcon /> },
        { to: '/checkin', label: 'Check-in / Check-out', icon: <BadgeRoundedIcon /> }
      ]
    },
    {
      section: 'Gestion équipe & clients',
      items: [
        { to: '/crm', label: 'Clients', icon: <ContactsRoundedIcon /> },
        { to: '/finance', label: 'Facturation', icon: <AccountBalanceWalletRoundedIcon /> },
        { to: '/paiements', label: 'Paiements', icon: <ShoppingCartRoundedIcon /> },
        { to: '/rh', label: 'Personnel', icon: <GroupsRoundedIcon /> },
        { to: '/planning', label: 'Planning des Agents', icon: <CalendarMonthRoundedIcon /> },
        { to: '/rapports', label: 'Rapports', icon: <DescriptionRoundedIcon /> }
      ]
    },
    {
      section: 'Communication',
      items: [
        { to: '/notifications', label: 'Notifications', icon: <NotificationsRoundedIcon /> },
        { to: '/profile', label: 'Profil', icon: <PersonPinRoundedIcon /> },
        { to: '/support', label: 'Support', icon: <SupportAgentRoundedIcon /> }
      ]
    },
    {
      section: 'Session',
      items: [{ type: 'logout', label: 'Déconnexion', icon: <LogoutRoundedIcon /> }]
    }
  ],
  Client: [
    { section: 'Accueil', items: [{ to: '/client', label: 'Accueil', icon: <HomeRoundedIcon /> }] },
    {
      section: 'Mon séjour',
      items: [
        { to: '/client/chambres', label: 'Chambres', icon: <MeetingRoomRoundedIcon /> },
        { to: '/client/reservations', label: 'Réservations', icon: <EventAvailableRoundedIcon /> },
        { to: '/client/restaurant', label: 'Restaurant', icon: <RestaurantRoundedIcon /> },
        { to: '/client/bar', label: 'Bar', icon: <LocalBarRoundedIcon /> },
        { to: '/client/activites', label: 'Activités', icon: <LocalActivityRoundedIcon /> },
        { to: '/client/concierge', label: 'Conciergerie', icon: <SupportAgentRoundedIcon /> }
      ]
    },
    {
      section: 'Mes services',
      items: [
        { to: '/client/commandes', label: 'Mes Commandes', icon: <ShoppingCartRoundedIcon /> },
        { to: '/client/factures', label: 'Mes Factures', icon: <ReceiptLongRoundedIcon /> },
        { to: '/client/paiements', label: 'Paiements', icon: <AccountBalanceWalletRoundedIcon /> },
        { to: '/client/qr', label: 'QR Code Personnel', icon: <QrCode2RoundedIcon /> },
        { to: '/client/fidelite', label: 'Programme de Fidélité', icon: <GroupsRoundedIcon /> },
        { to: '/client/ia', label: 'Assistant IA', icon: <PhoneIphoneRoundedIcon /> }
      ]
    },
    {
      section: 'Compte',
      items: [
        { to: '/client/profil', label: 'Profil', icon: <PersonPinRoundedIcon /> },
        { to: '/client/notifications', label: 'Notifications', icon: <NotificationsRoundedIcon /> },
        { to: '/client/support', label: 'Support', icon: <SupportAgentRoundedIcon /> }
      ]
    },
    {
      section: 'Session',
      items: [{ type: 'logout', label: 'Déconnexion', icon: <LogoutRoundedIcon /> }]
    }
  ]
};

const SIDEBAR_WIDTH = 268;

function SidebarContent({ onItemClick }) {
  const { userRole, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const nav = roleNav[userRole] || roleNav['Super Admin'];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <Box sx={{ px: 3, pt: 3.5, pb: 2.5 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '9px',
              border: `1.5px solid ${tokens.color.gold}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: tokens.font.display,
              color: tokens.color.gold,
              fontSize: 15
            }}
          >
            SH
          </Box>
          <Box>
            <Typography sx={{ fontFamily: tokens.font.display, fontSize: 17, lineHeight: 1.1, letterSpacing: '0.01em' }}>
              Smart Hotel
            </Typography>
            <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: '0.16em', color: tokens.color.gold }}>
              360° SUITE
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <Box sx={{ px: 1.5, py: 1.5, flex: 1 }}>
        {nav.map((group) => (
          <Box key={group.section} sx={{ mb: 1.5 }}>
            <Typography
              sx={{
                px: 1.5,
                pt: 1.5,
                pb: 0.5,
                fontFamily: tokens.font.mono,
                fontSize: 10,
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase'
              }}
            >
              {group.section}
            </Typography>
            <List dense disablePadding>
              {group.items.map((item) => {
                const isLogout = item.type === 'logout';
                return (
                  <ListItemButton
                    key={item.label}
                    component={isLogout ? 'button' : NavLink}
                    to={isLogout ? undefined : item.to}
                    end={!isLogout && item.to === '/dashboard'}
                    onClick={isLogout ? handleLogout : onItemClick}
                    sx={{
                      borderRadius: '10px',
                      mb: 0.4,
                      color: isLogout ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.75)',
                      '& .MuiListItemIcon-root': { color: isLogout ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.55)', minWidth: 36 },
                      '&.active': {
                        bgcolor: 'rgba(201,162,75,0.14)',
                        color: '#fff',
                        '& .MuiListItemIcon-root': { color: tokens.color.gold }
                      },
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}>{item.label}</ListItemText>
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 2, m: 1.5, mb: 2, borderRadius: '14px', bgcolor: 'rgba(255,255,255,0.05)' }}>
        <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', mb: 0.5 }}>Connexion</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tokens.color.success }} />
          <Typography sx={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{userRole}</Typography>
        </Stack>
      </Box>
    </>
  );
}

export default function Sidebar({ mobileOpen, onClose, isMobile }) {
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            bgcolor: tokens.color.navyDeep,
            color: '#fff'
          }
        }}
      >
        <SidebarContent onItemClick={onClose} />
      </Drawer>
    );
  }

  return (
    <Box
      component="nav"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        bgcolor: tokens.color.navyDeep,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}
    >
      <SidebarContent />
    </Box>
  );
}

export { SIDEBAR_WIDTH };

