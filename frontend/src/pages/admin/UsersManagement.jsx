import { useState, useContext } from 'react';
import {
  Grid, Card, Box, Typography, Stack, Chip, Button, Avatar, Dialog, DialogContent,
  TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Switch, Snackbar, Alert
} from '@mui/material';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SearchField from '../../components/common/SearchField.jsx';
import { tokens } from '../../theme.js';
import { systemUsers as initialUsers } from '../../data/mockData.js';
import { AppContext } from '../../context/AppContext.jsx';
import { filterRecords } from '../../utils/searchUtils.js';

const roleColor = {
  'Super Admin': { bg: tokens.color.navy, fg: '#fff' },
  Manager: { bg: tokens.color.goldSoft, fg: tokens.color.navyDeep },
  Client: { bg: tokens.color.infoSoft, fg: tokens.color.info }
};

export default function UsersManagement() {
  const { addAuditLog } = useContext(AppContext);
  const [users, setUsers] = useState(initialUsers);
  const [openAdd, setOpenAdd] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newUser, setNewUser] = useState({ nom: '', email: '', role: 'Manager' });
  const [searchQuery, setSearchQuery] = useState('');

  const active = users.filter((u) => u.statut === 'Actif').length;
  const rows = filterRecords(users, searchQuery, ['nom', 'email', 'role', 'statut', 'derniereConnexion', 'id']);

  const handleAddUser = () => {
    if (!newUser.nom.trim() || !newUser.email.trim()) return;
    setUsers((prev) => [
      ...prev,
      {
        id: `U${Date.now().toString().slice(-4)}`,
        nom: newUser.nom,
        email: newUser.email,
        role: newUser.role,
        statut: 'Actif',
        derniereConnexion: 'Jamais'
      }
    ]);
    addAuditLog(`Création utilisateur ${newUser.nom}`, 'Utilisateurs');
    setNewUser({ nom: '', email: '', role: 'Manager' });
    setOpenAdd(false);
    setSnackbar({ open: true, message: 'Utilisateur créé et journalisé.', severity: 'success' });
  };

  const toggleUser = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, statut: u.statut === 'Actif' ? 'Inactif' : 'Actif' } : u)));
    const u = users.find((x) => x.id === id);
    addAuditLog(`Changement statut ${u?.nom}`, 'Utilisateurs');
  };

  return (
    <Box>
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.6 }}>
            <Box sx={{ width: 46, height: 46, borderRadius: '12px', bgcolor: tokens.color.navy, color: tokens.color.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GroupRoundedIcon />
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary">Utilisateurs</Typography>
              <Typography variant="h4">{users.length}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.6 }}>
            <Box sx={{ width: 46, height: 46, borderRadius: '12px', bgcolor: tokens.color.successSoft, color: tokens.color.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PersonAddAltRoundedIcon />
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary">Comptes actifs</Typography>
              <Typography variant="h4">{active}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.6 }}>
            <Box sx={{ width: 46, height: 46, borderRadius: '12px', bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AdminPanelSettingsRoundedIcon />
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary">Rôles disponibles</Typography>
              <Typography variant="h4">3</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ overflow: 'hidden' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, pb: 1.5, flexWrap: 'wrap', gap: 1.5 }}>
          <Box>
            <Typography variant="h6">Liste des utilisateurs</Typography>
            <Typography variant="caption" color="text.secondary">Toutes les actions sont enregistrées dans le journal d’audit.</Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} alignItems="center">
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher un nom, email, rôle, statut…"
              sx={{ minWidth: { sm: 260 } }}
            />
            <Button variant="contained" color="secondary" startIcon={<PersonAddAltRoundedIcon />} sx={{ boxShadow: 'none' }} onClick={() => setOpenAdd(true)}>
              Nouvel utilisateur
            </Button>
          </Stack>
        </Stack>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: tokens.color.cream }}>
              {['Utilisateur', 'Rôle', 'Dernière connexion', 'Statut', 'Activer / Désactiver'].map((h) => (
                <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.4} alignItems="center">
                    <Avatar src={`https://i.pravatar.cc/100?img=${(u.id.charCodeAt(3) % 70) + 1}`} sx={{ width: 36, height: 36 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{u.nom}</Typography>
                      <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip label={u.role} size="small" sx={{ fontWeight: 700, bgcolor: roleColor[u.role].bg, color: roleColor[u.role].fg }} />
                </TableCell>
                <TableCell sx={{ fontFamily: tokens.font.mono, fontSize: 12.5 }}>{u.derniereConnexion}</TableCell>
                <TableCell>
                  <Chip label={u.statut} size="small" sx={{ fontWeight: 700, bgcolor: u.statut === 'Actif' ? tokens.color.successSoft : tokens.color.line, color: u.statut === 'Actif' ? tokens.color.success : 'text.secondary' }} />
                </TableCell>
                <TableCell>
                  <Switch checked={u.statut === 'Actif'} onChange={() => toggleUser(u.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Créer un utilisateur</Typography>
          <Stack spacing={2}>
            <TextField label="Nom complet" value={newUser.nom} onChange={(e) => setNewUser((prev) => ({ ...prev, nom: e.target.value }))} fullWidth size="small" />
            <TextField label="Email" value={newUser.email} onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))} fullWidth size="small" />
            <TextField
              label="Rôle"
              select
              value={newUser.role}
              onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
              fullWidth
              size="small"
            >
              {['Super Admin', 'Manager', 'Client'].map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button fullWidth variant="outlined" onClick={() => setOpenAdd(false)}>Annuler</Button>
              <Button fullWidth variant="contained" color="secondary" onClick={handleAddUser}>Créer</Button>
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

