import { useContext } from 'react';
import { Alert, Box, Button, Card, Chip, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { AppContext } from '../context/AppContext.jsx';
import { EmptyCard } from '../components/common/StateViews.jsx';
import { formatDateTime, sentenceCase } from '../utils/format.js';
import { api } from '../api/client.js';

export default function Notifications() {
  const { notifications, fetchNotifications, markNotificationRead } = useContext(AppContext);

  const markAll = async () => {
    await api.patch('/notifications/read-all');
    await fetchNotifications();
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Notifications temps réel + historiques via <strong>/api/notifications</strong> et Socket.io (<strong>notification</strong> event).
      </Alert>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Typography variant="h6">{notifications.length} notification(s)</Typography>
        <Button variant="outlined" onClick={markAll} disabled={!notifications.some((item) => !item.isRead)}>Tout marquer comme lu</Button>
      </Stack>

      {!notifications.length ? (
        <EmptyCard title="Aucune notification" message="Aucune notification n'a été reçue pour le moment." />
      ) : (
        <Card sx={{ p: 2 }}>
          <List disablePadding>
            {notifications.map((item) => (
              <ListItem key={item.id} divider secondaryAction={!item.isRead ? <Button size="small" onClick={() => markNotificationRead(item.id)}>Marquer lu</Button> : null}>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontWeight: 600 }}>{item.title || item.titre}</Typography>
                      <Chip label={item.isRead ? 'Lue' : 'Non lue'} size="small" color={item.isRead ? 'default' : 'warning'} />
                    </Stack>
                  }
                  secondary={`${sentenceCase(item.type || 'general')} · ${item.message || item.destinataire || ''} · ${formatDateTime(item.createdAt || item.heure)}`}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </Box>
  );
}
