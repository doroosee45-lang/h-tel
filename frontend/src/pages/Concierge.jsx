import { useState } from 'react';
import { Alert, Box, Button, Card, Chip, Dialog, DialogContent, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { api, unwrap } from '../api/client.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../components/common/StateViews.jsx';
import { formatCurrency, formatDateTime, fullName, sentenceCase } from '../utils/format.js';
import { tokens } from '../theme.js';

async function loadConcierge() {
  return unwrap(await api.get('/concierge/requests')) || [];
}

export default function Concierge() {
  const { data, loading, error, reload } = useAsyncData(loadConcierge, []);
  const [selected, setSelected] = useState(null);

  const updateStatus = async (id, status) => {
    await api.patch(`/concierge/requests/${id}/status`, { status });
    await reload();
  };

  if (loading) return <LoadingCard message="Chargement des demandes de conciergerie…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Liste et mise à jour issues de <strong>/api/concierge/requests</strong>.
      </Alert>

      {!data?.length ? (
        <EmptyCard title="Aucune demande" message="Aucune demande de conciergerie n'est disponible pour le moment." />
      ) : (
        <Card sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: tokens.color.cream }}>
                {['Référence', 'Client', 'Type', 'Détails', 'Planifié', 'Coût', 'Statut', ''].map((label) => (
                  <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((request) => (
                <TableRow key={request._id} hover>
                  <TableCell>{request.reference}</TableCell>
                  <TableCell>{fullName(request.client)}</TableCell>
                  <TableCell>{sentenceCase(request.type)}</TableCell>
                  <TableCell>{request.details || '—'}</TableCell>
                  <TableCell>{formatDateTime(request.scheduledFor || request.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(request.cost || 0)}</TableCell>
                  <TableCell>
                    <TextField select size="small" value={request.status} onChange={(event) => updateStatus(request._id, event.target.value)}>
                      {['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                        <MenuItem key={status} value={status}>{sentenceCase(status)}</MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell><Button size="small" onClick={() => setSelected(request)}>Voir</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{selected?.reference}</Typography>
          {selected ? (
            <Stack spacing={1.5}>
              <Chip label={sentenceCase(selected.status)} size="small" sx={{ width: 'fit-content' }} />
              <Typography><strong>Client:</strong> {fullName(selected.client)}</Typography>
              <Typography><strong>Type:</strong> {sentenceCase(selected.type)}</Typography>
              <Typography><strong>Chambre:</strong> {selected.room?.number || '—'}</Typography>
              <Typography><strong>Détails:</strong> {selected.details || '—'}</Typography>
            </Stack>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
