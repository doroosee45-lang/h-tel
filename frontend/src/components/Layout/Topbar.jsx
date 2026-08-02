import {
  Box,
  Stack,
  Typography,
  InputBase,
  Badge,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip
} from '@mui/material';

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SwitchAccountRoundedIcon from '@mui/icons-material/SwitchAccountRounded';

import { tokens } from '../../theme.js';
import { AppContext } from '../../context/AppContext.jsx';
import GlobalSearch from '../common/GlobalSearch.jsx';

const ROLE_AVATARS = {
  'Super Admin': 'https://omedevservicefrontend.onrender.com/assets/os5-zDql6FmJ.jpeg',
  Manager: 'https://omedevservicefrontend.onrender.com/assets/os5-zDql6FmJ.jpeg',
  Client: 'https://omedevservicefrontend.onrender.com/assets/os5-zDql6FmJ.jpeg'
};

const ROLE_HOME = {
  'Super Admin': '/dashboard',
  Manager: '/manager',
  Client: '/client'
};

export default function Topbar({ title, subtitle, onToggleSidebar }) {
const { userRole, notifications, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const openProfile = Boolean(anchorEl);

  const unreadCount = (notifications || []).filter((n) => n.statut !== 'Lue').length;

  // Raccourci clavier Ctrl/Cmd+K pour ouvrir la recherche globale
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
<Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: { xs: 1.5, sm: 3, lg: 4 },
        py: { xs: 1.5, sm: 2.5 },
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'rgba(246,243,236,0.88)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${tokens.color.line}`,
        maxWidth: '100%',
        overflowX: 'hidden'
      }}
    >
      {/* GAUCHE */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
        <IconButton
          onClick={onToggleSidebar}
          sx={{
            display: { xs: 'inline-flex', lg: 'none' },
            bgcolor: '#fff',
            border: `1px solid ${tokens.color.line}`,
            flexShrink: 0
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
          <Typography variant="h4" sx={{ fontSize: { xs: 16, sm: 20, md: 24 }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: 13.5, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>{subtitle}</Typography>
          )}
        </Box>
      </Stack>

      {/* DROITE */}
      <Stack direction="row" spacing={{ xs: 0.5, sm: 1.2, md: 2 }} alignItems="center" sx={{ flexShrink: 0 }}>
        {/* Recherche globale — fonctionnelle */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={() => setSearchOpen(true)}
          sx={{
            display: { xs: 'none', md: 'flex' },
            bgcolor: '#fff',
            border: `1px solid ${tokens.color.line}`,
            borderRadius: '10px',
            px: 1.5,
            py: 0.7,
            width: { md: 200, lg: 240 },
            cursor: 'pointer',
            transition: 'border-color .2s',
            '&:hover': { borderColor: tokens.color.gold }
          }}
        >
          <SearchRoundedIcon sx={{ color: tokens.color.gold, flexShrink: 0 }} />
          <InputBase
            placeholder="Rechercher… (Ctrl+K)"
            readOnly
            sx={{ fontSize: 13.5, width: '100%', cursor: 'pointer', '& input': { cursor: 'pointer' } }}
          />
          <Chip label="Ctrl K" size="small" sx={{ fontFamily: tokens.font.mono, fontSize: 10, height: 20, bgcolor: tokens.color.cream, color: 'text.secondary', flexShrink: 0 }} />
        </Stack>

        {/* Bouton loupe — mobile */}
        <IconButton
          onClick={() => setSearchOpen(true)}
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            bgcolor: '#fff',
            border: `1px solid ${tokens.color.line}`
          }}
        >
          <SearchRoundedIcon />
        </IconButton>

        {/* Hôtel */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.8}
          sx={{
            display: { xs: 'none', lg: 'flex' },
            bgcolor: '#fff',
            border: `1px solid ${tokens.color.line}`,
            borderRadius: '10px',
            px: 1.4,
            py: 0.7
          }}
        >
          <ApartmentRoundedIcon sx={{ color: tokens.color.gold, flexShrink: 0 }} />
          <Typography fontSize={13} sx={{ whiteSpace: 'nowrap' }}>Hôtel Fleuve — Kinshasa</Typography>
        </Stack>

{/* Badge de rôle (lecture seule) */}
        <Chip
          icon={<SwitchAccountRoundedIcon sx={{ fontSize: 16 }} />}
          label={userRole === 'Super Admin' ? 'Admin' : userRole === 'Manager' ? 'Manager' : 'Client'}
          sx={{
            fontWeight: 600,
            bgcolor: tokens.color.goldSoft,
            color: tokens.color.navyDeep,
            border: `1px solid ${tokens.color.line}`,
            borderRadius: '10px',
            height: 36,
            '& .MuiChip-icon': { color: tokens.color.navyDeep }
          }}
        />

        {/* Notification */}
        <IconButton
          onClick={() => navigate('/notifications')}
          sx={{
            bgcolor: '#fff',
            border: `1px solid ${tokens.color.line}`
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNoneRoundedIcon />
          </Badge>
        </IconButton>

        {/* Avatar Profil */}
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar
            src={ROLE_AVATARS[userRole] || 'https://omedevservicefrontend.onrender.com/assets/os5-zDql6FmJ.jpeg'}
            sx={{ width: 38, height: 38 }}
          />
        </IconButton>

        {/* MENU PROFIL */}
        <Menu
          anchorEl={anchorEl}
          open={openProfile}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { mt: 1, width: 220, borderRadius: 2 } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14, textTransform: 'capitalize' }}>{userRole}</Typography>
            <Typography variant="caption" color="text.secondary">Connecté à Smart Hotel 360°</Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              const target = userRole === 'Client' ? '/client/profil' : '/profile';
              navigate(target);
            }}
          >
            <PersonRoundedIcon sx={{ mr: 1 }} />
            Mon profil
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutRoundedIcon sx={{ mr: 1 }} />
            Déconnexion
          </MenuItem>
        </Menu>
      </Stack>

      {/* Recherche globale */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Stack>
  );
}

