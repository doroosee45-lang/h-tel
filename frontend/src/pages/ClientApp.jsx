import { Grid, Box, Typography, Stack, Chip, Button, Card } from '@mui/material';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import BatteryFullRoundedIcon from '@mui/icons-material/BatteryFullRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { tokens } from '../theme.js';

function PhoneFrame({ children, statusDark = false }) {
  return (
    <Box
      sx={{
        width: 300,
        height: 620,
        borderRadius: '38px',
        border: `10px solid ${tokens.color.navyDeep}`,
        boxShadow: '0 24px 48px rgba(11,37,69,0.22)',
        overflow: 'hidden',
        position: 'relative',
        bgcolor: '#fff',
        mx: 'auto'
      }}
    >
      <Box
        sx={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 130, height: 22, bgcolor: tokens.color.navyDeep, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, zIndex: 5
        }}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, pt: 1, pb: 0.3, color: statusDark ? '#1C2430' : '#fff', fontSize: 12, fontWeight: 600 }}>
        <span>10:09</span>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <SignalCellularAltRoundedIcon sx={{ fontSize: 15 }} />
          <WifiRoundedIcon sx={{ fontSize: 15 }} />
          <BatteryFullRoundedIcon sx={{ fontSize: 17 }} />
        </Stack>
      </Stack>
      <Box sx={{ height: 'calc(100% - 90px)', overflowY: 'auto' }}>{children}</Box>
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 62, bgcolor: '#fff', borderTop: `1px solid ${tokens.color.line}` }}
      >
        {[
          { icon: <HomeRoundedIcon />, label: 'Accueil', active: true },
          { icon: <EventNoteRoundedIcon />, label: 'Réservations' },
          { icon: <PersonRoundedIcon />, label: 'Profil' },
          { icon: <MoreHorizRoundedIcon />, label: 'Plus' }
        ].map((t) => (
          <Stack key={t.label} alignItems="center" spacing={0.2} sx={{ color: t.active ? tokens.color.gold : '#B7BFC9' }}>
            {t.icon}
            <Typography sx={{ fontSize: 9.5, fontWeight: 600 }}>{t.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

const tiles = [
  { label: 'À propos', bg: tokens.color.gold, fg: tokens.color.navyDeep },
  { label: 'Événements', bg: tokens.color.navy, fg: '#fff' },
  { label: 'Conciergerie', bg: tokens.color.navy, fg: '#fff' },
  { label: 'Restaurant & Bar', bg: tokens.color.gold, fg: tokens.color.navyDeep }
];

export default function ClientApp() {
  return (
    <Box>
      <Card sx={{ p: 2.5, mb: 3, bgcolor: tokens.color.goldSoft, border: 'none' }}>
        <Typography variant="body2" sx={{ color: tokens.color.navyDeep }}>
          Aperçu fidèle des écrans de l’application mobile client — reprend la structure et la palette des maquettes
          de référence (accueil hôtel, déverrouillage de chambre, demandes d’extras), adaptées à l’identité Smart Hotel 360°.
        </Typography>
      </Card>

      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <Typography align="center" variant="overline" sx={{ display: 'block', mb: 1.5, color: 'text.secondary' }}>
            Accueil & accès chambre
          </Typography>
          <PhoneFrame>
            <Box sx={{ bgcolor: tokens.color.navy, pt: 2, pb: 3, px: 3, textAlign: 'center' }}>
              <Typography sx={{ fontFamily: tokens.font.display, color: tokens.color.gold, fontSize: 20, letterSpacing: '0.04em' }}>
                Hôtel Fleuve
              </Typography>
              <Typography sx={{ fontFamily: tokens.font.mono, color: 'rgba(255,255,255,0.5)', fontSize: 9.5, letterSpacing: '0.2em', mt: 0.3 }}>
                DEPUIS 2018 — KINSHASA
              </Typography>
            </Box>

            <Box
              component="img"
              src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80"
              sx={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }}
            />

            <Box sx={{ px: 2.2, mt: -2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ bgcolor: '#fff', borderRadius: '14px', boxShadow: '0 8px 20px rgba(11,37,69,0.14)', p: 1.8 }}
              >
                <Box>
                  <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 22 }}>101</Typography>
                  <Typography variant="caption" color="text.secondary">Check-out demain</Typography>
                </Box>
                <Chip icon={<LockOpenRoundedIcon sx={{ fontSize: 16 }} />} label="Déverrouiller" sx={{ bgcolor: tokens.color.gold, color: tokens.color.navyDeep, fontWeight: 700 }} />
              </Stack>
            </Box>

            <Grid container spacing={1.4} sx={{ p: 2.2, mt: 0.2 }}>
              {tiles.map((t) => (
                <Grid item xs={6} key={t.label}>
                  <Box sx={{ bgcolor: t.bg, color: t.fg, borderRadius: '14px', height: 88, display: 'flex', alignItems: 'flex-end', p: 1.4 }}>
                    <Typography sx={{ fontFamily: tokens.font.display, fontWeight: 600, fontSize: 14.5, lineHeight: 1.1 }}>{t.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </PhoneFrame>
        </Grid>

        <Grid item>
          <Typography align="center" variant="overline" sx={{ display: 'block', mb: 1.5, color: 'text.secondary' }}>
            Demandes d’extras
          </Typography>
          <PhoneFrame statusDark>
            <Box sx={{ px: 2.2, pt: 2 }}>
              <Typography variant="h6" sx={{ fontSize: 18 }}>Extras</Typography>
              <Typography variant="caption" color="text.secondary">Pour votre séjour</Typography>

              {[
                { nom: 'Petit-déjeuner buffet', desc: 'Large choix de mets frais chaque matin.', prix: '12 000 FC', img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80', action: 'Ajouter' },
                { nom: 'Voiturier', desc: 'Votre véhicule pris en charge en toute sécurité.', prix: '9 000 FC/nuit', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80', action: 'Ajouté' },
                { nom: 'Late check-out', desc: 'Prolongez votre départ jusqu’à 15h.', prix: '15 000 FC', img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80', action: 'Ajouter' }
              ].map((e) => (
                <Stack key={e.nom} direction="row" spacing={1.4} sx={{ mt: 2 }} alignItems="flex-start">
                  <Box component="img" src={e.img} sx={{ width: 60, height: 60, borderRadius: '10px', objectFit: 'cover' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{e.nom}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.3 }}>{e.desc}</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.6 }}>
                      <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 12, fontWeight: 700 }}>{e.prix}</Typography>
                      <Button size="small" variant={e.action === 'Ajouté' ? 'outlined' : 'contained'} sx={{ fontSize: 11, py: 0.2, minWidth: 0, boxShadow: 'none' }}>
                        {e.action}
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              ))}

              <Box sx={{ mt: 3, p: 1.6, borderRadius: '12px', bgcolor: tokens.color.cream, display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>Total extras</Typography>
                <Typography sx={{ fontWeight: 700, fontFamily: tokens.font.mono }}>21 000 FC</Typography>
              </Box>
              <Button fullWidth variant="contained" sx={{ mt: 1.4, boxShadow: 'none' }}>Confirmer</Button>
            </Box>
          </PhoneFrame>
        </Grid>
      </Grid>
    </Box>
  );
}
