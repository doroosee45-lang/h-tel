import { useState } from 'react';
import { Alert, Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import { api, unwrap } from '../../api/client.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { ErrorCard, LoadingCard } from '../../components/common/StateViews.jsx';
import { fullName } from '../../utils/format.js';

async function loadProfile() {
  return unwrap(await api.get('/client-auth/me'));
}

export default function ClientProfile() {
  const { data, loading, error, reload } = useAsyncData(loadProfile, []);
  const [form, setForm] = useState(null);

  const profile = form || data;

  const handleSave = async () => {
    await api.put('/client-auth/me', profile);
    await reload();
  };

  if (loading) return <LoadingCard message="Chargement de votre profil…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Profil branché sur <strong>/api/client-auth/me</strong> (lecture + mise à jour).
      </Alert>

      <Card sx={{ p: 3, maxWidth: 760 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{fullName(data)}</Typography>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Prénom" value={profile?.firstName || ''} onChange={(event) => setForm((prev) => ({ ...(prev || data), firstName: event.target.value }))} fullWidth />
            <TextField label="Nom" value={profile?.lastName || ''} onChange={(event) => setForm((prev) => ({ ...(prev || data), lastName: event.target.value }))} fullWidth />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Email" value={profile?.email || ''} fullWidth InputProps={{ readOnly: true }} />
            <TextField label="Téléphone" value={profile?.phone || ''} onChange={(event) => setForm((prev) => ({ ...(prev || data), phone: event.target.value }))} fullWidth />
          </Stack>
          <TextField label="Adresse" value={profile?.address || ''} onChange={(event) => setForm((prev) => ({ ...(prev || data), address: event.target.value }))} />
          <Button variant="contained" color="secondary" onClick={handleSave} sx={{ width: 'fit-content' }}>Enregistrer</Button>
        </Stack>
      </Card>
    </Box>
  );
}
