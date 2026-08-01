import { Box } from '@mui/material';
import { tokens } from '../../theme.js';

/**
 * QRFrame — élément signature de Smart Hotel 360°.
 *
 * Le cahier des charges revient sans cesse sur le QR code (check-in, menu,
 * facture, activité, accès chambre...). Plutôt qu'un badge générique, on en
 * fait un motif graphique récurrent : chaque visuel important (chambre, plat,
 * boisson, activité) est "verrouillé" par les 4 coins d'un QR code — un clin
 * d'œil discret qui rappelle que tout, dans l'app, est scannable.
 */
export default function QRFrame({ children, size = 16, color = tokens.color.gold, radius = tokens.radius.lg }) {
  const corner = {
    position: 'absolute',
    width: size,
    height: size,
    borderColor: color,
    zIndex: 2
  };
  return (
    <Box sx={{ position: 'relative', borderRadius: `${radius}px`, overflow: 'hidden' }}>
      <Box sx={{ ...corner, top: 8, left: 8, borderTop: '3px solid', borderLeft: '3px solid', borderTopLeftRadius: 6 }} />
      <Box sx={{ ...corner, top: 8, right: 8, borderTop: '3px solid', borderRight: '3px solid', borderTopRightRadius: 6 }} />
      <Box sx={{ ...corner, bottom: 8, left: 8, borderBottom: '3px solid', borderLeft: '3px solid', borderBottomLeftRadius: 6 }} />
      {children}
    </Box>
  );
}
