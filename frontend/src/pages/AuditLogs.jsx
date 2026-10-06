import { useMemo, useState } from 'react';
import { Box, Card, Typography, Stack, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { filterRecords } from '../utils/searchUtils.js';
import { api, unwrap } from '../api/client.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../components/common/StateViews.jsx';
import { formatDate } from '../utils/format.js';

async function loadAuditLogs() {
  return unwrap(await api.get('/audit-logs')) || [];
}

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, loading, error, reload } = useAsyncData(loadAuditLogs, []);
  const rows = useMemo(
    () => filterRecords(
      (data || []).map((log) => ({
        ...log,
        id: log._id,
        timestamp: log.createdAt,
        user: log.userEmail || log.user || '—',
        action: `${log.method} ${log.path}`,
        module: log.path.split('/').filter(Boolean)[1] || 'api',
        status: log.statusCode >= 400 ? 'Échec' : 'Réussi'
      })),
      searchQuery,
      ['action', 'user', 'module', 'status', 'timestamp']
    ),
    [data, searchQuery]
  );

  if (loading) return <LoadingCard message="Chargement du journal d’audit…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <HistoryRoundedIcon sx={{ fontSize: 32, color: tokens.color.navy }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5">Journal d’audit</Typography>
            <Typography variant="body2" color="text.secondary">
              Suivi détaillé des connexions, actions administratives et modifications de données.
            </Typography>
          </Box>
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher une action, utilisateur, module…"
            sx={{ minWidth: { sm: 260 } }}
          />
        </Stack>
      </Card>

      <TableContainer component={Card} sx={{ p: 2, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 760 }}>
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
            {rows.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatDate(log.timestamp)}</TableCell>
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
      {!rows.length ? <EmptyCard title="Aucune action" message="Aucune entrée ne correspond à la recherche." /> : null}
    </Box>
  );
}
