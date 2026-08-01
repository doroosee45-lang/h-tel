import { useState } from 'react';
import { Card, Box, Typography, Stack, Chip, Table, TableHead, TableRow, TableCell, TableBody, Button, Grid, Dialog, DialogContent, TextField, MenuItem } from '@mui/material';
import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { events, currency } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

const statutStyle = {
  'Confirmé': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'En option': { bg: tokens.color.infoSoft, fg: tokens.color.info },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning }
};

const typeIcon = { Mariage: '💍', Séminaire: '💼', Conférence: '🎤', Anniversaire: '🎂' };

export default function Events() {
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const [localEvents, setLocalEvents] = useState(events);
  const [searchQuery, setSearchQuery] = useState('');
  const rows = filterRecords(localEvents, searchQuery, ['type', 'client', 'salle', 'date', 'traiteur', 'statut', 'montant', 'id']);
  const [newEvent, setNewEvent] = useState({
    type: 'Mariage',
    client: '',
    salle: '',
    date: '2026-08-01',
    traiteur: 'Interne',
    statut: 'Confirmé',
    montant: 0
  });

  return (
    <Box>
      <Grid container spacing={2.5} sx={{ mb: 0.5 }}>
        {['Mariages', 'Séminaires', 'Conférences', 'Anniversaires'].map((t) => (
          <Grid item xs={6} md={3} key={t}>
            <Card sx={{ p: 2.2, textAlign: 'center' }}>
              <CelebrationRoundedIcon sx={{ color: tokens.color.gold }} />
              <Typography sx={{ fontWeight: 600, mt: 0.5 }}>{t}</Typography>
              <Typography variant="caption" color="text.secondary">Salle · Traiteur · Facturation</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ overflow: 'hidden', mt: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 1.5, flexWrap: 'wrap', gap: 1.5 }}>
          <Typography variant="h6">Calendrier des événements</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} alignItems="center">
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher par type, client, salle, statut…"
              sx={{ minWidth: { sm: 260 } }}
            />
            <Button variant="contained" color="secondary" sx={{ boxShadow: 'none' }} onClick={() => setOpenAddEvent(true)}>+ Nouvel événement</Button>
          </Stack>
        </Stack>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: tokens.color.cream }}>
              {['Type', 'Client', 'Salle', 'Date', 'Traiteur', 'Montant', 'Statut'].map((h) => (
                <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((e) => (
              <TableRow key={e.id} hover>
                <TableCell>{typeIcon[e.type]} {e.type}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{e.client}</TableCell>
                <TableCell>{e.salle}</TableCell>
                <TableCell>{new Date(e.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{e.traiteur}</TableCell>
                <TableCell sx={{ fontFamily: tokens.font.mono, fontWeight: 600 }}>{currency(e.montant)}</TableCell>
                <TableCell>
                  <Chip label={e.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[e.statut].bg, color: statutStyle[e.statut].fg }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={openAddEvent} onClose={() => setOpenAddEvent(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Ajouter un événement</Typography>
          <Stack spacing={2}>
            <TextField
              label="Type d’événement"
              select
              value={newEvent.type}
              onChange={(e) => setNewEvent((prev) => ({ ...prev, type: e.target.value }))}
              size="small"
              fullWidth
            >
              {['Mariage', 'Séminaire', 'Conférence', 'Anniversaire'].map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Client"
              value={newEvent.client}
              onChange={(e) => setNewEvent((prev) => ({ ...prev, client: e.target.value }))}
              size="small"
              fullWidth
            />
            <TextField
              label="Salle"
              value={newEvent.salle}
              onChange={(e) => setNewEvent((prev) => ({ ...prev, salle: e.target.value }))}
              size="small"
              fullWidth
            />
            <TextField
              label="Date"
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            <TextField
              label="Traiteur"
              select
              value={newEvent.traiteur}
              onChange={(e) => setNewEvent((prev) => ({ ...prev, traiteur: e.target.value }))}
              size="small"
              fullWidth
            >
              {['Interne', 'Externe'].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Montant"
              type="number"
              value={newEvent.montant}
              onChange={(e) => setNewEvent((prev) => ({ ...prev, montant: Number(e.target.value) }))}
              size="small"
              fullWidth
            />
            <TextField
              label="Statut"
              select
              value={newEvent.statut}
              onChange={(e) => setNewEvent((prev) => ({ ...prev, statut: e.target.value }))}
              size="small"
              fullWidth
            >
              {['Confirmé', 'En option', 'En attente'].map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => setOpenAddEvent(false)}>Annuler</Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => {
                  if (!newEvent.client.trim() || !newEvent.salle.trim()) return;
                  setLocalEvents((prev) => [
                    ...prev,
                    { ...newEvent, id: `EV-${Date.now().toString().slice(-4)}` }
                  ]);
                  setNewEvent({ type: 'Mariage', client: '', salle: '', date: '2026-08-01', traiteur: 'Interne', statut: 'Confirmé', montant: 0 });
                  setOpenAddEvent(false);
                }}
              >
                Ajouter
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
