import { useMemo } from 'react';
import { Alert, Box, Button, Card, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api, unwrap } from '../../api/client.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../../components/common/StateViews.jsx';
import { formatCurrency, formatDate, fullName } from '../../utils/format.js';

async function loadClientHome() {
  const [meRes, historyRes, roomsRes] = await Promise.all([
    api.get('/client-auth/me'),
    api.get('/client-auth/me/history'),
    api.get('/client-portal/rooms')
  ]);

  return {
    me: unwrap(meRes),
    history: unwrap(historyRes),
    rooms: unwrap(roomsRes) || []
  };
}

export default function ClientHome() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsyncData(loadClientHome, []);

  const featuredRooms = useMemo(() => (data?.rooms || []).slice(0, 3), [data?.rooms]);

  if (loading) return <LoadingCard message="Chargement de votre espace client…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Accueil client alimenté par <strong>/api/client-auth/me</strong>, <strong>/api/client-auth/me/history</strong> et <strong>/api/client-portal/rooms</strong>.
      </Alert>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={4}><Card sx={{ p: 3 }}><Typography variant="h6">Bienvenue</Typography><Typography variant="h4">{fullName(data?.me)}</Typography></Card></Grid>
        <Grid item xs={12} md={4}><Card sx={{ p: 3 }}><Typography variant="h6">Réservations</Typography><Typography variant="h3">{data?.history?.reservations?.length || 0}</Typography></Card></Grid>
        <Grid item xs={12} md={4}><Card sx={{ p: 3 }}><Typography variant="h6">Commandes</Typography><Typography variant="h3">{data?.history?.orders?.length || 0}</Typography></Card></Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          {featuredRooms.length ? (
            <Grid container spacing={2.5}>
              {featuredRooms.map((room) => (
                <Grid item xs={12} md={4} key={room._id}>
                  <Card sx={{ p: 2.5, height: '100%' }}>
                    <Stack spacing={1.2} sx={{ height: '100%' }}>
                      <Typography variant="h6">Chambre {room.number}</Typography>
                      <Typography color="text.secondary">{room.category?.name || 'Sans catégorie'}</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{formatCurrency(room.category?.basePrice || 0)}/nuit</Typography>
                      <Box sx={{ mt: 'auto' }}>
                        <Button variant="contained" color="secondary" onClick={() => navigate(`/client/chambres?book=${room._id}`)}>Réserver</Button>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <EmptyCard title="Aucune chambre disponible" message="Le portail client ne renvoie aucune chambre pour le moment." />
          )}
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6">Historique récent</Typography>
            {(data?.history?.reservations || []).length ? (
              <List disablePadding>
                {data.history.reservations.slice(0, 6).map((reservation) => (
                  <ListItem key={reservation._id} disableGutters divider>
                    <ListItemText primary={reservation.reference} secondary={`${formatDate(reservation.checkInDate)} · chambre ${reservation.room?.number || '—'} · ${formatCurrency(reservation.totalAmount)}`} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">Aucune réservation enregistrée.</Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
