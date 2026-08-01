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
  Button,
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
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

import { tokens } from '../../theme.js';
import { AppContext } from '../../context/AppContext.jsx';
import GlobalSearch from '../common/GlobalSearch.jsx';

const ROLE_AVATARS = {
  'Super Admin': 'https://i.pravatar.cc/100?img=11',
  Manager: 'https://i.pravatar.cc/100?img=12',
  Client: 'https://i.pravatar.cc/100?img=33'
};

const ROLE_HOME = {
  'Super Admin': '/dashboard',
  Manager: '/manager',
  Client: '/client'
};

export default function Topbar({ title, subtitle, onToggleSidebar }) {
  const { userRole, switchRole, roles, notifications, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [roleEl, setRoleEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const openProfile = Boolean(anchorEl);
  const openRoles = Boolean(roleEl);

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

  const handleRoleChange = (role) => {
    switchRole(role);
    setRoleEl(null);
    navigate(ROLE_HOME[role] || '/', { replace: true });
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: { xs: 2, sm: 3, lg: 4 },
        py: 2.5,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'rgba(246,243,236,0.88)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${tokens.color.line}`
      }}
    >
      {/* GAUCHE */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <IconButton
          onClick={onToggleSidebar}
          sx={{
            display: { xs: 'inline-flex', lg: 'none' },
            bgcolor: '#fff',
            border: `1px solid ${tokens.color.line}`
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box>
          <Typography variant="h4">{title}</Typography>
          {subtitle && (
            <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>{subtitle}</Typography>
          )}
        </Box>
      </Stack>

      {/* DROITE */}
      <Stack direction="row" spacing={2} alignItems="center">
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
            width: 240,
            cursor: 'pointer',
            transition: 'border-color .2s',
            '&:hover': { borderColor: tokens.color.gold }
          }}
        >
          <SearchRoundedIcon sx={{ color: tokens.color.gold }} />
          <InputBase
            placeholder="Rechercher… (Ctrl+K)"
            readOnly
            sx={{ fontSize: 13.5, width: '100%', cursor: 'pointer', '& input': { cursor: 'pointer' } }}
          />
          <Chip label="Ctrl K" size="small" sx={{ fontFamily: tokens.font.mono, fontSize: 10, height: 20, bgcolor: tokens.color.cream, color: 'text.secondary' }} />
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
          <ApartmentRoundedIcon sx={{ color: tokens.color.gold }} />
          <Typography fontSize={13}>Hôtel Fleuve — Kinshasa</Typography>
        </Stack>

        {/* Sélecteur de rôle */}
        <Button
          onClick={(e) => setRoleEl(e.currentTarget)}
          endIcon={<KeyboardArrowDownRoundedIcon />}
          startIcon={<SwitchAccountRoundedIcon />}
          sx={{
            textTransform: 'none',
            color: tokens.color.navyDeep,
            bgcolor: tokens.color.goldSoft,
            border: `1px solid ${tokens.color.line}`,
            borderRadius: '10px',
            px: 1.4,
            py: 0.7,
            fontSize: 13,
            fontWeight: 600,
            '&:hover': { bgcolor: tokens.color.goldSoft }
          }}
        >
          {userRole}
        </Button>
        <Menu
          anchorEl={roleEl}
          open={openRoles}
          onClose={() => setRoleEl(null)}
          PaperProps={{ sx: { mt: 1, width: 240, borderRadius: 2 } }}
        >
          {roles.map((role) => (
            <MenuItem key={role} onClick={() => handleRoleChange(role)} sx={{ justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Avatar src={ROLE_AVATARS[role]} sx={{ width: 28, height: 28 }} />
                <Typography sx={{ fontSize: 13.5, fontWeight: userRole === role ? 700 : 500 }}>{role}</Typography>
              </Stack>
              {userRole === role && <CheckRoundedIcon sx={{ fontSize: 17, color: tokens.color.gold }} />}
            </MenuItem>
          ))}
        </Menu>

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
            src={ROLE_AVATARS[userRole] || 'https://i.pravatar.cc/100?img=33'}
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

