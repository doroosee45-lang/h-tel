import { useState } from 'react';
import {
  Grid, Card, Box, Typography, Stack, Chip, Button, Dialog, DialogContent, Divider, Snackbar, Alert, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import SearchField from '../../components/common/SearchField.jsx';
import { tokens } from '../../theme.js';
import { clientInvoicesData, currency } from '../../data/mockData.js';
import { filterRecords } from '../../utils/searchUtils.js';

const statutStyle = {
  'Payée': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning }
};

export default function ClientInvoices() {
  const [openInvoice, setOpenInvoice] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const rows = filterRecords(clientInvoicesData, searchQuery, ['id', 'periode', 'date', 'total', 'statut', 'methode']);

  const showToast = (msg, severity = 'info') => setSnackbar({ open: true, message: msg, severity });

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

      <Card sx={{ overflowX: 'auto' }}>
        <Box sx={{ p: 3, pb: 1.5 }}>
          <Typography variant="h6">Historique des factures</Typography>
        </Box>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: tokens.color.cream }}>
              {['N° Facture', 'Période', 'Date', 'Total', 'Statut', 'Méthode', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((inv) => (
              <TableRow key={inv.id} hover>
                <TableCell sx={{ fontFamily: tokens.font.mono, fontWeight: 700 }}>{inv.id}</TableCell>
                <TableCell>{inv.periode}</TableCell>
                <TableCell>{new Date(inv.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell sx={{ fontFamily: tokens.font.mono, fontWeight: 700 }}>{currency(inv.total)}</TableCell>
                <TableCell>
                  <Chip label={inv.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[inv.statut].bg, color: statutStyle[inv.statut].fg }} />
                </TableCell>
                <TableCell>{inv.methode}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.8}>
                    <Button size="small" startIcon={<VisibilityRoundedIcon />} onClick={() => setOpenInvoice(inv)}>Voir</Button>
                    <Button size="small" startIcon={<DownloadRoundedIcon />} onClick={() => showToast(`Téléchargement du PDF ${inv.id} prêt.`, 'success')}>PDF</Button>
                    <Button size="small" startIcon={<PrintRoundedIcon />} onClick={() => { showToast('Préparation de l’impression.', 'info'); window.print(); }}>Imprimer</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

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

