import { useMemo, useState } from 'react';
import { Alert, Box, Card, Chip, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import SearchField from '../../components/common/SearchField.jsx';
import { api, unwrap } from '../../api/client.js';
import { useAsyncData } from '../../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../../components/common/StateViews.jsx';
import { formatDate, fullName, sentenceCase } from '../../utils/format.js';
import { tokens } from '../../theme.js';

async function loadUsers() {
  return unwrap(await api.get('/users')) || [];
}

export default function UsersManagement() {
  const { data, loading, error, reload } = useAsyncData(loadUsers, []);
  const [query, setQuery] = useState('');
  const rows = useMemo(() => (data || []).filter((user) => {
    if (!query) return true;
    const haystack = [user.firstName, user.lastName, user.email, user.role].join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  }), [data, query]);

  if (loading) return <LoadingCard message="Chargement des utilisateurs…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Cette page est branchée sur <strong>/api/users</strong>. Les mises à jour CRUD détaillées restent côté backend mais la liste est désormais réelle.
      </Alert>

      <SearchField value={query} onChange={setQuery} placeholder="Rechercher un utilisateur…" sx={{ mb: 2.5, maxWidth: 320 }} />

      {!rows.length ? (
        <EmptyCard title="Aucun utilisateur" message="Aucun utilisateur ne correspond à la recherche." />
      ) : (
        <Card sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 860 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: tokens.color.cream }}>
                {['Utilisateur', 'Email', 'Rôle', 'Statut', 'Créé le', 'Dernière mise à jour'].map((label) => (
                  <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{fullName(user)}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{sentenceCase(user.role)}</TableCell>
                  <TableCell><Chip label={user.isActive ? 'Actif' : 'Désactivé'} size="small" color={user.isActive ? 'success' : 'default'} /></TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{formatDate(user.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </Box>
  );
}
