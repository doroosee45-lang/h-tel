import { useMemo } from 'react';
import { Alert, Box, Card, Chip, Divider, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import LocalBarRoundedIcon from '@mui/icons-material/LocalBarRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../components/common/StatCard.jsx';
import { ErrorCard, LoadingCard, EmptyCard } from '../components/common/StateViews.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { api, unwrap } from '../api/client.js';
import { formatCurrency, fullName, sentenceCase } from '../utils/format.js';
import { tokens } from '../theme.js';

async function loadDashboard() {
  const [overviewRes, popularRes, breakdownRes, forecastRes] = await Promise.all([
    api.get('/dashboard/overview'),
    api.get('/dashboard/popular'),
    api.get('/dashboard/revenue-breakdown').catch(() => ({ data: { data: {} } })),
    api.get('/dashboard/occupancy-forecast').catch(() => ({ data: { data: { forecast: [] } } }))
  ]);

  return {
    overview: unwrap(overviewRes),
    popular: unwrap(popularRes),
    breakdown: unwrap(breakdownRes) || {},
    forecast: unwrap(forecastRes)?.forecast || []
  };
}

export default function Dashboard({ variant = 'default' }) {
  const { data, loading, error, reload } = useAsyncData(loadDashboard, []);

  const revenueChart = useMemo(() => Object.entries(data?.breakdown || {}).map(([name, value]) => ({
    name: sentenceCase(name),
    value
  })), [data]);

  if (loading) return <LoadingCard message="Chargement du tableau de bord…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;
  if (!data?.overview) return <EmptyCard title="Dashboard indisponible" message="Aucune donnée dashboard n'a été renvoyée par l'API." />;

  const { overview, popular, forecast } = data;
  const cards = [
    { icon: <MeetingRoomRoundedIcon />, label: 'Occupation', value: `${overview.rooms.occupancyRate}%`, sub: `${overview.rooms.occupied}/${overview.rooms.total} chambres`, accent: tokens.color.navy },
    { icon: <EventAvailableRoundedIcon />, label: 'Arrivées du jour', value: overview.reservations.todaysArrivals, sub: `${overview.reservations.todaysDepartures} départs`, accent: tokens.color.gold },
    { icon: <PaidRoundedIcon />, label: 'Revenu du jour', value: formatCurrency(overview.finance.revenueToday), sub: `Profit ${formatCurrency(overview.finance.netProfitToday)}`, accent: tokens.color.success },
    { icon: <RestaurantRoundedIcon />, label: 'Restaurant', value: formatCurrency(overview.sales.restaurantToday), sub: 'ventes du jour', accent: tokens.color.gold },
    { icon: <LocalBarRoundedIcon />, label: 'Bar', value: formatCurrency(overview.sales.barToday), sub: 'ventes du jour', accent: tokens.color.info },
    { icon: <Inventory2RoundedIcon />, label: 'Stocks critiques', value: overview.stock.lowStockItems, sub: 'articles sous seuil', accent: tokens.color.warning },
    { icon: <GroupsRoundedIcon />, label: 'Employés présents', value: overview.hr.presentEmployees, sub: 'pointages ouverts', accent: tokens.color.success },
    { icon: <InsightsRoundedIcon />, label: 'Factures du jour', value: overview.finance.invoicesToday, sub: `Dépenses ${formatCurrency(overview.finance.expensesToday)}`, accent: tokens.color.info }
  ];

  return (
    <Box>
      {variant === 'manager' ? (
        <Alert severity="info" sx={{ mb: 2.5 }}>
          Vue manager basée sur les indicateurs réellement exposés par l'API. Les modules sans endpoint dédié restent signalés séparément dans leurs pages.
        </Alert>
      ) : null}

      <Grid container spacing={2.5}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.1 }}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6">Répartition des revenus</Typography>
                <Typography variant="body2" color="text.secondary">Source: /api/dashboard/revenue-breakdown</Typography>
              </Box>
              <Chip label={`${revenueChart.length} catégories`} size="small" />
            </Stack>
            {revenueChart.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tokens.color.line} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="value" fill={tokens.color.gold} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyCard title="Aucune ventilation" message="L'API ne renvoie pas encore de ventilation détaillée sur la période par défaut." />
            )}
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Prévision d'occupation</Typography>
            {forecast.length ? (
              <List disablePadding>
                {forecast.map((item) => (
                  <ListItem key={item.date} disableGutters divider>
                    <ListItemText
                      primary={item.date}
                      secondary={`${item.estimatedArrivals} arrivées · ${item.estimatedOccupancyRate}% occupation estimée`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <EmptyCard title="Prévision indisponible" message="Aucune projection n'est disponible actuellement." />
            )}
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.1 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Top chambres</Typography>
            <Divider sx={{ my: 1.5 }} />
            {(popular?.popularRooms || []).length ? (
              <List disablePadding>
                {popular.popularRooms.map((entry) => (
                  <ListItem key={entry.room?._id || entry._id} disableGutters divider>
                    <ListItemText primary={`Chambre ${entry.room?.number || '—'}`} secondary={`${entry.bookings} réservation(s)`} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <EmptyCard title="Aucune chambre populaire" message="Pas assez d'historique pour classer les chambres." />
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Produits populaires</Typography>
            <Divider sx={{ my: 1.5 }} />
            {[...(popular?.popularMeals || []), ...(popular?.popularDrinks || [])].length ? (
              <List disablePadding>
                {[...(popular?.popularMeals || []), ...(popular?.popularDrinks || [])].slice(0, 6).map((item) => (
                  <ListItem key={item._id} disableGutters divider>
                    <ListItemText primary={item.name} secondary={`${sentenceCase(item.type)} · ${formatCurrency(item.price)}`} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <EmptyCard title="Aucun produit populaire" message="Les ventes de menu n'ont pas encore de classement disponible." />
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <WarningAmberRoundedIcon color="warning" />
              <Typography variant="h6">Meilleurs clients</Typography>
            </Stack>
            {(popular?.topClients || []).length ? (
              <List disablePadding>
                {popular.topClients.map((client) => (
                  <ListItem key={client._id} disableGutters divider>
                    <ListItemText
                      primary={fullName(client)}
                      secondary={`${client.vipStatus ? 'VIP · ' : ''}${formatCurrency(client.totalSpent || 0)} dépensés`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <EmptyCard title="Aucun client classé" message="Le CRM ne renvoie pas encore de classement exploitable." />
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
