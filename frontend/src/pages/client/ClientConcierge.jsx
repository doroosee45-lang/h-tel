import { useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Button, Dialog, DialogContent, TextField, Snackbar, Alert, Chip } from '@mui/material';
import LocalTaxiRoundedIcon from '@mui/icons-material/LocalTaxiRounded';
import AirportShuttleRoundedIcon from '@mui/icons-material/AirportShuttleRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import TourRoundedIcon from '@mui/icons-material/TourRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import { tokens } from '../../theme.js';
import { concierge } from '../../data/mockData.js';

const icons = {
  taxi: <LocalTaxiRoundedIcon />,
  shuttle: <AirportShuttleRoundedIcon />,
  car: <DirectionsCarRoundedIcon />,
  tour: <TourRoundedIcon />,
  package: <Inventory2RoundedIcon />,
  restaurant: <RestaurantMenuRoundedIcon />
};

export default function ClientConcierge() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [requests, setRequests] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const submit = () => {
    if (!selected || !notes.trim()) return;
    setRequests((prev) => [
      { id: `RQ-${Date.now().toString().slice(-4)}`, service: selected.service, notes, date: new Date().toLocaleDateString('fr-FR'), statut: 'Envoyée' },
      ...prev
    ]);
    setOpen(false);
    setNotes('');
    setSelected(null);
    setSnackbar({ open: true, message: `Demande « ${selected.service} » envoyée à la conciergerie.`, severity: 'success' });
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 52, height: 52, borderRadius: '13px', bgcolor: tokens.color.gold, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TourRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h5">Conciergerie</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Taxi, navette, location, excursions, livraison — demandez en un clic.
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Grid container spacing={2.5}>
        {concierge.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.id}>
            <Card sx={{ p: 2.6, height: '100%' }}>
              <Box sx={{ width: 46, height: 46, borderRadius: '12px', bgcolor: tokens.color.navy, color: tokens.color.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.6 }}>
                {icons[c.icon]}
              </Box>
              <Typography variant="h6" sx={{ fontSize: 16.5 }}>{c.service}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>{c.description}</Typography>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ boxShadow: 'none' }}
                onClick={() => { setSelected(c); setOpen(true); }}
              >
                Demander ce service
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {requests.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>Mes demandes</Typography>
          <Stack spacing={1.4}>
            {requests.map((r) => (
              <Card key={r.id} sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontWeight: 600 }}>{r.service}</Typography>
                  <Chip label={r.statut} size="small" sx={{ fontWeight: 700, bgcolor: tokens.color.infoSoft, color: tokens.color.info }} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>{r.notes}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.6 }}>{r.id} · {r.date}</Typography>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); setSelected(null); setNotes(''); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Demande — {selected?.service}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selected?.description}</Typography>
          <Stack spacing={2}>
            <TextField
              label="Détails de la demande"
              multiline
              minRows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              size="small"
            />
            <Stack direction="row" spacing={2}>
              <Button fullWidth variant="outlined" onClick={() => { setOpen(false); setSelected(null); setNotes(''); }}>Annuler</Button>
              <Button fullWidth variant="contained" color="secondary" onClick={submit}>Envoyer</Button>
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

