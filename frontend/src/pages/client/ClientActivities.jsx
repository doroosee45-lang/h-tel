import { useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Chip, Button, Dialog, DialogContent, TextField, Snackbar, Alert, Divider } from '@mui/material';
import LocalActivityRoundedIcon from '@mui/icons-material/LocalActivityRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SearchField from '../../components/common/SearchField.jsx';
import { tokens } from '../../theme.js';
import { activities, clientActivitiesData, currency } from '../../data/mockData.js';
import { filterRecords } from '../../utils/searchUtils.js';

const statutStyle = {
  'Terminée': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'Confirmée': { bg: tokens.color.infoSoft, fg: tokens.color.info },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning }
};

export default function ClientActivities() {
  const [bookings, setBookings] = useState(clientActivitiesData);
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: '2026-08-05', personnes: 2 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const availableActivities = filterRecords(activities, searchQuery, ['nom', 'horaire', 'prix', 'description']);
  const filteredBookings = filterRecords(bookings, searchQuery, ['id', 'nom', 'date', 'statut', 'montant', 'methode']);

  const handleBook = () => {
    if (!selectedActivity) return;
    setBookings((prev) => [
      {
        id: `ACT-${Date.now().toString().slice(-5)}`,
        nom: selectedActivity.nom,
        date: bookingForm.date,
        statut: 'En attente',
        montant: selectedActivity.prix,
        methode: 'En attente'
      },
      ...prev
    ]);
    setOpenBooking(false);
    setSnackbar({ open: true, message: `Activité « ${selectedActivity.nom} » réservée.`, severity: 'success' });
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ flexWrap: 'wrap', gap: 1.5 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: 52, height: 52, borderRadius: '13px', bgcolor: tokens.color.gold, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LocalActivityRoundedIcon />
            </Box>
            <Box>
              <Typography variant="h5">Mes Activités</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Réservez et suivez vos activités : spa, piscine, excursions, sport, conférences, transport.
              </Typography>
            </Box>
          </Stack>
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher une activité, une réservation…"
            sx={{ minWidth: { sm: 240 } }}
          />
        </Stack>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>Réserver une activité</Typography>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {availableActivities.map((a) => (
          <Grid item xs={12} sm={6} md={4} key={a.id}>
            <Card sx={{ overflow: 'hidden', height: '100%' }}>
              <Box sx={{ height: 130, overflow: 'hidden' }}>
                <Box component="img" src={a.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
              <Box sx={{ p: 2.4 }}>
                <Typography sx={{ fontWeight: 600 }}>{a.nom}</Typography>
                <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mt: 0.4 }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">{a.horaire}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.6 }}>
                  <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy }}>
                    {a.prix ? currency(a.prix) : 'Inclus'}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color={a.prix ? 'secondary' : 'primary'}
                    sx={{ boxShadow: 'none' }}
                    onClick={() => { setSelectedActivity(a); setOpenBooking(true); }}
                  >
                    Réserver
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>Mes réservations d’activités</Typography>
      <Grid container spacing={2.5}>
        {filteredBookings.map((b) => (
          <Grid item xs={12} md={6} key={b.id}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocalActivityRoundedIcon sx={{ color: tokens.color.gold, fontSize: 20 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{b.nom}</Typography>
                    <Typography variant="caption" color="text.secondary">{b.id}</Typography>
                  </Box>
                </Stack>
                <Chip label={b.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[b.statut]?.bg, color: statutStyle[b.statut]?.fg }} />
              </Stack>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{new Date(b.date).toLocaleDateString('fr-FR')}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Paiement</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{b.methode}</Typography>
                </Stack>
              </Stack>
              <Divider sx={{ my: 1.6, borderStyle: 'dashed' }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">Montant</Typography>
                <Typography sx={{ fontWeight: 700, fontFamily: tokens.font.mono, color: tokens.color.navy }}>{currency(b.montant)}</Typography>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openBooking} onClose={() => setOpenBooking(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Réserver — {selectedActivity?.nom}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selectedActivity?.description}</Typography>
          <Stack spacing={2}>
            <TextField
              label="Date"
              type="date"
              value={bookingForm.date}
              onChange={(e) => setBookingForm((prev) => ({ ...prev, date: e.target.value }))}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Personnes"
              type="number"
              value={bookingForm.personnes}
              onChange={(e) => setBookingForm((prev) => ({ ...prev, personnes: Math.max(1, Number(e.target.value)) }))}
              fullWidth
              size="small"
            />
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => setOpenBooking(false)}>Annuler</Button>
              <Button fullWidth variant="contained" color="secondary" onClick={handleBook}>Confirmer</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

