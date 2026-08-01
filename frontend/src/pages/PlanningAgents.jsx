import { useState } from 'react';
import {
  Grid, Card, Box, Typography, Stack, Chip, Button, Dialog, DialogContent, TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Snackbar, Alert
} from '@mui/material';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { tokens } from '../theme.js';
import { agentShifts, teamTasks, employees } from '../data/mockData.js';

const statutStyle = {
  'Planifié': { bg: tokens.color.infoSoft, fg: tokens.color.info },
  'Confirmé': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning }
};

const prioriteStyle = {
  Haute: { bg: tokens.color.dangerSoft, fg: tokens.color.danger },
  Moyenne: { bg: tokens.color.warningSoft, fg: tokens.color.warning },
  Basse: { bg: tokens.color.infoSoft, fg: tokens.color.info }
};

export default function PlanningAgents() {
  const [shifts, setShifts] = useState(agentShifts);
  const [tasks, setTasks] = useState(teamTasks);
  const [openShift, setOpenShift] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newShift, setNewShift] = useState({ employe: employees[0]?.nom || '', poste: 'Réceptionniste', jour: 'Lun', creneau: '06h – 14h', tache: 'Standard', statut: 'Planifié' });

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const handleAddShift = () => {
    if (!newShift.employe) return;
    setShifts((prev) => [...prev, { id: Date.now(), ...newShift }]);
    setOpenShift(false);
    setSnackbar({ open: true, message: 'Créneau ajouté au planning.', severity: 'success' });
  };

  const advanceTask = (id) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const order = ['À faire', 'En cours', 'En attente', 'Terminée'];
      const next = order[Math.min(order.indexOf(t.statut) + 1, order.length - 1)];
      return { ...t, statut: next };
    }));
  };

  return (
    <Box>
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ p: 3, mb: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonthRoundedIcon sx={{ color: tokens.color.gold }} />
                <Typography variant="h6">Planning des Agents — Semaine 30</Typography>
              </Stack>
              <Button variant="contained" color="secondary" sx={{ boxShadow: 'none' }} onClick={() => setOpenShift(true)}>+ Créneau</Button>
            </Stack>

            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 640 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: tokens.color.cream }}>
                    {['Employé', 'Poste', ...days].map((h) => (
                      <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((e) => (
                    <TableRow key={e.id} hover>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13.5 }}>{e.nom}</TableCell>
                      <TableCell variant="body2">{e.poste}</TableCell>
                      {days.map((d) => {
                        const shift = shifts.find((s) => s.employe === e.nom && s.jour === d);
                        return (
                          <TableCell key={d}>
                            {shift ? (
                              <Box>
                                <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 11.5, fontWeight: 700 }}>{shift.creneau}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{shift.tache}</Typography>
                                <Chip label={shift.statut} size="small" sx={{ mt: 0.4, fontSize: 9.5, fontWeight: 700, bgcolor: statutStyle[shift.statut]?.bg, color: statutStyle[shift.statut]?.fg, height: 20 }} />
                              </Box>
                            ) : (
                              <Typography variant="caption" color="text.secondary">—</Typography>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Tâches de l’équipe</Typography>
            <Stack spacing={1.6}>
              {tasks.map((t) => (
                <Box key={t.id} sx={{ p: 1.8, borderRadius: '12px', border: `1px solid ${tokens.color.line}` }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip label={t.priorite} size="small" sx={{ fontWeight: 700, fontSize: 10.5, bgcolor: prioriteStyle[t.priorite].bg, color: prioriteStyle[t.priorite].fg }} />
                    <Chip label={t.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[t.statut]?.bg || tokens.color.cream, color: statutStyle[t.statut]?.fg || 'text.secondary' }} />
                  </Stack>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, mt: 1 }}>{t.tache}</Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">{t.responsable}</Typography>
                    <Button size="small" onClick={() => advanceTask(t.id)}>Avancer →</Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openShift} onClose={() => setOpenShift(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Ajouter un créneau</Typography>
          <Stack spacing={2}>
            <TextField
              label="Employé"
              select
              value={newShift.employe}
              onChange={(e) => setNewShift((prev) => ({ ...prev, employe: e.target.value }))}
              fullWidth
              size="small"
            >
              {employees.map((emp) => <MenuItem key={emp.id} value={emp.nom}>{emp.nom} — {emp.poste}</MenuItem>)}
            </TextField>
            <TextField
              label="Jour"
              select
              value={newShift.jour}
              onChange={(e) => setNewShift((prev) => ({ ...prev, jour: e.target.value }))}
              fullWidth
              size="small"
            >
              {days.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
            <TextField
              label="Créneau"
              select
              value={newShift.creneau}
              onChange={(e) => setNewShift((prev) => ({ ...prev, creneau: e.target.value }))}
              fullWidth
              size="small"
            >
              {['06h – 14h', '10h – 18h', '14h – 22h', '16h – 00h', '18h – 23h', '08h – 16h'].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField
              label="Tâche"
              value={newShift.tache}
              onChange={(e) => setNewShift((prev) => ({ ...prev, tache: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Statut"
              select
              value={newShift.statut}
              onChange={(e) => setNewShift((prev) => ({ ...prev, statut: e.target.value }))}
              fullWidth
              size="small"
            >
              {['Planifié', 'Confirmé', 'En attente'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => setOpenShift(false)}>Annuler</Button>
              <Button fullWidth variant="contained" color="secondary" onClick={handleAddShift}>Ajouter</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

