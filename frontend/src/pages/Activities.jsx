import { useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Chip, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import QRFrame from '../components/common/QRFrame.jsx';
import { tokens } from '../theme.js';
import { activities, currency } from '../data/mockData.js';

export default function Activities() {
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [bookingForm, setBookingForm] = useState({ client: '', date: '2026-08-01', personnes: 2 });
  const [bookings, setBookings] = useState([]);

  const openReservationDialog = (activity) => {
    setSelectedActivity(activity);
    setBookingForm({ client: '', date: '2026-08-01', personnes: 2 });
    setOpenBooking(true);
  };

  const handleConfirmBooking = () => {
    if (!bookingForm.client.trim()) return;
    setBookings((prev) => [
      ...prev,
      {
        id: `ACT-${Date.now().toString().slice(-5)}`,
        activity: selectedActivity.nom,
        prix: selectedActivity.prix,
        ...bookingForm
      }
    ]);
    setOpenBooking(false);
    setSelectedActivity(null);
  };

  return (
    <Grid container spacing={2.5}>
      {activities.map((a) => (
        <Grid item xs={12} sm={6} key={a.id}>
          <Card sx={{ overflow: 'hidden', display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
            <QRFrame radius={0}>
              <Box component="img" src={a.image} alt={a.nom} sx={{ width: { xs: '100%', sm: 190 }, height: { xs: 160, sm: '100%' }, objectFit: 'cover', display: 'block' }} />
            </QRFrame>
            <Box sx={{ p: 2.4, flex: 1 }}>
              <Typography variant="h6" sx={{ fontSize: 17 }}>{a.nom}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4, fontSize: 12.5 }}>{a.description}</Typography>
              <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mt: 0.6 }}>
                <AccessTimeRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{a.horaire}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                <Chip
                  label={a.prix ? currency(a.prix) : 'Inclus séjour'}
                  size="small"
                  sx={{ fontWeight: 700, bgcolor: a.prix ? tokens.color.goldSoft : tokens.color.successSoft, color: a.prix ? tokens.color.navyDeep : tokens.color.success }}
                />
                <Button size="small" variant="contained" sx={{ boxShadow: 'none' }} onClick={() => openReservationDialog(a)}>
                  Réserver
                </Button>
              </Stack>
            </Box>
          </Card>
        </Grid>
      ))}
      <Dialog open={openBooking} onClose={() => setOpenBooking(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle>Réserver une activité</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">Activité sélectionnée</Typography>
            <Typography variant="h6">{selectedActivity?.nom}</Typography>
            <Typography variant="body2" color="text.secondary">{selectedActivity?.description}</Typography>
            <TextField
              label="Nom du client"
              value={bookingForm.client}
              onChange={(e) => setBookingForm((prev) => ({ ...prev, client: e.target.value }))}
              fullWidth
              size="small"
            />
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
              <Button fullWidth variant="contained" color="secondary" onClick={handleConfirmBooking}>Confirmer</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
      {bookings.length > 0 && (
        <Card sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Réservations d’activités</Typography>
          <Stack spacing={1.5}>
            {bookings.map((booking) => (
              <Box key={booking.id} sx={{ p: 2, borderRadius: '16px', bgcolor: tokens.color.cream }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontWeight: 700 }}>{booking.activity}</Typography>
                  <Chip label={booking.id} size="small" sx={{ bgcolor: tokens.color.line }} />
                </Stack>
                <Typography variant="body2" color="text.secondary">Client : {booking.client}</Typography>
                <Typography variant="body2" color="text.secondary">Date : {booking.date}</Typography>
                <Typography variant="body2" color="text.secondary">Personnes : {booking.personnes}</Typography>
              </Box>
            ))}
          </Stack>
        </Card>
      )}
    </Grid>
  );
}
