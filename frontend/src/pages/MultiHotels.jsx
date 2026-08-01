import { useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Chip, Table, TableHead, TableRow, TableCell, TableBody, LinearProgress } from '@mui/material';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { hotels, currency } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

export default function MultiHotels() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredHotels = filterRecords(hotels, searchQuery, ['nom', 'id', 'chambres', 'occupation', 'revenus', 'actif']);
  const totalRevenus = hotels.reduce((s, h) => s + h.revenus, 0);

  return (
    <Box>
      <SearchField
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Rechercher un hôtel, une ville, un statut…"
        sx={{ mb: 2, maxWidth: 420 }}
      />
      <Grid container spacing={2.5} sx={{ mb: 0.5 }}>
        {filteredHotels.map((h) => (
          <Grid item xs={12} sm={6} md={4} key={h.id}>
            <Card sx={{ p: 2.6 }}>
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box sx={{ width: 42, height: 42, borderRadius: '10px', bgcolor: tokens.color.navy, color: tokens.color.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ApartmentRoundedIcon />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{h.nom}</Typography>
                  <Typography variant="caption" color="text.secondary">{h.chambres} chambres</Typography>
                </Box>
              </Stack>
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                  <Typography variant="caption" color="text.secondary">Occupation</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{h.occupation}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={h.occupation}
                  sx={{ height: 7, borderRadius: 6, bgcolor: tokens.color.line, '& .MuiLinearProgress-bar': { bgcolor: tokens.color.gold, borderRadius: 6 } }}
                />
              </Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.6 }}>
                <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, color: tokens.color.navy }}>{currency(h.revenus)}</Typography>
                <Chip label={h.actif ? 'Actif' : 'Inactif'} size="small" sx={{ bgcolor: tokens.color.successSoft, color: tokens.color.success, fontWeight: 700 }} />
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ overflow: 'hidden', mt: 2.5 }}>
        <Box sx={{ p: 3, pb: 1.5 }}>
          <Typography variant="h6">Rapport consolidé du groupe</Typography>
        </Box>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: tokens.color.cream }}>
              {['Hôtel', 'Chambres', 'Occupation', 'Revenus', 'Part du groupe'].map((h) => (
                <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHotels.map((h) => (
              <TableRow key={h.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{h.nom}</TableCell>
                <TableCell>{h.chambres}</TableCell>
                <TableCell>{h.occupation}%</TableCell>
                <TableCell sx={{ fontFamily: tokens.font.mono, fontWeight: 600 }}>{currency(h.revenus)}</TableCell>
                <TableCell>{Math.round((h.revenus / totalRevenus) * 100)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
