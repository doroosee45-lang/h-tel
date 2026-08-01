import { Card, Typography, Stack, Chip, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { tokens } from '../theme.js';
import { notifications } from '../data/mockData.js';

const statutStyle = {
  'Envoyée': { bg: tokens.color.infoSoft, fg: tokens.color.info },
  'Lue': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning }
};

export default function Notifications() {
  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 3, pb: 1.5 }}>
        <NotificationsRoundedIcon sx={{ color: tokens.color.gold }} />
        <Typography variant="h6">Journal des notifications push</Typography>
      </Stack>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: tokens.color.cream }}>
            {['Titre', 'Destinataire', 'Canal', 'Heure', 'Statut'].map((h) => (
              <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {notifications.map((n) => (
            <TableRow key={n.id} hover>
              <TableCell sx={{ fontWeight: 500 }}>{n.titre}</TableCell>
              <TableCell>{n.destinataire}</TableCell>
              <TableCell>{n.canal}</TableCell>
              <TableCell sx={{ fontFamily: tokens.font.mono }}>{n.heure}</TableCell>
              <TableCell>
                <Chip label={n.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[n.statut].bg, color: statutStyle[n.statut].fg }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
