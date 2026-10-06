import { useState } from 'react';
import { Alert, Box, Button, Card, Chip, Dialog, DialogContent, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { api, unwrap } from '../../api/client.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../../components/common/StateViews.jsx';
import { formatCurrency, formatDateTime, sentenceCase } from '../../utils/format.js';
import { tokens } from '../../theme.js';

async function loadConcierge() {
  return unwrap(await api.get('/client-portal/my-concierge-requests')) || [];
}

export default function ClientConcierge() {
  const { data, loading, error, reload } = useAsyncData(loadConcierge, []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'airport_shuttle', details: '', scheduledFor: '', cost: 0, isBilledToRoom: true });

  const handleCreate = async () => {
    await api.post('/client-portal/concierge-request', form);
    setOpen(false);
    setForm({ type: 'airport_shuttle', details: '', scheduledFor: '', cost: 0, isBilledToRoom: true });
    await reload();
  };

  if (loading) return <LoadingCard message="Chargement de la conciergerie…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Vos demandes utilisent <strong>/api/client-portal/my-concierge-requests</strong> et <strong>/api/client-portal/concierge-request</strong>.
      </Alert>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Typography variant="h6">Demandes de conciergerie</Typography>
        <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>Nouvelle demande</Button>
      </Stack>

      {!data?.length ? (
        <EmptyCard title="Aucune demande" message="Vous n'avez encore soumis aucune demande de conciergerie." />
      ) : (
        <Card sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 860 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: tokens.color.cream }}>
                {['Référence', 'Type', 'Détails', 'Planifié', 'Coût', 'Statut'].map((label) => (
                  <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((request) => (
                <TableRow key={request._id} hover>
                  <TableCell>{request.reference}</TableCell>
                  <TableCell>{sentenceCase(request.type)}</TableCell>
                  <TableCell>{request.details || '—'}</TableCell>
                  <TableCell>{formatDateTime(request.scheduledFor || request.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(request.cost || 0)}</TableCell>
                  <TableCell><Chip label={sentenceCase(request.status)} size="small" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Nouvelle demande</Typography>
          <Stack spacing={2}>
            <TextField select label="Type" value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}>
              {['airport_shuttle', 'restaurant_reservation', 'tour_guide', 'laundry', 'other'].map((type) => (
                <MenuItem key={type} value={type}>{sentenceCase(type)}</MenuItem>
              ))}
            </TextField>
            <TextField label="Détails" multiline minRows={3} value={form.details} onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))} />
            <TextField label="Planifié pour" type="datetime-local" InputLabelProps={{ shrink: true }} value={form.scheduledFor} onChange={(event) => setForm((prev) => ({ ...prev, scheduledFor: event.target.value }))} />
            <Stack direction="row" justifyContent="flex-end" spacing={1.2}>
              <Button variant="outlined" onClick={() => setOpen(false)}>Annuler</Button>
              <Button variant="contained" color="secondary" onClick={handleCreate}>Envoyer</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
