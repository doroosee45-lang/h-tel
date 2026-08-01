import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Stack, Button, Card, Chip, Grid, Avatar, Divider, IconButton, Rating, TextField, Snackbar, Alert
} from '@mui/material';
import { useState } from 'react';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PoolRoundedIcon from '@mui/icons-material/PoolRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import AirportShuttleRoundedIcon from '@mui/icons-material/AirportShuttleRounded';
import { tokens } from '../../theme.js';
import { rooms, menuItems, barItems, activities, gallery, testimonials, hotelContact, currency } from '../../data/mockData.js';

const activityIcons = {
  'Spa & Massage': <SpaRoundedIcon />,
  'Piscine Extérieure': <PoolRoundedIcon />,
  'Salle de Sport': <FitnessCenterRoundedIcon />,
  'Excursion Fleuve Congo': <ExploreRoundedIcon />,
  'Soirée à Thème': <CampaignRoundedIcon />,
  'Espace Coworking': <AirportShuttleRoundedIcon />
};

const socialIcons = {
  Facebook: <FacebookRoundedIcon />,
  Instagram: <InstagramIcon />,
  'X (Twitter)': <XIcon />,
  LinkedIn: <LinkedInIcon />
};

export default function ClientHome() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [contactMsg, setContactMsg] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const heroSlides = [
    { image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=80', tagline: 'L’excellence au bord du fleuve' },
    { image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=80', tagline: 'Un palace au cœur de Kinshasa' },
    { image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&q=80', tagline: 'Détente, gastronomie et raffinement' }
  ];

  const popularRooms = rooms.filter((r) => r.statut === 'Libre').slice(0, 3);
  const featuredMenu = menuItems.filter((m) => m.dispo).slice(0, 3);
  const featuredBar = barItems.slice(0, 3);

  const handleBookRoom = (room) => {
    navigate(`/client/chambres?book=${encodeURIComponent(room.nom)}`);
    setSnackbar({ open: true, message: `« ${room.nom} » sélectionnée. Complétez vos dates pour confirmer la réservation.`, severity: 'success' });
  };

  return (
    <Box>
      {/* HERO */}
      <Box sx={{ position: 'relative', borderRadius: '26px', overflow: 'hidden', minHeight: { xs: 320, md: 440 }, mb: 4 }}>
        <Box
          component="img"
          src={heroSlides[heroIndex].image}
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.6s' }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(7,26,51,0.88) 0%, rgba(7,26,51,0.35) 60%, rgba(7,26,51,0.05) 100%)' }} />
        <Box sx={{ position: 'relative', zIndex: 2, p: { xs: 3, md: 6 }, maxWidth: 620, minHeight: { xs: 320, md: 440 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 12, letterSpacing: '0.2em', color: tokens.color.gold, mb: 1.5 }}>
            DEPUIS 2018 — KINSHASA, RDC
          </Typography>
          <Typography sx={{ fontFamily: tokens.font.display, fontSize: { xs: 32, md: 48 }, color: '#fff', lineHeight: 1.08, mb: 1.5 }}>
            Hôtel Fleuve
          </Typography>
          <Typography sx={{ fontFamily: tokens.font.display, fontStyle: 'italic', fontSize: { xs: 18, md: 24 }, color: tokens.color.goldSoft, mb: 2 }}>
            « Le fleuve vous accueille, le luxe vous retient. »
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 14.5, lineHeight: 1.7, mb: 3 }}>
            {heroSlides[heroIndex].tagline} — des suites d’exception, une gastronomie raffinée,
            un spa apaisant et un service de conciergerie 5 étoiles.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<PlayArrowRoundedIcon />}
              onClick={() => navigate('/client/chambres')}
              sx={{ fontWeight: 700, boxShadow: 'none' }}
            >
              Réserver maintenant
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', fontWeight: 600, '&:hover': { borderColor: '#fff' } }}
              onClick={() => navigate('/client/restaurant')}
            >
              Découvrir le restaurant
            </Button>
          </Stack>
          {/* Slider dots */}
          <Stack direction="row" spacing={0.8} sx={{ mt: 3 }}>
            {heroSlides.map((_, i) => (
              <Box
                key={i}
                onClick={() => setHeroIndex(i)}
                sx={{ width: i === heroIndex ? 28 : 10, height: 6, borderRadius: '3px', cursor: 'pointer', bgcolor: i === heroIndex ? tokens.color.gold : 'rgba(255,255,255,0.4)', transition: 'width 0.3s' }}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      {/* CHAMBRES POPULAIRES */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5">Chambres populaires</Typography>
          <Typography variant="body2" color="text.secondary">Disponibilité en temps réel</Typography>
        </Box>
        <Button endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/client/chambres')}>Tout voir</Button>
      </Stack>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {popularRooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card sx={{ overflow: 'hidden', height: '100%' }}>
              <Box sx={{ position: 'relative', height: 170 }}>
                <Box component="img" src={room.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <Chip label="Disponible" size="small" sx={{ position: 'absolute', top: 10, right: 10, bgcolor: tokens.color.success, color: '#fff', fontWeight: 700 }} />
                {room.promotion && (
                  <Chip label={room.promotion} size="small" sx={{ position: 'absolute', bottom: 10, left: 10, bgcolor: tokens.color.gold, color: tokens.color.navyDeep, fontWeight: 700 }} />
                )}
              </Box>
              <Box sx={{ p: 2.4 }}>
                <Typography variant="h6" sx={{ fontSize: 17 }}>{room.nom}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5, mt: 0.4 }}>{room.description}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.6 }}>
                  <Box>
                    <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy }}>{currency(room.prix)}</Typography>
                    <Typography variant="caption" color="text.secondary">/ nuit</Typography>
                  </Box>
                  <Button variant="contained" color="secondary" size="small" sx={{ boxShadow: 'none' }} onClick={() => handleBookRoom(room)}>
                    Réserver cette chambre
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* RESTAURANT */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5">Restaurant</Typography>
          <Typography variant="body2" color="text.secondary">Repas vedettes & menus du chef</Typography>
        </Box>
        <Button endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/client/restaurant')}>Voir le menu</Button>
      </Stack>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {featuredMenu.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ p: 2, display: 'flex', gap: 1.6, alignItems: 'center' }}>
              <Box component="img" src={item.image} sx={{ width: 76, height: 76, borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{item.nom}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>{item.description}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.8 }}>
                  <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy }}>{currency(item.prix)}</Typography>
                  <Button size="small" variant="contained" sx={{ boxShadow: 'none' }} onClick={() => navigate('/client/restaurant')}>
                    Ajouter
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* BAR */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5">Bar & Cocktails</Typography>
          <Typography variant="body2" color="text.secondary">Signatures du barman, vins et champagnes</Typography>
        </Box>
        <Button endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/client/bar')}>Voir la carte</Button>
      </Stack>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {featuredBar.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ display: 'flex', gap: 1.6, alignItems: 'center', p: 2 }}>
              <Box component="img" src={item.image} sx={{ width: 76, height: 76, borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{item.nom}</Typography>
                <Typography variant="caption" color="text.secondary">{item.marque} · {item.volume}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.8 }}>
                  <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy }}>{currency(item.prix)}</Typography>
                  <Button size="small" variant="contained" color="secondary" sx={{ boxShadow: 'none' }} onClick={() => navigate('/client/bar')}>
                    Ajouter
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ACTIVITÉS */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5">Activités & Loisirs</Typography>
          <Typography variant="body2" color="text.secondary">Piscine, sport, spa, excursions, conférences, transport</Typography>
        </Box>
        <Button endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/client/activites')}>Tout voir</Button>
      </Stack>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {activities.map((a) => (
          <Grid item xs={12} sm={6} md={4} key={a.id}>
            <Card sx={{ overflow: 'hidden', height: '100%' }}>
              <Box sx={{ position: 'relative', height: 140 }}>
                <Box component="img" src={a.image} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(7,26,51,0.35)' }} />
                <Box sx={{ position: 'absolute', bottom: 10, left: 12, color: '#fff', display: 'flex', gap: 0.8, alignItems: 'center' }}>
                  {activityIcons[a.nom] || <SpaRoundedIcon sx={{ fontSize: 20, color: tokens.color.gold }} />}
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{a.nom}</Typography>
                </Box>
              </Box>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">{a.horaire}</Typography>
                <Typography sx={{ fontWeight: 700, color: tokens.color.navy, fontFamily: tokens.font.mono }}>
                  {a.prix ? currency(a.prix) : 'Inclus'}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* GALERIE */}
      <Typography variant="h5" sx={{ mb: 2 }}>Galerie</Typography>
      <Grid container spacing={1.5} sx={{ mb: 4 }}>
        {gallery.map((g) => (
          <Grid item xs={6} md={4} key={g.id}>
            <Box sx={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', height: 160, cursor: 'pointer' }}>
              <Box component="img" src={g.image} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.4s', '&:hover': { transform: 'scale(1.05)' } }} />
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 1.2, background: 'linear-gradient(transparent, rgba(7,26,51,0.75))' }}>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{g.titre}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* TÉMOIGNAGES */}
      <Typography variant="h5" sx={{ mb: 2 }}>Ils ont séjourné chez nous</Typography>
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {testimonials.map((t) => (
          <Grid item xs={12} sm={6} md={3} key={t.id}>
            <Card sx={{ p: 2.6, height: '100%' }}>
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.2 }}>
                <Avatar src={`https://i.pravatar.cc/60?img=${t.id + 20}`} sx={{ width: 40, height: 40 }} />
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{t.nom}</Typography>
                  <Rating value={t.note} size="small" readOnly sx={{ color: tokens.color.gold }} />
                </Box>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.6 }}>{t.avis}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {new Date(t.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CONTACT */}
      <Card sx={{ p: 4, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Typography variant="h5" sx={{ mb: 2 }}>Contact</Typography>
            <Stack spacing={1.6}>
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PhoneRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Téléphone</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{hotelContact.telephone}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <EmailRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{hotelContact.email}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LocationOnRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Adresse</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{hotelContact.adresse}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                {hotelContact.reseaux.map((r) => (
                  <IconButton key={r.nom} component="a" href={r.url} target="_blank" sx={{ bgcolor: tokens.color.cream, '&:hover': { bgcolor: tokens.color.goldSoft } }}>
                    {socialIcons[r.nom] || <FacebookRoundedIcon />}
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack spacing={2}>
              <TextField label="Votre message" multiline rows={4} fullWidth size="small" value={contactMsg} onChange={(e) => setContactMsg(e.target.value)} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ boxShadow: 'none' }}
                  onClick={() => {
                    if (!contactMsg.trim()) return;
                    setSnackbar({ open: true, message: 'Message envoyé à la réception. Nous vous répondrons rapidement.', severity: 'success' });
                    setContactMsg('');
                  }}
                >
                  Envoyer le message
                </Button>
                <Button
                  variant="outlined"
                  component="a"
                  href={hotelContact.mapsUrl}
                  target="_blank"
                  startIcon={<LocationOnRoundedIcon />}
                >
                  Ouvrir dans Google Maps
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

