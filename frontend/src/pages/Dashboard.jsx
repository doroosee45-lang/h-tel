import { Grid, Card, Box, Typography, Stack, Chip, Avatar, Divider } from '@mui/material';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell,
  BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import LocalBarRoundedIcon from '@mui/icons-material/LocalBarRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import RoomRoundedIcon from '@mui/icons-material/RoomRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import StatCard from '../components/common/StatCard.jsx';
import { tokens } from '../theme.js';
import {
  kpis, occupationSemaine, revenusParModule, currency, reservations, presenceLog,
  revenusMensuels, reservationsParMois, repartitionPaiements, consommationRestoBar,
  stockItems, checkinToday, checkoutToday, auditLogs, payments, roomServiceOrders
} from '../data/mockData.js';

const PIE_COLORS = [tokens.color.navy, tokens.color.gold, tokens.color.info, tokens.color.success, tokens.color.warning];

export default function Dashboard() {
  const totalChambres = kpis.chambresOccupees + kpis.chambresLibres + kpis.chambresNettoyage + kpis.chambresMaintenance;
  const tauxOccupation = Math.round((kpis.chambresOccupees / totalChambres) * 100);
  const critiquesStock = stockItems.filter((s) => s.statut === 'Critique');

  const kpiCards = [
    { icon: <RoomRoundedIcon />, label: 'Chambres occupées', value: kpis.chambresOccupees, sub: `${tauxOccupation}% du parc`, accent: tokens.color.navy },
    { icon: <MeetingRoomRoundedIcon />, label: 'Chambres disponibles', value: kpis.chambresLibres, sub: `${kpis.chambresNettoyage} en nettoyage`, accent: tokens.color.success },
    { icon: <EventAvailableRoundedIcon />, label: 'Réservations du jour', value: kpis.reservationsJour, sub: 'toutes sources', accent: tokens.color.gold },
    { icon: <PaidRoundedIcon />, label: 'CA journalier', value: currency(kpis.recettesJour), sub: `Dépenses ${currency(kpis.depensesJour)}`, accent: tokens.color.info },
    { icon: <RestaurantRoundedIcon />, label: 'Revenus Restaurant', value: currency(kpis.ventesRestaurant), sub: 'aujourd’hui', accent: tokens.color.gold },
    { icon: <LocalBarRoundedIcon />, label: 'Revenus Bar', value: currency(kpis.ventesBar), sub: 'aujourd’hui', accent: tokens.color.info },
    { icon: <PendingActionsRoundedIcon />, label: 'Paiements en attente', value: payments.filter((p) => p.statut === 'En attente').length, sub: 'à relancer', accent: tokens.color.warning },
    { icon: <GroupsRoundedIcon />, label: 'Employés présents', value: presenceLog.filter((p) => p.statut === 'En service').length, sub: `sur ${presenceLog.length}`, accent: tokens.color.success }
  ];

  const latestPayments = payments.slice(0, 4);

  return (
    <Box>
      {/* KPI — 8 cartes */}
      <Grid container spacing={2.5}>
        {kpiCards.map((k) => (
          <Grid item xs={12} sm={6} md={3} key={k.label}>
            <StatCard icon={k.icon} label={k.label} value={k.value} sub={k.sub} accent={k.accent} />
          </Grid>
        ))}
      </Grid>

      {/* Graphiques — ligne 1 */}
      <Grid container spacing={2.5} sx={{ mt: 0.2 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Box>
                <Typography variant="h6">Revenus mensuels</Typography>
                <Typography variant="caption" color="text.secondary">Chambres · Restaurant · Bar — 7 derniers mois</Typography>
              </Box>
              <Chip label="+12% vs juin" size="small" sx={{ bgcolor: tokens.color.successSoft, color: tokens.color.success }} />
            </Stack>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenusMensuels}>
                <CartesianGrid strokeDasharray="3 3" stroke={tokens.color.line} vertical={false} />
                <XAxis dataKey="mois" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${tokens.color.line}` }} formatter={(v) => currency(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="chambres" name="Chambres" fill={tokens.color.navy} radius={[6, 6, 0, 0]} />
                <Bar dataKey="restaurant" name="Restaurant" fill={tokens.color.gold} radius={[6, 6, 0, 0]} />
                <Bar dataKey="bar" name="Bar" fill={tokens.color.info} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Taux d’occupation</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={occupationSemaine}>
                <defs>
                  <linearGradient id="occ" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tokens.color.gold} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={tokens.color.gold} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={tokens.color.line} vertical={false} />
                <XAxis dataKey="jour" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} unit="%" />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${tokens.color.line}` }} formatter={(v) => [`${v}%`, 'Occupation']} />
                <Area type="monotone" dataKey="taux" stroke={tokens.color.navy} strokeWidth={2.5} fill="url(#occ)" />
              </AreaChart>
            </ResponsiveContainer>
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', fontWeight: 600 }}>
              Moyenne 7 jours : {Math.round(occupationSemaine.reduce((s, d) => s + d.taux, 0) / occupationSemaine.length)}%
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques — ligne 2 */}
      <Grid container spacing={2.5} sx={{ mt: 0.2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Réservations par mois</Typography>
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={reservationsParMois}>
                <CartesianGrid strokeDasharray="3 3" stroke={tokens.color.line} vertical={false} />
                <XAxis dataKey="mois" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${tokens.color.line}` }} />
                <Line type="monotone" dataKey="reservations" stroke={tokens.color.navy} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Répartition des paiements</Typography>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={repartitionPaiements} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={2}>
                  {repartitionPaiements.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              M-Pesa, Orange Money, Visa, Mastercard…
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <RestaurantRoundedIcon sx={{ color: tokens.color.gold, fontSize: 20 }} />
              <LocalBarRoundedIcon sx={{ color: tokens.color.info, fontSize: 20 }} />
              <Typography variant="h6">Consommation Resto & Bar</Typography>
            </Stack>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={consommationRestoBar}>
                <CartesianGrid strokeDasharray="3 3" stroke={tokens.color.line} vertical={false} />
                <XAxis dataKey="jour" tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${tokens.color.line}` }} formatter={(v) => currency(v)} />
                <Bar dataKey="restaurant" name="Restaurant" fill={tokens.color.gold} radius={[4, 4, 0, 0]} />
                <Bar dataKey="bar" name="Bar" fill={tokens.color.info} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Widgets */}
      <Grid container spacing={2.5} sx={{ mt: 0.2 }}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Dernières réservations</Typography>
            <Stack spacing={1.4}>
              {reservations.slice(0, 4).map((r) => (
                <Stack key={r.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.2, borderRadius: '10px', bgcolor: tokens.color.cream }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{r.client}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.chambre} · {r.id}</Typography>
                  </Box>
                  <Chip label={r.statut} size="small" sx={{ fontWeight: 700, bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep }} />
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Derniers paiements</Typography>
            <Stack spacing={1.4}>
              {latestPayments.map((p) => (
                <Stack key={p.id} direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{p.client}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.methode} · {p.type}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 13 }}>{currency(p.montant)}</Typography>
                    <Chip label={p.statut} size="small" sx={{ fontWeight: 700, bgcolor: p.statut === 'Payé' ? tokens.color.successSoft : tokens.color.warningSoft, color: p.statut === 'Payé' ? tokens.color.success : tokens.color.warning }} />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <WarningAmberRoundedIcon sx={{ color: tokens.color.warning }} />
              <Typography variant="h6">Alertes de stock</Typography>
            </Stack>
            <Stack spacing={1.4}>
              {critiquesStock.map((s) => (
                <Stack key={s.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.2, borderRadius: '10px', bgcolor: tokens.color.warningSoft }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{s.produit}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.quantite} unités / seuil {s.seuil}</Typography>
                  </Box>
                  <Chip label="Critique" size="small" sx={{ fontWeight: 700, bgcolor: tokens.color.warning, color: '#fff' }} />
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Activités récentes</Typography>
            <Stack spacing={1.4}>
              {auditLogs.slice(0, 4).map((log) => (
                <Stack key={log.id} direction="row" spacing={1.4} alignItems="center">
                  <Box sx={{ width: 32, height: 32, borderRadius: '9px', bgcolor: tokens.color.navy, color: tokens.color.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HistoryRoundedIcon sx={{ fontSize: 16 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{log.action}</Typography>
                    <Typography variant="caption" color="text.secondary">{log.user} · {log.module} · {log.timestamp}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <LoginRoundedIcon sx={{ color: tokens.color.success }} />
              <Typography variant="h6">Check-in du jour</Typography>
            </Stack>
            <Stack spacing={1.4}>
              {checkinToday.map((c) => (
                <Stack key={c.id} direction="row" spacing={1.4} alignItems="center">
                  <Avatar src={`https://i.pravatar.cc/60?img=${c.id + 10}`} sx={{ width: 32, height: 32 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{c.client}</Typography>
                    <Typography variant="caption" color="text.secondary">{c.chambre} · {c.heure}</Typography>
                  </Box>
                  <Chip label={c.statut} size="small" sx={{ fontWeight: 700, bgcolor: tokens.color.successSoft, color: tokens.color.success }} />
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <LogoutRoundedIcon sx={{ color: tokens.color.info }} />
              <Typography variant="h6">Check-out du jour</Typography>
            </Stack>
            <Stack spacing={1.4}>
              {checkoutToday.map((c) => (
                <Stack key={c.id} direction="row" spacing={1.4} alignItems="center">
                  <Avatar src={`https://i.pravatar.cc/60?img=${c.id + 20}`} sx={{ width: 32, height: 32 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{c.client}</Typography>
                    <Typography variant="caption" color="text.secondary">{c.chambre} · {c.heure}</Typography>
                  </Box>
                  <Chip label={c.statut} size="small" sx={{ fontWeight: 700, bgcolor: tokens.color.infoSoft, color: tokens.color.info }} />
                </Stack>
              ))}
            </Stack>
            <Divider sx={{ my: 1.6 }} />
            <Typography variant="caption" color="text.secondary">Facturation automatique activée pour les départs.</Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

