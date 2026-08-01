import { Card, Box, Typography, Stack, Chip, Table, TableHead, TableRow, TableCell, TableBody, Button, LinearProgress } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Link } from 'react-router-dom';
import { tokens } from '../theme.js';
import { stockItems, currency } from '../data/mockData.js';

export default function Stock() {
  const critiques = stockItems.filter((s) => s.statut === 'Critique');

  return (
    <Box>
      {critiques.length > 0 && (
        <Card sx={{ p: 2, mb: 2.5, bgcolor: tokens.color.warningSoft, border: 'none' }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <WarningAmberRoundedIcon sx={{ color: tokens.color.warning }} />
            <Typography sx={{ color: tokens.color.warning, fontWeight: 600 }}>
              {critiques.length} article(s) sous le seuil critique — un bon de commande est recommandé.
            </Typography>
          </Stack>
        </Card>
      )}

      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 3, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Inventaire</Typography>
          <Button variant="contained" color="secondary" component={Link} to="/achats" sx={{ boxShadow: 'none' }}>Voir le module Achats →</Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: tokens.color.cream }}>
              {['Produit', 'Catégorie', 'Quantité', 'Seuil', 'Prix d’achat', 'Fournisseur', 'Statut'].map((h) => (
                <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stockItems.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.4} alignItems="center">
                    <Box component="img" src={s.photo} alt={s.produit} sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.produit}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{s.categorie}</TableCell>
                <TableCell sx={{ width: 170 }}>
                  <Stack spacing={0.4}>
                    <Typography variant="caption">{s.quantite} unités</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (s.quantite / (s.seuil * 3)) * 100)}
                      sx={{ height: 6, borderRadius: 6, bgcolor: tokens.color.line, '& .MuiLinearProgress-bar': { bgcolor: s.statut === 'Critique' ? tokens.color.warning : tokens.color.success, borderRadius: 6 } }}
                    />
                  </Stack>
                </TableCell>
                <TableCell>{s.seuil}</TableCell>
                <TableCell sx={{ fontFamily: tokens.font.mono }}>{currency(s.prixAchat)}</TableCell>
                <TableCell>{s.fournisseur}</TableCell>
                <TableCell>
                  <Chip
                    label={s.statut}
                    size="small"
                    sx={{ fontWeight: 700, bgcolor: s.statut === 'Critique' ? tokens.color.warningSoft : tokens.color.successSoft, color: s.statut === 'Critique' ? tokens.color.warning : tokens.color.success }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
