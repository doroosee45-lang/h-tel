import { Alert, Box, Card, Grid, Typography } from '@mui/material';
import { api, unwrap } from '../../api/client.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { ErrorCard, LoadingCard } from '../../components/common/StateViews.jsx';

async function loadMe() {
  return unwrap(await api.get('/client-auth/me'));
}

export default function ClientLoyalty() {
  const { data, loading, error, reload } = useAsyncData(loadMe, []);

  if (loading) return <LoadingCard message="Chargement de votre fidélité…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Le backend ne fournit pas de grille de paliers dédiée, mais expose les points et le statut VIP sur <strong>/api/client-auth/me</strong>.
      </Alert>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}><Card sx={{ p: 3 }}><Typography variant="h6">Points fidélité</Typography><Typography variant="h3">{data?.loyaltyPoints || 0}</Typography></Card></Grid>
        <Grid item xs={12} md={6}><Card sx={{ p: 3 }}><Typography variant="h6">Statut</Typography><Typography variant="h3">{data?.vipStatus ? 'VIP' : 'Standard'}</Typography></Card></Grid>
      </Grid>
    </Box>
  );
}
