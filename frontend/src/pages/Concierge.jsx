import { useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Button, Dialog, DialogContent, TextField } from '@mui/material';
import LocalTaxiRoundedIcon from '@mui/icons-material/LocalTaxiRounded';
import AirportShuttleRoundedIcon from '@mui/icons-material/AirportShuttleRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import TourRoundedIcon from '@mui/icons-material/TourRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { concierge } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

const icons = {
  taxi: <LocalTaxiRoundedIcon />,
  shuttle: <AirportShuttleRoundedIcon />,
  car: <DirectionsCarRoundedIcon />,
  tour: <TourRoundedIcon />,
  package: <Inventory2RoundedIcon />,
  restaurant: <RestaurantMenuRoundedIcon />
};

export default function Concierge() {
  const [openRequest, setOpenRequest] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [requestsSent, setRequestsSent] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const services = filterRecords(concierge, searchQuery, ['service', 'description']);

  const handleShowDetails = (service) => {
    setSelectedService(service);
    setOpenDetails(true);
  };

  const handleSendRequest = () => {
    if (!selectedService || !requestNotes.trim()) return;
    setRequestsSent((prev) => [
      ...prev,
      {
        id: `RQ-${Date.now().toString().slice(-4)}`,
        service: selectedService.service,
        notes: requestNotes,
        date: new Date().toLocaleDateString('fr-FR')
      }
    ]);
    setOpenRequest(false);
    setSelectedService(null);
    setRequestNotes('');
  };

  return (
    <Box>
      <SearchField
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Rechercher un service de conciergerie…"
        sx={{ mb: 2.5, maxWidth: 420 }}
      />
      <Grid container spacing={2.5}>
      {services.map((c) => (
        <Grid item xs={12} sm={6} md={4} key={c.id}>
          <Card sx={{ p: 2.6, height: '100%' }}>
            <Box
              sx={{
                width: 46, height: 46, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: tokens.color.navy, color: tokens.color.gold, mb: 1.6
              }}
            >
              {icons[c.icon]}
            </Box>
            <Typography variant="h6" sx={{ fontSize: 16.5 }}>{c.service}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, minHeight: 40 }}>{c.description}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button size="small" variant="outlined" fullWidth sx={{ borderColor: tokens.color.line, color: 'text.primary' }} onClick={() => handleShowDetails(c)}>
                Voir détails
              </Button>
              <Button
                size="small"
                variant="contained"
                fullWidth
                sx={{ boxShadow: 'none' }}
                onClick={() => {
                  setSelectedService(c);
                  setOpenRequest(true);
                }}
              >
                Nouvelle
              </Button>
            </Stack>
          </Card>
        </Grid>
      ))}
      <Dialog open={openRequest} onClose={() => { setOpenRequest(false); setSelectedService(null); setRequestNotes(''); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Nouvelle demande de service</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Service sélectionné : {selectedService?.service || 'Aucun service'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Détails de la demande"
              multiline
              minRows={4}
              value={requestNotes}
              onChange={(e) => setRequestNotes(e.target.value)}
              size="small"
              fullWidth
            />
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => { setOpenRequest(false); setSelectedService(null); setRequestNotes(''); }}>Annuler</Button>
              <Button fullWidth variant="contained" color="secondary" onClick={handleSendRequest}>Envoyer</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={openDetails} onClose={() => { setOpenDetails(false); setSelectedService(null); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Détails du service</Typography>
          <Typography variant="subtitle2" color="text.secondary">Service</Typography>
          <Typography sx={{ fontWeight: 700 }}>{selectedService?.service || 'Aucun service sélectionné'}</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Description</Typography>
          <Typography>{selectedService?.description}</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={() => { setOpenDetails(false); setSelectedService(null); }}>Fermer</Button>
          </Stack>
        </DialogContent>
      </Dialog>
      {requestsSent.length > 0 && (
        <Box sx={{ mt: 3, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Demandes envoyées</Typography>
          <Stack spacing={1.2}>
            {requestsSent.map((req) => (
              <Card key={req.id} sx={{ p: 2, border: `1px solid ${tokens.color.line}` }}>
                <Typography sx={{ fontWeight: 600 }}>{req.service}</Typography>
                <Typography variant="caption" color="text.secondary">{req.date} • {req.id}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{req.notes}</Typography>
              </Card>
            ))}
          </Stack>
        </Box>
      )}
      </Grid>
    </Box>
  );
}
