import { Alert, Box, Card, Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { api, unwrap } from '../../api/client.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../../components/common/StateViews.jsx';
import { formatCurrency, formatDate, sentenceCase } from '../../utils/format.js';
import { tokens } from '../../theme.js';

async function loadOrders() {
  return unwrap(await api.get('/client-portal/my-orders')) || [];
}

export default function ClientOrders() {
  const { data, loading, error, reload } = useAsyncData(loadOrders, []);

  if (loading) return <LoadingCard message="Chargement de vos commandes…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;
  if (!data?.length) return <EmptyCard title="Aucune commande" message="Vous n'avez pas encore passé de commande restaurant ou bar." />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Vos commandes proviennent de <strong>/api/client-portal/my-orders</strong>.
      </Alert>

      <Card sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 860 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: tokens.color.cream }}>
              {['Commande', 'Origine', 'Canal', 'Total', 'Paiement', 'Statut', 'Créée le'].map((label) => (
                <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((order) => (
              <TableRow key={order._id} hover>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{sentenceCase(order.origin)}</TableCell>
                <TableCell>{sentenceCase(order.channel)}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>{order.isPaid ? 'Payé' : 'À payer'}</TableCell>
                <TableCell><Chip label={sentenceCase(order.status)} size="small" /></TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
