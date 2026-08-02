import { useContext, useState } from 'react';
import {
  Grid, Card, Box, Typography, Stack, Button, Chip, Divider, Snackbar, Alert,
  TextField, MenuItem, Dialog, DialogContent, DialogActions
} from '@mui/material';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import { tokens } from '../theme.js';
import { AppContext } from '../context/AppContext.jsx';
import { currency, clientInvoice } from '../data/mockData.js';

const lifecycleSteps = [
  { label: 'Réservation créée', desc: 'Le dossier a été saisi et en attente de confirmation.' },
  { label: 'Réservation confirmée', desc: 'Le client a reçu la confirmation et la chambre est bloquée.' },
  { label: 'Arrivée prévue', desc: 'Le client est attendu aujourd’hui et le service est prêt.' },
  { label: 'Check-in effectué', desc: 'L’enregistrement est validé et la clé est activée.' },
  { label: 'Séjour en cours', desc: 'Le client séjourne et peut consommer room service & bar.' },
  { label: 'Check-out effectué', desc: 'Le départ a été enregistré et la facture est clôturée.' },
  { label: 'Séjour terminé', desc: 'Le séjour est finalisé et le dossier est archivé.' }
];

export default function CheckInOut() {
  const {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentMethods
  } = useContext(AppContext);

  const [currentStage, setCurrentStage] = useState(2);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [paymentCaptured, setPaymentCaptured] = useState(false);
  const [invoiceSent, setInvoiceSent] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const total = clientInvoice.reduce((sum, item) => sum + item.montant, 0);

  const handleAdvanceStage = () => {
    if (currentStage < lifecycleSteps.length - 1) {
      setCurrentStage((prev) => prev + 1);
      setSnackbar({ open: true, message: `${lifecycleSteps[currentStage + 1].label} activé.`, severity: 'success' });
    }
  };

  const handleGenerateInvoice = () => {
    setInvoiceGenerated(true);
    setInvoiceOpen(true);
    setSnackbar({ open: true, message: 'Facture générée et prête à être consultée.', severity: 'info' });
  };

  const handleCapturePayment = () => {
    if (!invoiceGenerated) {
      setSnackbar({ open: true, message: 'Générez d’abord la facture avant d’encaisser.', severity: 'warning' });
      return;
    }
    setPaymentCaptured(true);
    setSnackbar({ open: true, message: `Paiement ${selectedPaymentMethod} encaissé.`, severity: 'success' });
  };

  const handlePrintInvoice = () => {
    window.print();
    setSnackbar({ open: true, message: 'Préparation de l’impression de la facture.', severity: 'info' });
  };

  const handleDownloadPdf = () => {
    setSnackbar({ open: true, message: 'PDF de la facture prêt à télécharger.', severity: 'info' });
  };

  const handleSendInvoice = () => {
    setInvoiceSent(true);
    setSnackbar({ open: true, message: 'Facture envoyée au client par email.', severity: 'success' });
  };

  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const currentStatus = lifecycleSteps[currentStage];

return (
    <Grid container spacing={2.5} sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <Grid item xs={12} md={7}>
        <Card sx={{ p: 3, mb: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h6">Suivi du séjour</Typography>
              <Typography variant="caption" color="text.secondary">Ch. R204 · Famille Muyaya · Réf. RS-13083</Typography>
            </Box>
            <Chip
              label={currentStatus.label}
              sx={{ bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, fontWeight: 700 }}
            />
          </Stack>

          <Stack spacing={2}>
            {lifecycleSteps.map((step, index) => {
              const completed = index <= currentStage;
              return (
                <Box key={step.label} sx={{ p: 2, borderRadius: '16px', bgcolor: completed ? tokens.color.successSoft : tokens.color.cream, border: `1px solid ${tokens.color.line}` }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography sx={{ fontWeight: 700 }}>{index + 1}. {step.label}</Typography>
                    <Chip
                      label={completed ? 'OK' : 'En attente'}
                      size="small"
                      sx={{ bgcolor: completed ? tokens.color.success : tokens.color.line, color: completed ? '#fff' : tokens.color.navyDeep }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
                </Box>
              );
            })}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              disabled={currentStage >= lifecycleSteps.length - 1}
              onClick={handleAdvanceStage}
            >
              Passer à l’étape suivante
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleGenerateInvoice}
            >
              Voir la facture
            </Button>
          </Stack>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Actions de facturation</Typography>
          <Stack spacing={2}>
            <TextField
              label="Mode de paiement"
              select
              size="small"
              value={selectedPaymentMethod}
              onChange={(event) => setSelectedPaymentMethod(event.target.value)}
              fullWidth
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method} value={method}>{method}</MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              fullWidth
              color="secondary"
              startIcon={<PaymentsRoundedIcon />}
              onClick={handleCapturePayment}
              disabled={!invoiceGenerated || paymentCaptured}
              sx={{ boxShadow: 'none' }}
            >
              {paymentCaptured ? 'Paiement effectué' : 'Encaisser le paiement'}
            </Button>

            <Box sx={{ p: 2, borderRadius: '16px', bgcolor: tokens.color.cream }}>
              <Typography variant="body2" color="text.secondary">Statut facture</Typography>
<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mt: 1 }}>
                <Chip label={invoiceGenerated ? 'Facture générée' : 'Facture non générée'} size="small" sx={{ bgcolor: invoiceGenerated ? tokens.color.successSoft : tokens.color.line, color: invoiceGenerated ? tokens.color.success : tokens.color.navyDeep }} />
                <Chip label={paymentCaptured ? 'Paiement reçu' : 'Paiement en attente'} size="small" sx={{ bgcolor: paymentCaptured ? tokens.color.successSoft : tokens.color.warningSoft, color: paymentCaptured ? tokens.color.success : tokens.color.warning }} />
                <Chip label={invoiceSent ? 'Envoyée' : 'Non envoyée'} size="small" sx={{ bgcolor: invoiceSent ? tokens.color.successSoft : tokens.color.line, color: invoiceSent ? tokens.color.success : tokens.color.navyDeep }} />
              </Stack>
            </Box>
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">Résumé de la facture</Typography>
            <Chip label={paymentCaptured ? 'Clôturée' : 'Ouverte'} size="small" sx={{ fontFamily: tokens.font.mono }} />
          </Stack>

          <Stack spacing={1.4}>
            {clientInvoice.map((item) => (
              <Stack key={item.label} direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" sx={{ fontFamily: tokens.font.mono }}>{currency(item.montant)}</Typography>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography sx={{ fontWeight: 700, fontFamily: tokens.font.mono, color: tokens.color.navy }}>{currency(total)}</Typography>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Mode de paiement sélectionné</Typography>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>{selectedPaymentMethod}</Typography>

<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2 }}>
            <Button variant="outlined" fullWidth startIcon={<ReceiptLongRoundedIcon />} onClick={handleGenerateInvoice}>
              Voir la facture
            </Button>
            <Button variant="contained" fullWidth color="secondary" startIcon={<PaymentsRoundedIcon />} onClick={handleCapturePayment} sx={{ boxShadow: 'none' }}>
              Payer maintenant
            </Button>
          </Stack>

          <Box sx={{ p: 2, borderRadius: '16px', bgcolor: tokens.color.cream, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Facturation instantanée accessible à l’écran et prête à partager.</Typography>
          </Box>
        </Card>
      </Grid>

      <Dialog open={invoiceOpen} onClose={() => setInvoiceOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Facture séjour</Typography>
          <Typography variant="caption" color="text.secondary">Famille Muyaya — Chambre R204</Typography>
          <Stack spacing={1.2} sx={{ mt: 2 }}>
            {clientInvoice.map((item) => (
              <Stack key={item.label} direction="row" justifyContent="space-between">
                <Typography variant="body2">{item.label}</Typography>
                <Typography variant="body2" sx={{ fontFamily: tokens.font.mono }}>{currency(item.montant)}</Typography>
              </Stack>
            ))}
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle2">Total</Typography>
            <Typography variant="subtitle2" sx={{ fontFamily: tokens.font.mono }}>{currency(total)}</Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">Mode de paiement choisi : {selectedPaymentMethod}</Typography>
        </DialogContent>
<DialogActions sx={{ px: 3, pb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={() => setInvoiceOpen(false)}>Fermer</Button>
          <Button onClick={handleDownloadPdf}>Télécharger PDF</Button>
          <Button onClick={handlePrintInvoice}>Imprimer</Button>
          <Button variant="contained" color="secondary" onClick={handleSendInvoice}>Envoyer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={closeSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
