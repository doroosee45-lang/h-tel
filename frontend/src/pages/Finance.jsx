import { Alert, Box, Card, Chip, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { api, unwrap } from '../api/client.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../components/common/StateViews.jsx';
import { formatCurrency, formatDate, fullName, sentenceCase } from '../utils/format.js';
import { tokens } from '../theme.js';

async function safeRequest(request, fallback) {
  try {
    return unwrap(await request());
  } catch {
    return fallback;
  }
}

async function loadFinance() {
  const [invoices, cashRegisters, expenses, dailyReport, ledger] = await Promise.all([
    safeRequest(() => api.get('/finance/invoices'), []),
    safeRequest(() => api.get('/finance/cash-register'), []),
    safeRequest(() => api.get('/finance/expenses'), []),
    safeRequest(() => api.get('/finance/reports/daily'), null),
    safeRequest(() => api.get('/finance/reports/ledger', { params: { from: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10), to: new Date().toISOString().slice(0, 10) } }), null)
  ]);

  return { invoices, cashRegisters, expenses, dailyReport, ledger };
}

export default function Finance() {
  const { data, loading, error, reload } = useAsyncData(loadFinance, []);

  if (loading) return <LoadingCard message="Chargement des données financières…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Factures et caisses sont branchées sur l'API. Les rapports et dépenses restent visibles seulement si le rôle connecté dispose des droits backend requis.
      </Alert>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={3}><Card sx={{ p: 3 }}><Typography variant="h6">Factures</Typography><Typography variant="h3">{data?.invoices?.length || 0}</Typography></Card></Grid>
        <Grid item xs={12} md={3}><Card sx={{ p: 3 }}><Typography variant="h6">Caisses</Typography><Typography variant="h3">{data?.cashRegisters?.length || 0}</Typography></Card></Grid>
        <Grid item xs={12} md={3}><Card sx={{ p: 3 }}><Typography variant="h6">Dépenses</Typography><Typography variant="h3">{data?.expenses?.length || 0}</Typography></Card></Grid>
        <Grid item xs={12} md={3}><Card sx={{ p: 3 }}><Typography variant="h6">Revenu journalier</Typography><Typography variant="h4">{formatCurrency(data?.dailyReport?.totalRevenue || 0)}</Typography></Card></Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          {(data?.invoices || []).length ? (
            <Card sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 860 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: tokens.color.cream }}>
                    {['Facture', 'Client', 'Type', 'Total', 'Statut', 'Créée le'].map((label) => (
                      <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.invoices.map((invoice) => (
                    <TableRow key={invoice._id} hover>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{fullName(invoice.client)}</TableCell>
                      <TableCell>{sentenceCase(invoice.type)}</TableCell>
                      <TableCell>{formatCurrency(invoice.total)}</TableCell>
                      <TableCell><Chip label={sentenceCase(invoice.status)} size="small" /></TableCell>
                      <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <EmptyCard title="Aucune facture" message="Le backend ne renvoie aucune facture." />
          )}
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ p: 3, mb: 2.5 }}>
            <Typography variant="h6">Rapport du jour</Typography>
            {data?.dailyReport ? (
              <List disablePadding>
                <ListItem disableGutters divider><ListItemText primary="Chiffre d'affaires" secondary={formatCurrency(data.dailyReport.totalRevenue)} /></ListItem>
                <ListItem disableGutters divider><ListItemText primary="Dépenses" secondary={formatCurrency(data.dailyReport.totalExpenses)} /></ListItem>
                <ListItem disableGutters divider><ListItemText primary="Profit net" secondary={formatCurrency(data.dailyReport.netProfit)} /></ListItem>
                <ListItem disableGutters><ListItemText primary="Paiements enregistrés" secondary={data.dailyReport.paymentCount} /></ListItem>
              </List>
            ) : (
              <Typography color="text.secondary">Aucun rapport détaillé disponible pour ce rôle.</Typography>
            )}
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6">Grand livre</Typography>
            {data?.ledger?.ledger?.length ? (
              <List disablePadding>
                {data.ledger.ledger.slice(0, 8).map((entry, index) => (
                  <ListItem key={index} disableGutters divider>
                    <ListItemText primary={entry.description} secondary={`${formatDate(entry.date)} · ${sentenceCase(entry.type)} · Solde ${formatCurrency(entry.balance)}`} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">Le grand livre n'est pas accessible ou ne contient aucune écriture sur la période.</Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
