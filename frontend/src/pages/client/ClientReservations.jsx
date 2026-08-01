import { useContext } from 'react';
import { Grid, Card, Box, Typography, Stack, Chip, Button, Divider } from '@mui/material';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import { tokens } from '../../theme.js';
import { AppContext } from '../../context/AppContext.jsx';
import { reservations, rooms, currency } from '../../data/mockData.js';

const statutStyle = {
  'Confirmée': { bg: tokens.color.successSoft, fg: tokens.color.success },
  'En cours': { bg: tokens.color.infoSoft, fg: tokens.color.info },
  'En attente': { bg: tokens.color.warningSoft, fg: tokens.color.warning },
  'Terminée': { bg: tokens.color.line, fg: 'text.secondary' }
};

export default function ClientReservations() {
  const { userRole } = useContext(AppContext);
  const clientName = userRole === 'Client' ? 'M. Kanyinda Tshibola' : 'M. Kanyinda Tshibola';
  const myReservations = reservations.filter((r) => r.client === clientName);

  const nightsOf = (r) => Math.max(1, Math.round((new Date(r.depart) - new Date(r.arrivee)) / (1000 * 60 * 60 * 24)));

  const amountOf = (r) => {
    const room = rooms.find((x) => x.nom === r.chambre);
    return (room?.prix || 120000) * nightsOf(r);
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 52, height: 52, borderRadius: '13px', bgcolor: tokens.color.gold, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EventAvailableRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h5">Mes Réservations</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Suivi complet de vos séjours : numéro, chambre, dates, statut et paiement.
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Grid container spacing={2.5}>
        {myReservations.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">Aucune réservation</Typography>
              <Typography variant="body2" color="text.secondary">Réservez une chambre pour commencer votre séjour.</Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2, boxShadow: 'none' }} href="/client/chambres">
                Voir les chambres
              </Button>
            </Card>
          </Grid>
        ) : (
          myReservations.map((r) => {
            const total = amountOf(r);
            const paid = r.statut === 'Terminée' || r.statut === 'Confirmée' || r.statut === 'En cours' ? Math.round(total * (r.statut === 'En cours' ? 0.5 : 1)) : 0;
            const solde = total - paid;
            return (
              <Grid item xs={12} md={6} key={r.id}>
                <Card sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography sx={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 15 }}>{r.id}</Typography>
                    <Chip label={r.statut} size="small" sx={{ fontWeight: 700, bgcolor: statutStyle[r.statut].bg, color: statutStyle[r.statut].fg }} />
                  </Stack>

                  <Stack spacing={1.2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Chambre réservée</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.chambre}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Date d’arrivée</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{new Date(r.arrivee).toLocaleDateString('fr-FR')}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Date de départ</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{new Date(r.depart).toLocaleDateString('fr-FR')}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Nombre de jours</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{nightsOf(r)} nuits</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Nombre de personnes</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>2 adultes</Typography>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 1.6, borderStyle: 'dashed' }} />

                  <Stack spacing={1.2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Montant payé</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: tokens.color.success, fontFamily: tokens.font.mono }}>{currency(paid)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Solde restant</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: solde > 0 ? tokens.color.warning : tokens.color.success, fontFamily: tokens.font.mono }}>{currency(solde)}</Typography>
                    </Stack>
                  </Stack>

                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<PaymentRoundedIcon />}
                    sx={{ mt: 2, boxShadow: 'none' }}
                    href="/client/paiements"
                  >
                    {solde > 0 ? 'Payer le solde' : 'Voir les paiements'}
                  </Button>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
}

