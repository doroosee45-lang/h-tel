import { useContext, useState } from 'react';
import { Box, Typography, Card, Stack, Avatar, Button, TextField, Chip, Snackbar, Alert, Grid } from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import { tokens } from '../theme.js';
import { AppContext } from '../context/AppContext.jsx';
import { clients } from '../data/mockData.js';

const ROLE_PROFILE = {
    'Super Admin': { photo: 'https://omedevservicefrontend.onrender.com/assets/os5-zDql6FmJ.jpeg', nom: 'Patrick Mwamba', email: 'p.mwamba@sh360.cd', telephone: '+243 81 000 0001', role: 'Super Admin', departement: 'Direction', poste: 'Administrateur Général' },
    Manager: { photo: 'https://omedevservicefrontend.onrender.com/assets/os5-zDql6FmJ.jpeg', nom: 'Sarah Nzuzi', email: 's.nzuzi@sh360.cd', telephone: '+243 89 000 0002', role: 'Manager', departement: 'Opérations', poste: 'Chef des Agents' },
  Client: { photo: 'https://omedevservicefrontend.onrender.com/assets/os5-zDql6FmJ.jpeg', nom: 'M. Kanyinda Tshibola', email: 'k.tshibola@mail.cd', telephone: '+243 81 000 0001', role: 'Client', departement: '—', poste: 'Client fidèle' }
};

export default function Profile() {
  const { userRole, currentUser, addAuditLog } = useContext(AppContext);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const base = ROLE_PROFILE[userRole] || ROLE_PROFILE['Super Admin'];
  const user = currentUser || { ...base };

  const clientData = clients.find((c) => c.nom === user.nom) || clients[0];

  const handleSave = () => {
    setEditMode(false);
    addAuditLog('Mise à jour du profil', 'Profil');
    setSnackbar({ open: true, message: 'Profil mis à jour et journalisé.', severity: 'success' });
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Avatar src={base.photo} sx={{ width: 84, height: 84, border: `2px solid ${tokens.color.gold}` }} />
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5">{base.nom}</Typography>
              <Chip icon={<VerifiedRoundedIcon sx={{ fontSize: 14 }} />} label={base.role} size="small" sx={{ bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, fontWeight: 700 }} />
            </Stack>
            <Typography variant="body2" color="text.secondary">{base.poste} · {base.departement}</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 0.6 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <EmailRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{base.email}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PhoneRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{base.telephone}</Typography>
              </Stack>
            </Stack>
          </Box>
          {!editMode && (
            <Button variant="contained" color="secondary" sx={{ boxShadow: 'none' }} onClick={() => setEditMode(true)}>
              Modifier le profil
            </Button>
          )}
        </Stack>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Informations de compte</Typography>
            {editMode ? (
              <Stack spacing={2}>
                <TextField label="Nom complet" defaultValue={base.nom} size="small" fullWidth />
                <TextField label="Email" defaultValue={base.email} size="small" fullWidth />
                <TextField label="Téléphone" defaultValue={base.telephone} size="small" fullWidth />
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" onClick={() => setEditMode(false)}>Annuler</Button>
                  <Button variant="contained" color="secondary" onClick={handleSave}>Enregistrer</Button>
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={1.6}>
                <Typography variant="body2">Rôle : <strong>{base.role}</strong></Typography>
                <Typography variant="body2">Poste : <strong>{base.poste}</strong></Typography>
                <Typography variant="body2">Département : <strong>{base.departement}</strong></Typography>
                <Typography variant="body2">Email : <strong>{base.email}</strong></Typography>
                <Typography variant="body2">Téléphone : <strong>{base.telephone}</strong></Typography>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Statut fidélité</Typography>
            <Typography variant="body2">
              Niveau : <strong>{clientData?.fidelite || 'Or'}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.6 }}>
              Points : <strong>{(clientData?.pointsFidelite || 0).toLocaleString('fr-FR')}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.6 }}>
              Séjours : <strong>{clientData?.sejours || 0}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.6 }}>
              Dépenses totales : <strong>{(clientData?.depensesTotales || 0).toLocaleString('fr-FR')} FC</strong>
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

