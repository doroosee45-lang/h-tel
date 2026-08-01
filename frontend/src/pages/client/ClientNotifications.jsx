import { Grid, Card, Box, Typography, Stack, Chip } from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import { tokens } from '../../theme.js';
import { clientNotifications } from '../../data/mockData.js';

const typeStyle = {
  succes: { bg: tokens.color.successSoft, fg: tokens.color.success, icon: <CheckCircleRoundedIcon sx={{ fontSize: 18 }} /> },
  info: { bg: tokens.color.infoSoft, fg: tokens.color.info, icon: <InfoRoundedIcon sx={{ fontSize: 18 }} /> },
  promo: { bg: tokens.color.goldSoft, fg: tokens.color.navyDeep, icon: <CampaignRoundedIcon sx={{ fontSize: 18 }} /> }
};

export default function ClientNotifications() {
  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 52, height: 52, borderRadius: '13px', bgcolor: tokens.color.gold, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <NotificationsRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h5">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Confirmations, paiements reçus, chambre prête et promotions personnalisées.
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Grid container spacing={2}>
        {clientNotifications.map((n) => {
          const st = typeStyle[n.type] || typeStyle.info;
          return (
            <Grid item xs={12} md={6} key={n.id}>
              <Card sx={{ p: 2.6, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '11px', bgcolor: st.bg, color: st.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {st.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{n.titre}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: tokens.font.mono }}>{n.heure}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mt: 0.5, lineHeight: 1.6 }}>
                    {n.detail}
                  </Typography>
                  <Chip label={n.type === 'promo' ? 'Promotion' : n.type === 'succes' ? 'Confirmation' : 'Information'} size="small" sx={{ mt: 1.2, fontWeight: 600, fontSize: 10.5, bgcolor: st.bg, color: st.fg }} />
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

