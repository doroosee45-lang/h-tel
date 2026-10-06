import { Alert, Box, Card, Chip, List, ListItem, ListItemText, Typography } from '@mui/material';
import { STAFF_ROLES, ROLE_LABELS } from '../../utils/auth.js';

export default function RolesPermissions() {
  return (
    <Box>
      <Alert severity="warning" sx={{ mb: 2.5 }}>
        Aucun endpoint backend ne publie actuellement une matrice de permissions. Cette page reflète donc les rôles exacts du modèle User backend et signale ce manque explicitement.
      </Alert>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Rôles disponibles dans le backend</Typography>
        <List disablePadding>
          {STAFF_ROLES.map((role) => (
            <ListItem key={role} divider disableGutters>
              <ListItemText primary={ROLE_LABELS[role]} secondary={role} />
              <Chip label="Défini côté User model" size="small" />
            </ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
}
