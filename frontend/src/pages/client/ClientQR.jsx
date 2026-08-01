import { useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Chip, Button, Snackbar, Alert, Divider } from '@mui/material';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import { tokens } from '../../theme.js';
import { clientMembership } from '../../data/mockData.js';

function QRPattern({ seed, size = 140, color = tokens.color.navyDeep }) {
  const cells = 11;
  const cell = size / cells;
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) % 100000;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };

  const squares = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const inFinder = (x < 4 && y < 4) || (x > cells - 5 && y < 4) || (x < 4 && y > cells - 5);
      if (inFinder) continue;
      if (rand() > 0.5) squares.push([x, y]);
    }
  }
  const finder = (fx, fy) => (
    <g key={`${fx}-${fy}`}>
      <rect x={fx * cell} y={fy * cell} width={cell * 4} height={cell * 4} fill="none" stroke={color} strokeWidth={cell * 0.3} />
      <rect x={(fx + 1.5) * cell} y={(fy + 1.5) * cell} width={cell} height={cell} fill={color} />
    </g>
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#fff" />
      {squares.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={color} />
      ))}
      {finder(0, 0)}
      {finder(cells - 4, 0)}
      {finder(0, cells - 4)}
    </svg>
  );
}

const perks = [
  { icon: <LockOpenRoundedIcon />, label: 'Check-in rapide', desc: 'Présentez ce QR Code à la réception pour un enregistrement express.' },
  { icon: <ReceiptLongRoundedIcon />, label: 'Accès aux réservations', desc: 'Scannez pour retrouver instantanément toutes vos réservations.' },
  { icon: <ReceiptLongRoundedIcon />, label: 'Accès aux factures', desc: 'Vos factures et historique de paiement, en un scan.' },
  { icon: <VerifiedUserRoundedIcon />, label: 'Vérification d’identité', desc: 'Confirmation sécurisée de votre identité auprès des services.' }
];

export default function ClientQR() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 52, height: 52, borderRadius: '13px', bgcolor: tokens.color.gold, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrCode2RoundedIcon />
          </Box>
          <Box>
            <Typography variant="h5">QR Code Personnel</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Votre identifiant unique pour un séjour sans friction.
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                p: 2.4,
                borderRadius: '22px',
                border: `1.5px solid ${tokens.color.gold}`,
                display: 'inline-block',
                bgcolor: '#fff',
                boxShadow: tokens.shadow.lg
              }}
            >
              <QRPattern seed={clientMembership.qrPayload} />
            </Box>
            <Typography variant="h6" sx={{ mt: 2 }}>{clientMembership.code}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontFamily: tokens.font.mono }}>
              Membre {clientMembership.niveau} · {clientMembership.points} pts
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 1.5 }}>
              <Chip icon={<BadgeRoundedIcon sx={{ fontSize: 15 }} />} label={`Chambre R101`} size="small" sx={{ bgcolor: tokens.color.cream }} />
              <Chip label="Valide jusqu’au 31/12/2026" size="small" sx={{ bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, fontWeight: 600 }} />
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<LockOpenRoundedIcon />}
                sx={{ boxShadow: 'none' }}
                onClick={() => setSnackbar({ open: true, message: 'QR Code vérifié — accès autorisé.', severity: 'success' })}
              >
                Vérifier mon identité
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadRoundedIcon />}
                onClick={() => setSnackbar({ open: true, message: 'QR Code téléchargé (PDF).', severity: 'info' })}
              >
                Télécharger
              </Button>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ mb: 2 }}>Usages du QR Code</Typography>
          <Grid container spacing={2}>
            {perks.map((p) => (
              <Grid item xs={12} sm={6} key={p.label}>
                <Card sx={{ p: 2.4, height: '100%' }}>
                  <Stack direction="row" spacing={1.6} alignItems="flex-start">
                    <Box sx={{ width: 42, height: 42, borderRadius: '11px', bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {p.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{p.label}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5, mt: 0.4, lineHeight: 1.6 }}>
                        {p.desc}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card sx={{ p: 3, mt: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Sécurité & confidentialité</Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Stack spacing={1}>
              {[
                'QR Code unique et personnel — ne le partagez pas.',
                'Vérifié à chaque check-in, check-out et accès aux services.',
                'Les données sont chiffrées et conformes aux réglementations.',
                'En cas de perte, la réception peut régénérer votre code instantanément.'
              ].map((s) => (
                <Stack key={s} direction="row" spacing={1} alignItems="flex-start">
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: tokens.color.gold, mt: 0.6 }} />
                  <Typography variant="body2" sx={{ fontSize: 13 }}>{s}</Typography>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

