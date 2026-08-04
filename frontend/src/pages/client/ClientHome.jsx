import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import {
  Box, Typography, Stack, Button, Card, Chip, Grid, Avatar, Divider, IconButton, Rating, TextField,
  Snackbar, Alert, Accordion, AccordionSummary, AccordionDetails, useMediaQuery, useTheme
} from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
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
import KingBedRoundedIcon from '@mui/icons-material/KingBedRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import LocalBarRoundedIcon from '@mui/icons-material/LocalBarRounded';
import RoomServiceRoundedIcon from '@mui/icons-material/RoomServiceRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import { tokens } from '../../theme.js';
import {
  rooms, menuItems, barItems, activities, gallery, testimonials, hotelContact, currency,
  homeStats, whyChooseUs, howItWorks, partners, faqItems, heroImages
} from '../../data/mockData.js';
import Reveal from '../../components/client/Reveal.jsx';
import AnimatedCounter from '../../components/client/AnimatedCounter.jsx';

// ---------------------------------------------------------------------------
// Animations utilitaires (discrètes & professionnelles)
// ---------------------------------------------------------------------------
const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

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

const statIcons = {
  clients: <PeopleRoundedIcon />,
  reservations: <EventNoteRoundedIcon />,
  chambres: <KingBedRoundedIcon />,
  commandes: <ShoppingBagRoundedIcon />,
  partenaires: <HandshakeRoundedIcon />,
  satisfaction: <ThumbUpRoundedIcon />
};

const whyIcons = {
  concierge: <SupportAgentRoundedIcon />,
  instant: <BoltRoundedIcon />,
  restaurant: <RestaurantRoundedIcon />,
  spa: <SpaRoundedIcon />,
  loyalty: <WorkspacePremiumRoundedIcon />,
  secure: <ShieldRoundedIcon />
};

const stepsIcons = {
  choose: <SearchRoundedIcon />,
  book: <EventAvailableRoundedIcon />,
  stay: <KingBedRoundedIcon />,
  share: <ShareRoundedIcon />
};

const services = [
  { id: 1, nom: 'Chambres & Suites', desc: '116 chambres, vues sur le fleuve', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700&q=80', route: '/client/chambres', icon: <KingBedRoundedIcon /> },
  { id: 2, nom: 'Restaurant', desc: 'Gastronomie locale & internationale', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80', route: '/client/restaurant', icon: <RestaurantRoundedIcon /> },
  { id: 3, nom: 'Bar & Cocktails', desc: 'Signatures du barman, vins & champagne', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=700&q=80', route: '/client/bar', icon: <LocalBarRoundedIcon /> },
  { id: 4, nom: 'Spa & Bien-être', desc: 'Massages, hammam & soins premium', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=700&q=80', route: '/client/activites', icon: <SpaRoundedIcon /> },
  { id: 5, nom: 'Activités & Loisirs', desc: 'Piscine, sport, excursions sur le fleuve', image: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=700&q=80', route: '/client/activites', icon: <ExploreRoundedIcon /> },
  { id: 6, nom: 'Conciergerie', desc: 'Taxi, navette, visites guidées 24h/24', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=700&q=80', route: '/client/concierge', icon: <RoomServiceRoundedIcon /> }
];

// ---------------------------------------------------------------------------
// Composant en-tête de section — tailles & styles uniformisés
// ---------------------------------------------------------------------------
function SectionHeader({ kicker, title, subtitle, light = false, align = 'center' }) {
  return (
    <Stack
      spacing={1}
      alignItems={align === 'center' ? 'center' : 'flex-start'}
      sx={{ mb: { xs: 3, md: 4.5 }, textAlign: align }}
    >
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 22, height: 1.5, bgcolor: tokens.color.gold, display: { xs: 'none', sm: 'block' } }} />
        <Typography
          sx={{
            fontFamily: tokens.font.mono, fontSize: 11.5, letterSpacing: '0.24em',
            textTransform: 'uppercase', color: tokens.color.gold, fontWeight: 600
          }}
        >
          {kicker}
        </Typography>
        <Box sx={{ width: 22, height: 1.5, bgcolor: tokens.color.gold, display: { xs: 'none', sm: 'block' } }} />
      </Box>
      <Typography
        variant="h3"
        sx={{
          fontSize: { xs: 26, md: 36 }, lineHeight: 1.15,
          color: light ? '#fff' : tokens.color.navyDeep, maxWidth: 760, fontWeight: 600
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            color: light ? 'rgba(255,255,255,0.78)' : 'text.secondary',
            maxWidth: 600, fontSize: { xs: 13.5, md: 14.5 }, lineHeight: 1.7
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Petite carte titre de section (variante alignée à gauche)
// ---------------------------------------------------------------------------
function SectionTitle({ kicker, title, action, onAction, actionIcon }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
      sx={{ mb: { xs: 2.5, md: 3.5 }, gap: 1.5 }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: tokens.font.mono, fontSize: 11.5, letterSpacing: '0.24em',
            textTransform: 'uppercase', color: tokens.color.gold, fontWeight: 600, mb: 0.6
          }}
        >
          {kicker}
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: 24, md: 32 }, lineHeight: 1.15, color: tokens.color.navyDeep, fontWeight: 600 }}
        >
          {title}
        </Typography>
      </Box>
      {action && (
        <Button
          endIcon={actionIcon || <ArrowForwardRoundedIcon />}
          onClick={onAction}
          sx={{
            flexShrink: 0, color: tokens.color.navy, fontWeight: 600, fontSize: 13.5,
            px: 2.5, py: 1, border: `1px solid ${tokens.color.line}`, borderRadius: '10px',
            bgcolor: '#fff', alignSelf: { xs: 'flex-start', sm: 'auto' },
            '&:hover': { borderColor: tokens.color.gold, bgcolor: tokens.color.goldSoft }
          }}
        >
          {action}
        </Button>
      )}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Page d'accueil client
// ---------------------------------------------------------------------------
export default function ClientHome() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));

  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [contactMsg, setContactMsg] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const popularRooms = useMemo(() => rooms.filter((r) => r.statut === 'Libre').slice(0, 3), []);
  const featuredMenu = useMemo(() => menuItems.filter((m) => m.dispo).slice(0, 3), []);
  const featuredBar = useMemo(() => barItems.slice(0, 3), []);

  // ---- Hero : auto-défilement toutes les 5s ----
  useEffect(() => {
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  // ---- Témoignages : carrousel auto (1 / 2 / 3 cartes par vue) ----
  const testimonialsPerView = isMd ? 3 : isSm ? 2 : 1;
  const maxTestimonialIndex = Math.max(0, testimonials.length - testimonialsPerView);
  useEffect(() => {
    setTestimonialIndex((i) => Math.min(i, maxTestimonialIndex));
  }, [maxTestimonialIndex]);

  useEffect(() => {
    const t = setInterval(() => {
      setTestimonialIndex((i) => (i >= maxTestimonialIndex ? 0 : i + 1));
    }, 6500);
    return () => clearInterval(t);
  }, [maxTestimonialIndex]);

  const handleBookRoom = (room) => {
    navigate(`/client/chambres?book=${encodeURIComponent(room.nom)}`);
    setSnackbar({ open: true, message: `« ${room.nom} » sélectionnée. Complétez vos dates pour confirmer la réservation.`, severity: 'success' });
  };

  const heroGo = (dir) => {
    setHeroIndex((i) => (i + dir + heroImages.length) % heroImages.length);
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* ================================================================
          HERO — carrousel auto (5s), fade + zoom doux, flèches & dots
      ================================================================ */}
      <Reveal direction="none">
        <Box
  sx={{
    position: 'relative', borderRadius: { xs: '20px', sm: '26px', md: '30px' }, overflow: 'hidden',
    minHeight: { xs: 440, sm: 500, md: 560 }, mb: { xs: 5, md: 7 },
    boxShadow: tokens.shadow.lg, isolation: 'isolate'
  }}
>
          {heroImages.map((slide, i) => (
            <Box
              key={slide.image}
              component="img"
              src={slide.image}
              alt={slide.tagline}
              loading={i === 0 ? 'eager' : 'lazy'}
              sx={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: i === heroIndex ? 1 : 0,
                transform: i === heroIndex ? 'scale(1)' : 'scale(1.05)',
                transition: 'opacity 1.2s ease, transform 6s ease-out',
                willChange: 'opacity, transform'
              }}
            />
          ))}
          {/* Overlay renforcé pour la lisibilité du texte */}
          <Box
            sx={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(90deg, rgba(7,26,51,0.92) 0%, rgba(7,26,51,0.6) 50%, rgba(7,26,51,0.25) 100%)'
            }}
          />
          <Box
            sx={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'radial-gradient(120% 100% at 50% 0%, rgba(7,26,51,0.25) 0%, transparent 55%)'
            }}
          />

          {/* Contenu hero */}
          <Box
            sx={{
              position: 'relative', zIndex: 2, p: { xs: 3, sm: 5, md: 7 },
              maxWidth: 720, minHeight: { xs: 440, sm: 500, md: 560 },
              display: 'flex', flexDirection: 'column', justifyContent: 'center'
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.8 }}>
              <Box
                sx={{
                  width: 34, height: 34, borderRadius: '10px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  bgcolor: 'rgba(201,162,75,0.18)', border: `1px solid ${tokens.color.gold}`,
                  color: tokens.color.gold
                }}
              >
                <VerifiedRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: tokens.font.mono, fontSize: { xs: 10.5, sm: 11.5 },
                  letterSpacing: '0.22em', color: tokens.color.gold, fontWeight: 600,
                  textShadow: '0 1px 8px rgba(7,26,51,0.6)'
                }}
              >
                DEPUIS 2018 — KINSHASA, RDC
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontFamily: tokens.font.display, fontSize: { xs: 38, sm: 50, md: 62 },
                color: '#fff', lineHeight: 1.04, mb: 1.2,
                textShadow: '0 2px 24px rgba(7,26,51,0.55)'
              }}
            >
              Hôtel Fleuve
            </Typography>
            <Typography
              sx={{
                fontFamily: tokens.font.display, fontStyle: 'italic',
                fontSize: { xs: 16, sm: 19, md: 22 }, color: tokens.color.goldSoft, mb: 1.8,
                textShadow: '0 1px 12px rgba(7,26,51,0.5)'
              }}
            >
              « Le fleuve vous accueille, le luxe vous retient. »
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.9)', fontSize: { xs: 14, md: 15.5 },
                lineHeight: 1.75, mb: 3, maxWidth: 560,
                textShadow: '0 1px 10px rgba(7,26,51,0.6)'
              }}
            >
              {heroImages[heroIndex].tagline} — des suites d’exception, une gastronomie raffinée,
              un spa apaisant et un service de conciergerie 5 étoiles.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.4, sm: 1.6 }}>
              <Button
                variant="contained" color="secondary" size="large"
                startIcon={<PlayArrowRoundedIcon />}
                onClick={() => navigate('/client/chambres')}
                sx={{ fontWeight: 700, px: 3.5, boxShadow: tokens.shadow.md, '&:hover': { transform: 'translateY(-2px)', boxShadow: tokens.shadow.lg } }}
              >
                Réserver maintenant
              </Button>
              <Button
                variant="outlined" size="large"
                sx={{
                  color: '#fff', borderColor: 'rgba(255,255,255,0.55)', fontWeight: 600,
                  backdropFilter: 'blur(4px)', bgcolor: 'rgba(255,255,255,0.06)',
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.14)' }
                }}
                onClick={() => navigate('/client/restaurant')}
              >
                Découvrir le restaurant
              </Button>
            </Stack>

            {/* Ligne de confiance */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: { xs: 3, md: 4 } }}>
              <Rating value={5} readOnly size="small" sx={{ color: tokens.color.gold, '& .MuiRating-icon': { mr: 0.2 } }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600 }}>
                4,6/5 — plus de 12 500 clients satisfaits
              </Typography>
            </Stack>

            {/* Dots */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: { xs: 2.5, md: 3.5 } }}>
              {heroImages.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  role="button"
                  aria-label={`Aller à la diapositive ${i + 1}`}
                  sx={{
                    width: i === heroIndex ? 30 : 10, height: 5, borderRadius: '3px', cursor: 'pointer',
                    bgcolor: i === heroIndex ? tokens.color.gold : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.35s', '&:hover': { bgcolor: tokens.color.gold }
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Flèches navigation */}
          <Stack
            direction="row" spacing={1}
            sx={{ position: 'absolute', right: { xs: 14, sm: 24, md: 32 }, bottom: { xs: 16, md: 24 }, zIndex: 3 }}
          >
            <IconButton
              onClick={() => heroGo(-1)}
              aria-label="Diapositive précédente"
              sx={{ bgcolor: 'rgba(255,255,255,0.16)', color: '#fff', backdropFilter: 'blur(8px)', '&:hover': { bgcolor: tokens.color.gold, color: tokens.color.navyDeep } }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
            <IconButton
              onClick={() => heroGo(1)}
              aria-label="Diapositive suivante"
              sx={{ bgcolor: 'rgba(255,255,255,0.16)', color: '#fff', backdropFilter: 'blur(8px)', '&:hover': { bgcolor: tokens.color.gold, color: tokens.color.navyDeep } }}
            >
              <ArrowForwardIosRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Box>
      </Reveal>

      {/* ================================================================
          CHIFFRES CLÉS — compteurs animés, cartes blanches élégantes
      ================================================================ */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Reveal>
          <SectionHeader
            kicker="Chiffres clés"
            title="Un hôtel à la hauteur de vos ambitions"
            subtitle="Des résultats concrets qui font de l'Hôtel Fleuve une référence à Kinshasa et en RDC."
          />
        </Reveal>
        <Grid container spacing={2.5}>
          {homeStats.map((s, idx) => (
            <Grid item xs={6} sm={4} md={2} key={s.id}>
              <Reveal delay={idx * 60}>
                <Card
                  sx={{
                    height: '100%', p: { xs: 2, sm: 2.6 }, textAlign: 'center',
                    borderTop: `3px solid ${tokens.color.gold}`, borderRadius: '18px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: tokens.shadow.md }
                  }}
                >
                  <Box
                    sx={{
                      width: 48, height: 48, borderRadius: '13px', mx: 'auto', mb: 1.4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep
                    }}
                  >
                    {statIcons[s.icon]}
                  </Box>
                  <AnimatedCounter
                    value={s.value}
                    decimals={s.decimals || 0}
                    suffix={s.suffix || ''}
                    sx={{ fontSize: { xs: 20, md: 26 }, color: tokens.color.navy, lineHeight: 1.1 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mt: 0.6, lineHeight: 1.4, fontSize: { xs: 11, sm: 12 } }}
                  >
                    {s.label}
                  </Typography>
                </Card>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================================================================
          SERVICES — cartes blanches premium avec image
      ================================================================ */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Reveal>
          <SectionHeader
            kicker="Nos services"
            title="Tout ce qu'il faut pour un séjour parfait"
            subtitle="Chambres raffinées, tables d'exception, bien-être et conciergerie : explorez l'univers Hôtel Fleuve."
          />
        </Reveal>
        <Grid container spacing={2.5}>
          {services.map((s, idx) => (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Reveal delay={idx * 50}>
                <Card
                  onClick={() => navigate(s.route)}
                  sx={{
                    height: '100%', overflow: 'hidden', cursor: 'pointer', position: 'relative',
                    borderRadius: '18px', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)', boxShadow: tokens.shadow.md,
                      '& .service-img': { transform: 'scale(1.05)' },
                      '& .service-cta': { bgcolor: tokens.color.gold, color: tokens.color.navyDeep }
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', height: { xs: 180, sm: 200 }, overflow: 'hidden' }}>
                    <Box
                      component="img" src={s.image} alt={s.nom} loading="lazy"
                      className="service-img"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}
                    />
                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,26,51,0.02) 45%, rgba(7,26,51,0.72) 100%)' }} />
                    <Box
                      sx={{
                        position: 'absolute', top: 14, left: 14, width: 42, height: 42, borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: 'rgba(255,255,255,0.94)', color: tokens.color.navy, boxShadow: tokens.shadow.sm
                      }}
                    >
                      {s.icon}
                    </Box>
                    <Box sx={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 17, fontFamily: tokens.font.display, textShadow: '0 1px 8px rgba(7,26,51,0.5)' }}>
                        {s.nom}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: { xs: 2, sm: 2.2 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.5, minWidth: 0 }}>
                      {s.desc}
                    </Typography>
                    <Box
                      className="service-cta"
                      sx={{
                        flexShrink: 0, width: 38, height: 38, borderRadius: '11px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: tokens.color.cream, color: tokens.color.navy,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <ArrowForwardRoundedIcon sx={{ fontSize: 19 }} />
                    </Box>
                  </Box>
                </Card>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================================================================
          POURQUOI NOUS CHOISIR ? / L'EXCELLENCE — section claire & élégante
      ================================================================ */}
      <Box
        sx={{
          mb: { xs: 6, md: 8 },
          background: 'linear-gradient(160deg, #FBF8F1 0%, #F3EEE1 100%)',
          border: `1px solid ${tokens.color.line}`,
          borderRadius: { xs: 8, md: 10 }, p: { xs: 3.5, sm: 5, md: 6.5 }, position: 'relative', overflow: 'hidden'
        }}
      >

        <Reveal>
          <SectionHeader
            kicker="Pourquoi nous choisir ?"
            title="L'excellence, de votre arrivée à votre départ"
            subtitle="Des standards internationaux au cœur de Kinshasa, pensés pour les voyageurs exigeants."
          />
        </Reveal>
        <Grid container spacing={2.5}>
          {whyChooseUs.map((w, idx) => (
            <Grid item xs={12} sm={6} md={4} key={w.id}>
              <Reveal delay={idx * 50}>
                <Card
                  sx={{
                    p: { xs: 2.6, sm: 3 }, height: '100%', borderRadius: '8px',
                    bgcolor: '#fff', border: `1px solid ${tokens.color.line}`,
                    position: 'relative', overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                    '&::before': {
                      content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                      bgcolor: tokens.color.gold, opacity: 0, transition: 'opacity 0.3s ease'
                    },
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: tokens.shadow.md, borderColor: tokens.color.gold, '&::before': { opacity: 1 } }
                  }}
                >
                  <Box
                    sx={{
                      width: 48, height: 48, borderRadius: '6px', mb: 1.8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {whyIcons[w.icon]}
                  </Box>
                  <Typography sx={{ color: tokens.color.navyDeep, fontWeight: 700, fontSize: 16, fontFamily: tokens.font.display, mb: 0.8 }}>
                    {w.titre}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 13, lineHeight: 1.7 }}>
                    {w.texte}
                  </Typography>
                </Card>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================================================================
          COMMENT ÇA MARCHE ? — 4 étapes
      ================================================================ */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Reveal>
          <SectionHeader
            kicker="Comment ça marche ?"
            title="Votre séjour en 4 étapes simples"
            subtitle="Une expérience fluide, du choix de la chambre jusqu'à votre fidélisation."
          />
        </Reveal>
        <Grid container spacing={2.5}>
          {howItWorks.map((st, idx) => (
            <Grid item xs={12} sm={6} md={3} key={st.id}>
              <Reveal delay={idx * 70}>
                <Box sx={{ position: 'relative', textAlign: 'center', px: { xs: 1, md: 1.5 } }}>
                  {idx < howItWorks.length - 1 && (
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute', top: 40, left: 'calc(50% + 45px)', width: 'calc(100% - 90px)',
                        borderTop: `1.5px dashed ${tokens.color.line}`
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      width: { xs: 76, sm: 84 }, height: { xs: 76, sm: 84 }, borderRadius: '22px', mx: 'auto', mb: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: tokens.color.goldSoft, color: tokens.color.navy, position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': { bgcolor: tokens.color.gold, color: tokens.color.navyDeep, transform: 'translateY(-3px)' }
                    }}
                  >
                    {stepsIcons[st.icon]}
                    <Box
                      sx={{
                        position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: '50%',
                        bgcolor: tokens.color.navy, color: tokens.color.gold, fontFamily: tokens.font.mono,
                        fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      {st.id}
                    </Box>
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15.5, fontFamily: tokens.font.display, mb: 0.6, color: tokens.color.navyDeep }}>
                    {st.titre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5, lineHeight: 1.65 }}>
                    {st.texte}
                  </Typography>
                </Box>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================================================================
          CHAMBRES POPULAIRES
      ================================================================ */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Reveal>
          <SectionTitle
            kicker="Sélection"
            title="Chambres populaires"
            action="Tout voir"
            onAction={() => navigate('/client/chambres')}
          />
        </Reveal>
        <Grid container spacing={2.5}>
          {popularRooms.map((room, idx) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Reveal delay={idx * 70}>
                <Card
                  sx={{
                    overflow: 'hidden', height: '100%', borderRadius: '18px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: tokens.shadow.md }
                  }}
                >
                  <Box sx={{ position: 'relative', height: { xs: 170, sm: 180 }, overflow: 'hidden' }}>
                    <Box
                      component="img" src={room.image} alt={room.nom} loading="lazy"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.05)' } }}
                    />
                    <Chip label="Disponible" size="small" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: tokens.color.success, color: '#fff', fontWeight: 700 }} />
                    {room.promotion && (
                      <Chip label={room.promotion} size="small" sx={{ position: 'absolute', bottom: 12, left: 12, bgcolor: tokens.color.gold, color: tokens.color.navyDeep, fontWeight: 700 }} />
                    )}
                  </Box>
                  <Box sx={{ p: { xs: 2.2, sm: 2.4 } }}>
                    <Typography variant="h6" sx={{ fontSize: 17, color: tokens.color.navyDeep }}>{room.nom}</Typography>
                    <Typography
                      variant="body2" color="text.secondary" sx={{
                        fontSize: 12.5, mt: 0.4, lineHeight: 1.6,
                        overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {room.description}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.8, gap: 1 }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy, fontSize: 15 }}>{currency(room.prix)}</Typography>
                        <Typography variant="caption" color="text.secondary">/ nuit</Typography>
                      </Box>
                      <Button
                        variant="contained" color="secondary" size="small"
                        sx={{ boxShadow: 'none', px: 2, flexShrink: 0, whiteSpace: 'nowrap' }}
                        onClick={() => handleBookRoom(room)}
                      >
                        Réserver
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================================================================
          RESTAURANT + BAR (deux sections jumelles)
      ================================================================ */}
      <Grid container spacing={3} sx={{ mb: { xs: 6, md: 8 } }}>
        <Grid item xs={12} md={6}>
          <Reveal>
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 1 }}>
                <Box>
                  <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: tokens.color.gold, fontWeight: 600 }}>
                    Restaurant
                  </Typography>
                  <Typography variant="h5" sx={{ fontSize: { xs: 20, md: 24 }, color: tokens.color.navyDeep }}>
                    Repas vedettes du chef
                  </Typography>
                </Box>
                <Button endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/client/restaurant')} sx={{ flexShrink: 0, fontSize: 13 }}>
                  Voir le menu
                </Button>
              </Stack>
              <Stack spacing={1.4}>
                {featuredMenu.map((item) => (
                  <Card key={item.id} sx={{ p: 1.6, display: 'flex', gap: 1.6, alignItems: 'center', borderRadius: '16px', transition: 'all 0.3s ease', '&:hover': { boxShadow: tokens.shadow.md } }}>
                    <Box component="img" src={item.image} alt={item.nom} loading="lazy" sx={{ width: { xs: 64, sm: 72 }, height: { xs: 64, sm: 72 }, borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 14, color: tokens.color.navyDeep }}>{item.nom}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.8, gap: 1 }}>
                        <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy, fontSize: 13.5 }}>{currency(item.prix)}</Typography>
                        <Button size="small" variant="contained" sx={{ boxShadow: 'none', flexShrink: 0 }} onClick={() => navigate('/client/restaurant')}>Ajouter</Button>
                      </Stack>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Reveal>
        </Grid>

        <Grid item xs={12} md={6}>
          <Reveal delay={100}>
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 1 }}>
                <Box>
                  <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: tokens.color.gold, fontWeight: 600 }}>
                    Bar & Cocktails
                  </Typography>
                  <Typography variant="h5" sx={{ fontSize: { xs: 20, md: 24 }, color: tokens.color.navyDeep }}>
                    Signatures du barman
                  </Typography>
                </Box>
                <Button endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/client/bar')} sx={{ flexShrink: 0, fontSize: 13 }}>
                  Voir la carte
                </Button>
              </Stack>
              <Stack spacing={1.4}>
                {featuredBar.map((item) => (
                  <Card key={item.id} sx={{ p: 1.6, display: 'flex', gap: 1.6, alignItems: 'center', borderRadius: '16px', transition: 'all 0.3s ease', '&:hover': { boxShadow: tokens.shadow.md } }}>
                    <Box component="img" src={item.image} alt={item.nom} loading="lazy" sx={{ width: { xs: 64, sm: 72 }, height: { xs: 64, sm: 72 }, borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 14, color: tokens.color.navyDeep }}>{item.nom}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.marque} · {item.volume}</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.8, gap: 1 }}>
                        <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy, fontSize: 13.5 }}>{currency(item.prix)}</Typography>
                        <Button size="small" variant="contained" color="secondary" sx={{ boxShadow: 'none', flexShrink: 0 }} onClick={() => navigate('/client/bar')}>Ajouter</Button>
                      </Stack>
                    </Box>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Reveal>
        </Grid>
      </Grid>

      {/* ================================================================
          ACTIVITÉS
      ================================================================ */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Reveal>
          <SectionTitle
            kicker="Loisirs"
            title="Activités & Expériences"
            action="Tout voir"
            onAction={() => navigate('/client/activites')}
          />
        </Reveal>
        <Grid container spacing={2.5}>
          {activities.map((a, idx) => (
            <Grid item xs={12} sm={6} md={4} key={a.id}>
              <Reveal delay={idx * 50}>
                <Card sx={{ overflow: 'hidden', height: '100%', borderRadius: '18px', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: tokens.shadow.md } }}>
                  <Box sx={{ position: 'relative', height: { xs: 140, sm: 150 }, overflow: 'hidden' }}>
                    <Box component="img" src={a.image} alt={a.nom} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.05)' } }} />
                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(7,26,51,0.3)' }} />
                    <Box sx={{ position: 'absolute', bottom: 10, left: 12, right: 12, color: '#fff', display: 'flex', gap: 0.8, alignItems: 'center' }}>
                      <Box sx={{ width: 30, height: 30, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.16)', flexShrink: 0 }}>
                        {activityIcons[a.nom] || <SpaRoundedIcon sx={{ fontSize: 18, color: tokens.color.gold }} />}
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 15, textShadow: '0 1px 6px rgba(7,26,51,0.5)' }}>{a.nom}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 0 }}>{a.horaire}</Typography>
                    <Typography sx={{ fontWeight: 700, color: tokens.color.navy, fontFamily: tokens.font.mono, fontSize: 13, flexShrink: 0 }}>
                      {a.prix ? currency(a.prix) : 'Inclus'}
                    </Typography>
                  </Box>
                </Card>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================================================================
          GALERIE — hover zoom subtil
      ================================================================ */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Reveal>
          <SectionHeader
            kicker="Galerie"
            title="Plongez dans l'ambiance de l'hôtel"
            subtitle="Un aperçu de nos espaces, entre élégance intemporelle et confort moderne."
          />
        </Reveal>
        <Grid container spacing={1.5}>
          {gallery.map((g, idx) => (
            <Grid item xs={6} md={4} key={g.id}>
              <Reveal delay={idx * 40}>
                <Box
                  sx={{
                    position: 'relative', borderRadius: '16px', overflow: 'hidden',
                    height: { xs: 130, sm: 150, md: 190 }, cursor: 'pointer',
                    '&:hover img': { transform: 'scale(1.05)' },
                    '&:hover .gallery-overlay': { opacity: 1 }
                  }}
                >
                  <Box
                    component="img" src={g.image} alt={g.titre} loading="lazy"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}
                  />
                  <Box
                    className="gallery-overlay"
                    sx={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, p: 1.4,
                      background: 'linear-gradient(transparent, rgba(7,26,51,0.82))', opacity: 1, transition: 'opacity 0.4s ease'
                    }}
                  >
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 13.5, textShadow: '0 1px 6px rgba(7,26,51,0.4)' }}>{g.titre}</Typography>
                  </Box>
                </Box>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================================================================
          NOS PARTENAIRES — marquee sur fond clair, cartes blanches fines
      ================================================================ */}
      <Box
        sx={{
          mb: { xs: 6, md: 8 }, py: { xs: 3.5, sm: 4.5, md: 5.5 }, px: { xs: 1.5, sm: 3 },
          bgcolor: '#FBF8F1', border: `1px solid ${tokens.color.line}`,
          borderRadius: { xs: 20, md: 26 }, overflow: 'hidden'
        }}
      >
        <Reveal>
          <SectionHeader
            kicker="Ils nous font confiance"
            title="Nos partenaires"
            subtitle="Un réseau de partenaires de confiance pour enrichir votre expérience."
          />
        </Reveal>
        <Box sx={{ position: 'relative', overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
          <Box sx={{ display: 'flex', gap: 3, width: 'max-content', animation: `${marquee} 36s linear infinite`, '&:hover': { animationPlayState: 'paused' } }}>
            {[...partners, ...partners].map((p, i) => (
              <Box
                key={`${p.id}-${i}`}
                sx={{
                  flexShrink: 0, minWidth: { xs: 150, sm: 170 }, p: { xs: 2, sm: 2.4 },
                  borderRadius: '16px', bgcolor: '#fff', border: `1px solid ${tokens.color.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.2,
                  transition: 'all 0.3s ease', '&:hover': { borderColor: tokens.color.gold, boxShadow: tokens.shadow.sm }
                }}
              >
                <Box component="img" src={p.logo} alt={p.nom} loading="lazy" sx={{ width: 40, height: 40, borderRadius: '11px', objectFit: 'cover', flexShrink: 0 }} />
                <Typography sx={{ color: tokens.color.navyDeep, fontWeight: 700, fontSize: 14.5, whiteSpace: 'nowrap' }}>{p.nom}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ================================================================
          TÉMOIGNAGES — carrousel premium refondu (1/2/3 par vue)
      ================================================================ */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Reveal>
          <SectionHeader
            kicker="Témoignages"
            title="Ils ont séjourné chez nous"
            subtitle="La satisfaction de nos hôtes est notre plus belle récompense."
          />
        </Reveal>

        <Box sx={{ position: 'relative', maxWidth: 1080, mx: 'auto', px: { xs: 0.5, sm: 4 } }}>
          <Box sx={{ overflow: 'hidden', borderRadius: { xs: 18, md: 22 } }}>
            <Box
              sx={{
                display: 'flex', alignItems: 'stretch',
                transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
                transform: `translateX(-${testimonialIndex * (100 / testimonialsPerView)}%)`
              }}
            >
              {testimonials.map((t) => (
                <Box
                  key={t.id}
                  sx={{ width: `${100 / testimonialsPerView}%`, flexShrink: 0, px: { xs: 0.5, sm: 0.9 }, py: 0.5, minWidth: 0 }}
                >
                  <Card
                    sx={{
                      height: '100%', p: { xs: 2.4, sm: 3 }, borderRadius: '18px',
                      bgcolor: '#fff', border: `1px solid ${tokens.color.line}`,
                      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: tokens.shadow.md }
                    }}
                  >
                    {/* Guillemet décoratif */}
                    <FormatQuoteRoundedIcon
                      sx={{
                        position: 'absolute', top: 10, right: 14, fontSize: 58, color: tokens.color.goldSoft,
                        transform: 'rotate(180deg)', opacity: 0.85
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2, gap: 1 }}>
                      <Rating value={t.note} readOnly size="small" sx={{ color: tokens.color.gold }} />
                      <Chip
                        icon={<VerifiedRoundedIcon sx={{ fontSize: 14 }} />}
                        label="Séjour vérifié"
                        size="small"
                        sx={{
                          bgcolor: tokens.color.cream, color: tokens.color.navy, fontSize: 10.5,
                          height: 24, fontWeight: 600, '& .MuiChip-icon': { color: tokens.color.success }
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary', fontSize: { xs: 13, sm: 13.5 }, lineHeight: 1.7,
                        fontStyle: 'italic', mb: 2.2, flex: 1, position: 'relative', zIndex: 1
                      }}
                    >
                      « {t.avis} »
                    </Typography>
                    <Divider sx={{ mb: 1.6 }} />
                    <Stack direction="row" spacing={1.4} alignItems="center">
                      <Box sx={{ position: 'relative', flexShrink: 0 }}>
                        <Avatar
                          src={`https://i.pravatar.cc/80?img=${t.id + 20}`}
                          sx={{
                            width: 48, height: 48,
                            border: `2px solid ${tokens.color.goldSoft}`,
                            boxShadow: `0 0 0 2px ${tokens.color.gold}`
                          }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: tokens.color.navyDeep }}>{t.nom}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {new Date(t.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Dots */}
          <Stack direction="row" spacing={0.9} justifyContent="center" sx={{ mt: 2.8 }}>
            {Array.from({ length: maxTestimonialIndex + 1 }).map((_, i) => (
              <Box
                key={i}
                onClick={() => setTestimonialIndex(i)}
                role="button"
                aria-label={`Aller au témoignage ${i + 1}`}
                sx={{
                  width: i === testimonialIndex ? 26 : 9, height: 6, borderRadius: '3px', cursor: 'pointer',
                  bgcolor: i === testimonialIndex ? tokens.color.gold : tokens.color.line,
                  transition: 'all 0.35s'
                }}
              />
            ))}
          </Stack>

          {/* Flèches */}
          <IconButton
            onClick={() => setTestimonialIndex((i) => (i <= 0 ? maxTestimonialIndex : i - 1))}
            aria-label="Témoignages précédents"
            sx={{
              position: 'absolute', top: '42%', left: { xs: -4, sm: -14 },
              bgcolor: '#fff', boxShadow: tokens.shadow.md, color: tokens.color.navy,
              border: `1px solid ${tokens.color.line}`,
              '&:hover': { bgcolor: tokens.color.gold, color: tokens.color.navyDeep }
            }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <IconButton
            onClick={() => setTestimonialIndex((i) => (i >= maxTestimonialIndex ? 0 : i + 1))}
            aria-label="Témoignages suivants"
            sx={{
              position: 'absolute', top: '42%', right: { xs: -4, sm: -14 },
              bgcolor: '#fff', boxShadow: tokens.shadow.md, color: tokens.color.navy,
              border: `1px solid ${tokens.color.line}`,
              '&:hover': { bgcolor: tokens.color.gold, color: tokens.color.navyDeep }
            }}
          >
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* ================================================================
          FAQ — accordéon interactif
      ================================================================ */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Reveal>
          <SectionHeader
            kicker="FAQ"
            title="Questions fréquentes"
            subtitle="Tout ce que vous devez savoir avant de réserver votre séjour."
          />
        </Reveal>
        <Box sx={{ maxWidth: 780, mx: 'auto' }}>
          {faqItems.map((f, idx) => (
            <Reveal key={f.id} delay={idx * 40}>
              <Accordion
                sx={{
                  mb: 1.4, borderRadius: '16px !important', boxShadow: 'none',
                  border: `1px solid ${tokens.color.line}`, bgcolor: '#fff',
                  '&::before': { display: 'none' },
                  '&.Mui-expanded': { borderColor: tokens.color.gold, boxShadow: tokens.shadow.sm }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreRoundedIcon sx={{ color: tokens.color.navy }} />}
                  sx={{ borderRadius: '16px', '&.Mui-expanded': { bgcolor: tokens.color.goldSoft } }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: 15, color: tokens.color.navyDeep }}>{f.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, fontSize: 13.5 }}>
                    {f.reponse}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Reveal>
          ))}
        </Box>
      </Box>

      {/* ================================================================
          CTA FINAL — Offre bienvenue 10 %
      ================================================================ */}
     <Reveal>
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',

      width: '100%',
      maxWidth: '100%',

      mb: { xs: 6, md: 8 },

      borderRadius: '20px',

      p: {
        xs: 4,
        sm: 6,
        md: 8
      },

      textAlign: 'center',

      boxShadow: '0 15px 40px rgba(0,0,0,0.15)',

      background: `linear-gradient(
        120deg,
        ${tokens.color.navyDeep} 0%,
        ${tokens.color.navy} 55%,
        ${tokens.color.navySoft} 100%
      )`,
    }}
  >
    {/* Image de fond */}
    <Box
      component="img"
      src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=70"
      loading="lazy"
      alt="Hôtel Fleuve"
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.15,
        borderRadius: 'inherit',
      }}
    />

    {/* Overlay lumineux */}
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 50% 120%, rgba(201,162,75,0.30) 0%, transparent 60%)',
      }}
    />

    {/* Contenu */}
    <Box
      sx={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '900px',
        mx: 'auto',
      }}
    >
      {/* Badge */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,

          bgcolor: 'rgba(201,162,75,0.16)',
          border: `1px solid ${tokens.color.gold}`,

          color: tokens.color.goldSoft,

          borderRadius: '12px',

          px: 2.5,
          py: 1,

          mb: 3,
        }}
      >
        <StarRoundedIcon sx={{ fontSize: 18 }} />

        <Typography
          sx={{
            fontSize: { xs: 11, sm: 13 },
            fontWeight: 600,
            fontFamily: tokens.font.mono,
            letterSpacing: '0.08em',
            textAlign: 'center',
          }}
        >
          OFFRE BIENVENUE — 10% DE RÉDUCTION SUR VOTRE PREMIER SÉJOUR
        </Typography>
      </Box>

      {/* Titre */}
      <Typography
        sx={{
          fontFamily: tokens.font.display,
          color: '#FFFFFF',

          fontSize: {
            xs: 28,
            sm: 38,
            md: 48,
          },

          fontWeight: 700,
          lineHeight: 1.15,

          mb: 2,

          textShadow: '0 2px 20px rgba(7,26,51,0.50)',
        }}
      >
        Prêt à vivre l'expérience Hôtel Fleuve ?
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          color: 'rgba(255,255,255,0.85)',

          fontSize: {
            xs: 14,
            md: 16,
          },

          lineHeight: 1.8,

          maxWidth: '650px',
          mx: 'auto',

          mb: 4,
        }}
      >
        Réservez dès maintenant et profitez de nos meilleurs tarifs,
        d'un accueil personnalisé et d'une annulation gratuite
        jusqu'à 48 heures avant votre arrivée.
      </Typography>

      {/* Boutons */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<EventAvailableRoundedIcon />}
          onClick={() => navigate('/client/chambres')}
          sx={{
            minWidth: 240,

            px: 4,
            py: 1.5,

            borderRadius: '12px',

            fontWeight: 700,

            boxShadow: tokens.shadow.lg,

            transition: 'all .3s ease',

            '&:hover': {
              transform: 'translateY(-3px)',
            },
          }}
        >
          Réserver une chambre
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/client/fidelite')}
          sx={{
            minWidth: 240,

            px: 4,
            py: 1.5,

            borderRadius: '12px',

            color: '#FFFFFF',
            borderColor: 'rgba(255,255,255,0.5)',

            fontWeight: 600,

            transition: 'all .3s ease',

            '&:hover': {
              borderColor: '#FFFFFF',
              bgcolor: 'rgba(255,255,255,0.10)',
              transform: 'translateY(-3px)',
            },
          }}
        >
          Voir le programme fidélité
        </Button>
      </Stack>
    </Box>
  </Box>
</Reveal>

      {/* ================================================================
          CONTACT
      ================================================================ */}
     <Reveal>
  <Card
    sx={{
      p: { xs: 3, sm: 4, md: 5 },
      mb: 4,
      borderRadius: '20px',
      border: `1px solid ${tokens.color.line}`,
      boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      bgcolor: 'background.paper',
    }}
  >
    <Grid container spacing={4} alignItems="flex-start">
      {/* Informations de contact */}
      <Grid item xs={12} md={5}>
        <Typography
          sx={{
            fontFamily: tokens.font.mono,
            fontSize: 12,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: tokens.color.gold,
            fontWeight: 700,
            mb: 1,
          }}
        >
          Contact
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: 28, md: 34 },
            fontWeight: 700,
            color: tokens.color.navyDeep,
            mb: 1.5,
          }}
        >
          Restons en contact
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            lineHeight: 1.8,
          }}
        >
          Une question, une demande spéciale ou une réservation ?
          Notre équipe est disponible 24h/24 et 7j/7 pour vous assister.
        </Typography>

        <Stack spacing={2.5}>
          {/* Téléphone */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '12px',
                bgcolor: tokens.color.goldSoft,
                color: tokens.color.navyDeep,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PhoneRoundedIcon />
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Téléphone
              </Typography>
              <Typography fontWeight={600}>
                {hotelContact.telephone}
              </Typography>
            </Box>
          </Stack>

          {/* Email */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '12px',
                bgcolor: tokens.color.goldSoft,
                color: tokens.color.navyDeep,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <EmailRoundedIcon />
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Email
              </Typography>
              <Typography fontWeight={600}>
                {hotelContact.email}
              </Typography>
            </Box>
          </Stack>

          {/* Adresse */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '12px',
                bgcolor: tokens.color.goldSoft,
                color: tokens.color.navyDeep,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <LocationOnRoundedIcon />
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Adresse
              </Typography>
              <Typography fontWeight={600}>
                {hotelContact.adresse}
              </Typography>
            </Box>
          </Stack>

          {/* Réseaux sociaux */}
          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            {hotelContact.reseaux.map((r) => (
              <IconButton
                key={r.nom}
                component="a"
                href={r.url}
                target="_blank"
                rel="noreferrer"
                aria-label={r.nom}
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: '12px',
                  bgcolor: tokens.color.cream,
                  border: `1px solid ${tokens.color.line}`,
                  transition: 'all .3s ease',
                  '&:hover': {
                    bgcolor: tokens.color.goldSoft,
                    borderColor: tokens.color.gold,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {socialIcons[r.nom] || <FacebookRoundedIcon />}
              </IconButton>
            ))}
          </Stack>
        </Stack>
      </Grid>

      {/* Formulaire */}
      <Grid item xs={12} md={7}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
          >
            <TextField
              label="Votre nom"
              fullWidth
              size="medium"
            />

            <TextField
              label="Email"
              fullWidth
              size="medium"
            />
          </Stack>

          <TextField
            label="Votre message"
            multiline
            rows={5}
            fullWidth
            value={contactMsg}
            onChange={(e) => setContactMsg(e.target.value)}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.3,
                borderRadius: '12px',
                boxShadow: 'none',
              }}
              onClick={() => {
                if (!contactMsg.trim()) return;

                setSnackbar({
                  open: true,
                  message:
                    'Message envoyé à la réception. Nous vous répondrons rapidement.',
                  severity: 'success',
                });

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
              rel="noreferrer"
              startIcon={<LocationOnRoundedIcon />}
              sx={{
                borderRadius: '12px',
                px: 3,
              }}
            >
              Ouvrir dans Google Maps
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  </Card>
</Reveal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

