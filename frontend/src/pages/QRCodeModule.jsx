import { Grid, Card, Box, Typography, Stack, Chip, Button } from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { tokens } from '../theme.js';
import { qrCodes } from '../data/mockData.js';

// Petit générateur de motif pseudo-QR déterministe (démonstration visuelle uniquement)
function QRPattern({ seed, size = 96 }) {
  const cells = 9;
  const cell = size / cells;
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) % 100000;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };

  const squares = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const inFinder = (x < 3 && y < 3) || (x > cells - 4 && y < 3) || (x < 3 && y > cells - 4);
      if (inFinder) continue;
      if (rand() > 0.55) squares.push([x, y]);
    }
  }
  const finder = (fx, fy) => (
    <g key={`${fx}-${fy}`}>
      <rect x={fx * cell} y={fy * cell} width={cell * 3} height={cell * 3} fill="none" stroke={tokens.color.navy} strokeWidth={cell * 0.3} />
      <rect x={(fx + 1) * cell} y={(fy + 1) * cell} width={cell} height={cell} fill={tokens.color.navy} />
    </g>
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#fff" />
      {squares.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={tokens.color.gold} />
      ))}
      {finder(0, 0)}
      {finder(cells - 3, 0)}
      {finder(0, cells - 3)}
    </svg>
  );
}

export default function QRCodeModule() {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Chaque chambre, menu, facture et activité possède un QR Code unique, scannable depuis l’application client
        pour un accès instantané — sans contact.
      </Typography>

      <Grid container spacing={2.5}>
        {qrCodes.map((qr) => (
          <Grid item xs={12} sm={6} md={4} key={qr.id}>
            <Card sx={{ p: 2.4 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, border: `1px solid ${tokens.color.line}`, borderRadius: '10px' }}>
                  <QRPattern seed={qr.id} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Chip label={qr.type} size="small" sx={{ bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, fontWeight: 700, mb: 0.6 }} />
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{qr.cible}</Typography>
                  <Typography variant="caption" color="text.secondary">{qr.scans} scans</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.6 }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: qr.statut === 'Actif' ? tokens.color.success : tokens.color.line }} />
                    <Typography variant="caption" sx={{ color: qr.statut === 'Actif' ? tokens.color.success : 'text.secondary', fontWeight: 600 }}>{qr.statut}</Typography>
                  </Stack>
                </Box>
              </Stack>
              <Button size="small" startIcon={<DownloadRoundedIcon />} fullWidth sx={{ mt: 1.6, color: tokens.color.navy }}>
                Télécharger
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
