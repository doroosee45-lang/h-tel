import { useContext, useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Chip, LinearProgress, Tabs, Tab, Button } from '@mui/material';
import LocalBarRoundedIcon from '@mui/icons-material/LocalBarRounded';
import QRFrame from '../components/common/QRFrame.jsx';
import CartSummary from '../components/common/CartSummary.jsx';
import { tokens } from '../theme.js';
import { AppContext } from '../context/AppContext.jsx';
import { barItems, barCategories, currency } from '../data/mockData.js';

export default function Bar() {
  const [tab, setTab] = useState('Tous');
  const { addToCart, userRole } = useContext(AppContext);
  const isClient = userRole === 'Client';
  const cats = ['Tous', ...barCategories];
  const items = barItems.filter((i) => tab === 'Tous' || i.categorie === tab);

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: 36, mb: 2.5, '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600, fontSize: 13.5 } }}
      >
        {cats.map((c) => <Tab key={c} label={c} value={c} />)}
      </Tabs>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2.5}>
            {items.map((item) => {
              const critique = item.stock < 10;
              return (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card sx={{ overflow: 'hidden' }}>
                <QRFrame radius={0}>
                  <Box sx={{ position: 'relative', height: 150 }}>
                    <Box component="img" src={item.image} alt={item.nom} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <Chip
                      icon={<LocalBarRoundedIcon sx={{ fontSize: 15 }} />}
                      label={item.categorie}
                      size="small"
                      sx={{ position: 'absolute', top: 10, left: 10, bgcolor: 'rgba(11,37,69,0.8)', color: '#fff', fontWeight: 600 }}
                    />
                  </Box>
                </QRFrame>
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 600 }}>{item.nom}</Typography>
                    <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy }}>{currency(item.prix)}</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">{item.marque} · {item.volume}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6, fontSize: 12.5 }}>{item.description}</Typography>
                  {!isClient && (
                    <Box sx={{ mt: 1.4 }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                        <Typography variant="caption" color="text.secondary">Stock</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: critique ? tokens.color.warning : 'text.secondary' }}>
                          {item.stock} unités {critique && '· seuil bas'}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, (item.stock / 60) * 100)}
                        sx={{ height: 6, borderRadius: 6, bgcolor: tokens.color.line, '& .MuiLinearProgress-bar': { bgcolor: critique ? tokens.color.warning : tokens.color.success, borderRadius: 6 } }}
                      />
                    </Box>
                  )}
                  <Button
                    disabled={item.stock <= 0}
                    variant="contained"
                    color="secondary"
                    size="small"
                    fullWidth
                    sx={{ mt: 1.5, boxShadow: 'none' }}
                    onClick={() => addToCart(item)}
                  >
                    Acheter
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
          </Grid>
        </Grid>
      <Grid item xs={12} lg={4}>
        <CartSummary />
      </Grid>
    </Grid>
  </Box>
  );
}
