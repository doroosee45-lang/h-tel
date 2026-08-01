import { useState } from 'react';
import { Box, Typography, Card, Stack, Avatar, Button, TextField, Chip, Snackbar, Alert, Grid, Divider } from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import { tokens } from '../../theme.js';
import { clients, currency } from '../../data/mockData.js';

export default function ClientProfile() {
  const client = clients[0];
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Avatar src={client.photo} sx={{ width: 84, height: 84, border: `2px solid ${tokens.color.gold}` }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5">{client.nom}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{client.email}</Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.6 }}>
              <Chip icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 15 }} />} label={`${client.fidelite} · ${client.pointsFidelite.toLocaleString('fr-FR')} pts`} size="small" sx={{ bgcolor: tokens.color.gold, color: tokens.color.navyDeep, fontWeight: 700 }} />
            </Stack>
          </Box>
        </Stack>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Informations personnelles</Typography>
            {editMode ? (
              <Stack spacing={2}>
                <TextField label="Nom complet" defaultValue={client.nom} size="small" fullWidth />
                <TextField label="Email" defaultValue={client.email} size="small" fullWidth />
                <TextField label="Téléphone" defaultValue={client.telephone} size="small" fullWidth />
                <TextField label="Nationalité" defaultValue={client.nationalite} size="small" fullWidth />
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" onClick={() => setEditMode(false)}>Annuler</Button>
                  <Button variant="contained" color="secondary" onClick={() => { setEditMode(false); setSnackbar({ open: true, message: 'Profil mis à jour.', severity: 'success' }); }}>
                    Enregistrer
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={1.6}>
                <Stack direction="row" spacing={1.4} alignItems="center">
                  <PersonRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Nom complet</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{client.nom}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.4} alignItems="center">
                  <EmailRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{client.email}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.4} alignItems="center">
                  <PhoneRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Téléphone</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{client.telephone}</Typography>
                  </Box>
                </Stack>
                <Button variant="contained" color="secondary" sx={{ mt: 1, boxShadow: 'none', alignSelf: 'flex-start' }} onClick={() => setEditMode(true)}>
                  Modifier le profil
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, mb: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Statistiques de séjour</Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Stack spacing={1.2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Séjours effectués</Typography>
                <Typography sx={{ fontWeight: 700 }}>{client.sejours}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Dépenses totales</Typography>
                <Typography sx={{ fontWeight: 700, fontFamily: tokens.font.mono }}>{currency(client.depensesTotales)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Nationalité</Typography>
                <Typography sx={{ fontWeight: 700 }}>{client.nationalite}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Niveau fidélité</Typography>
                <Chip label={client.fidelite} size="small" sx={{ fontWeight: 700, bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep }} />
              </Stack>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Préférences</Typography>
            <Stack spacing={1}>
              {['Recevoir les offres par email', 'Notifications push', 'Petit-déjeuner inclus par défaut', 'Chambre non-fumeur'].map((p) => (
                <Stack key={p} direction="row" spacing={1} alignItems="flex-start">
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: tokens.color.gold, mt: 0.6 }} />
                  <Typography variant="body2" sx={{ fontSize: 13.5 }}>{p}</Typography>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

