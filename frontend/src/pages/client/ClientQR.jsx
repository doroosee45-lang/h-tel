import { Alert, Box, Card, List, ListItem, ListItemText, Typography } from '@mui/material';
import { api, unwrap } from '../../api/client.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../../components/common/StateViews.jsx';
import { formatDateTime } from '../../utils/format.js';

async function loadKeys() {
  return unwrap(await api.get('/locks/mine')) || [];
}

export default function ClientQR() {
  const { data, loading, error, reload } = useAsyncData(loadKeys, []);

  if (loading) return <LoadingCard message="Chargement de vos clés numériques…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;
  if (!data?.length) return <EmptyCard title="Aucune clé active" message="Aucune clé numérique active n'est disponible. Une clé est émise automatiquement après check-in backend." />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Le backend n'expose pas de QR client générique, mais il expose bien les clés numériques actives via <strong>/api/locks/mine</strong>.
      </Alert>

      <Card sx={{ p: 3 }}>
        <List disablePadding>
          {data.map((key) => (
            <ListItem key={key._id} disableGutters divider>
              <ListItemText primary={`Chambre ${key.room?.number || '—'}`} secondary={`Valide du ${formatDateTime(key.validFrom)} au ${formatDateTime(key.validUntil)}`} />
            </ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
}
