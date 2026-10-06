import { useContext, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  List,
  ListItem,
  ListItemText,
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
import { AppContext } from '../context/AppContext.jsx';
import { api, unwrap } from '../api/client.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../components/common/StateViews.jsx';
import { formatCurrency, fullName, sentenceCase } from '../utils/format.js';
import { tokens } from '../theme.js';

async function loadRestaurant(isClient) {
  const requests = [api.get('/restaurant/items'), api.get('/restaurant/categories')];
  if (!isClient) {
    requests.push(api.get('/restaurant/orders'));
    requests.push(api.get('/restaurant/tables'));
  }

  const [itemsRes, categoriesRes, ordersRes, tablesRes] = await Promise.all(requests);
  return {
    items: unwrap(itemsRes) || [],
    categories: unwrap(categoriesRes) || [],
    orders: unwrap(ordersRes) || [],
    tables: unwrap(tablesRes) || []
  };
}

export default function Restaurant() {
  const { authType } = useContext(AppContext);
  const isClient = authType === 'client';
  const { data, loading, error, reload } = useAsyncData(() => loadRestaurant(isClient), [isClient]);
  const [category, setCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderForm, setOrderForm] = useState({ quantity: 1, notes: '', paymentMethod: 'card' });

  const items = useMemo(() => (data?.items || []).filter((item) => category === 'all' || item.category?._id === category), [category, data?.items]);

  const handleCreateOrder = async () => {
    if (!selectedItem) return;
    if (isClient) {
      await api.post('/client-portal/order', {
        origin: 'restaurant',
        items: [{ menuItem: selectedItem._id, quantity: Number(orderForm.quantity), notes: orderForm.notes }]
      });
    } else {
      await api.post('/restaurant/orders', {
        items: [{ menuItem: selectedItem._id, quantity: Number(orderForm.quantity), notes: orderForm.notes }],
        channel: 'dine_in'
      });
    }
    setSelectedItem(null);
    setOrderForm({ quantity: 1, notes: '', paymentMethod: 'card' });
    await reload();
  };

  if (loading) return <LoadingCard message="Chargement du restaurant…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Menu depuis <strong>/api/restaurant/items</strong>. {isClient ? 'Les commandes client passent par /api/client-portal/order.' : 'Le suivi des commandes staff utilise /api/restaurant/orders.'}
      </Alert>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} sx={{ mb: 2.5, gap: 1.5 }}>
        <TextField select size="small" value={category} onChange={(event) => setCategory(event.target.value)} sx={{ minWidth: 240 }}>
          <MenuItem value="all">Toutes les catégories</MenuItem>
          {(data?.categories || []).map((item) => (
            <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
          ))}
        </TextField>
        {!isClient ? <Chip label={`${(data?.orders || []).length} commande(s)`} /> : null}
      </Stack>

      {!items.length ? (
        <EmptyCard title="Aucun article" message="Le restaurant ne renvoie aucun article disponible." />
      ) : (
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={isClient ? 12 : 7}>
            <Grid container spacing={2.5}>
              {items.map((item) => (
                <Grid item xs={12} md={6} key={item._id}>
                  <Card sx={{ p: 2.5, height: '100%' }}>
                    <Stack spacing={1.2} sx={{ height: '100%' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h6">{item.name}</Typography>
                          <Typography color="text.secondary">{item.category?.name || 'Sans catégorie'}</Typography>
                        </Box>
                        <Chip label={item.isAvailable ? 'Disponible' : 'Indisponible'} color={item.isAvailable ? 'success' : 'default'} size="small" />
                      </Stack>
                      <Typography color="text.secondary">{item.description || 'Aucune description.'}</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{formatCurrency(item.price)}</Typography>
                      <Box sx={{ mt: 'auto' }}>
                        <Button variant="contained" color="secondary" onClick={() => setSelectedItem(item)} disabled={!item.isAvailable}>
                          {isClient ? 'Commander' : 'Créer une commande'}
                        </Button>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {!isClient ? (
            <Grid item xs={12} lg={5}>
              <Card sx={{ p: 3, mb: 2.5 }}>
                <Typography variant="h6">Tables</Typography>
                <List disablePadding>
                  {(data?.tables || []).slice(0, 8).map((table) => (
                    <ListItem key={table._id} disableGutters divider>
                      <ListItemText primary={table.name || `Table ${table.number || ''}`} secondary={`${sentenceCase(table.status)} · ${table.seats || '—'} places`} />
                    </ListItem>
                  ))}
                </List>
              </Card>

              <Card sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 560 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: tokens.color.cream }}>
                      {['Commande', 'Client', 'Total', 'Statut'].map((label) => (
                        <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data?.orders || []).slice(0, 8).map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>{order.orderNumber}</TableCell>
                        <TableCell>{fullName(order.client)}</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell><Chip label={sentenceCase(order.status)} size="small" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Grid>
          ) : null}
        </Grid>
      )}

      <Dialog open={Boolean(selectedItem)} onClose={() => setSelectedItem(null)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{selectedItem?.name}</Typography>
          <Stack spacing={2}>
            <TextField label="Quantité" type="number" value={orderForm.quantity} onChange={(event) => setOrderForm((prev) => ({ ...prev, quantity: Number(event.target.value) }))} />
            <TextField label="Notes" multiline minRows={3} value={orderForm.notes} onChange={(event) => setOrderForm((prev) => ({ ...prev, notes: event.target.value }))} />
            <Stack direction="row" justifyContent="flex-end" spacing={1.2}>
              <Button variant="outlined" onClick={() => setSelectedItem(null)}>Annuler</Button>
              <Button variant="contained" color="secondary" onClick={handleCreateOrder}>Confirmer</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
