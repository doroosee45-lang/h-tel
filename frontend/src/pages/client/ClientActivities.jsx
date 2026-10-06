import { useState } from 'react';
import { Alert, Box, Button, Card, Dialog, DialogContent, Grid, Stack, TextField, Typography } from '@mui/material';
import { api, unwrap } from '../../api/client.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../../components/common/StateViews.jsx';
import { formatCurrency, sentenceCase } from '../../utils/format.js';

async function loadActivities() {
  return unwrap(await api.get('/activities')) || [];
}

export default function ClientActivities() {
  const { data, loading, error, reload } = useAsyncData(loadActivities, []);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ date: '', participants: 1 });

  const handleBook = async () => {
    await api.post(`/activities/${selected._id}/bookings`, form);
    setSelected(null);
    setForm({ date: '', participants: 1 });
    await reload();
  };

  if (loading) return <LoadingCard message="Chargement des activités…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;
  if (!data?.length) return <EmptyCard title="Aucune activité" message="Le backend ne renvoie aucune activité disponible." />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Catalogue via <strong>/api/activities</strong> et réservation via <strong>/api/activities/:id/bookings</strong>.
      </Alert>

      <Grid container spacing={2.5}>
        {data.map((activity) => (
          <Grid item xs={12} md={6} lg={4} key={activity._id}>
            <Card sx={{ p: 2.5, height: '100%' }}>
              <Stack spacing={1.2} sx={{ height: '100%' }}>
                <Typography variant="h6">{activity.name}</Typography>
                <Typography color="text.secondary">{sentenceCase(activity.category)}</Typography>
                <Typography>{activity.description || 'Aucune description.'}</Typography>
                <Typography sx={{ fontWeight: 700 }}>{formatCurrency(activity.price || 0)}</Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Button variant="contained" color="secondary" onClick={() => setSelected(activity)}>Réserver</Button>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{selected?.name}</Typography>
          <Stack spacing={2}>
            <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} value={form.date} onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))} />
            <TextField label="Participants" type="number" value={form.participants} onChange={(event) => setForm((prev) => ({ ...prev, participants: Number(event.target.value) }))} />
            <Stack direction="row" justifyContent="flex-end" spacing={1.2}>
              <Button variant="outlined" onClick={() => setSelected(null)}>Annuler</Button>
              <Button variant="contained" color="secondary" onClick={handleBook}>Confirmer</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
