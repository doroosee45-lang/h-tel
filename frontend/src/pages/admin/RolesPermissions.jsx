import { useState, useContext } from 'react';
import {
  Grid, Card, Box, Typography, Stack, Chip, Button, Dialog, DialogContent, TextField,
  Checkbox, FormControlLabel, Divider, Snackbar, Alert
} from '@mui/material';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import { tokens } from '../../theme.js';
import { permissionMatrix } from '../../data/mockData.js';
import { AppContext } from '../../context/AppContext.jsx';

const ROLE_ICONS = {
  'Super Admin': <ShieldRoundedIcon />,
  Manager: <VerifiedUserRoundedIcon />,
  Client: <WorkspacePremiumRoundedIcon />
};

const ROLE_COLORS = {
  'Super Admin': tokens.color.navy,
  Manager: tokens.color.gold,
  Client: tokens.color.info
};

export default function RolesPermissions() {
  const { addAuditLog } = useContext(AppContext);
  const [matrix, setMatrix] = useState(permissionMatrix);
  const [openEdit, setOpenEdit] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const allModules = [
    'Dashboard', 'Utilisateurs', 'Rôles', 'Chambres', 'Réservations', 'Restaurant', 'Bar', 'Activités',
    'Conciergerie', 'Check-in/out', 'Facturation', 'Paiements', 'Stocks', 'RH', 'Planning', 'Rapports',
    'QR Code', 'Paramètres', 'Audit', 'Notifications', 'Support', 'Profil'
  ];

  const toggleModule = (role, module) => {
    setMatrix((prev) => {
      const current = prev[role].modules;
      const updated = current.includes(module) ? current.filter((m) => m !== module) : [...current, module];
      return { ...prev, [role]: { ...prev[role], modules: updated } };
    });
    addAuditLog(`Modification permission ${role} — ${module}`, 'Rôles & Permissions');
  };

  const saveChanges = () => {
    setOpenEdit(null);
    setSnackbar({ open: true, message: 'Permissions mises à jour et journalisées.', severity: 'success' });
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <ShieldRoundedIcon sx={{ fontSize: 34, color: tokens.color.gold }} />
          <Box>
            <Typography variant="h5">Matrice Rôles & Permissions</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Contrôle d’accès basé sur les rôles (RBAC) — chaque module est assignable par rôle.
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Grid container spacing={2.5}>
        {Object.entries(matrix).map(([role, data]) => (
          <Grid item xs={12} md={4} key={role}>
            <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" spacing={1.6} alignItems="center" sx={{ mb: 1 }}>
                <Box sx={{ width: 46, height: 46, borderRadius: '12px', bgcolor: `${ROLE_COLORS[role]}14`, color: ROLE_COLORS[role], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {ROLE_ICONS[role]}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: 17 }}>{role}</Typography>
                  <Chip
                    label={data.full ? 'Accès complet' : `${data.modules.length} modules`}
                    size="small"
                    sx={{ fontSize: 10.5, mt: 0.4, bgcolor: data.full ? tokens.color.successSoft : tokens.color.goldSoft, color: data.full ? tokens.color.success : tokens.color.navyDeep, fontWeight: 700 }}
                  />
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.6 }}>
                {data.label}
              </Typography>

              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                  {data.modules.map((m) => (
                    <Chip
                      key={m}
                      label={m}
                      size="small"
                      sx={{ bgcolor: tokens.color.cream, fontWeight: 600, fontSize: 11.5 }}
                    />
                  ))}
                </Stack>
              </Box>

              {!data.full && (
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2, borderColor: tokens.color.line, color: 'text.primary' }}
                  onClick={() => setOpenEdit(role)}
                >
                  Personnaliser les permissions
                </Button>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={Boolean(openEdit)} onClose={() => setOpenEdit(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>Personnaliser — {openEdit}</Typography>
          <Typography variant="caption" color="text.secondary">Cochez ou décochez les modules accessibles.</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={0.5}>
            {allModules.map((module) => {
              const checked = matrix[openEdit]?.modules.includes(module);
              return (
                <Grid item xs={6} sm={4} key={module}>
                  <FormControlLabel
                    control={<Checkbox checked={checked} onChange={() => toggleModule(openEdit, module)} size="small" />}
                    label={<Typography sx={{ fontSize: 12.5 }}>{module}</Typography>}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={() => setOpenEdit(null)}>Annuler</Button>
            <Button fullWidth variant="contained" color="secondary" onClick={saveChanges}>Enregistrer</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

