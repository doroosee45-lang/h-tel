import { Alert, Box, Card, Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { api, unwrap } from '../../api/client.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../../components/common/StateViews.jsx';
import { formatCurrency, formatDate, sentenceCase } from '../../utils/format.js';
import { tokens } from '../../theme.js';

async function loadReservations() {
  return unwrap(await api.get('/client-portal/my-reservations')) || [];
}

export default function ClientReservations() {
  const { data, loading, error, reload } = useAsyncData(loadReservations, []);

  if (loading) return <LoadingCard message="Chargement de vos réservations…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;
  if (!data?.length) return <EmptyCard title="Aucune réservation" message="Vous n'avez encore aucune réservation côté portail client." />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Vos séjours proviennent de <strong>/api/client-portal/my-reservations</strong>.
      </Alert>

      <Card sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 860 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: tokens.color.cream }}>
              {['Référence', 'Chambre', 'Arrivée', 'Départ', 'Montant', 'Statut'].map((label) => (
                <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((reservation) => (
              <TableRow key={reservation._id} hover>
                <TableCell>{reservation.reference}</TableCell>
                <TableCell>{reservation.room?.number || '—'}</TableCell>
                <TableCell>{formatDate(reservation.checkInDate)}</TableCell>
                <TableCell>{formatDate(reservation.checkOutDate)}</TableCell>
                <TableCell>{formatCurrency(reservation.totalAmount)}</TableCell>
                <TableCell><Chip label={sentenceCase(reservation.status)} size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
