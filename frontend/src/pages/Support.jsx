import { Box, Typography, Card, Stack, Button } from '@mui/material';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import { tokens } from '../theme.js';

export default function Support() {
  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <SupportAgentRoundedIcon sx={{ fontSize: 32, color: tokens.color.gold }} />
          <Box>
            <Typography variant="h5">Support Hôtelier</Typography>
            <Typography variant="body2" color="text.secondary">
              Accédez à l’assistance, ouvrez des tickets et suivez les demandes du personnel
              et des clients.
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>Besoin d’aide ?</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Notre équipe support est disponible pour résoudre les incidents de l’hôtel,
          les questions clients et les demandes techniques.
        </Typography>
        <Button variant="contained" color="secondary" sx={{ boxShadow: 'none' }}>Créer un ticket de support</Button>
      </Card>
    </Box>
  );
}
