import { useState, useContext } from 'react';
import {
  Grid, Card, Box, Typography, Stack, Chip, Button, Tabs, Tab, Divider, Snackbar, Alert
} from '@mui/material';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import LocalBarRoundedIcon from '@mui/icons-material/LocalBarRounded';
import { tokens } from '../../theme.js';
import { AppContext } from '../../context/AppContext.jsx';
import { clientOrdersData, currency } from '../../data/mockData.js';

const statutStyle = {
  'Livrée': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'En préparation': { bg: tokens.color.goldSoft, fg: tokens.color.navyDeep },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning },
  'Terminée': { bg: tokens.color.line, fg: 'text.secondary' }
};

export default function ClientOrders() {
  const { cartItems, cartSubtotal, addToCart, clearCart } = useContext(AppContext);
  const [tab, setTab] = useState('Tous');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const cats = ['Tous', 'Restaurant', 'Bar'];
  const orders = clientOrdersData.filter((o) => tab === 'Tous' || o.type === tab);

  const handleOrderFromCart = () => {
    if (cartItems.length === 0) return;
    setSnackbar({ open: true, message: `Commande de ${currency(cartSubtotal)} envoyée à la cuisine.`, severity: 'success' });
    clearCart();
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 52, height: 52, borderRadius: '13px', bgcolor: tokens.color.gold, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RestaurantRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h5">Mes Commandes</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Restaurant & Bar — suivez vos repas, quantités, prix et statut.
            </Typography>
          </Box>
        </Stack>
      </Card>

      {cartItems.length > 0 && (
        <Card sx={{ p: 2.5, mb: 2.5, border: `1px solid ${tokens.color.gold}`, bgcolor: tokens.color.goldSoft }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>Panier en cours — {cartItems.length} article(s)</Typography>
              <Typography variant="body2" color="text.secondary">Total : <strong>{currency(cartSubtotal)}</strong></Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="secondary" sx={{ boxShadow: 'none' }} onClick={handleOrderFromCart}>
                Commander maintenant
              </Button>
              <Button variant="outlined" onClick={clearCart}>Vider</Button>
            </Stack>
          </Stack>
        </Card>
      )}

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2.5, minHeight: 36, '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600, fontSize: 13.5 } }}
      >
        {cats.map((c) => <Tab key={c} label={c} value={c} />)}
      </Tabs>

      <Grid container spacing={2.5}>
        {orders.map((o) => (
          <Grid item xs={12} md={6} key={o.id}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  {o.type === 'Bar' ? (
                    <LocalBarRoundedIcon sx={{ color: tokens.color.info, fontSize: 20 }} />
                  ) : (
                    <RestaurantRoundedIcon sx={{ color: tokens.color.gold, fontSize: 20 }} />
                  )}
                  <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700 }}>{o.id}</Typography>
                </Stack>
                <Chip label={o.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[o.statut]?.bg, color: statutStyle[o.statut]?.fg }} />
              </Stack>

              <Stack spacing={1}>
                {o.items.map((item, i) => (
                  <Stack key={i} direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      {item.nom} <span style={{ opacity: 0.7 }}>× {item.quantite}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: tokens.font.mono }}>{currency(item.prix * item.quantite)}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 1.6, borderStyle: 'dashed' }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.4}>
                  <Typography variant="caption" color="text.secondary">{new Date(o.date).toLocaleDateString('fr-FR')} · {o.methode}</Typography>
                  <Typography variant="caption" color="text.secondary">{o.type}</Typography>
                </Stack>
                <Typography sx={{ fontWeight: 700, fontFamily: tokens.font.mono, color: tokens.color.navy }}>{currency(o.total)}</Typography>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

