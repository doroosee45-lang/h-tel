import { useMemo } from 'react';
import { Alert, Box, Button, Card, Chip, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { api, unwrap } from '../api/client.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../components/common/StateViews.jsx';
import { formatCurrency, formatDate, fullName, sentenceCase } from '../utils/format.js';
import { tokens } from '../theme.js';

async function loadCheckInOut() {
  return unwrap(await api.get('/reservations')) || [];
}

export default function CheckInOut() {
  const { data, loading, error, reload } = useAsyncData(loadCheckInOut, []);

  const todayItems = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return (data || []).filter((reservation) => {
      const checkIn = reservation.checkInDate?.slice(0, 10);
      const checkOut = reservation.checkOutDate?.slice(0, 10);
      return checkIn === today || checkOut === today || reservation.status === 'checked_in';
    });
  }, [data]);

  const handleCheckIn = async (id) => {
    await api.post(`/reservations/${id}/checkin`, {});
    await reload();
  };

  const handleCheckOut = async (id) => {
    await api.post(`/reservations/${id}/checkout`, {});
    await reload();
  };

  if (loading) return <LoadingCard message="Chargement des arrivées et départs…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Les actions utilisent <strong>/api/reservations/:id/checkin</strong> et <strong>/api/reservations/:id/checkout</strong>. Le checkout renvoie aussi la facture finale générée par le backend.
      </Alert>

      {!todayItems.length ? (
        <EmptyCard title="Aucune opération aujourd'hui" message="Aucune arrivée, départ ou présence en cours n'a été trouvée pour aujourd'hui." />
      ) : (
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={1.2}>
                <Typography variant="h6">Synthèse</Typography>
                <Chip icon={<LoginRoundedIcon />} label={`${todayItems.filter((item) => item.status === 'confirmed').length} check-in à traiter`} />
                <Chip icon={<LogoutRoundedIcon />} label={`${todayItems.filter((item) => item.status === 'checked_in').length} check-out possibles`} />
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 860 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: tokens.color.cream }}>
                    {['Référence', 'Client', 'Chambre', 'Séjour', 'Montant', 'Statut', 'Action'].map((label) => (
                      <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todayItems.map((reservation) => (
                    <TableRow key={reservation._id} hover>
                      <TableCell>{reservation.reference}</TableCell>
                      <TableCell>{fullName(reservation.client)}</TableCell>
                      <TableCell>{reservation.room?.number || '—'}</TableCell>
                      <TableCell>{formatDate(reservation.checkInDate)} → {formatDate(reservation.checkOutDate)}</TableCell>
                      <TableCell>{formatCurrency(reservation.totalAmount)}</TableCell>
                      <TableCell><Chip label={sentenceCase(reservation.status)} size="small" /></TableCell>
                      <TableCell>
                        {reservation.status === 'confirmed' ? (
                          <Button size="small" variant="contained" onClick={() => handleCheckIn(reservation._id)}>Check-in</Button>
                        ) : reservation.status === 'checked_in' ? (
                          <Button size="small" variant="contained" color="secondary" onClick={() => handleCheckOut(reservation._id)}>Check-out</Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">Aucune action</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
