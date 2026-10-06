import { useState } from 'react';
import { Alert, Box, Button, Card, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import { api, unwrap } from '../../api/client.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { ErrorCard, LoadingCard } from '../../components/common/StateViews.jsx';
import { formatDateTime } from '../../utils/format.js';

async function loadHistory() {
  return unwrap(await api.get('/chatbot/history')) || [];
}

export default function ClientAI() {
  const { data, loading, error, reload } = useAsyncData(loadHistory, []);
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!message.trim()) return;
    await api.post('/chatbot/message', { message });
    setMessage('');
    await reload();
  };

  if (loading) return <LoadingCard message="Chargement de l'assistant IA…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        L'assistant client est désormais branché sur <strong>/api/chatbot/history</strong> et <strong>/api/chatbot/message</strong>.
      </Alert>

      <Card sx={{ p: 3 }}>
        <List sx={{ mb: 2, maxHeight: 360, overflowY: 'auto' }}>
          {(data || []).map((entry) => (
            <ListItem key={entry._id} disableGutters divider>
              <ListItemText primary={entry.content} secondary={`${entry.role} · ${formatDateTime(entry.createdAt)}`} />
            </ListItem>
          ))}
        </List>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
          <TextField fullWidth label="Votre message" value={message} onChange={(event) => setMessage(event.target.value)} />
          <Button variant="contained" color="secondary" onClick={handleSend}>Envoyer</Button>
        </Stack>
      </Card>
    </Box>
  );
}
