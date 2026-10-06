import { Alert, Box, Card, Chip, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { api, unwrap } from '../api/client.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../components/common/StateViews.jsx';
import { formatCurrency, formatDate, fullName, sentenceCase } from '../utils/format.js';
import { tokens } from '../theme.js';

async function safeGet(url) {
  try {
    return unwrap(await api.get(url));
  } catch {
    return [];
  }
}

async function loadHr() {
  const [employees, attendance, leaves, payroll] = await Promise.all([
    safeGet('/hr/employees'),
    safeGet('/hr/attendance'),
    safeGet('/hr/leaves'),
    safeGet('/hr/payroll')
  ]);
  return { employees, attendance, leaves, payroll };
}

export default function HR() {
  const { data, loading, error, reload } = useAsyncData(loadHr, []);

  if (loading) return <LoadingCard message="Chargement des données RH…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Employés, présence, congés et paie sont chargés depuis le backend. Selon le rôle, certaines sections peuvent revenir vides si l'API refuse l'accès.
      </Alert>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={3}><Card sx={{ p: 3 }}><Typography variant="h6">Employés</Typography><Typography variant="h3">{data?.employees?.length || 0}</Typography></Card></Grid>
        <Grid item xs={12} md={3}><Card sx={{ p: 3 }}><Typography variant="h6">Présences</Typography><Typography variant="h3">{data?.attendance?.length || 0}</Typography></Card></Grid>
        <Grid item xs={12} md={3}><Card sx={{ p: 3 }}><Typography variant="h6">Congés</Typography><Typography variant="h3">{data?.leaves?.length || 0}</Typography></Card></Grid>
        <Grid item xs={12} md={3}><Card sx={{ p: 3 }}><Typography variant="h6">Paies</Typography><Typography variant="h3">{data?.payroll?.length || 0}</Typography></Card></Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          {(data?.employees || []).length ? (
            <Card sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 860 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: tokens.color.cream }}>
                    {['Employé', 'Département', 'Poste', 'Contrat', 'Salaire', 'Statut'].map((label) => (
                      <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.employees.map((employee) => (
                    <TableRow key={employee._id} hover>
                      <TableCell>{fullName(employee.user)}</TableCell>
                      <TableCell>{employee.department || '—'}</TableCell>
                      <TableCell>{employee.position || '—'}</TableCell>
                      <TableCell>{sentenceCase(employee.contractType)}</TableCell>
                      <TableCell>{formatCurrency(employee.baseSalary)}</TableCell>
                      <TableCell><Chip label={sentenceCase(employee.status || 'active')} size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <EmptyCard title="Aucun employé" message="Aucun dossier employé accessible pour ce rôle." />
          )}
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ p: 3, mb: 2.5 }}>
            <Typography variant="h6">Présence récente</Typography>
            {(data?.attendance || []).length ? (
              <List disablePadding>
                {data.attendance.slice(0, 8).map((entry) => (
                  <ListItem key={entry._id} disableGutters divider>
                    <ListItemText primary={entry.employee?.employeeCode || 'Employé'} secondary={`Entrée ${formatDate(entry.checkIn)}${entry.checkOut ? ` · Sortie ${formatDate(entry.checkOut)}` : ' · En cours'}`} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">Aucun pointage visible.</Typography>
            )}
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6">Dernières paies</Typography>
            {(data?.payroll || []).length ? (
              <List disablePadding>
                {data.payroll.slice(0, 8).map((entry) => (
                  <ListItem key={entry._id} disableGutters divider>
                    <ListItemText primary={`${fullName(entry.employee?.user)} · ${entry.period}`} secondary={`${formatCurrency(entry.netSalary)} · ${sentenceCase(entry.status)}`} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">Aucune fiche de paie accessible.</Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
