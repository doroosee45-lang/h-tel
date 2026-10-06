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

async function loadBar(isClient) {
  const requests = [api.get('/bar/items'), api.get('/bar/categories')];
  if (!isClient) requests.push(api.get('/bar/orders'));
  const [itemsRes, categoriesRes, ordersRes] = await Promise.all(requests);
  return {
    items: unwrap(itemsRes) || [],
    categories: unwrap(categoriesRes) || [],
    orders: unwrap(ordersRes) || []
  };
}

export default function Bar() {
  const { authType } = useContext(AppContext);
  const isClient = authType === 'client';
  const { data, loading, error, reload } = useAsyncData(() => loadBar(isClient), [isClient]);
  const [category, setCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const items = useMemo(() => (data?.items || []).filter((item) => category === 'all' || item.category?._id === category), [category, data?.items]);

  const handleOrder = async () => {
    const payload = { items: [{ menuItem: selectedItem._id, quantity: Number(quantity) }] };
    if (isClient) {
      await api.post('/client-portal/order', { ...payload, origin: 'bar' });
    } else {
      await api.post('/bar/orders', payload);
    }
    setSelectedItem(null);
    setQuantity(1);
    await reload();
  };

  if (loading) return <LoadingCard message="Chargement du bar…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Les articles du bar proviennent de <strong>/api/bar/items</strong>. {isClient ? 'Les commandes client utilisent /api/client-portal/order avec origin="bar".' : 'Le suivi staff utilise /api/bar/orders.'}
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
        <EmptyCard title="Aucune boisson" message="Le backend ne renvoie aucun article bar disponible." />
      ) : (
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={isClient ? 12 : 7}>
            <Grid container spacing={2.5}>
              {items.map((item) => (
                <Grid item xs={12} md={6} key={item._id}>
                  <Card sx={{ p: 2.5, height: '100%' }}>
                    <Stack spacing={1.2} sx={{ height: '100%' }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Box>
                          <Typography variant="h6">{item.name}</Typography>
                          <Typography color="text.secondary">{item.category?.name || 'Sans catégorie'}</Typography>
                        </Box>
                        <Chip label={item.isAvailable ? 'Disponible' : 'Indisponible'} size="small" color={item.isAvailable ? 'success' : 'default'} />
                      </Stack>
                      <Typography color="text.secondary">{item.description || 'Aucune description.'}</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{formatCurrency(item.price)}</Typography>
                      <Box sx={{ mt: 'auto' }}>
                        <Button variant="contained" color="secondary" onClick={() => setSelectedItem(item)} disabled={!item.isAvailable}>
                          Commander
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
              <Card sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 520 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: tokens.color.cream }}>
                      {['Commande', 'Client', 'Total', 'Statut'].map((label) => (
                        <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data?.orders || []).slice(0, 10).map((order) => (
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

      <Dialog open={Boolean(selectedItem)} onClose={() => setSelectedItem(null)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{selectedItem?.name}</Typography>
          <Stack spacing={2}>
            <TextField label="Quantité" type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
            <Stack direction="row" justifyContent="flex-end" spacing={1.2}>
              <Button variant="outlined" onClick={() => setSelectedItem(null)}>Annuler</Button>
              <Button variant="contained" color="secondary" onClick={handleOrder}>Confirmer</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
