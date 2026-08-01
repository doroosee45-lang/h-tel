import { useEffect, useState } from 'react';
import { Typography, Stack } from '@mui/material';
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded';
import { tokens } from '../../theme.js';

export default function OfflineBanner() {
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <Stack
      direction="row"
      spacing={1.2}
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: tokens.color.warning, color: '#fff', py: 0.8 }}
    >
      <WifiOffRoundedIcon sx={{ fontSize: 18 }} />
      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
        Mode hors-ligne actif — Réception, Restaurant, Bar et Stock continuent de fonctionner localement. Synchronisation automatique dès le retour du réseau.
      </Typography>
    </Stack>
  );
}
