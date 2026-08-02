import { useContext, useState } from 'react';
import {
  Grid, Card, Box, Typography, Stack, Chip, Button, Table, TableHead, TableRow, TableCell,
  TableBody, Dialog, DialogContent, MenuItem, TextField, Snackbar, Alert
} from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { AppContext } from '../context/AppContext.jsx';
import { payments as initialPayments, repartitionPaiements, clientOrdersData, clientInvoicesData, currency } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

const PIE_COLORS = [tokens.color.navy, tokens.color.gold, tokens.color.info, tokens.color.success, tokens.color.warning, tokens.color.navySoft, tokens.color.danger, tokens.color.inkMuted];

const statutStyle = {
  'Payé': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning },
  'Échec': { bg: tokens.color.dangerSoft, fg: tokens.color.danger }
};

export default function Payments() {
  const { userRole, payments, setPayments, selectedPaymentMethod, setSelectedPaymentMethod, paymentMethods, addAuditLog, addNotification } = useContext(AppContext);
  const [openPay, setOpenPay] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');

  const isClient = userRole === 'Client';

  const pendingCount = payments.filter((p) => p.statut === 'En attente').length;
  const paidTotal = payments.filter((p) => p.statut === 'Payé').reduce((s, p) => s + p.montant, 0);

  // En vue client, on montre les paiements du client connecté (C001)
  const clientPayments = [
    ...payments.filter((p) => p.client === 'M. Kanyinda Tshibola'),
    ...clientOrdersData.map((o) => ({ id: `PAY-${o.id}`, reference: o.id, client: 'M. Kanyinda Tshibola', type: o.type === 'Bar' ? 'Bar' : 'Restaurant', methode: o.methode, montant: o.total, statut: o.statut === 'Livrée' || o.statut === 'Terminée' ? 'Payé' : 'En attente', date: o.date })),
    ...clientInvoicesData.filter((i) => i.statut === 'En attente').map((i) => ({ id: `PAY-${i.id}`, reference: i.id, client: 'M. Kanyinda Tshibola', type: 'Facture', methode: i.methode, montant: i.total, statut: 'En attente', date: i.date }))
  ];

  const rows = filterRecords(
    isClient ? clientPayments : payments,
    searchQuery,
    ['reference', 'client', 'type', 'methode', 'methodePaiement', 'statut', 'montant', 'id', 'date']
  );

  const handleRecordPayment = () => {
    if (!selectedPaymentMethod) return;
    setPayments((prev) => [
      {
        id: `PAY-${Date.now().toString().slice(-4)}`,
        reference: 'MANUEL',
        client: isClient ? 'M. Kanyinda Tshibola' : 'Client',
        type: 'Manuel',
        methode: selectedPaymentMethod,
        montant: 0,
        statut: 'Payé',
        date: new Date().toISOString().slice(0, 10)
      },
      ...prev
    ]);
    addAuditLog(`Paiement enregistré via ${selectedPaymentMethod}`, 'Paiements');
    addNotification(`Paiement ${selectedPaymentMethod} enregistré`, 'Client', 'Email');
    setOpenPay(false);
    setSnackbar({ open: true, message: `Paiement ${selectedPaymentMethod} enregistré.`, severity: 'success' });
  };

  return (
    <Box>
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1.4} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: tokens.color.navy, color: tokens.color.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PaymentsRoundedIcon />
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">Transactions</Typography>
                <Typography variant="h4">{rows.length}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1.4} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: tokens.color.successSoft, color: tokens.color.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleRoundedIcon />
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">Montant payé</Typography>
                <Typography variant="h6" sx={{ fontFamily: tokens.font.mono }}>{currency(isClient ? clientPayments.filter((p) => p.statut === 'Payé').reduce((s, p) => s + p.montant, 0) : paidTotal)}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1.4} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: tokens.color.warningSoft, color: tokens.color.warning, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PendingActionsRoundedIcon />
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">En attente</Typography>
                <Typography variant="h4">{rows.filter((p) => p.statut === 'En attente').length}</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="overline" color="text.secondary">Méthodes acceptées</Typography>
            <Typography variant="h4">{paymentMethods.length}</Typography>
            <Typography variant="caption" color="text.secondary">M-Pesa · Orange · Airtel · Africell · Visa · MC · Virement · Espèces</Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, mb: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Répartition par méthode</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={repartitionPaiements} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {repartitionPaiements.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
          {!isClient && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>Enregistrer un paiement</Typography>
              <TextField
                label="Mode de paiement"
                select
                size="small"
                fullWidth
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<AddCardRoundedIcon />}
                sx={{ mt: 2, boxShadow: 'none' }}
                onClick={() => setOpenPay(true)}
              >
                Encaisser un paiement
              </Button>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card sx={{ overflowX: 'auto' }}>
            <Box sx={{ p: 3, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
              <Box>
                <Typography variant="h6">{isClient ? 'Mes paiements' : 'Toutes les transactions'}</Typography>
                <Typography variant="caption" color="text.secondary">Reliés aux réservations, commandes restaurant/bar, activités et factures.</Typography>
              </Box>
              <SearchField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher par référence, client, méthode, statut…"
                sx={{ minWidth: { sm: 260 } }}
              />
            </Box>
            <Table sx={{ minWidth: 680 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: tokens.color.cream }}>
                  {['Référence', 'Type', 'Méthode', 'Montant', 'Date', 'Statut'].map((h) => (
                    <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ fontFamily: tokens.font.mono, fontSize: 12.5 }}>{p.reference}</TableCell>
                    <TableCell>{p.type}</TableCell>
                    <TableCell>
                      <Chip label={p.methode} size="small" sx={{ bgcolor: tokens.color.cream, fontWeight: 600 }} />
                    </TableCell>
                    <TableCell sx={{ fontFamily: tokens.font.mono, fontWeight: 700 }}>{currency(p.montant)}</TableCell>
                    <TableCell>{new Date(p.date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <Chip label={p.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[p.statut]?.bg, color: statutStyle[p.statut]?.fg }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openPay} onClose={() => setOpenPay(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Confirmer l’encaissement</Typography>
          <Typography variant="body2" color="text.secondary">
            Paiement enregistré via <strong>{selectedPaymentMethod}</strong>. Le client recevra une notification.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={() => setOpenPay(false)}>Annuler</Button>
            <Button fullWidth variant="contained" color="secondary" onClick={handleRecordPayment}>Confirmer</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

