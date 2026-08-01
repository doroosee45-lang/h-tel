import { useState } from 'react';
import {
  Grid, Card, Box, Typography, Stack, Chip, Avatar, Tabs, Tab,
  Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { employees, presenceLog, payroll, leaveRequests, currency } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

const statutStyle = {
  Présent: { bg: tokens.color.successSoft, fg: tokens.color.success },
  Congé: { bg: tokens.color.infoSoft, fg: tokens.color.info },
  Absent: { bg: tokens.color.dangerSoft, fg: tokens.color.danger },
  'En service': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'Terminé': { bg: tokens.color.line, fg: 'text.secondary' },
  'Absent non justifié': { bg: tokens.color.dangerSoft, fg: tokens.color.danger },
  'Validé': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning }
};

export default function HR() {
  const [tab, setTab] = useState('effectif');
  const [searchQuery, setSearchQuery] = useState('');
  const present = employees.filter((e) => e.statut === 'Présent').length;

  const employeesRows = filterRecords(employees, searchQuery, ['nom', 'poste', 'departement', 'statut', 'id', 'contrat', 'dateEmbauche']);
  const presenceRows = filterRecords(presenceLog, searchQuery, ['employe', 'lieu', 'statut', 'arrivee', 'depart']);
  const payrollRows = filterRecords(payroll, searchQuery, ['employe', 'salaireBase', 'primes', 'deductions', 'net']);
  const leaveRows = filterRecords(leaveRequests, searchQuery, ['employe', 'type', 'du', 'au', 'statut']);

  return (
    <Box>
      <Grid container spacing={2.5} sx={{ mb: 0.5 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="overline" color="text.secondary">Effectif total</Typography>
            <Typography variant="h4">{employees.length}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="overline" color="text.secondary">Présents aujourd’hui</Typography>
            <Typography variant="h4" sx={{ color: tokens.color.success }}>{present}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="overline" color="text.secondary">Pointage</Typography>
            <Typography variant="h4" sx={{ color: tokens.color.navy }}>Géolocalisé</Typography>
          </Card>
        </Grid>
      </Grid>

      <SearchField
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Rechercher un employé par nom, poste, département, statut, contrat…"
        sx={{ mt: 2.5, mb: 2, maxWidth: 420 }}
      />

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2, minHeight: 36, '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600, fontSize: 13.5 } }}
      >
        <Tab label="Effectif" value="effectif" />
        <Tab label="Présence" value="presence" />
        <Tab label="Paie" value="paie" />
        <Tab label="Congés" value="conges" />
      </Tabs>

      {tab === 'effectif' && (
        <Grid container spacing={2.5}>
          {employeesRows.map((e) => (
            <Grid item xs={12} sm={6} md={4} key={e.id}>
              <Card sx={{ p: 2.4 }}>
                <Stack direction="row" spacing={1.6} alignItems="center">
                  <Avatar src={e.photo} sx={{ width: 52, height: 52 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14.5 }}>{e.nom}</Typography>
                    <Typography variant="caption" color="text.secondary">{e.poste} · {e.departement}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.6 }}>
                  <Chip label={e.contrat} size="small" sx={{ fontFamily: tokens.font.mono, bgcolor: tokens.color.cream }} />
                  <Chip label={e.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[e.statut].bg, color: statutStyle[e.statut].fg }} />
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Embauché le {new Date(e.dateEmbauche).toLocaleDateString('fr-FR')}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tab === 'presence' && (
        <Card sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: tokens.color.cream }}>
                {['Employé', 'Arrivée', 'Départ', 'Lieu (géolocalisation)', 'Statut'].map((h) => (
                  <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {presenceRows.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{p.employe}</TableCell>
                  <TableCell sx={{ fontFamily: tokens.font.mono }}>{p.arrivee}</TableCell>
                  <TableCell sx={{ fontFamily: tokens.font.mono }}>{p.depart}</TableCell>
                  <TableCell>{p.lieu}</TableCell>
                  <TableCell>
                    <Chip label={p.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[p.statut]?.bg, color: statutStyle[p.statut]?.fg }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {tab === 'paie' && (
        <Card sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: tokens.color.cream }}>
                {['Employé', 'Salaire de base', 'Primes', 'Déductions', 'Net à payer'].map((h) => (
                  <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {payrollRows.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{p.employe}</TableCell>
                  <TableCell sx={{ fontFamily: tokens.font.mono }}>{currency(p.salaireBase)}</TableCell>
                  <TableCell sx={{ fontFamily: tokens.font.mono, color: tokens.color.success }}>+{currency(p.primes)}</TableCell>
                  <TableCell sx={{ fontFamily: tokens.font.mono, color: tokens.color.danger }}>-{currency(p.deductions)}</TableCell>
                  <TableCell sx={{ fontFamily: tokens.font.mono, fontWeight: 700 }}>{currency(p.net)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {tab === 'conges' && (
        <Card sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: tokens.color.cream }}>
                {['Employé', 'Type', 'Du', 'Au', 'Statut'].map((h) => (
                  <TableCell key={h} sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRows.map((l) => (
                <TableRow key={l.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{l.employe}</TableCell>
                  <TableCell>{l.type}</TableCell>
                  <TableCell>{new Date(l.du).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{new Date(l.au).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>
                    <Chip label={l.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[l.statut]?.bg, color: statutStyle[l.statut]?.fg }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </Box>
  );
}
