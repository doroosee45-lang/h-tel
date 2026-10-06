import { useMemo } from 'react';
import { Alert, Box, Card, Chip, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { api, unwrap } from '../api/client.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../components/common/StateViews.jsx';
import { formatCurrency, sentenceCase } from '../utils/format.js';
import { tokens } from '../theme.js';

async function loadStock() {
  const [itemsRes, alertsRes, suppliersRes, purchaseOrdersRes] = await Promise.all([
    api.get('/stock/items'),
    api.get('/stock/items/alerts'),
    api.get('/stock/suppliers'),
    api.get('/stock/purchase-orders')
  ]);

  return {
    items: unwrap(itemsRes) || [],
    alerts: unwrap(alertsRes) || [],
    suppliers: unwrap(suppliersRes) || [],
    purchaseOrders: unwrap(purchaseOrdersRes) || []
  };
}

export default function Stock() {
  const { data, loading, error, reload } = useAsyncData(loadStock, []);
  const inventoryValue = useMemo(() => (data?.items || []).reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0), [data?.items]);

  if (loading) return <LoadingCard message="Chargement des stocks…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Cette vue consomme <strong>/api/stock/items</strong>, <strong>/api/stock/items/alerts</strong>, <strong>/api/stock/suppliers</strong> et <strong>/api/stock/purchase-orders</strong>.
      </Alert>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={4}><Card sx={{ p: 3 }}><Typography variant="h6">Articles</Typography><Typography variant="h3">{data?.items?.length || 0}</Typography></Card></Grid>
        <Grid item xs={12} md={4}><Card sx={{ p: 3 }}><Typography variant="h6">Alertes critiques</Typography><Typography variant="h3">{data?.alerts?.length || 0}</Typography></Card></Grid>
        <Grid item xs={12} md={4}><Card sx={{ p: 3 }}><Typography variant="h6">Valeur estimée</Typography><Typography variant="h4">{formatCurrency(inventoryValue)}</Typography></Card></Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          {!data?.items?.length ? (
            <EmptyCard title="Aucun article" message="Aucun produit de stock n'a été trouvé." />
          ) : (
            <Card sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: tokens.color.cream }}>
                    {['Produit', 'Catégorie', 'Quantité', 'Seuil', 'Fournisseur', 'Valeur'].map((label) => (
                      <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.items.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{sentenceCase(item.category)}</TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>{item.minThreshold} {item.unit}</TableCell>
                      <TableCell>{item.supplier?.name || '—'}</TableCell>
                      <TableCell>{formatCurrency((item.unitPrice || 0) * (item.quantity || 0))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, mb: 2.5 }}>
            <Typography variant="h6">Alertes</Typography>
            {(data?.alerts || []).length ? (
              <List disablePadding>
                {data.alerts.map((item) => (
                  <ListItem key={item._id} disableGutters divider>
                    <ListItemText primary={item.name} secondary={`${item.quantity} ${item.unit} restants · seuil ${item.minThreshold}`} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">Aucune alerte de stock critique.</Typography>
            )}
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6">Commandes fournisseurs</Typography>
            {(data?.purchaseOrders || []).length ? (
              <List disablePadding>
                {data.purchaseOrders.slice(0, 6).map((order) => (
                  <ListItem key={order._id} disableGutters divider>
                    <ListItemText primary={order.reference} secondary={`${order.supplier?.name || 'Sans fournisseur'} · ${sentenceCase(order.status)} · ${formatCurrency(order.totalAmount)}`} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">Aucune commande fournisseur pour le moment.</Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
