import { Card, Box, Typography, Stack, Chip, Button, Grid } from '@mui/material';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { tokens } from '../theme.js';
import { rapports } from '../data/mockData.js';

export default function Reports() {
  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        {[
          { label: 'Rapport d’occupation', desc: 'Par chambre, par catégorie, par période' },
          { label: 'Rapport financier', desc: 'Recettes, dépenses, rentabilité' },
          { label: 'Rapport RH', desc: 'Présence, congés, paie' },
          { label: 'Rapport stock', desc: 'Consommation, pertes, ruptures' }
        ].map((r) => (
          <Grid item xs={12} sm={6} md={3} key={r.label}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ p: 2, flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', borderColor: tokens.color.line, color: 'text.primary', height: '100%' }}
            >
              <DescriptionRoundedIcon sx={{ color: tokens.color.gold, mb: 0.6 }} />
              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{r.label}</Typography>
              <Typography variant="caption" color="text.secondary">{r.desc}</Typography>
            </Button>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ p: 3, mt: 1.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Rapports générés récemment</Typography>
        <Stack spacing={1.4}>
          {rapports.map((r) => (
            <Stack key={r.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.6, borderRadius: '12px', border: `1px solid ${tokens.color.line}` }}>
              <Stack direction="row" spacing={1.6} alignItems="center">
                <Box sx={{ width: 38, height: 38, borderRadius: '9px', bgcolor: tokens.color.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DescriptionRoundedIcon sx={{ fontSize: 18, color: tokens.color.navy }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{r.nom}</Typography>
                  <Typography variant="caption" color="text.secondary">{r.periode} · généré le {new Date(r.genere).toLocaleDateString('fr-FR')}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <Chip label={r.format} size="small" sx={{ fontFamily: tokens.font.mono, bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep }} />
                <Button size="small" startIcon={<DownloadRoundedIcon />}>Télécharger</Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Box>
  );
}
