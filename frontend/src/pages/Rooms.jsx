import { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SearchField from '../components/common/SearchField.jsx';
import { ErrorCard, LoadingCard, EmptyCard } from '../components/common/StateViews.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { api, unwrap } from '../api/client.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { formatCurrency, sentenceCase } from '../utils/format.js';
import { tokens } from '../theme.js';

const STATUS_COLORS = {
  available: { bg: tokens.color.successSoft, fg: tokens.color.success },
  occupied: { bg: tokens.color.navy, fg: '#fff' },
  cleaning: { bg: tokens.color.infoSoft, fg: tokens.color.info },
  reserved: { bg: tokens.color.goldSoft, fg: tokens.color.navyDeep },
  maintenance: { bg: tokens.color.warningSoft, fg: tokens.color.warning }
};

function roomPrice(room) {
  return room?.category?.basePrice || room?.price || 0;
}

async function loadRooms(isClient) {
  const [roomsRes, categoriesRes] = await Promise.all([
    api.get(isClient ? '/client-portal/rooms' : '/rooms'),
    api.get('/rooms/categories').catch(() => ({ data: { data: [] } }))
  ]);

  return {
    rooms: unwrap(roomsRes) || [],
    categories: unwrap(categoriesRes) || []
  };
}

export default function Rooms() {
  const { authType, userRole } = useContext(AppContext);
  const isClient = authType === 'client';
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({ checkInDate: '', checkOutDate: '', adults: 2, children: 0, notes: '' });
  const { data, loading, error, reload } = useAsyncData(() => loadRooms(isClient), [isClient]);

  useEffect(() => {
    const bookId = searchParams.get('book');
    if (!bookId || !data?.rooms?.length) return;
    const room = data.rooms.find((item) => item._id === bookId || item.number === bookId);
    if (room) setBookingRoom(room);
    setSearchParams({}, { replace: true });
  }, [data?.rooms, searchParams, setSearchParams]);

  const filteredRooms = useMemo(() => (data?.rooms || []).filter((room) => {
    if (statusFilter !== 'all' && room.status !== statusFilter) return false;
    if (!query) return true;
    const haystack = [room.number, room.name, room.description, room.floor, room.category?.name].join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  }), [data?.rooms, query, statusFilter]);

  const canManageStatus = ['admin', 'receptionist', 'housekeeping'].includes(userRole);

  const handleUpdateStatus = async (roomId, status) => {
    await api.patch(`/rooms/${roomId}/status`, { status });
    await reload();
  };

  const handleBookRoom = async () => {
    await api.post('/client-portal/book-room', {
      room: bookingRoom._id,
      ...bookingForm,
      source: 'web'
    });
    setBookingRoom(null);
    await reload();
  };

  if (loading) return <LoadingCard message="Chargement des chambres…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      {isClient ? (
        <Alert severity="info" sx={{ mb: 2.5 }}>
          Les chambres proviennent de <strong>/api/client-portal/rooms</strong>. Les réservations client utilisent <strong>/api/client-portal/book-room</strong>.
        </Alert>
      ) : null}

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} sx={{ mb: 2.5, gap: 1.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
          <SearchField value={query} onChange={setQuery} placeholder="Rechercher une chambre, catégorie, étage…" sx={{ minWidth: { sm: 280 } }} />
          <TextField select size="small" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="all">Tous les statuts</MenuItem>
            {Object.keys(STATUS_COLORS).map((status) => (
              <MenuItem key={status} value={status}>{sentenceCase(status)}</MenuItem>
            ))}
          </TextField>
        </Stack>
        <Chip label={`${filteredRooms.length} chambre(s)`} />
      </Stack>

      {!filteredRooms.length ? (
        <EmptyCard title="Aucune chambre" message="Aucune chambre ne correspond aux filtres appliqués." />
      ) : (
        <Grid container spacing={2.5}>
          {filteredRooms.map((room) => {
            const color = STATUS_COLORS[room.status] || { bg: tokens.color.line, fg: tokens.color.ink };
            return (
              <Grid item xs={12} sm={6} lg={4} key={room._id}>
                <Card sx={{ p: 2.5, height: '100%' }}>
                  <Stack spacing={1.4} sx={{ height: '100%' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="overline">Chambre {room.number || '—'}</Typography>
                        <Typography variant="h6">{room.name || room.category?.name || 'Sans libellé'}</Typography>
                      </Box>
                      <Chip label={sentenceCase(room.status)} sx={{ bgcolor: color.bg, color: color.fg, fontWeight: 700 }} />
                    </Stack>

                    <Typography color="text.secondary">{room.description || room.category?.description || 'Aucune description fournie.'}</Typography>
                    <Typography><strong>Catégorie:</strong> {room.category?.name || '—'}</Typography>
                    <Typography><strong>Étage:</strong> {room.floor ?? '—'}</Typography>
                    <Typography><strong>Prix:</strong> {formatCurrency(roomPrice(room))}/nuit</Typography>
                    <Typography><strong>Capacité:</strong> {room.category?.capacity || room.capacity || '—'} personne(s)</Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 'auto' }}>
                      {isClient ? (
                        <Button variant="contained" color="secondary" onClick={() => setBookingRoom(room)} disabled={room.status !== 'available'}>
                          Réserver
                        </Button>
                      ) : canManageStatus ? (
                        <TextField
                          select
                          size="small"
                          value={room.status}
                          onChange={(event) => handleUpdateStatus(room._id, event.target.value)}
                          sx={{ minWidth: 180 }}
                        >
                          {Object.keys(STATUS_COLORS).map((status) => (
                            <MenuItem key={status} value={status}>{sentenceCase(status)}</MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <Chip label="Lecture seule" variant="outlined" />
                      )}
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={Boolean(bookingRoom)} onClose={() => setBookingRoom(null)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Réserver la chambre {bookingRoom?.number}</Typography>
          <Stack spacing={2}>
            <TextField label="Arrivée" type="date" InputLabelProps={{ shrink: true }} value={bookingForm.checkInDate} onChange={(event) => setBookingForm((prev) => ({ ...prev, checkInDate: event.target.value }))} />
            <TextField label="Départ" type="date" InputLabelProps={{ shrink: true }} value={bookingForm.checkOutDate} onChange={(event) => setBookingForm((prev) => ({ ...prev, checkOutDate: event.target.value }))} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Adultes" type="number" value={bookingForm.adults} onChange={(event) => setBookingForm((prev) => ({ ...prev, adults: Number(event.target.value) }))} fullWidth />
              <TextField label="Enfants" type="number" value={bookingForm.children} onChange={(event) => setBookingForm((prev) => ({ ...prev, children: Number(event.target.value) }))} fullWidth />
            </Stack>
            <TextField label="Notes" multiline minRows={3} value={bookingForm.notes} onChange={(event) => setBookingForm((prev) => ({ ...prev, notes: event.target.value }))} />
            <Stack direction="row" spacing={1.2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => setBookingRoom(null)}>Annuler</Button>
              <Button variant="contained" color="secondary" onClick={handleBookRoom}>Confirmer</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
