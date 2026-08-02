import { useState } from 'react';
import { Card, Typography, Stack, Chip, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { notifications } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

const statutStyle = {
  'Envoyée': { bg: tokens.color.infoSoft, fg: tokens.color.info },
  'Lue': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning }
};

export default function Notifications() {
  const [searchQuery, setSearchQuery] = useState('');
  const rows = filterRecords(notifications, searchQuery, ['titre', 'destinataire', 'canal', 'heure', 'statut', 'detail', 'type']);
  return (
    <Card sx={{ overflowX: 'auto' }}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ p: 3, pb: 1.5, flexWrap: 'wrap', gap: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <NotificationsRoundedIcon sx={{ color: tokens.color.gold }} />
          <Typography variant="h6">Journal des notifications push</Typography>
        </Stack>
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher par titre, destinataire, canal…"
          sx={{ minWidth: { sm: 260 } }}
        />
      </Stack>
      <Table sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: tokens.color.cream }}>
            {['Titre', 'Destinataire', 'Canal', 'Heure', 'Statut'].map((h) => (
              <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((n) => (
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
