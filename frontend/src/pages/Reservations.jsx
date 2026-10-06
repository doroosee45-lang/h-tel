import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogContent,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import SearchField from '../components/common/SearchField.jsx';
import { api, unwrap } from '../api/client.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../components/common/StateViews.jsx';
import { formatCurrency, formatDate, fullName, sentenceCase } from '../utils/format.js';
import { tokens } from '../theme.js';

async function loadReservations() {
  const [reservationsRes, roomsRes, clientsRes] = await Promise.all([
    api.get('/reservations'),
    api.get('/rooms'),
    api.get('/crm/clients').catch(() => ({ data: { data: [] } }))
  ]);

  return {
    reservations: unwrap(reservationsRes) || [],
    rooms: unwrap(roomsRes) || [],
    clients: unwrap(clientsRes) || []
  };
}

export default function Reservations() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({ room: '', client: '', checkInDate: '', checkOutDate: '', adults: 2, children: 0, notes: '' });
  const { data, loading, error, reload } = useAsyncData(loadReservations, []);

  const rows = useMemo(() => (data?.reservations || []).filter((reservation) => {
    if (statusFilter !== 'all' && reservation.status !== statusFilter) return false;
    if (!query) return true;
    const haystack = [
      reservation.reference,
      fullName(reservation.client),
      reservation.room?.number,
      reservation.status,
      reservation.source
    ].join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  }), [data?.reservations, query, statusFilter]);

  const handleCreate = async () => {
    await api.post('/reservations', {
      ...form,
      source: 'reception'
    });
    setOpenCreate(false);
    setForm({ room: '', client: '', checkInDate: '', checkOutDate: '', adults: 2, children: 0, notes: '' });
    await reload();
  };

  if (loading) return <LoadingCard message="Chargement des réservations…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Cette page utilise <strong>/api/reservations</strong> pour la liste et la création. La création staff exige un client existant côté CRM.
      </Alert>

      <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" alignItems={{ lg: 'center' }} sx={{ mb: 2.5, gap: 1.5 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
          <SearchField value={query} onChange={setQuery} placeholder="Référence, client, chambre…" sx={{ minWidth: { sm: 280 } }} />
          <TextField select size="small" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="all">Tous les statuts</MenuItem>
            {['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map((status) => (
              <MenuItem key={status} value={status}>{sentenceCase(status)}</MenuItem>
            ))}
          </TextField>
        </Stack>
        <Button variant="contained" color="secondary" onClick={() => setOpenCreate(true)}>
          Nouvelle réservation
        </Button>
      </Stack>

      {!rows.length ? (
        <EmptyCard title="Aucune réservation" message="Aucune réservation ne correspond aux filtres actuels." />
      ) : (
        <Card sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: tokens.color.cream }}>
                {['Référence', 'Client', 'Chambre', 'Séjour', 'Montant', 'Source', 'Statut'].map((label) => (
                  <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((reservation) => (
                <TableRow key={reservation._id} hover>
                  <TableCell>{reservation.reference}</TableCell>
                  <TableCell>{fullName(reservation.client)}</TableCell>
                  <TableCell>{reservation.room?.number || '—'}</TableCell>
                  <TableCell>{formatDate(reservation.checkInDate)} → {formatDate(reservation.checkOutDate)}</TableCell>
                  <TableCell>{formatCurrency(reservation.totalAmount)}</TableCell>
                  <TableCell>{sentenceCase(reservation.source)}</TableCell>
                  <TableCell>
                    <Chip label={sentenceCase(reservation.status)} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Créer une réservation</Typography>
          <Stack spacing={2}>
            <TextField select label="Client" value={form.client} onChange={(event) => setForm((prev) => ({ ...prev, client: event.target.value }))}>
              {(data?.clients || []).map((client) => (
                <MenuItem key={client._id} value={client._id}>{fullName(client)} · {client.email}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Chambre" value={form.room} onChange={(event) => setForm((prev) => ({ ...prev, room: event.target.value }))}>
              {(data?.rooms || []).filter((room) => room.status === 'available').map((room) => (
                <MenuItem key={room._id} value={room._id}>Chambre {room.number} · {room.category?.name || 'Sans catégorie'} · {formatCurrency(room.category?.basePrice || 0)}</MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Arrivée" type="date" InputLabelProps={{ shrink: true }} value={form.checkInDate} onChange={(event) => setForm((prev) => ({ ...prev, checkInDate: event.target.value }))} fullWidth />
              <TextField label="Départ" type="date" InputLabelProps={{ shrink: true }} value={form.checkOutDate} onChange={(event) => setForm((prev) => ({ ...prev, checkOutDate: event.target.value }))} fullWidth />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Adultes" type="number" value={form.adults} onChange={(event) => setForm((prev) => ({ ...prev, adults: Number(event.target.value) }))} fullWidth />
              <TextField label="Enfants" type="number" value={form.children} onChange={(event) => setForm((prev) => ({ ...prev, children: Number(event.target.value) }))} fullWidth />
            </Stack>
            <TextField label="Notes" multiline minRows={3} value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} />
            <Stack direction="row" justifyContent="flex-end" spacing={1.2}>
              <Button variant="outlined" onClick={() => setOpenCreate(false)}>Annuler</Button>
              <Button variant="contained" color="secondary" onClick={handleCreate}>Créer</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
