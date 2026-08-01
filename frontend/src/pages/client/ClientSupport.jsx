import { useState } from 'react';
import {
  Grid, Card, Box, Typography, Stack, Button, TextField, MenuItem, Chip, Divider, Snackbar, Alert, IconButton
} from '@mui/material';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { tokens } from '../../theme.js';
import { hotelContact } from '../../data/mockData.js';

const categories = ['Question réservation', 'Facturation / paiement', 'Room Service', 'Conciergerie', 'Réclamation', 'Autre'];

export default function ClientSupport() {
  const [form, setForm] = useState({ sujet: '', categorie: 'Question réservation', message: '' });
  const [tickets, setTickets] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chat, setChat] = useState([
    { from: 'hotel', text: 'Bienvenue au support Hôtel Fleuve. Comment pouvons-nous vous aider ?' }
  ]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const submitTicket = () => {
    if (!form.sujet.trim() || !form.message.trim()) return;
    setTickets((prev) => [{ id: `TK-${Date.now().toString().slice(-4)}`, ...form, date: new Date().toLocaleDateString('fr-FR'), statut: 'Ouvert' }, ...prev]);
    setForm({ sujet: '', categorie: 'Question réservation', message: '' });
    setSnackbar({ open: true, message: 'Votre demande a été envoyée au support.', severity: 'success' });
  };

  const sendChat = () => {
    const text = chatMsg.trim();
    if (!text) return;
    setChat((prev) => [...prev, { from: 'client', text }]);
    setChatMsg('');
    setTimeout(() => {
      setChat((prev) => [...prev, { from: 'hotel', text: 'Merci ! Un agent de la réception vous répondra dans quelques instants. Pour une urgence, appelez le +243 81 555 0101.' }]);
    }, 900);
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 52, height: 52, borderRadius: '13px', bgcolor: tokens.color.gold, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SupportAgentRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h5">Support & Assistance</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Notre équipe est disponible 24h/24 pour vous accompagner pendant votre séjour.
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Contacter la réception</Typography>
            <Stack spacing={1.6}>
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box sx={{ width: 42, height: 42, borderRadius: '11px', bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PhoneRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Téléphone</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{hotelContact.telephone}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box sx={{ width: 42, height: 42, borderRadius: '11px', bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <EmailRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{hotelContact.email}</Typography>
                </Box>
              </Stack>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>Ouvrir un ticket</Typography>
            <Stack spacing={2}>
              <TextField label="Sujet" value={form.sujet} onChange={(e) => setForm((p) => ({ ...p, sujet: e.target.value }))} fullWidth size="small" />
              <TextField label="Catégorie" select value={form.categorie} onChange={(e) => setForm((p) => ({ ...p, categorie: e.target.value }))} fullWidth size="small">
                {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField label="Message" multiline minRows={4} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} fullWidth size="small" />
              <Button variant="contained" color="secondary" sx={{ boxShadow: 'none' }} onClick={submitTicket}>
                Envoyer le ticket
              </Button>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, mb: 2.5 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <ChatBubbleRoundedIcon sx={{ color: tokens.color.gold }} />
              <Typography variant="h6">Messagerie instantanée</Typography>
            </Stack>
            <Box sx={{ minHeight: 260, mb: 2, bgcolor: tokens.color.cream, borderRadius: '14px', p: 2, maxHeight: 300, overflowY: 'auto' }}>
              <Stack spacing={1.4}>
                {chat.map((m, i) => (
                  <Stack key={i} direction="row" justifyContent={m.from === 'client' ? 'flex-end' : 'flex-start'}>
                    <Box
                      sx={{
                        maxWidth: '80%',
                        p: 1.4,
                        borderRadius: m.from === 'client' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        bgcolor: m.from === 'client' ? tokens.color.navy : '#fff',
                        color: m.from === 'client' ? '#fff' : 'text.primary',
                        border: m.from === 'hotel' ? `1px solid ${tokens.color.line}` : 'none'
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: 13.5 }}>{m.text}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
            <Stack direction="row" spacing={1}>
              <TextField size="small" fullWidth placeholder="Écrire un message…" value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendChat()} />
              <IconButton onClick={sendChat} sx={{ bgcolor: tokens.color.gold, color: tokens.color.navyDeep, '&:hover': { bgcolor: tokens.color.gold } }}>
                <SendRoundedIcon sx={{ fontSize: 19 }} />
              </IconButton>
            </Stack>
          </Card>

          {tickets.length > 0 && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>Mes tickets</Typography>
              <Stack spacing={1.4}>
                {tickets.map((t) => (
                  <Stack key={t.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.4, borderRadius: '10px', border: `1px solid ${tokens.color.line}` }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 13.5 }}>{t.sujet}</Typography>
                      <Typography variant="caption" color="text.secondary">{t.id} · {t.categorie} · {t.date}</Typography>
                    </Box>
                    <Chip label={t.statut} size="small" sx={{ fontWeight: 700, bgcolor: tokens.color.infoSoft, color: tokens.color.info }} />
                  </Stack>
                ))}
              </Stack>
            </Card>
          )}
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

