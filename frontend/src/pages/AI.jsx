import { Grid, Card, Box, Typography, Stack, Chip, LinearProgress, TextField, IconButton } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import { tokens } from '../theme.js';
import { previsionOccupation, previsionVentes, produitsPopulaires, clientsVIP, alertesFraude, currency } from '../data/mockData.js';

export default function AI() {
  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} md={7}>
        <Card sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
            <AutoAwesomeRoundedIcon sx={{ color: tokens.color.gold, fontSize: 20 }} />
            <Typography variant="h6">Prévision d’occupation (IA)</Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">Réel vs projection sur les 3 prochains jours</Typography>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={previsionOccupation} margin={{ left: -20, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.color.line} vertical={false} />
              <XAxis dataKey="jour" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${tokens.color.line}` }} />
              <Line type="monotone" dataKey="reel" name="Réel" stroke={tokens.color.navy} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="prevision" name="Prévision" stroke={tokens.color.gold} strokeWidth={2.5} strokeDasharray="5 4" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card sx={{ p: 3, mt: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 0.4 }}>Prévision des ventes — Restaurant & Bar</Typography>
          <Typography variant="caption" color="text.secondary">Projection IA sur 6 jours glissants</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={previsionVentes}>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.color.line} vertical={false} />
              <XAxis dataKey="jour" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${tokens.color.line}` }} formatter={(v) => currency(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="restaurant" name="Restaurant" fill={tokens.color.navy} radius={[6, 6, 0, 0]} />
              <Bar dataKey="bar" name="Bar" fill={tokens.color.gold} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card sx={{ p: 3, mt: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>Produits les plus populaires</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={produitsPopulaires} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.color.line} horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis type="category" dataKey="nom" tickLine={false} axisLine={false} fontSize={12} width={140} />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${tokens.color.line}` }} />
              <Bar dataKey="ventes" fill={tokens.color.navy} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card sx={{ p: 3, mb: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>Clients VIP (score de fidélité IA)</Typography>
          <Stack spacing={1.8}>
            {clientsVIP.map((c) => (
              <Box key={c.nom}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{c.nom}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: tokens.color.gold }}>{c.score}</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={c.score}
                  sx={{ height: 6, borderRadius: 6, bgcolor: tokens.color.line, '& .MuiLinearProgress-bar': { bgcolor: tokens.color.gold, borderRadius: 6 } }}
                />
                <Typography variant="caption" color="text.secondary">{c.sejours} séjours · {currency(c.depenses)}</Typography>
              </Box>
            ))}
          </Stack>
        </Card>

        <Card sx={{ p: 3, mb: 2.5 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <WarningAmberRoundedIcon sx={{ color: tokens.color.warning, fontSize: 20 }} />
            <Typography variant="h6">Détection d’anomalies</Typography>
          </Stack>
          <Stack spacing={1.4}>
            {alertesFraude.map((a) => (
              <Stack key={a.id} direction="row" spacing={1.4} sx={{ p: 1.4, borderRadius: '10px', bgcolor: tokens.color.warningSoft }}>
                <Chip label={a.niveau} size="small" sx={{ bgcolor: tokens.color.warning, color: '#fff', fontWeight: 700, height: 22 }} />
                <Box>
                  <Typography variant="body2">{a.description}</Typography>
                  <Typography variant="caption" color="text.secondary">{a.heure}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Card>

        <Card sx={{ p: 3, bgcolor: tokens.color.navy, color: '#fff' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <SmartToyRoundedIcon sx={{ color: tokens.color.gold }} />
            <Typography variant="h6">Assistant virtuel hôtel</Typography>
          </Stack>
          <Stack spacing={1} sx={{ mb: 1.5 }}>
            <Box sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(255,255,255,0.08)', borderRadius: '10px', p: 1.2, maxWidth: '85%' }}>
              <Typography variant="body2">Bonjour ! Puis-je vous aider à consulter vos réservations, votre stock ou vos statistiques du jour ?</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField
              placeholder="Poser une question au chatbot…"
              size="small"
              fullWidth
              sx={{
                bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '8px',
                '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }
              }}
            />
            <IconButton sx={{ bgcolor: tokens.color.gold, color: tokens.color.navyDeep, '&:hover': { bgcolor: tokens.color.gold } }}>
              <SendRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
