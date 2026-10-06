import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import { AppContext } from '../context/AppContext.jsx';
import { tokens } from '../theme.js';

const MODES = [
  { value: 'staff', label: 'Personnel', helper: 'Connexion via /api/auth/login' },
  { value: 'client', label: 'Client', helper: 'Connexion via /api/client-auth/login' },
  { value: 'register', label: 'Inscription client', helper: 'Création via /api/client-auth/register' }
];

export default function Login() {
  const navigate = useNavigate();
  const { authLoading, loginStaff, loginClient, registerClient, verifyStaffOtp, pendingTwoFactor } = useContext(AppContext);
  const [mode, setMode] = useState('staff');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    otp: '',
    firstName: '',
    lastName: '',
    phone: '',
    nationality: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const notify = (severity, message) => setSnackbar({ open: true, severity, message });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (pendingTwoFactor?.pendingToken) {
        const result = await verifyStaffOtp(form.otp);
        notify('success', 'Authentification 2FA validée.');
        navigate(result.homePath, { replace: true });
        return;
      }

      if (mode === 'register') {
        const result = await registerClient({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          nationality: form.nationality
        });
        notify('success', 'Compte client créé et connecté.');
        navigate(result.homePath, { replace: true });
        return;
      }

      const action = mode === 'client' ? loginClient : loginStaff;
      const result = await action({ email: form.email, password: form.password });
      if (result?.twoFactorRequired) {
        notify('info', 'Code OTP requis pour terminer la connexion.');
        return;
      }

      notify('success', 'Connexion réussie.');
      navigate(result.homePath, { replace: true });
    } catch (error) {
      notify('error', error.response?.data?.message || error.message || 'Connexion impossible.');
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
          <Box sx={{ flex: 1, p: { xs: 4, md: 5 }, bgcolor: tokens.color.navyDeep, color: '#fff', minHeight: { md: 560 } }}>
            <Typography sx={{ fontFamily: tokens.font.display, fontSize: { xs: 30, md: 38 }, mb: 2 }}>
              Smart Hotel 360° connecté au backend réel.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, mb: 3 }}>
              Cette interface utilise désormais l'API Express/Mongo et Socket.io du projet. Le personnel et les clients utilisent des parcours d'authentification distincts.
            </Typography>
            <Stack spacing={1.2}>
              <Chip label="Staff: /api/auth/login" sx={{ width: 'fit-content', bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              <Chip label="Client: /api/client-auth/login" sx={{ width: 'fit-content', bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              <Chip label="Rafraîchissement automatique des tokens" sx={{ width: 'fit-content', bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
            </Stack>
          </Box>

          <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, bgcolor: tokens.color.surface }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>Connexion</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {pendingTwoFactor?.pendingToken ? 'Entrez le code OTP pour finaliser la session staff.' : MODES.find((item) => item.value === mode)?.helper}
            </Typography>

            {!pendingTwoFactor?.pendingToken ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ mb: 3 }}>
                {MODES.map((item) => (
                  <Card
                    key={item.value}
                    onClick={() => setMode(item.value)}
                    sx={{
                      p: 1.6,
                      flex: 1,
                      cursor: 'pointer',
                      textAlign: 'center',
                      border: `1.5px solid ${mode === item.value ? tokens.color.gold : tokens.color.line}`,
                      bgcolor: mode === item.value ? tokens.color.goldSoft : '#fff'
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>{item.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.helper}</Typography>
                  </Card>
                ))}
              </Stack>
            ) : null}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {mode === 'register' && !pendingTwoFactor?.pendingToken ? (
                  <>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField label="Prénom" value={form.firstName} onChange={handleChange('firstName')} fullWidth />
                      <TextField label="Nom" value={form.lastName} onChange={handleChange('lastName')} fullWidth />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField label="Téléphone" value={form.phone} onChange={handleChange('phone')} fullWidth />
                      <TextField label="Nationalité" value={form.nationality} onChange={handleChange('nationality')} fullWidth />
                    </Stack>
                  </>
                ) : null}

                {!pendingTwoFactor?.pendingToken ? (
                  <>
                    <TextField
                      label="Email"
                      value={form.email}
                      onChange={handleChange('email')}
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
                      value={form.password}
                      onChange={handleChange('password')}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start"><LockRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>
                        ),
                        endAdornment: (
                          <IconButton size="small" onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? 'Masquer' : 'Voir'}
                          </IconButton>
                        )
                      }}
                    />
                  </>
                ) : (
                  <TextField
                    label="Code OTP"
                    value={form.otp}
                    onChange={handleChange('otp')}
                    fullWidth
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={authLoading}
                  startIcon={mode === 'register' ? <PersonAddRoundedIcon /> : null}
                  endIcon={mode !== 'register' ? <ArrowForwardRoundedIcon /> : null}
                  sx={{ py: 1.4, fontWeight: 700 }}
                >
                  {authLoading ? 'Veuillez patienter…' : pendingTwoFactor?.pendingToken ? 'Valider le code' : mode === 'register' ? 'Créer mon compte client' : 'Se connecter'}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }}>
              <Chip label="Notes backend" size="small" />
            </Divider>
            <Alert severity="info">
              Le login staff peut demander un OTP si le 2FA est activé. Les rôles et accès sont ensuite pilotés par les rôles backend réels.
            </Alert>
          </Box>
        </Stack>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
