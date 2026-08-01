import { useContext, useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Chip, Tabs, Tab, Button, Divider, IconButton, Tooltip } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import QRFrame from '../components/common/QRFrame.jsx';
import CartSummary from '../components/common/CartSummary.jsx';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { AppContext } from '../context/AppContext.jsx';
import { menuCategories, menuItems, kitchenOrders, restaurantTables, currency } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

const statutStyle = {
  'Nouvelle': { bg: tokens.color.dangerSoft, fg: tokens.color.danger },
  'En préparation': { bg: tokens.color.goldSoft, fg: tokens.color.navyDeep },
  'Prête': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'Servie': { bg: tokens.color.line, fg: 'text.secondary' }
};

const tableStyle = {
  'Libre': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'Occupée': { bg: tokens.color.navy, fg: '#fff' },
  'Réservée': { bg: tokens.color.goldSoft, fg: tokens.color.navyDeep }
};

export default function Restaurant() {
  const [tab, setTab] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, userRole } = useContext(AppContext);
  const isClient = userRole === 'Client';
  const cats = ['Tous', ...menuCategories];
  const items = filterRecords(
    menuItems.filter((i) => tab === 'Tous' || i.categorie === tab),
    searchQuery,
    ['nom', 'categorie', 'description', 'ingredients', 'allergenes', 'temps', 'prix', 'id']
  );

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} lg={8}>
        <Card sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6">Menu digital</Typography>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <SearchField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher un plat, une catégorie, un ingrédient…"
                sx={{ minWidth: { sm: 240 } }}
              />
              <Chip label="QR Menu actif en salle & chambre" size="small" sx={{ bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep }} />
            </Stack>
          </Stack>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 36, mb: 2, '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600, fontSize: 13.5 } }}
          >
            {cats.map((c) => <Tab key={c} label={c} value={c} />)}
          </Tabs>

          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} key={item.id}>
                <Stack
                  direction="column"
                  spacing={1.2}
                  sx={{ p: 1.4, borderRadius: '14px', border: `1px solid ${tokens.color.line}`, opacity: item.dispo ? 1 : 0.5 }}
                >
                  <Stack direction="row" spacing={1.6}>
                    <QRFrame size={10} radius={10}>
                      <Box component="img" src={item.image} alt={item.nom} sx={{ width: 74, height: 74, objectFit: 'cover', display: 'block' }} />
                    </QRFrame>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 14.5 }}>{item.nom}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mt: 0.2 }}>
                        {item.description}
                      </Typography>
                      <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mt: 0.4, flexWrap: 'wrap' }}>
                        <AccessTimeRoundedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{item.temps}</Typography>
                        {item.allergenes.length > 0 && (
                          <Typography variant="caption" sx={{ color: tokens.color.warning, fontWeight: 600 }}>
                            · Allergènes : {item.allergenes.join(', ')}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy }}>{currency(item.prix)}</Typography>
                    <Chip label={item.dispo ? 'Disponible' : 'Rupture'} size="small" sx={{ fontSize: 10.5, bgcolor: item.dispo ? tokens.color.successSoft : tokens.color.dangerSoft, color: item.dispo ? tokens.color.success : tokens.color.danger }} />
                  </Stack>
                  <Button
                    disabled={!item.dispo}
                    variant="contained"
                    color="secondary"
                    size="small"
                    fullWidth
                    sx={{ boxShadow: 'none' }}
                    onClick={() => addToCart(item)}
                  >
                    Ajouter au panier
                  </Button>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Grid>

      <Grid item xs={12} lg={4}>
        <CartSummary />
        {!isClient && (
          <>
            <Card sx={{ p: 3, mb: 2.5, mt: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 0.4 }}>Plan des tables</Typography>
              <Typography variant="caption" color="text.secondary">Réservation table en un clic</Typography>
              <Grid container spacing={1.2} sx={{ mt: 0.5 }}>
                {restaurantTables.map((t) => (
                  <Grid item xs={4} key={t.id}>
                    <Box
                      sx={{
                        p: 1.2, borderRadius: '10px', textAlign: 'center', cursor: 'pointer',
                        bgcolor: tableStyle[t.statut].bg, color: tableStyle[t.statut].fg
                      }}
                    >
                      <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 15 }}>T{t.numero}</Typography>
                      <Typography sx={{ fontSize: 10.5, opacity: 0.85 }}>{t.capacite} pers.</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Stack direction="row" spacing={1.5} sx={{ mt: 1.6 }}>
                {Object.entries(tableStyle).map(([k, v]) => (
                  <Stack key={k} direction="row" spacing={0.6} alignItems="center">
                    <Box sx={{ width: 9, height: 9, borderRadius: '3px', bgcolor: v.bg, border: `1px solid ${tokens.color.line}` }} />
                    <Typography variant="caption" color="text.secondary">{k}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 0.4 }}>Écran cuisine</Typography>
              <Typography variant="caption" color="text.secondary">Commandes salle, chambre & QR Code</Typography>
              <Stack spacing={1.6} sx={{ mt: 2 }}>
                {kitchenOrders.map((o) => (
                  <Box key={o.id} sx={{ p: 1.6, borderRadius: '12px', bgcolor: tokens.color.cream }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 13 }}>{o.id}</Typography>
                      <Chip label={o.statut} size="small" sx={{ bgcolor: statutStyle[o.statut].bg, color: statutStyle[o.statut].fg, fontWeight: 700 }} />
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>{o.table}</Typography>
                    <Typography variant="caption" color="text.secondary">{o.items.join(' · ')}</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">{o.heure}</Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Tooltip title="Imprimer le ticket cuisine">
                          <IconButton size="small">
                            <PrintRoundedIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                        {o.statut === 'Servie' && (
                          <Tooltip title="Générer la facture">
                            <IconButton size="small">
                              <ReceiptLongRoundedIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Button size="small" sx={{ fontSize: 12 }}>Avancer →</Button>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Card>
          </>
        )}
      </Grid>
    </Grid>
  );
}
