import { useContext, useState } from 'react';
import { Card, Box, Typography, Stack, Divider, IconButton, Button, Chip, Snackbar, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { AppContext } from '../../context/AppContext.jsx';
import { currency } from '../../data/mockData.js';
import { tokens } from '../../theme.js';

export default function CartSummary() {
  const {
    cartItems,
    cartSubtotal,
    updateCartItem,
    removeCartItem,
    clearCart,
    selectedPaymentMethod,
    paymentMethods,
    setSelectedPaymentMethod,
    userRole,
    setPayments,
    addAuditLog,
    addNotification
  } = useContext(AppContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handlePayment = () => {
    if (cartItems.length === 0) return;
    const id = `PAY-${Date.now().toString().slice(-6)}`;
    const details = cartItems.map((i) => `${i.nom} x${i.quantite}`).join(', ');
    const isClientRole = userRole === 'client';
    setPayments((prev) => [
      {
        id,
        reference: isClientRole ? `CMD-${Date.now().toString().slice(-3)}` : 'MANUEL',
        client: isClientRole ? 'M. Kanyinda Tshibola' : 'Comptoir',
        type: isClientRole ? 'Restaurant & Bar' : 'Point de vente',
        methode: selectedPaymentMethod,
        montant: cartSubtotal,
        statut: 'Payé',
        date: new Date().toISOString().slice(0, 10)
      },
      ...prev
    ]);
    addAuditLog(`Paiement ${id} de ${currency(cartSubtotal)} par ${selectedPaymentMethod} — ${details}`, 'Paiements');
    addNotification(`Paiement reçu — ${currency(cartSubtotal)}`, 'M. Kanyinda Tshibola', 'Email');
    clearCart();
    setSnackbar({ open: true, message: `Paiement de ${currency(cartSubtotal)} par ${selectedPaymentMethod} enregistré.`, severity: 'success' });
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Panier</Typography>
      {cartItems.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Votre panier est vide pour le moment.</Typography>
      ) : (
        <Stack spacing={2}>
          {cartItems.map((item) => (
            <Box key={item.id}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{item.nom}</Typography>
                  <Typography variant="caption" color="text.secondary">{currency(item.prix)} / unité</Typography>
                </Box>
                <Typography sx={{ fontWeight: 700 }}>{currency(item.prix * item.quantite)}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton size="small" onClick={() => updateCartItem(item.id, item.quantite - 1)}>
                    <RemoveCircleOutlineIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantite}</Typography>
                  <IconButton size="small" onClick={() => updateCartItem(item.id, item.quantite + 1)}>
                    <AddCircleOutlineIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
                <IconButton size="small" onClick={() => removeCartItem(item.id)}>
                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">Sous-total</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>{currency(cartSubtotal)}</Typography>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>Mode de paiement</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            {paymentMethods.map((method) => (
              <Chip
                key={method}
                label={method}
                size="small"
                onClick={() => setSelectedPaymentMethod(method)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  bgcolor: selectedPaymentMethod === method ? tokens.color.navy : tokens.color.cream,
                  color: selectedPaymentMethod === method ? '#fff' : 'text.primary'
                }}
              />
            ))}
          </Stack>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ boxShadow: 'none', mt: 2 }}
            onClick={handlePayment}
            disabled={cartItems.length === 0}
          >
            Payer avec {selectedPaymentMethod}
          </Button>
          <Button variant="text" fullWidth onClick={clearCart}>
            Vider le panier
          </Button>
        </Stack>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Card>
  );
}
