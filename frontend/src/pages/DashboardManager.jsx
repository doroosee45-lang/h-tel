import { useNavigate } from 'react-router-dom';
import { Grid, Card, Box, Typography, Stack, Chip, Avatar, Button, LinearProgress, Divider } from '@mui/material';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import LocalBarRoundedIcon from '@mui/icons-material/LocalBarRounded';
import LocalActivityRoundedIcon from '@mui/icons-material/LocalActivityRounded';
import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import StatCard from '../components/common/StatCard.jsx';
import { tokens } from '../theme.js';
import { kpis, currency, reservations, employees, presenceLog, teamTasks, checkinToday, checkoutToday, kitchenOrders, roomServiceOrders, activities } from '../data/mockData.js';

export default function DashboardManager() {
  const navigate = useNavigate();

  const totalChambres = kpis.chambresOccupees + kpis.chambresLibres + kpis.chambresNettoyage + kpis.chambresMaintenance;
  const tauxOccupation = Math.round((kpis.chambresOccupees / totalChambres) * 100);
  const agentsConnectes = employees.filter((e) => e.statut === 'Présent').length;
  const retards = presenceLog.filter((p) => p.statut === 'Absent non justifié').length;

  const kpiCards = [
    { icon: <EventAvailableRoundedIcon />, label: 'Réservations aujourd’hui', value: kpis.reservationsJour, sub: `${kpis.arriveesPrevues} arrivées · ${kpis.departsPrevues} départs`, accent: tokens.color.gold },
    { icon: <GroupsRoundedIcon />, label: 'Clients présents', value: kpis.chambresOccupees, sub: `${kpis.chambresLibres} chambres libres`, accent: tokens.color.navy },
    { icon: <LoginRoundedIcon />, label: 'Check-in effectués', value: checkinToday.filter((c) => c.statut === 'Effectué').length + 2, sub: `${checkinToday.length} à venir`, accent: tokens.color.success },
    { icon: <LogoutRoundedIcon />, label: 'Check-out effectués', value: checkoutToday.filter((c) => c.statut === 'Effectué').length, sub: `${checkoutToday.length} prévus`, accent: tokens.color.info },
    { icon: <RestaurantRoundedIcon />, label: 'Commandes Restaurant', value: kitchenOrders.filter((o) => o.statut !== 'Servie').length, sub: `${kitchenOrders.length} au total`, accent: tokens.color.gold },
    { icon: <LocalBarRoundedIcon />, label: 'Commandes Bar', value: roomServiceOrders.filter((o) => o.statut !== 'Livrée').length + 1, sub: 'en préparation', accent: tokens.color.info },
    { icon: <LocalActivityRoundedIcon />, label: 'Activités réservées', value: activities.filter((a) => a.prix > 0).length, sub: 'disponibles aujourd’hui', accent: tokens.color.warning },
    { icon: <PercentRoundedIcon />, label: 'Taux d’occupation', value: `${tauxOccupation}%`, sub: `${kpis.chambresOccupees}/${totalChambres} chambres`, accent: tokens.color.success }
  ];

  const quickActions = [
    { label: 'Nouvelle réservation', icon: <EventAvailableRoundedIcon />, to: '/reservations' },
    { label: 'Nouveau client', icon: <PersonAddAltRoundedIcon />, to: '/crm' },
    { label: 'Nouveau check-in', icon: <BadgeRoundedIcon />, to: '/checkin' },
    { label: 'Nouvelle facture', icon: <ReceiptLongRoundedIcon />, to: '/finance' },
    { label: 'Ajouter activité', icon: <EventNoteRoundedIcon />, to: '/activites' },
    { label: 'Ajouter chambre', icon: <MeetingRoomRoundedIcon />, to: '/chambres' }
  ];

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

      {/* Actions rapides */}
      <Card sx={{ p: 3, mt: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Actions rapides</Typography>
        <Grid container spacing={1.6}>
          {quickActions.map((a) => (
            <Grid item xs={6} sm={4} md={2} key={a.label}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate(a.to)}
                sx={{ p: 2, flexDirection: 'column', gap: 1, borderColor: tokens.color.line, color: 'text.primary', '&:hover': { borderColor: tokens.color.gold } }}
              >
                <Box sx={{ color: tokens.color.gold }}>{a.icon}</Box>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>{a.label}</Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Card>

      <Grid container spacing={2.5} sx={{ mt: 0.2 }}>
        {/* Gestion des équipes */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Gestion des équipes</Typography>
              <Chip label={`${agentsConnectes} agents connectés`} size="small" sx={{ bgcolor: tokens.color.successSoft, color: tokens.color.success, fontWeight: 700 }} />
            </Stack>

            <Grid container spacing={1.4}>
              {[
                { label: 'Agents connectés', value: agentsConnectes, color: tokens.color.success },
                { label: 'Présences', value: presenceLog.filter((p) => p.statut === 'En service').length, color: tokens.color.info },
                { label: 'Retards', value: retards, color: tokens.color.warning },
                { label: 'Tâches en cours', value: teamTasks.filter((t) => t.statut === 'En cours').length, color: tokens.color.navy },
                { label: 'Demandes en attente', value: teamTasks.filter((t) => t.statut === 'En attente').length, color: tokens.color.gold }
              ].map((s) => (
                <Grid item xs={12} sm={6} md={4} key={s.label}>
                  <Box sx={{ p: 1.6, borderRadius: '12px', bgcolor: tokens.color.cream }}>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 22, color: s.color }}>{s.value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Stack spacing={1.2} sx={{ mt: 2 }}>
              {teamTasks.slice(0, 4).map((t) => (
                <Stack key={t.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.4, borderRadius: '10px', border: `1px solid ${tokens.color.line}` }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{t.tache}</Typography>
                    <Typography variant="caption" color="text.secondary">{t.responsable}</Typography>
                  </Box>
                  <Chip label={t.statut} size="small" sx={{ fontWeight: 700, bgcolor: t.statut === 'En cours' ? tokens.color.infoSoft : tokens.color.warningSoft, color: t.statut === 'En cours' ? tokens.color.info : tokens.color.warning }} />
                </Stack>
              ))}
            </Stack>
          </Card>

          <Card sx={{ p: 3, mt: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Personnel en service</Typography>
            <Stack spacing={1.6}>
              {presenceLog.slice(0, 3).map((p) => (
                <Stack key={p.id} direction="row" spacing={1.4} alignItems="center">
                  <Avatar src={`https://i.pravatar.cc/60?img=${p.id + 5}`} sx={{ width: 36, height: 36 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{p.employe}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.lieu}</Typography>
                  </Box>
                  <Stack sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 12, fontWeight: 600 }}>{p.arrivee}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.statut}</Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Colonne droite */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Prochaines arrivées</Typography>
            <Stack spacing={1.4}>
              {reservations.slice(0, 4).map((r) => (
                <Stack key={r.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.4, borderRadius: '10px', bgcolor: tokens.color.cream }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{r.client}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {r.chambre} · {new Date(r.arrivee).toLocaleDateString('fr-FR')} → {new Date(r.depart).toLocaleDateString('fr-FR')}
                    </Typography>
                  </Box>
                  <Chip label={r.statut} size="small" sx={{ fontWeight: 700, bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep }} />
                </Stack>
              ))}
            </Stack>
          </Card>

          <Card sx={{ p: 3, mt: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="h6">Occupation du jour</Typography>
              <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy }}>{tauxOccupation}%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={tauxOccupation}
              sx={{ height: 10, borderRadius: 6, bgcolor: tokens.color.line, '& .MuiLinearProgress-bar': { bgcolor: tokens.color.gold, borderRadius: 6 } }}
            />
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={1.4}>
              {[
                { label: 'Occupées', value: kpis.chambresOccupees, color: tokens.color.navy },
                { label: 'Libres', value: kpis.chambresLibres, color: tokens.color.success },
                { label: 'Nettoyage', value: kpis.chambresNettoyage, color: tokens.color.info },
                { label: 'Maintenance', value: kpis.chambresMaintenance, color: tokens.color.warning }
              ].map((s) => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <Box sx={{ p: 1.4, borderRadius: '10px', bgcolor: tokens.color.cream, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 700, color: s.color, fontSize: 20 }}>{s.value}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>

          <Card sx={{ p: 3, mt: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Revenus du jour</Typography>
            <Grid container spacing={1.4}>
              {[
                { label: 'Hébergement', value: kpis.recettesJour - kpis.ventesRestaurant - kpis.ventesBar, color: tokens.color.navy },
                { label: 'Restaurant', value: kpis.ventesRestaurant, color: tokens.color.gold },
                { label: 'Bar', value: kpis.ventesBar, color: tokens.color.info }
              ].map((s) => (
                <Grid item xs={4} key={s.label}>
                  <Box sx={{ p: 1.6, borderRadius: '12px', bgcolor: tokens.color.cream, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 700, color: s.color, fontSize: 15, fontFamily: tokens.font.mono }}>{currency(s.value)}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, p: 1.6, borderRadius: '12px', bgcolor: tokens.color.navy, color: '#fff' }}>
              <Typography sx={{ fontWeight: 600 }}>Total encaissé</Typography>
              <Typography sx={{ fontWeight: 700, fontFamily: tokens.font.mono, color: tokens.color.gold }}>{currency(kpis.recettesJour)}</Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

