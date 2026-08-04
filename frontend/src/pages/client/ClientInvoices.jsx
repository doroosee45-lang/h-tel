import { useState } from 'react';
import {
  Grid, Card, Box, Typography, Stack, Chip, Button, Dialog, DialogContent, Divider, Snackbar, Alert, IconButton
} from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import SearchField from '../../components/common/SearchField.jsx';
import { tokens } from '../../theme.js';
import { clientInvoicesData, currency } from '../../data/mockData.js';
import { filterRecords } from '../../utils/searchUtils.js';

const statutStyle = {
  'Payée': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning }
};

// ---------------------------------------------------------------------------
// Carte facture — une carte par facture, alignée en grille responsive
// (4 colonnes desktop / 2 colonnes tablette / 1 colonne mobile)
// ---------------------------------------------------------------------------
function InvoiceCard({ invoice, onView, onDownload, onPrint }) {
  const style = statutStyle[invoice.statut] || { bg: tokens.color.cream, fg: tokens.color.navy };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: `1px solid ${tokens.color.line}`,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: tokens.shadow.md }
      }}
    >
      {/* En-tête : icône + n° facture + statut */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ p: 2.2, pb: 1.4 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box
            sx={{
              width: 42, height: 42, borderRadius: '11px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep
            }}
          >
            <ReceiptLongRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 14.5, color: tokens.color.navyDeep, lineHeight: 1.2 }}>
              {invoice.id}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {invoice.periode}
            </Typography>
          </Box>
        </Stack>
        <Chip
          label={invoice.statut}
          size="small"
          sx={{ fontWeight: 700, fontSize: 11, flexShrink: 0, bgcolor: style.bg, color: style.fg }}
        />
      </Stack>

      <Divider />

      {/* Corps : date, méthode, total */}
      <Stack spacing={1.1} sx={{ px: 2.2, py: 1.8, flex: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarMonthRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            {new Date(invoice.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <PaymentsRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            {invoice.methode}
          </Typography>
        </Stack>
      </Stack>

      <Divider />

      {/* Total mis en avant */}
      <Box sx={{ px: 2.2, py: 1.6, bgcolor: tokens.color.cream }}>
        <Typography variant="caption" color="text.secondary">Montant total</Typography>
        <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 20, color: tokens.color.navy, lineHeight: 1.25 }}>
          {currency(invoice.total)}
        </Typography>
      </Box>

      {/* Actions */}
      <Stack direction="row" sx={{ p: 1.4, gap: 0.8 }}>
        <Button
          size="small" fullWidth startIcon={<VisibilityRoundedIcon sx={{ fontSize: 17 }} />}
          onClick={() => onView(invoice)}
          sx={{ fontSize: 12.5 }}
        >
          Voir
        </Button>
        <IconButton
          size="small"
          onClick={() => onDownload(invoice)}
          aria-label="Télécharger le PDF"
          sx={{ border: `1px solid ${tokens.color.line}`, borderRadius: '8px' }}
        >
          <DownloadRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onPrint(invoice)}
          aria-label="Imprimer"
          sx={{ border: `1px solid ${tokens.color.line}`, borderRadius: '8px' }}
        >
          <PrintRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Stack>
    </Card>
  );
}

export default function ClientInvoices() {
  const [openInvoice, setOpenInvoice] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const rows = filterRecords(clientInvoicesData, searchQuery, ['id', 'periode', 'date', 'total', 'statut', 'methode']);

  const showToast = (msg, severity = 'info') => setSnackbar({ open: true, message: msg, severity });

  const handleDownload = (inv) => showToast(`Téléchargement du PDF ${inv.id} prêt.`, 'success');
  const handlePrint = () => {
    showToast('Préparation de l’impression.', 'info');
    window.print();
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ flexWrap: 'wrap', gap: 1.5 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: 52, height: 52, borderRadius: '13px', bgcolor: tokens.color.gold, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ReceiptLongRoundedIcon />
            </Box>
            <Box>
              <Typography variant="h5">Mes Factures</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Consultez, téléchargez, imprimez — historique complet de vos séjours.
              </Typography>
            </Box>
          </Stack>
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher une facture, un statut, une période…"
            sx={{ minWidth: { sm: 240 } }}
          />
        </Stack>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Historique des factures
        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          ({rows.length} {rows.length > 1 ? 'factures' : 'facture'})
        </Typography>
      </Typography>

      {rows.length === 0 ? (
        <Card sx={{ p: 5, textAlign: 'center', borderRadius: '16px', border: `1px solid ${tokens.color.line}` }}>
          <ReceiptLongRoundedIcon sx={{ fontSize: 40, color: tokens.color.line, mb: 1 }} />
          <Typography color="text.secondary">Aucune facture ne correspond à votre recherche.</Typography>
        </Card>
      ) : (
        <Grid container spacing={2.2}>
          {/* xs=12 -> 1/ligne mobile · sm=6 -> 2/ligne tablette · md=3 -> 4/ligne desktop */}
          {rows.map((inv) => (
            <Grid item xs={12} sm={6} md={3} key={inv.id}>
              <InvoiceCard
                invoice={inv}
                onView={setOpenInvoice}
                onDownload={handleDownload}
                onPrint={handlePrint}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={Boolean(openInvoice)} onClose={() => setOpenInvoice(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
        <DialogContent sx={{ p: 3.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h6">Facture {openInvoice?.id}</Typography>
              <Typography variant="caption" color="text.secondary">{openInvoice?.periode} · {openInvoice?.date}</Typography>
            </Box>
            <Chip label={openInvoice?.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[openInvoice?.statut]?.bg, color: statutStyle[openInvoice?.statut]?.fg }} />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1.4}>
            {openInvoice?.lignes?.map((l, i) => (
              <Stack key={i} direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">{l.label}</Typography>
                <Typography variant="body2" sx={{ fontFamily: tokens.font.mono }}>{currency(l.montant)}</Typography>
              </Stack>
            ))}
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography variant="subtitle1" sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy }}>{currency(openInvoice?.total || 0)}</Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="outlined" fullWidth startIcon={<DownloadRoundedIcon />} onClick={() => showToast('PDF téléchargé.', 'success')}>PDF</Button>
            <Button variant="outlined" fullWidth startIcon={<PrintRoundedIcon />} onClick={() => showToast('Impression lancée.', 'info')}>Imprimer</Button>
            <Button variant="contained" color="secondary" fullWidth onClick={() => setOpenInvoice(null)}>Fermer</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}