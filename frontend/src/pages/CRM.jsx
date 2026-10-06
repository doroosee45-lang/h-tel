import { useMemo, useState } from 'react';
import { Alert, Box, Button, Card, Chip, Dialog, DialogContent, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import SearchField from '../components/common/SearchField.jsx';
import { api, unwrap } from '../api/client.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { EmptyCard, ErrorCard, LoadingCard } from '../components/common/StateViews.jsx';
import { formatCurrency, formatDate, fullName } from '../utils/format.js';
import { tokens } from '../theme.js';

async function loadCrm() {
  return unwrap(await api.get('/crm/clients')) || [];
}

export default function CRM() {
  const { data, loading, error, reload } = useAsyncData(loadCrm, []);
  const [query, setQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [details, setDetails] = useState(null);

  const rows = useMemo(() => (data || []).filter((client) => {
    if (!query) return true;
    const haystack = [client.firstName, client.lastName, client.email, client.phone].join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  }), [data, query]);

  const openDetails = async (client) => {
    setSelectedClient(client);
    const result = unwrap(await api.get(`/crm/clients/${client._id}`));
    setDetails(result);
  };

  if (loading) return <LoadingCard message="Chargement du CRM…" />;
  if (error) return <ErrorCard error={error} onRetry={reload} />;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2.5 }}>
        Cette page consomme <strong>/api/crm/clients</strong> et <strong>/api/crm/clients/:id</strong>.
      </Alert>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 2.5, gap: 1.5 }}>
        <SearchField value={query} onChange={setQuery} placeholder="Rechercher un client…" sx={{ minWidth: { sm: 280 } }} />
        <Chip label={`${rows.length} client(s)`} />
      </Stack>

      {!rows.length ? (
        <EmptyCard title="Aucun client" message="Aucune fiche client n'est accessible avec les filtres courants." />
      ) : (
        <Card sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 920 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: tokens.color.cream }}>
                {['Client', 'Contact', 'VIP', 'Points fidélité', 'Dépenses', 'Dernière activité', ''].map((label) => (
                  <TableCell key={label} sx={{ fontFamily: tokens.font.mono, fontSize: 11, textTransform: 'uppercase', color: 'text.secondary' }}>{label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((client) => (
                <TableRow key={client._id} hover>
                  <TableCell>{fullName(client)}</TableCell>
                  <TableCell>{client.email || client.phone || '—'}</TableCell>
                  <TableCell><Chip label={client.vipStatus ? 'VIP' : 'Standard'} size="small" color={client.vipStatus ? 'secondary' : 'default'} /></TableCell>
                  <TableCell>{client.loyaltyPoints || 0}</TableCell>
                  <TableCell>{formatCurrency(client.totalSpent || 0)}</TableCell>
                  <TableCell>{formatDate(client.updatedAt || client.createdAt)}</TableCell>
                  <TableCell><Button size="small" onClick={() => openDetails(client)}>Détails</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={Boolean(selectedClient)} onClose={() => { setSelectedClient(null); setDetails(null); }} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{selectedClient ? fullName(selectedClient) : 'Client'}</Typography>
          {!details ? (
            <Typography color="text.secondary">Chargement…</Typography>
          ) : (
            <Stack spacing={2}>
              <Typography><strong>Réservations:</strong> {details.reservations?.length || 0}</Typography>
              <Typography><strong>Commandes:</strong> {details.orders?.length || 0}</Typography>
              <Typography><strong>Factures:</strong> {details.invoices?.length || 0}</Typography>
              <Typography><strong>Dépenses cumulées:</strong> {formatCurrency(details.client?.totalSpent || selectedClient?.totalSpent || 0)}</Typography>
              <TextField
                label="Résumé"
                value={`Dernière réservation: ${details.reservations?.[0]?.reference || 'aucune'} | Dernière facture: ${details.invoices?.[0]?.invoiceNumber || 'aucune'}`}
                multiline
                minRows={3}
                InputProps={{ readOnly: true }}
              />
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
