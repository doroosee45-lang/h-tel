import { useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Chip, Divider, Button } from '@mui/material';
import RoomServiceRoundedIcon from '@mui/icons-material/RoomServiceRounded';
import QRFrame from '../components/common/QRFrame.jsx';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { roomServiceOrders, roomServiceCatalog, currency } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

const statutStyle = {
  'Nouvelle': { bg: tokens.color.dangerSoft, fg: tokens.color.danger },
  'En livraison': { bg: tokens.color.goldSoft, fg: tokens.color.navyDeep },
  'Livrée': { bg: tokens.color.successSoft, fg: tokens.color.success }
};

export default function RoomService() {
  const [searchQuery, setSearchQuery] = useState('');
  const orderRows = filterRecords(roomServiceOrders, searchQuery, ['id', 'chambre', 'client', 'items', 'statut', 'heure', 'montant']);
  const catalogRows = filterRecords(roomServiceCatalog, searchQuery, ['id', 'nom', 'categorie', 'prix']);

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} lg={7}>
        <Card sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <RoomServiceRoundedIcon sx={{ color: tokens.color.gold }} />
              <Typography variant="h6">Commandes en cours</Typography>
            </Stack>
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher commande, client, chambre…"
              sx={{ minWidth: { sm: 240 } }}
            />
          </Stack>
          <Stack spacing={1.6}>
            {orderRows.map((o) => (
              <Box key={o.id} sx={{ p: 1.8, borderRadius: '12px', border: `1px solid ${tokens.color.line}` }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 13 }}>{o.id}</Typography>
                    <Chip label={`Ch. ${o.chambre}`} size="small" sx={{ fontFamily: tokens.font.mono, bgcolor: tokens.color.cream }} />
                  </Stack>
                  <Chip label={o.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[o.statut].bg, color: statutStyle[o.statut].fg }} />
                </Stack>
                <Typography variant="body2" sx={{ mt: 0.8, fontWeight: 500 }}>{o.client}</Typography>
                <Typography variant="caption" color="text.secondary">{o.items.join(' · ')}</Typography>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">{o.heure}</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy }}>{currency(o.montant)}</Typography>
                    <Button size="small">Avancer →</Button>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} lg={5}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 0.4 }}>Catalogue Room Service</Typography>
          <Typography variant="caption" color="text.secondary">Accessible via QR Code depuis chaque chambre</Typography>
          <Stack spacing={1.6} sx={{ mt: 2 }}>
            {catalogRows.map((item) => (
              <Stack key={item.id} direction="row" spacing={1.6} alignItems="center">
                <QRFrame size={9} radius={10}>
                  <Box component="img" src={item.image} sx={{ width: 62, height: 62, objectFit: 'cover', display: 'block' }} />
                </QRFrame>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{item.nom}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.categorie}</Typography>
                </Box>
                <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700 }}>{currency(item.prix)}</Typography>
              </Stack>
            ))}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
