import { Grid, Card, Box, Typography, Stack, Chip, LinearProgress, Divider } from '@mui/material';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { tokens } from '../../theme.js';
import { loyaltyTiers, clientMembership, currency } from '../../data/mockData.js';

const tierColors = {
  Standard: tokens.color.inkMuted,
  Argent: tokens.color.info,
  Or: tokens.color.gold,
  Platine: '#9A8A5A'
};

export default function ClientLoyalty() {
  const progress = Math.min(100, (clientMembership.points / 4000) * 100);

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 52, height: 52, borderRadius: '13px', bgcolor: tokens.color.gold, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WorkspacePremiumRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h5">Programme de Fidélité</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Accumulez des points, débloquez des réductions et des récompenses VIP.
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <EmojiEventsRoundedIcon sx={{ fontSize: 44, color: tierColors[clientMembership.niveau] }} />
            <Typography variant="h4" sx={{ mt: 1 }}>{clientMembership.niveau}</Typography>
            <Typography variant="body2" color="text.secondary">Votre niveau actuel</Typography>
<Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" spacing={2} sx={{ mt: 2 }} alignItems="center">
              <Box>
                <Typography variant="h5">{clientMembership.points.toLocaleString('fr-FR')}</Typography>
                <Typography variant="caption" color="text.secondary">Points</Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Box>
                <Typography variant="h5">{clientMembership.totalSejours}</Typography>
                <Typography variant="caption" color="text.secondary">Séjours</Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Box>
                <Typography variant="h5">{currency(clientMembership.depensesTotales)}</Typography>
                <Typography variant="caption" color="text.secondary">Dépensé</Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3, textAlign: 'left' }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Progression vers <strong>Platine</strong></Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{clientMembership.pointsVersPlatine.toLocaleString('fr-FR')} pts restants</Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 10, borderRadius: 6, mt: 1, bgcolor: tokens.color.line, '& .MuiLinearProgress-bar': { bgcolor: tokens.color.gold, borderRadius: 6 } }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontFamily: tokens.font.mono }}>
              Code membre : {clientMembership.code}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            {loyaltyTiers.map((tier) => {
              const unlocked = clientMembership.points >= tier.pointsRequis;
              const isCurrent = clientMembership.niveau === tier.nom;
              return (
                <Grid item xs={12} sm={6} key={tier.nom}>
                  <Card
                    sx={{
                      p: 2.6,
                      height: '100%',
                      border: `1.5px solid ${isCurrent ? tierColors[tier.nom] : tokens.color.line}`,
                      bgcolor: isCurrent ? tokens.color.goldSoft : '#fff'
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <StarRoundedIcon sx={{ color: tierColors[tier.nom] }} />
                        <Typography variant="h6" sx={{ fontSize: 18 }}>{tier.nom}</Typography>
                      </Stack>
                      {isCurrent && <Chip label="Votre niveau" size="small" sx={{ bgcolor: tokens.color.gold, color: tokens.color.navyDeep, fontWeight: 700 }} />}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Dès {tier.pointsRequis.toLocaleString('fr-FR')} pts · -{tier.reduction}%
                    </Typography>
                    <Divider sx={{ my: 1.2 }} />
                    <Stack spacing={0.8}>
                      {tier.avantages.map((a) => (
                        <Stack key={a} direction="row" spacing={1} alignItems="flex-start">
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: unlocked ? tokens.color.success : tokens.color.line, mt: 0.6 }} />
                          <Typography variant="body2" sx={{ fontSize: 13, color: unlocked ? 'text.primary' : 'text.secondary' }}>
                            {a}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                    {!unlocked && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.4 }}>
                        🔒 Débloque à {tier.pointsRequis.toLocaleString('fr-FR')} points
                      </Typography>
                    )}
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

