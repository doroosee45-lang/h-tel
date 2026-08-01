import { useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Chip, Button, Dialog, DialogContent, TextField, MenuItem } from '@mui/material';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { purchaseRequests, purchaseSteps } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

const stepColor = {
  Demande: tokens.color.info,
  Validation: tokens.color.gold,
  'Bon de commande': tokens.color.navy,
  Réception: tokens.color.success
};

export default function Purchases() {
  const [openAddPurchase, setOpenAddPurchase] = useState(false);
  const [localRequests, setLocalRequests] = useState(purchaseRequests);
  const [newPurchase, setNewPurchase] = useState({ produit: '', quantite: 1, demandeur: 'Responsable Stock', etape: 'Demande', fournisseur: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const filteredRequests = filterRecords(localRequests, searchQuery, ['produit', 'fournisseur', 'demandeur', 'etape', 'quantite', 'id']);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          Suivi des demandes d’achat, de la validation jusqu’à la réception marchandises.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} alignItems="center">
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher un produit, fournisseur, demandeur, étape…"
            sx={{ minWidth: { sm: 260 } }}
          />
          <Button variant="contained" color="secondary" sx={{ boxShadow: 'none' }} onClick={() => setOpenAddPurchase(true)}>+ Nouvelle demande</Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {purchaseSteps.map((step) => (
          <Grid item xs={12} sm={6} md={3} key={step}>
            <Box sx={{ mb: 1.2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stepColor[step] }} />
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>{step}</Typography>
              </Stack>
            </Box>
            <Stack spacing={1.4}>
              {filteredRequests.filter((p) => p.etape === step).map((p) => (
                <Card key={p.id} sx={{ p: 1.8, borderTop: `3px solid ${stepColor[step]}` }}>
                  <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary' }}>{p.id}</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, mt: 0.2 }}>{p.produit}</Typography>
                  <Typography variant="caption" color="text.secondary">Qté {p.quantite} · {p.fournisseur}</Typography>
                  <Chip label={p.demandeur} size="small" sx={{ mt: 1, fontSize: 10.5, bgcolor: tokens.color.cream }} />
                </Card>
              ))}
              {filteredRequests.filter((p) => p.etape === step).length === 0 && (
                <Box sx={{ p: 2, textAlign: 'center', border: `1px dashed ${tokens.color.line}`, borderRadius: '12px' }}>
                  <Typography variant="caption" color="text.secondary">Aucune demande</Typography>
                </Box>
              )}
            </Stack>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openAddPurchase} onClose={() => setOpenAddPurchase(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Nouvelle demande d’achat</Typography>
          <Stack spacing={2}>
            <TextField
              label="Produit"
              value={newPurchase.produit}
              onChange={(e) => setNewPurchase((prev) => ({ ...prev, produit: e.target.value }))}
              size="small"
              fullWidth
            />
            <TextField
              label="Quantité"
              type="number"
              value={newPurchase.quantite}
              onChange={(e) => setNewPurchase((prev) => ({ ...prev, quantite: Number(e.target.value) }))}
              size="small"
              fullWidth
            />
            <TextField
              label="Fournisseur"
              value={newPurchase.fournisseur}
              onChange={(e) => setNewPurchase((prev) => ({ ...prev, fournisseur: e.target.value }))}
              size="small"
              fullWidth
            />
            <TextField
              label="Étape"
              select
              value={newPurchase.etape}
              onChange={(e) => setNewPurchase((prev) => ({ ...prev, etape: e.target.value }))}
              size="small"
              fullWidth
            >
              {purchaseSteps.map((step) => (
                <MenuItem key={step} value={step}>{step}</MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => setOpenAddPurchase(false)}>Annuler</Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => {
                  if (!newPurchase.produit.trim() || !newPurchase.fournisseur.trim()) return;
                  setLocalRequests((prev) => [
                    ...prev,
                    { id: `PA-${Date.now().toString().slice(-4)}`, ...newPurchase }
                  ]);
                  setNewPurchase({ produit: '', quantite: 1, demandeur: 'Responsable Stock', etape: 'Demande', fournisseur: '' });
                  setOpenAddPurchase(false);
                }}
              >
                Ajouter
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
