import { useState } from 'react';
import { Grid, Card, Box, Typography, Stack, Chip, Avatar, Divider, Dialog, DialogContent, IconButton, Button } from '@mui/material';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchField from '../components/common/SearchField.jsx';
import { tokens } from '../theme.js';
import { clients, clientHistory, fideliteReductions, currency } from '../data/mockData.js';
import { filterRecords } from '../utils/searchUtils.js';

const fideliteStyle = {
  Platine: { bg: '#EAEAEA', fg: '#4A4A4A' },
  Or: { bg: tokens.color.goldSoft, fg: tokens.color.navyDeep },
  Argent: { bg: tokens.color.infoSoft, fg: tokens.color.info },
  Standard: { bg: tokens.color.line, fg: 'text.secondary' }
};

function HistorySection({ title, items }) {
  return (
    <Box sx={{ mb: 1.6 }}>
      <Typography variant="overline" color="text.secondary">{title}</Typography>
      <Stack spacing={0.5} sx={{ mt: 0.4 }}>
        {items.map((it, i) => (
          <Typography key={i} variant="body2">• {it}</Typography>
        ))}
      </Stack>
    </Box>
  );
}

export default function CRM() {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const history = selected ? clientHistory[selected.id] : null;
  const filteredClients = filterRecords(
    clients,
    searchQuery,
    ['nom', 'nationalite', 'telephone', 'email', 'fidelite', 'id', 'sejours', 'pointsFidelite']
  );

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher un client par nom, téléphone, email, nationalité, fidélité…"
          sx={{ maxWidth: 480 }}
        />
      </Grid>
      {filteredClients.map((c) => (
        <Grid item xs={12} sm={6} lg={3} key={c.id}>
          <Card sx={{ p: 2.6, height: '100%' }}>
            <Stack direction="row" spacing={1.6} alignItems="center">
              <Avatar src={c.photo} sx={{ width: 52, height: 52 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14.5, lineHeight: 1.2 }}>{c.nom}</Typography>
                <Chip label={c.fidelite} size="small" sx={{ mt: 0.5, fontSize: 10.5, bgcolor: fideliteStyle[c.fidelite].bg, color: fideliteStyle[c.fidelite].fg, fontWeight: 700 }} />
              </Box>
            </Stack>

            <Stack spacing={0.8} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PublicRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{c.nationalite}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{c.telephone}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailRoundedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" noWrap>{c.email}</Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 1.8 }} />

            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary">Séjours</Typography>
                <Typography sx={{ fontWeight: 700 }}>{c.sejours}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">Dépenses totales</Typography>
                <Typography sx={{ fontWeight: 700, fontFamily: tokens.font.mono, color: tokens.color.navy }}>{currency(c.depensesTotales)}</Typography>
              </Box>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {c.pointsFidelite.toLocaleString('fr-FR')} points · {fideliteReductions[c.fidelite]}% de réduction
            </Typography>

            <Button size="small" fullWidth sx={{ mt: 1.8, color: tokens.color.navy }} onClick={() => setSelected(c)}>
              Voir l’historique complet
            </Button>
          </Card>
        </Grid>
      ))}

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '18px' } }}>
        <IconButton onClick={() => setSelected(null)} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseRoundedIcon />
        </IconButton>
        {selected && history && (
          <DialogContent sx={{ p: 3.5 }}>
            <Typography variant="h6">{selected.nom}</Typography>
            <Typography variant="caption" color="text.secondary">Historique complet du client</Typography>
            <Divider sx={{ my: 2 }} />
            <HistorySection title="Chambres" items={history.chambres} />
            <HistorySection title="Repas" items={history.repas} />
            <HistorySection title="Boissons" items={history.boissons} />
            <HistorySection title="Paiements" items={history.paiements} />
          </DialogContent>
        )}
      </Dialog>
    </Grid>
  );
}
