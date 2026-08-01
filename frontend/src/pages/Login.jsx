import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Stack, Typography, Card, Avatar, Button, Chip, Divider, Snackbar, Alert, TextField, InputAdornment, IconButton
} from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import PersonPinRoundedIcon from '@mui/icons-material/PersonPinRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { AppContext } from '../context/AppContext.jsx';
import { tokens } from '../theme.js';
import { useContext } from 'react';

const ROLE_CREDENTIALS = {
  'Super Admin': { email: 'admin@sh360.cd', password: 'admin' },
  Manager: { email: 'manager@sh360.cd', password: 'manager' },
  Client: { email: 'client@sh360.cd', password: 'client' }
};

const ROLE_META = {
  'Super Admin': {
    icon: <AdminPanelSettingsRoundedIcon />,
    desc: 'Accès complet à tous les modules, utilisateurs, rôles, finance et rapports.',
    avatar: 'https://i.pravatar.cc/100?img=11'
  },
  Manager: {
    icon: <ManageAccountsRoundedIcon />,
    desc: 'Supervision des opérations quotidiennes et des équipes.',
    avatar: 'https://i.pravatar.cc/100?img=12'
  },
  Client: {
    icon: <PersonPinRoundedIcon />,
    desc: 'Espace personnel : réservations, commandes, factures et services.',
    avatar: 'https://i.pravatar.cc/100?img=33'
  }
};

export default function Login() {
  const { login, switchRole } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('Super Admin');
  const [email, setEmail] = useState('admin@sh360.cd');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    const creds = ROLE_CREDENTIALS[role];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const creds = ROLE_CREDENTIALS[selectedRole];
    if (email === creds.email && password === creds.password) {
      const user = {
        nom: selectedRole === 'Super Admin' ? 'Patrick Mwamba'
          : selectedRole === 'Manager' ? 'Sarah Nzuzi'
            : 'M. Kanyinda Tshibola',
        email,
        role: selectedRole
      };
      login(selectedRole, user);
      setSnackbar({ open: true, message: `Connecté en tant que ${selectedRole}.`, severity: 'success' });
      setTimeout(() => {
        navigate(selectedRole === 'Client' ? '/client' : selectedRole === 'Manager' ? '/manager' : '/dashboard', { replace: true });
      }, 800);
    } else {
      setSnackbar({ open: true, message: 'Identifiants incorrects pour ce rôle.', severity: 'error' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        background: `linear-gradient(135deg, ${tokens.color.navyDeep} 0%, ${tokens.color.navy} 55%, ${tokens.color.navySoft} 100%)`
      }}
    >
      <Card sx={{ maxWidth: 1080, width: '100%', borderRadius: '26px', overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.35)' }}>
        <Stack direction={{ xs: 'column', md: 'row' }}>
          {/* Panneau gauche — branding */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 4, md: 5 },
              bgcolor: tokens.color.navyDeep,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: { md: 560 }
            }}
          >
            <Box>
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 4 }}>
                <Box
                  sx={{
                    width: 42, height: 42, borderRadius: '10px',
                    border: `1.5px solid ${tokens.color.gold}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: tokens.font.display, color: tokens.color.gold, fontSize: 18
                  }}
                >
                  SH
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: tokens.font.display, fontSize: 20, lineHeight: 1.1 }}>Smart Hotel</Typography>
                  <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: '0.18em', color: tokens.color.gold }}>
                    360° SUITE
                  </Typography>
                </Box>
              </Stack>

              <Typography sx={{ fontFamily: tokens.font.display, fontSize: { xs: 28, md: 34 }, lineHeight: 1.15, mb: 2 }}>
                Une plateforme de gestion hôtelière digne des plus grands palaces.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 14.5, lineHeight: 1.7, mb: 4 }}>
                Chambres, réservations, restaurant, bar, activités, conciergerie, finance, RH,
                facturation, paiements mobiles et espace client premium — réunis dans une
                interface moderne et intuitive.
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                {['Dashboard temps réel', 'Permissions RBAC', 'Paiements mobiles', 'Assistant IA'].map((f) => (
                  <Chip
                    key={f}
                    label={f}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(201,162,75,0.14)',
                      color: tokens.color.goldSoft,
                      border: `1px solid rgba(201,162,75,0.35)`,
                      fontWeight: 600
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              {[...Array(5)].map((_, i) => (
                <StarRoundedIcon key={i} sx={{ fontSize: 18, color: tokens.color.gold }} />
              ))}
              <Typography variant="caption" sx={{ ml: 1 }}>Hôtel 5 étoiles · Kinshasa</Typography>
            </Stack>
          </Box>

          {/* Panneau droit — formulaire */}
          <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, bgcolor: tokens.color.surface }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>Connexion</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sélectionnez un rôle et utilisez les identifiants pré-remplis.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ mb: 3 }}>
              {['Super Admin', 'Manager', 'Client'].map((role) => (
                <Card
                  key={role}
                  onClick={() => handleSelectRole(role)}
                  sx={{
                    p: 1.6,
                    flex: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: `1.5px solid ${selectedRole === role ? tokens.color.gold : tokens.color.line}`,
                    bgcolor: selectedRole === role ? tokens.color.goldSoft : '#fff',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: tokens.color.gold }
                  }}
                >
                  <Box sx={{ color: selectedRole === role ? tokens.color.navy : tokens.color.inkMuted, display: 'flex', justifyContent: 'center', mb: 0.6 }}>
                    {ROLE_META[role].icon}
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>{role}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.4, fontSize: 10.5, lineHeight: 1.4 }}>
                    {ROLE_META[role].desc}
                  </Typography>
                </Card>
              ))}
            </Stack>

            <form onSubmit={handleLogin}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"><PersonRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>
                    )
                  }}
                />
                <TextField
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"><LockRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton size="small" onClick={() => setShowPassword((p) => !p)}>
                        {showPassword ? 'Masquer' : 'Voir'}
                      </IconButton>
                    )
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ py: 1.4, fontWeight: 700, boxShadow: 'none' }}
                >
                  Se connecter
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }}>
              <Chip label="Aperçu rapide" size="small" />
            </Divider>

            <Box sx={{ p: 2, borderRadius: '14px', bgcolor: tokens.color.cream }}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <WorkspacePremiumRoundedIcon sx={{ color: tokens.color.gold }} />
                <Typography variant="body2" sx={{ fontSize: 12.5 }}>
                  Démo : admin@sh360.cd / admin · manager@sh360.cd / manager · client@sh360.cd / client
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

