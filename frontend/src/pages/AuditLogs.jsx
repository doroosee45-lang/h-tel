import { Box, Card, Typography, Stack, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { tokens } from '../theme.js';
import { auditLogs } from '../data/mockData.js';

export default function AuditLogs() {
  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <HistoryRoundedIcon sx={{ fontSize: 32, color: tokens.color.navy }} />
          <Box>
            <Typography variant="h5">Journal d’audit</Typography>
            <Typography variant="body2" color="text.secondary">
              Suivi détaillé des connexions, actions administratives et modifications de données.
            </Typography>
          </Box>
        </Stack>
      </Card>

      <TableContainer component={Card} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Heure</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Résultat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.module}</TableCell>
                <TableCell>
                  <Chip
                    label={log.status}
                    size="small"
                    sx={{ bgcolor: log.status === 'Échec' ? tokens.color.dangerSoft : tokens.color.successSoft, color: log.status === 'Échec' ? tokens.color.danger : tokens.color.success }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
