import {
  Grid, Card, Box, Typography, Stack, Chip, Button, Avatar, Divider, LinearProgress
} from '@mui/material';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import RoomServiceRoundedIcon from '@mui/icons-material/RoomServiceRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import QRFrame from '../components/common/QRFrame.jsx';
import { tokens } from '../theme.js';
import {
  portalClient, clients, rooms, reservations, clientInvoice, myRequests,
  notifications, fideliteReductions, currency
} from '../data/mockData.js';

const requestStatutStyle = {
  'Nouvelle': { bg: tokens.color.dangerSoft, fg: tokens.color.danger },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning },
  'Confirmé': { bg: tokens.color.successSoft, fg: tokens.color.success }
};

const quickActions = [
  { label: 'Room Service', icon: <RoomServiceRoundedIcon /> },
  { label: 'Conciergerie', icon: <SupportAgentRoundedIcon /> },
  { label: 'Restaurant & Bar', icon: <RestaurantRoundedIcon /> },
  { label: 'Spa & Activités', icon: <SpaRoundedIcon /> },
  { label: 'Ma Facture', icon: <ReceiptLongRoundedIcon /> },
  { label: 'Contacter la réception', icon: <ChatBubbleOutlineRoundedIcon /> }
];

export default function ClientPortal() {
  const client = clients.find((c) => c.id === portalClient.clientId);
  const room = rooms.find((r) => r.id === portalClient.roomId);
  const mesSejours = reservations.filter((r) => r.client === client.nom);
  const mesNotifications = notifications.filter((n) => n.destinataire.includes(client.nom.split(' ').slice(-1)[0]));
  const total = clientInvoice.reduce((s, l) => s + l.montant, 0);
  const reduction = fideliteReductions[client.fidelite];
  const totalApresReduction = Math.round(total * (1 - reduction / 100));

  return (
    <Box>
      <Card sx={{ p: { xs: 2.5, md: 4 }, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff', overflow: 'hidden', position: 'relative' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={client.photo} sx={{ width: 64, height: 64, border: `2px solid ${tokens.color.gold}` }} />
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Bon retour parmi nous</Typography>
                <Typography sx={{ fontFamily: tokens.font.display, fontSize: 24 }}>{client.nom}</Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <Chip
                    icon={<EmojiEventsRoundedIcon sx={{ fontSize: 15 }} />}
                    label={`${client.fidelite} · ${client.pointsFidelite.toLocaleString('fr-FR')} pts · -${reduction}%`}
                    size="small"
                    sx={{ bgcolor: tokens.color.gold, color: tokens.color.navyDeep, fontWeight: 700 }}
                  />
                </Stack>
              </Box>
            </Stack>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6} sm={4}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Chambre</Typography>
                <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 20, fontWeight: 700 }}>{room.id.replace('R', '')}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{room.nom}</Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Check-out</Typography>
                <Typography sx={{ fontWeight: 700 }}>3 août 2026</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>avant 12h00</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  startIcon={<LockOpenRoundedIcon />}
                  sx={{ mt: { xs: 1, sm: 0 }, bgcolor: tokens.color.gold, color: tokens.color.navyDeep, boxShadow: 'none', '&:hover': { bgcolor: tokens.color.gold } }}
                >
                  Déverrouiller ma chambre
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <QRFrame color={tokens.color.gold} radius={16}>
              <Box component="img" src={room.image} alt={room.nom} sx={{ width: 220, height: 140, objectFit: 'cover', display: 'block' }} />
            </QRFrame>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={1.6} sx={{ mb: 2.5 }}>
        {quickActions.map((a) => (
          <Grid item xs={6} sm={4} md={2} key={a.label}>
            <Card sx={{ p: 2, textAlign: 'center', cursor: 'pointer', height: '100%' }}>
              <Box sx={{ color: tokens.color.navy, display: 'flex', justifyContent: 'center', mb: 0.8 }}>{a.icon}</Box>
              <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>{a.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="h6">Ma facture — en cours</Typography>
              <Chip label={`Ch. ${room.id}`} size="small" sx={{ fontFamily: tokens.font.mono, bgcolor: tokens.color.cream }} />
            </Stack>
            <Stack spacing={1.2}>
              {clientInvoice.map((l) => (
                <Stack key={l.label} direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">{l.label}</Typography>
                  <Typography variant="body2" sx={{ fontFamily: tokens.font.mono }}>{currency(l.montant)}</Typography>
                </Stack>
              ))}
            </Stack>
            <Divider sx={{ my: 1.6, borderStyle: 'dashed' }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Réduction fidélité ({client.fidelite})</Typography>
              <Typography variant="body2" sx={{ fontFamily: tokens.font.mono, color: tokens.color.success }}>-{reduction}%</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>Total à régler</Typography>
              <Typography sx={{ fontWeight: 700, fontFamily: tokens.font.mono, color: tokens.color.navy }}>{currency(totalApresReduction)}</Typography>
            </Stack>
            <Button variant="contained" fullWidth sx={{ mt: 2, boxShadow: 'none' }}>Payer maintenant</Button>
          </Card>

          <Card sx={{ p: 3, mt: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Mes séjours</Typography>
            <Stack spacing={1.2}>
              {mesSejours.map((s) => (
                <Stack key={s.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.4, borderRadius: '10px', border: `1px solid ${tokens.color.line}` }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.chambre}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(s.arrivee).toLocaleDateString('fr-FR')} → {new Date(s.depart).toLocaleDateString('fr-FR')}
                    </Typography>
                  </Box>
                  <Chip label={s.statut} size="small" sx={{ fontWeight: 700, bgcolor: tokens.color.cream }} />
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, mb: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Mes demandes en cours</Typography>
            <Stack spacing={1.4}>
              {myRequests.map((r) => (
                <Box key={r.id} sx={{ p: 1.6, borderRadius: '12px', bgcolor: tokens.color.cream }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{r.type}</Typography>
                    <Chip label={r.statut} size="small" sx={{ fontWeight: 700, bgcolor: requestStatutStyle[r.statut].bg, color: requestStatutStyle[r.statut].fg }} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">{r.detail}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.4 }}>{r.heure}</Typography>
                </Box>
              ))}
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Notifications récentes</Typography>
            <Stack spacing={1.2}>
              {(mesNotifications.length > 0 ? mesNotifications : notifications.slice(0, 2)).map((n) => (
                <Stack key={n.id} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">{n.titre}</Typography>
                  <Typography variant="caption" color="text.secondary">{n.heure}</Typography>
                </Stack>
              ))}
            </Stack>
          </Card>

          <Card sx={{ p: 2.5, mt: 2.5 }}>
            <Typography variant="caption" color="text.secondary">Progression vers le palier Platine</Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (client.pointsFidelite / 4000) * 100)}
              sx={{ height: 8, borderRadius: 6, mt: 1, bgcolor: tokens.color.line, '& .MuiLinearProgress-bar': { bgcolor: tokens.color.gold, borderRadius: 6 } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.6 }}>
              {client.pointsFidelite.toLocaleString('fr-FR')} / 4 000 points
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
