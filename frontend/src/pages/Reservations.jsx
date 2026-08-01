import { useContext, useEffect, useState } from 'react';
import {
  Card, Box, Typography, Stack, Chip, Button, Table, TableHead, TableRow,
  TableCell, TableBody, TextField, MenuItem, Avatar, Tooltip, Dialog, DialogContent
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchField from '../components/common/SearchField.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { kpis, clients, currency } from '../data/mockData.js';
import { tokens } from '../theme.js';
import { filterRecords } from '../utils/searchUtils.js';

const statutColor = {
  'Confirmée': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'En cours': { bg: tokens.color.infoSoft, fg: tokens.color.info },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning },
  'Terminée': { bg: tokens.color.line, fg: 'text.secondary' }
};

const canalIcon = { Web: '🌐', Mobile: '📱', Réception: '🛎️', Téléphone: '☎️' };

const getReservationAmount = (reservation, roomsList) => {
  const roomPriceByName = Object.fromEntries(roomsList.map((room) => [room.nom, room.prix]));
  const basePrice = roomPriceByName[reservation.chambre] || 120000;
  const arrivee = new Date(reservation.arrivee);
  const depart = new Date(reservation.depart);
  const nights = Math.max(1, Math.round((depart - arrivee) / (1000 * 60 * 60 * 24)));
  return basePrice * nights;
};

const paymentStatusLabel = (statut) => {
  if (statut === 'Terminée' || statut === 'Confirmée') return 'Payé';
  if (statut === 'En cours') return 'Partiel';
  return 'En attente';
};

const getClientInfo = (clientName) => clients.find((client) => client.nom === clientName) || null;

// Génère une disponibilité pseudo-déterministe sur 14 jours (démonstration)
// — à remplacer par l'agrégation réelle des réservations en base.
function buildAvailability(totalRooms) {
  const days = [];
  const today = new Date('2026-07-30');
  let seed = 42;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const occupees = Math.round(totalRooms * (0.55 + rand() * 0.4));
    days.push({ date: d, libres: Math.max(0, totalRooms - occupees) });
  }
  return days;
}

export default function Reservations() {
  const [filtre, setFiltre] = useState('Tous');
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [newReservation, setNewReservation] = useState({
    client: '',
    chambre: 'Standard',
    arrivee: '2026-08-01',
    depart: '2026-08-02',
    canal: 'Web',
    statut: 'Confirmée'
  });
  const [quickReservation, setQuickReservation] = useState({
    client: '',
    chambre: 'Standard',
    arrivee: '2026-08-01',
    depart: '2026-08-02'
  });
  const { selectedRoom, setSelectedRoom, reservations, setReservations, rooms, setRooms } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');

  const totalChambres = kpis.chambresOccupees + kpis.chambresLibres + kpis.chambresNettoyage + kpis.chambresMaintenance;
  const availability = buildAvailability(totalChambres); // même total que le Dashboard, pour rester cohérent

  const rows = filterRecords(
    reservations.filter((r) => filtre === 'Tous' || r.statut === filtre),
    searchQuery,
    ['id', 'client', 'chambre', 'statut', 'canal', 'arrivee', 'depart']
  );

  useEffect(() => {
    if (selectedRoom) {
      setNewReservation((prev) => ({ ...prev, chambre: selectedRoom.nom }));
      setOpenAdd(true);
    }
  }, [selectedRoom]);

  const handleAddReservation = () => {
    if (!newReservation.client.trim()) return;
    const nextId = `RS-${Date.now().toString().slice(-5)}`;
    setReservations((prev) => [...prev, { id: nextId, ...newReservation }]);
    setRooms((prev) => prev.map((room) => room.nom === newReservation.chambre ? { ...room, statut: 'Réservée' } : room));
    if (selectedRoom && selectedRoom.nom === newReservation.chambre) {
      setSelectedRoom(null);
    }
    setNewReservation({
      client: '',
      chambre: 'Standard',
      arrivee: '2026-08-01',
      depart: '2026-08-02',
      canal: 'Web',
      statut: 'Confirmée'
    });
    setOpenAdd(false);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {['Tous', 'Confirmée', 'En cours', 'En attente', 'Terminée'].map((f) => (
            <Chip
              key={f}
              label={f}
              onClick={() => setFiltre(f)}
              sx={{
                fontWeight: 600,
                bgcolor: filtre === f ? tokens.color.navy : '#fff',
                color: filtre === f ? '#fff' : 'text.primary',
                border: `1px solid ${filtre === f ? tokens.color.navy : tokens.color.line}`
              }}
            />
          ))}
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} alignItems="center">
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher par référence, client, chambre, canal…"
            sx={{ minWidth: { sm: 260 } }}
          />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddRoundedIcon />}
            sx={{ boxShadow: 'none' }}
            onClick={() => setOpenAdd(true)}
          >
            Nouvelle réservation
          </Button>
        </Stack>
      </Stack>

      <Dialog open={openAdd} onClose={() => { setOpenAdd(false); setSelectedRoom(null); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Ajouter une réservation</Typography>
          <Stack spacing={2}>
            <TextField
              label="Nom du client"
              value={newReservation.client}
              onChange={(e) => setNewReservation((prev) => ({ ...prev, client: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Type de chambre"
              select
              fullWidth
              size="small"
              value={newReservation.chambre}
              onChange={(e) => setNewReservation((prev) => ({ ...prev, chambre: e.target.value }))}
            >
              {['Standard', 'Deluxe', 'Suite', 'Familiale'].map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Arrivée"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={newReservation.arrivee}
                onChange={(e) => setNewReservation((prev) => ({ ...prev, arrivee: e.target.value }))}
              />
              <TextField
                label="Départ"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={newReservation.depart}
                onChange={(e) => setNewReservation((prev) => ({ ...prev, depart: e.target.value }))}
              />
            </Stack>
            <TextField
              label="Canal"
              select
              fullWidth
              size="small"
              value={newReservation.canal}
              onChange={(e) => setNewReservation((prev) => ({ ...prev, canal: e.target.value }))}
            >
              {['Web', 'Mobile', 'Réception', 'Téléphone'].map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Statut"
              select
              fullWidth
              size="small"
              value={newReservation.statut}
              onChange={(e) => setNewReservation((prev) => ({ ...prev, statut: e.target.value }))}
            >
              {['Confirmée', 'En cours', 'En attente', 'Terminée'].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => setOpenAdd(false)}>
                Annuler
              </Button>
              <Button fullWidth variant="contained" color="secondary" onClick={handleAddReservation}>
                Ajouter
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Card sx={{ p: 3, mb: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 0.4 }}>Calendrier de disponibilités</Typography>
        <Typography variant="caption" color="text.secondary">Chambres libres sur les 14 prochains jours</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
          {availability.map((d) => {
            const tendu = d.libres < 15;
            return (
              <Tooltip key={d.date.toISOString()} title={`${d.libres} chambres libres`}>
                <Box
                  sx={{
                    minWidth: 68, textAlign: 'center', p: 1.2, borderRadius: '12px',
                    bgcolor: tendu ? tokens.color.warningSoft : tokens.color.successSoft, flexShrink: 0
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                    {d.date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </Typography>
                  <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 15 }}>
                    {d.date.getDate()}/{d.date.getMonth() + 1}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: tendu ? tokens.color.warning : tokens.color.success }}>
                    {d.libres} libres
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
        </Stack>
      </Card>

      <Card sx={{ overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: tokens.color.cream }}>
              {['Référence', 'Client', 'Chambre', 'Arrivée', 'Départ', 'Canal', 'Statut', ''].map((h) => (
                <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: '0.06em', color: 'text.secondary', textTransform: 'uppercase' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontFamily: tokens.font.mono, fontSize: 13 }}>{r.id}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep }}>
                      {r.client.split(' ').slice(-1)[0][0]}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.client}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{r.chambre}</TableCell>
                <TableCell>{new Date(r.arrivee).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{new Date(r.depart).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{canalIcon[r.canal]} {r.canal}</TableCell>
                <TableCell>
                  <Chip
                    label={r.statut}
                    size="small"
                    sx={{ bgcolor: statutColor[r.statut]?.bg, color: statutColor[r.statut]?.fg, fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small" sx={{ color: tokens.color.navy }} onClick={() => setSelectedReservation(r)}>Détails</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog
        open={Boolean(selectedReservation)}
        onClose={() => setSelectedReservation(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Détails de la réservation</Typography>
          {selectedReservation ? (
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">Référence</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedReservation.id}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">Client</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedReservation.client}</Typography>
              </Stack>
              {getClientInfo(selectedReservation.client) && (
                <Box sx={{ p: 2, borderRadius: '16px', border: `1px solid ${tokens.color.line}`, bgcolor: tokens.color.cream }}>
                  <Typography variant="caption" color="text.secondary">Profil client</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{getClientInfo(selectedReservation.client).nationalite}</Typography>
                  <Typography variant="body2">{getClientInfo(selectedReservation.client).telephone}</Typography>
                  <Typography variant="body2">{getClientInfo(selectedReservation.client).email}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>Fidélité : {getClientInfo(selectedReservation.client).fidelite} • {getClientInfo(selectedReservation.client).pointsFidelite} pts</Typography>
                </Box>
              )}
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">Chambre</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedReservation.chambre}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">Arrivée</Typography>
                <Typography variant="body1">{new Date(selectedReservation.arrivee).toLocaleDateString('fr-FR')}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">Départ</Typography>
                <Typography variant="body1">{new Date(selectedReservation.depart).toLocaleDateString('fr-FR')}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">Nuits</Typography>
                <Typography variant="body1">{Math.max(1, Math.round((new Date(selectedReservation.depart) - new Date(selectedReservation.arrivee)) / (1000 * 60 * 60 * 24)))}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">Montant estimé</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{currency(getReservationAmount(selectedReservation, rooms))}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">Statut de réservation</Typography>
                <Chip label={selectedReservation.statut} size="small" sx={{ bgcolor: statutColor[selectedReservation.statut]?.bg, color: statutColor[selectedReservation.statut]?.fg, fontWeight: 600 }} />
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">Statut de paiement</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{paymentStatusLabel(selectedReservation.statut)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">Canal de réservation</Typography>
                <Typography variant="body1">{selectedReservation.canal}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="subtitle2" color="text.secondary">Détails chambre</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{rooms.find((room) => room.nom === selectedReservation.chambre)?.surface || 'N/A'} m²</Typography>
                  <Typography variant="caption" color="text.secondary">{rooms.find((room) => room.nom === selectedReservation.chambre)?.lits || 'N/A'}</Typography>
                </Box>
              </Stack>
              <Button variant="contained" color="secondary" fullWidth onClick={() => setSelectedReservation(null)}>Fermer</Button>
            </Stack>
          ) : (
            <Typography>Aucune réservation sélectionnée.</Typography>
          )}
        </DialogContent>
      </Dialog>

      <Card sx={{ mt: 2.5, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Nouvelle réservation rapide</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Nom du client"
            fullWidth
            size="small"
            value={quickReservation.client}
            onChange={(e) => setQuickReservation((prev) => ({ ...prev, client: e.target.value }))}
          />
          <TextField
            label="Type de chambre"
            select
            fullWidth
            size="small"
            value={quickReservation.chambre}
            onChange={(e) => setQuickReservation((prev) => ({ ...prev, chambre: e.target.value }))}
          >
            {['Standard', 'Deluxe', 'Suite', 'Familiale'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField
            label="Arrivée"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={quickReservation.arrivee}
            onChange={(e) => setQuickReservation((prev) => ({ ...prev, arrivee: e.target.value }))}
          />
          <TextField
            label="Départ"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={quickReservation.depart}
            onChange={(e) => setQuickReservation((prev) => ({ ...prev, depart: e.target.value }))}
          />
          <Button
            variant="contained"
            sx={{ px: 4, whiteSpace: 'nowrap' }}
            onClick={() => {
              if (!quickReservation.client.trim()) return;
              const nextId = `RS-${Date.now().toString().slice(-5)}`;
              setReservations((prev) => [...prev, {
                id: nextId,
                client: quickReservation.client,
                chambre: quickReservation.chambre,
                arrivee: quickReservation.arrivee,
                depart: quickReservation.depart,
                canal: 'Web',
                statut: 'Confirmée'
              }]);
              // La chambre concernée passe au statut « Réservée »
              setRooms((prev) => prev.map((room) =>
                room.nom === quickReservation.chambre ? { ...room, statut: 'Réservée' } : room
              ));
              setQuickReservation({ client: '', chambre: 'Standard', arrivee: '2026-08-01', depart: '2026-08-02' });
            }}
          >
            Réserver
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
