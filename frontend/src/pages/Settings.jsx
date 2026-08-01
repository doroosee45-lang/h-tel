import { useState } from 'react';
import { Grid, Card, Box, Typography, Stack, TextField, Switch, Chip, Button, Dialog, DialogContent, MenuItem } from '@mui/material';
import { tokens } from '../theme.js';
import { paymentMethods } from '../data/mockData.js';

const roles = [
  { nom: 'Administrateur Général', acces: 'Accès complet', couleur: tokens.color.navy },
  { nom: 'Réceptionniste', acces: 'Réservations, Check-in/out, Facturation', couleur: tokens.color.info },
  { nom: 'Manager Restaurant', acces: 'Commandes, Tables, Menu', couleur: tokens.color.gold },
  { nom: 'Barman', acces: 'Ventes & stock bar', couleur: tokens.color.gold },
  { nom: 'Comptable', acces: 'Finance & rapports', couleur: tokens.color.success },
  { nom: 'Responsable Stock', acces: 'Inventaire & achats', couleur: tokens.color.warning },
  { nom: 'Responsable RH', acces: 'Personnel & paie', couleur: tokens.color.info }
];

export default function Settings() {
  const [openAddUser, setOpenAddUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ nom: '', role: 'Réceptionniste', email: '' });

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, mb: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Profil de l’établissement</Typography>
          <Stack spacing={2}>
            <TextField label="Nom de l’hôtel" defaultValue="Hôtel Fleuve — Kinshasa" size="small" fullWidth />
            <TextField label="Adresse" defaultValue="Avenue du Fleuve, Kinshasa, RDC" size="small" fullWidth />
            <Stack direction="row" spacing={2}>
              <TextField label="Devise" defaultValue="FC (Franc Congolais)" size="small" fullWidth />
              <TextField label="Fuseau horaire" defaultValue="Afrique/Kinshasa (UTC+1)" size="small" fullWidth />
            </Stack>
          </Stack>
        </Card>

        <Card sx={{ p: 3, mb: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Sécurité</Typography>
          <Stack spacing={1.6}>
            {[
              { label: 'Authentification à deux facteurs (2FA)', on: true },
              { label: 'Journalisation complète des actions', on: true },
              { label: 'Sauvegardes automatiques quotidiennes', on: true },
              { label: 'Verrouillage après échecs de connexion', on: false }
            ].map((s) => (
              <Stack key={s.label} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">{s.label}</Typography>
                <Switch defaultChecked={s.on} />
              </Stack>
            ))}
          </Stack>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Moyens de paiement acceptés</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {paymentMethods.map((m) => (
              <Chip key={m} label={m} sx={{ bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, fontWeight: 600 }} />
            ))}
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, mb: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 0.4 }}>Utilisateurs & rôles (RBAC)</Typography>
          <Typography variant="caption" color="text.secondary">Contrôle d’accès basé sur les rôles</Typography>
          <Stack spacing={1.4} sx={{ mt: 2 }}>
            {roles.map((r) => (
              <Stack key={r.nom} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.4, borderRadius: '10px', border: `1px solid ${tokens.color.line}` }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{r.nom}</Typography>
                  <Typography variant="caption" color="text.secondary">{r.acces}</Typography>
                </Box>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.couleur }} />
              </Stack>
            ))}
          </Stack>
          <Box sx={{ mt: 2 }}>
            {users.length === 0 ? (
              <Typography variant="caption" color="text.secondary">Aucun utilisateur ajouté pour l’instant.</Typography>
            ) : (
              <Stack spacing={1} sx={{ mb: 2 }}>
                {users.map((user) => (
                  <Box key={user.email} sx={{ p: 1.4, borderRadius: '10px', border: `1px solid ${tokens.color.line}` }}>
                    <Typography sx={{ fontWeight: 600 }}>{user.nom}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.role} • {user.email}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
            <Button variant="outlined" fullWidth sx={{ mt: 2, borderColor: tokens.color.line, color: 'text.primary' }} onClick={() => setOpenAddUser(true)}>+ Ajouter un utilisateur</Button>
          </Box>
        </Card>

        <Dialog open={openAddUser} onClose={() => setOpenAddUser(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Ajouter un utilisateur</Typography>
            <Stack spacing={2}>
              <TextField
                label="Nom complet"
                size="small"
                value={newUser.nom}
                onChange={(e) => setNewUser((prev) => ({ ...prev, nom: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Email"
                size="small"
                value={newUser.email}
                onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Rôle"
                select
                size="small"
                value={newUser.role}
                onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
                fullWidth
              >
                {roles.map((r) => (
                  <MenuItem key={r.nom} value={r.nom}>{r.nom}</MenuItem>
                ))}
              </TextField>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Button fullWidth variant="outlined" onClick={() => setOpenAddUser(false)}>Annuler</Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    if (!newUser.nom.trim() || !newUser.email.trim()) return;
                    setUsers((prev) => [...prev, newUser]);
                    setNewUser({ nom: '', role: 'Réceptionniste', email: '' });
                    setOpenAddUser(false);
                  }}
                >
                  Ajouter
                </Button>
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Préférences de notification</Typography>
          <Stack spacing={1.6}>
            {[
              'Réservation confirmée',
              'Chambre prête',
              'Commande prête',
              'Paiement reçu',
              'Alerte stock critique'
            ].map((n) => (
              <Stack key={n} direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">{n}</Typography>
                <Switch defaultChecked />
              </Stack>
            ))}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
