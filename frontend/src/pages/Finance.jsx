import { useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Chip, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { financeJournal, financeTrend, financeIndicateurs, caisse, kpis, currency } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

export default function Finance() {
  const [searchQuery, setSearchQuery] = useState('');
  const solde = kpis.recettesJour - kpis.depensesJour;
  const journalRows = filterRecords(financeJournal, searchQuery, ['libelle', 'type', 'montant', 'date']);

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} md={4}>
        <Stack spacing={2.5}>
          <Card sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="overline" color="text.secondary">Caisse</Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.4 }}>
                  {caisse.statut === 'Ouverte' ? (
                    <LockOpenRoundedIcon sx={{ fontSize: 18, color: tokens.color.success }} />
                  ) : (
                    <LockRoundedIcon sx={{ fontSize: 18, color: tokens.color.danger }} />
                  )}
                  <Typography sx={{ fontWeight: 700 }}>{caisse.statut}</Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.4 }}>
                  Par {caisse.ouvertePar} à {caisse.heureOuverture}
                </Typography>
              </Box>
              <Button size="small" variant={caisse.statut === 'Ouverte' ? 'outlined' : 'contained'} color={caisse.statut === 'Ouverte' ? 'error' : 'primary'} sx={{ borderColor: tokens.color.line }}>
                {caisse.statut === 'Ouverte' ? 'Fermer' : 'Ouvrir'}
              </Button>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.6 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Solde initial</Typography>
                <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 600 }}>{currency(caisse.soldeInitial)}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">Solde actuel</Typography>
                <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy }}>{currency(caisse.soldeActuel)}</Typography>
              </Box>
            </Stack>
          </Card>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="overline" color="text.secondary">Recettes du jour</Typography>
            <Typography variant="h4" sx={{ color: tokens.color.success }}>{currency(kpis.recettesJour)}</Typography>
          </Card>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="overline" color="text.secondary">Dépenses du jour</Typography>
            <Typography variant="h4" sx={{ color: tokens.color.warning }}>{currency(kpis.depensesJour)}</Typography>
          </Card>
          <Card sx={{ p: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)' }}>Solde de caisse</Typography>
            <Typography variant="h4" sx={{ color: tokens.color.gold }}>{currency(solde)}</Typography>
          </Card>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="overline" color="text.secondary">Bénéfice net (mois)</Typography>
            <Typography variant="h4">{currency(financeIndicateurs.beneficeNet)}</Typography>
            <Typography variant="caption" color="text.secondary">Marge bénéficiaire {financeIndicateurs.margeBeneficiaire}%</Typography>
          </Card>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="overline" color="text.secondary">Flux de trésorerie</Typography>
            <Typography variant="h5">{currency(financeIndicateurs.fluxTresorerieJour)} <Typography component="span" variant="caption" color="text.secondary">/ jour</Typography></Typography>
            <Typography variant="caption" color="text.secondary">{currency(financeIndicateurs.fluxTresorerieMois)} sur le mois</Typography>
          </Card>
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Recettes vs dépenses (indice mensuel)</Typography>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={financeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.color.line} vertical={false} />
              <XAxis dataKey="mois" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${tokens.color.line}` }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="recettes" name="Recettes" fill={tokens.color.navy} radius={[6, 6, 0, 0]} />
              <Bar dataKey="depenses" name="Dépenses" fill={tokens.color.gold} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ overflowX: 'auto' }}>
            <Box sx={{ p: 3, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
              <Typography variant="h6">Journal de caisse — aujourd’hui</Typography>
              <SearchField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher un libellé, type, montant…"
                sx={{ minWidth: { sm: 260 } }}
              />
            </Box>
            <Table sx={{ minWidth: 560 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: tokens.color.cream }}>
                  {['Date', 'Libellé', 'Type', 'Montant'].map((h) => (
                    <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {journalRows.map((f) => (
                <TableRow key={f.id} hover>
                  <TableCell>{new Date(f.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{f.libelle}</TableCell>
                  <TableCell>
                    <Chip label={f.type} size="small" sx={{ bgcolor: f.type === 'Recette' ? tokens.color.successSoft : tokens.color.dangerSoft, color: f.type === 'Recette' ? tokens.color.success : tokens.color.danger, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: f.montant > 0 ? tokens.color.success : tokens.color.danger }}>
                    {f.montant > 0 ? '+' : ''}{currency(f.montant)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Grid>
    </Grid>
  );
}
