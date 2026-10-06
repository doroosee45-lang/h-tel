import { Alert, Box, Card, Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { api, unwrap } from '../../api/client.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../../components/common/StateViews.jsx';
import { formatCurrency, formatDate, sentenceCase } from '../../utils/format.js';
import { tokens } from '../../theme.js';

async function loadInvoices() {
  return unwrap(await api.get('/client-portal/my-invoices')) || [];
}

export default function ClientInvoices() {
  const { data, loading, error, reload } = useAsyncData(loadInvoices, []);

  if (loading) return <LoadingCard message="Chargement de vos factures…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;
  if (!data?.length) return <EmptyCard title="Aucune facture" message="Aucune facture client n'est disponible pour votre compte." />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Vos factures proviennent de <strong>/api/client-portal/my-invoices</strong>.
      </Alert>

      <Card sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 820 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: tokens.color.cream }}>
              {['Facture', 'Type', 'Total', 'Statut', 'Date'].map((label) => (
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
