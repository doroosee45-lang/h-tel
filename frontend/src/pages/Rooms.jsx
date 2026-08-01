import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Grid, Card, Box, Typography, Stack, Chip, Button, ToggleButtonGroup, ToggleButton, Dialog, DialogContent, TextField, MenuItem, Snackbar, Alert } from '@mui/material';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import QRFrame from '../components/common/QRFrame.jsx';
import RoomDetailDialog from '../components/common/RoomDetailDialog.jsx';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { AppContext } from '../context/AppContext.jsx';
import { currency } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

const statutStyle = {
  'Occupée': { bg: tokens.color.navy, fg: '#fff' },
  'Libre': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'Nettoyage': { bg: tokens.color.infoSoft, fg: tokens.color.info },
  'Réservée': { bg: tokens.color.goldSoft, fg: tokens.color.navyDeep },
  'Maintenance': { bg: tokens.color.warningSoft, fg: tokens.color.warning }
};

export default function Rooms() {
  const isClient = useContext(AppContext).userRole === 'Client';
  const [statutFiltre, setStatutFiltre] = useState('Toutes');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openAddRoom, setOpenAddRoom] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({ arrivee: '2026-08-01', depart: '2026-08-03', personnes: 2 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newRoom, setNewRoom] = useState({
    id: 'R000',
    nom: '',
    etage: 1,
    categorie: 'Standard',
    statut: 'Libre',
    prix: 120000,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80'
  });
  const { rooms, setRooms, reserveRoom, setReservations, addAuditLog, addNotification } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const statuts = ['Toutes', 'Occupée', 'Libre', 'Nettoyage', 'Réservée', 'Maintenance'];
  const rows = filterRecords(
    rooms.filter((r) => (isClient ? r.statut === 'Libre' : true) && (statutFiltre === 'Toutes' || r.statut === statutFiltre)),
    searchQuery,
    ['nom', 'id', 'categorie', 'statut', 'client', 'surface', 'lits', 'description', 'equipements', 'promotion', 'etage', 'prix']
  );

  // Si l'utilisateur arrive depuis la Home client avec ?book=RoomName, on ouvre le dialogue de réservation
  useEffect(() => {
    const bookParam = searchParams.get('book');
    if (bookParam) {
      const room = rooms.find((r) => r.nom === decodeURIComponent(bookParam));
      if (room) {
        setBookingRoom(room);
      }
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nights = Math.max(1, Math.round((new Date(bookingForm.depart) - new Date(bookingForm.arrivee)) / (1000 * 60 * 60 * 24)));
  const bookingTotal = bookingRoom ? bookingRoom.prix * nights : 0;

  const openBooking = (room) => {
    setBookingRoom(room);
    setBookingForm({ arrivee: '2026-08-01', depart: '2026-08-03', personnes: 2 });
  };

  const confirmBooking = () => {
    if (!bookingRoom) return;
    const id = `RS-${Date.now().toString().slice(-5)}`;
    setReservations((prev) => [
      {
        id,
        client: 'M. Kanyinda Tshibola',
        chambre: bookingRoom.nom,
        arrivee: bookingForm.arrivee,
        depart: bookingForm.depart,
        statut: 'Confirmée',
        canal: 'Web'
      },
      ...prev
    ]);
    setRooms((prev) => prev.map((r) => (r.id === bookingRoom.id ? { ...r, statut: 'Réservée', client: 'M. Kanyinda Tshibola' } : r)));
    addAuditLog(`Réservation ${id} créée pour ${bookingRoom.nom}`, 'Réservations');
    addNotification(`Réservation confirmée — ${bookingRoom.nom}`, 'M. Kanyinda Tshibola', 'Push + Email');
    setBookingRoom(null);
    setSnackbar({ open: true, message: `Réservation ${id} confirmée pour ${bookingRoom.nom}.`, severity: 'success' });
    navigate('/client/reservations');
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
        {isClient ? (
          <Box>
            <Typography variant="h6">Nos chambres & suites</Typography>
            <Typography variant="body2" color="text.secondary">Disponibilité en temps réel</Typography>
          </Box>
        ) : (
          <ToggleButtonGroup
            value={statutFiltre}
            exclusive
            onChange={(_, v) => v && setStatutFiltre(v)}
            size="small"
            sx={{ bgcolor: '#fff', border: `1px solid ${tokens.color.line}`, borderRadius: '10px', p: 0.4 }}
          >
            {statuts.map((s) => (
              <ToggleButton key={s} value={s} sx={{ border: 0, borderRadius: '8px !important', px: 2, textTransform: 'none', fontWeight: 600 }}>
                {s}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} alignItems="center">
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher par nom, catégorie, statut, client, prix…"
            sx={{ minWidth: { sm: 260 } }}
          />
          {!isClient && (
            <Button variant="contained" color="secondary" sx={{ boxShadow: 'none' }} onClick={() => setOpenAddRoom(true)}>+ Ajouter une chambre</Button>
          )}
        </Stack>
      </Stack>

      <Dialog open={openAddRoom} onClose={() => setOpenAddRoom(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Ajouter une chambre</Typography>
          <Stack spacing={2}>
            <TextField
              label="Nom de la chambre"
              value={newRoom.nom}
              onChange={(e) => setNewRoom((prev) => ({ ...prev, nom: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Étage"
              type="number"
              value={newRoom.etage}
              onChange={(e) => setNewRoom((prev) => ({ ...prev, etage: Number(e.target.value) }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Catégorie"
              select
              fullWidth
              size="small"
              value={newRoom.categorie}
              onChange={(e) => setNewRoom((prev) => ({ ...prev, categorie: e.target.value }))}
            >
              {['Standard', 'Deluxe', 'Suite', 'Familiale'].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Prix par nuit"
              type="number"
              value={newRoom.prix}
              onChange={(e) => setNewRoom((prev) => ({ ...prev, prix: Number(e.target.value) }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Statut"
              select
              fullWidth
              size="small"
              value={newRoom.statut}
              onChange={(e) => setNewRoom((prev) => ({ ...prev, statut: e.target.value }))}
            >
              {['Libre', 'Occupée', 'Réservée', 'Nettoyage', 'Maintenance'].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => setOpenAddRoom(false)}>Annuler</Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => {
                  if (!newRoom.nom.trim()) return;
                  setRooms((prev) => [
                    ...prev,
                    { ...newRoom, id: `R${Math.floor(Math.random() * 900 + 100)}` }
                  ]);
                  setNewRoom({
                    id: 'R000',
                    nom: '',
                    etage: 1,
                    categorie: 'Standard',
                    statut: 'Libre',
                    prix: 120000,
                    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80'
                  });
                  setOpenAddRoom(false);
                }}
              >
                Ajouter
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Grid container spacing={2.5}>
        {rows.map((room) => (
          <Grid item xs={12} sm={6} lg={4} key={room.id}>
            <Card sx={{ overflow: 'hidden' }}>
              <QRFrame radius={0}>
                <Box sx={{ position: 'relative', height: 170 }}>
                  <Box component="img" src={room.image} alt={room.nom} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {!isClient && (
                    <Chip
                      label={room.statut}
                      size="small"
                      sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 700, bgcolor: statutStyle[room.statut].bg, color: statutStyle[room.statut].fg }}
                    />
                  )}
                  <Box sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: 'rgba(11,37,69,0.75)', borderRadius: '8px', p: 0.6, display: 'flex' }}>
                    <QrCode2RoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Box>
                  {room.promotion && (
                    <Chip
                      label={room.promotion}
                      size="small"
                      sx={{ position: 'absolute', bottom: 10, left: 10, fontWeight: 700, bgcolor: tokens.color.gold, color: tokens.color.navyDeep }}
                    />
                  )}
                </Box>
              </QRFrame>

              <Box sx={{ p: 2.2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary' }}>{room.id}</Typography>
                    <Typography variant="h6" sx={{ fontSize: 17 }}>{room.nom}</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 600, color: tokens.color.navy }}>
                    {currency(room.prix)}<Typography component="span" variant="caption" color="text.secondary">/nuit</Typography>
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <LayersRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">Étage {room.etage} · {room.categorie}</Typography>
                </Stack>

                {room.client && !isClient && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: tokens.color.navySoft }}>
                    Occupée par {room.client}
                  </Typography>
                )}

                {isClient ? (
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button size="small" variant="outlined" fullWidth sx={{ borderColor: tokens.color.line, color: 'text.primary' }} onClick={() => setSelectedRoom(room)}>Détails</Button>
                    <Button size="small" variant="contained" color="secondary" fullWidth sx={{ boxShadow: 'none' }} onClick={() => openBooking(room)}>
                      Réserver cette chambre
                    </Button>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button size="small" variant="outlined" fullWidth sx={{ borderColor: tokens.color.line, color: 'text.primary' }} onClick={() => setSelectedRoom(room)}>Détails</Button>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      sx={{ boxShadow: 'none' }}
                      disabled={room.statut !== 'Libre'}
                      onClick={() => {
                        reserveRoom(room);
                        navigate('/reservations');
                      }}
                    >
                      Réserver cette chambre
                    </Button>
                  </Stack>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <RoomDetailDialog room={selectedRoom} open={Boolean(selectedRoom)} onClose={() => setSelectedRoom(null)} />

      {/* Dialogue de réservation client */}
      <Dialog open={Boolean(bookingRoom)} onClose={() => setBookingRoom(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Réserver — {bookingRoom?.nom}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            {currency(bookingRoom?.prix || 0)} / nuit · {bookingRoom?.categorie} · Étage {bookingRoom?.etage}
          </Typography>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Arrivée"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={bookingForm.arrivee}
                onChange={(e) => setBookingForm((prev) => ({ ...prev, arrivee: e.target.value }))}
              />
              <TextField
                label="Départ"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={bookingForm.depart}
                onChange={(e) => setBookingForm((prev) => ({ ...prev, depart: e.target.value }))}
              />
            </Stack>
            <TextField
              label="Personnes"
              type="number"
              fullWidth
              size="small"
              value={bookingForm.personnes}
              onChange={(e) => setBookingForm((prev) => ({ ...prev, personnes: Math.max(1, Number(e.target.value)) }))}
            />
            <Box sx={{ p: 2, borderRadius: '14px', bgcolor: tokens.color.cream }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">{nights} nuit(s)</Typography>
                <Typography variant="body2" sx={{ fontFamily: tokens.font.mono }}>{currency(nights * (bookingRoom?.prix || 0))}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography sx={{ fontWeight: 700, fontFamily: tokens.font.mono, color: tokens.color.navy }}>{currency(bookingTotal)}</Typography>
              </Stack>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button fullWidth variant="outlined" onClick={() => setBookingRoom(null)}>Annuler</Button>
              <Button fullWidth variant="contained" color="secondary" onClick={confirmBooking}>Confirmer la réservation</Button>
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
