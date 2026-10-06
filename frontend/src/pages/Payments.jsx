import { useContext } from 'react';
import { Alert, Box, Card, Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { AppContext } from '../context/AppContext.jsx';
import { api, unwrap } from '../api/client.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../components/common/StateViews.jsx';
import { formatCurrency, formatDate, sentenceCase } from '../utils/format.js';
import { tokens } from '../theme.js';

async function loadPayments(isClient) {
  return unwrap(await api.get(isClient ? '/client-portal/my-invoices' : '/finance/invoices')) || [];
}

export default function Payments() {
  const { authType } = useContext(AppContext);
  const isClient = authType === 'client';
  const { data, loading, error, reload } = useAsyncData(() => loadPayments(isClient), [isClient]);

  if (loading) return <LoadingCard message="Chargement des paiements…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;
  if (!data?.length) return <EmptyCard title="Aucune facture" message="Aucune facture exploitable pour les paiements n'a été trouvée." />;

  return (
    <Box>
      <Alert severity="warning" sx={{ mb: 2.5 }}>
        Il n'existe pas encore d'endpoint backend pour lister l'historique détaillé des paiements. Cette page s'appuie donc sur les factures disponibles et signale cette lacune explicitement.
      </Alert>

      <Card sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 820 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: tokens.color.cream }}>
              {['Facture', 'Type', 'Montant', 'Statut', 'Date'].map((label) => (
                <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((invoice) => (
              <TableRow key={invoice._id} hover>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{sentenceCase(invoice.type)}</TableCell>
                <TableCell>{formatCurrency(invoice.total)}</TableCell>
                <TableCell><Chip label={sentenceCase(invoice.status)} size="small" /></TableCell>
                <TableCell>{formatDate(invoice.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
