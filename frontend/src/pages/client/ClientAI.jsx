import { useState } from 'react';
import { Card, Box, Typography, Stack, Chip, IconButton, TextField } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { tokens } from '../../theme.js';
import { aiAssistantQuestions, rooms, menuItems, activities, currency } from '../../data/mockData.js';

const RESPONSES = {
  'Quelles chambres sont disponibles ce week-end ?': () => {
    const libres = rooms.filter((r) => r.statut === 'Libre').slice(0, 3);
    return `Nous avons actuellement ${libres.length} chambres disponibles : ${libres.map((r) => `${r.nom} (${currency(r.prix)}/nuit)`).join(' · ')}. Souhaitez-vous réserver ?`;
  },
  'Que recommandez-vous au restaurant ?': () => {
    const top = menuItems.filter((m) => m.dispo).slice(0, 3);
    return `Nos plats vedettes du jour : ${top.map((m) => `${m.nom} — ${currency(m.prix)}`).join(' · ')}. Le poulet braisé reste le favori de nos clients !`;
  },
  'Quelles activités proposez-vous ?': () => {
    return `Nous proposons : ${activities.map((a) => a.nom).join(', ')}. ${activities.find((a) => a.nom === 'Spa & Massage')?.horaire} pour le spa.`;
  },
  'Comment accéder à ma facture ?': () => {
    return 'Vos factures sont disponibles dans le menu « Mes Factures ». Vous pouvez les télécharger en PDF ou les imprimer directement.';
  }
};

const SUGGESTED = aiAssistantQuestions;

export default function ClientAI() {
  const [messages, setMessages] = useState([
    { from: 'ia', text: 'Bonjour ! Je suis votre concierge virtuel. Chambres, restaurant, bar, activités, factures — posez-moi vos questions.' }
  ]);
  const [input, setInput] = useState('');

  const send = (text) => {
    const q = text.trim();
    if (!q) return;
    setMessages((prev) => [...prev, { from: 'user', text: q }]);
    const responder = RESPONSES[q] || (() => 'Bonne question ! Pour ce sujet, je vous conseille de contacter la réception au +243 81 555 0101 — je peux aussi vous recommander nos chambres, plats ou activités.');
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'ia', text: responder() }]);
    }, 700);
    setInput('');
  };

  return (
    <Box>
      <Card sx={{ p: 3, mb: 2.5, bgcolor: tokens.color.navy, color: '#fff' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 52, height: 52, borderRadius: '13px', bgcolor: tokens.color.gold, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AutoAwesomeRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h5">Assistant IA Hôtel</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Réponses instantanées, recommandations de chambres, de repas et d’activités.
            </Typography>
          </Box>
        </Stack>
      </Card>

      <Card sx={{ p: 3 }}>
        <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {SUGGESTED.map((q) => (
            <Chip key={q} label={q} size="small" onClick={() => send(q)} sx={{ bgcolor: tokens.color.cream, fontWeight: 600, '&:hover': { bgcolor: tokens.color.goldSoft } }} />
          ))}
        </Stack>

        <Box sx={{ maxHeight: 420, overflowY: 'auto', mb: 2, p: 0.5 }}>
          <Stack spacing={1.4}>
            {messages.map((m, i) => (
              <Stack
                key={i}
                direction="row"
                spacing={1}
                justifyContent={m.from === 'user' ? 'flex-end' : 'flex-start'}
                alignItems="flex-end"
              >
                {m.from === 'ia' && (
                  <Box sx={{ width: 32, height: 32, borderRadius: '9px', bgcolor: tokens.color.navy, color: tokens.color.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <SmartToyRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                )}
                <Box
                  sx={{
                    maxWidth: '78%',
                    p: 1.6,
                    borderRadius: m.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    bgcolor: m.from === 'user' ? tokens.color.navy : tokens.color.cream,
                    color: m.from === 'user' ? '#fff' : 'text.primary'
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.6 }}>{m.text}</Typography>
                </Box>
                {m.from === 'user' && (
                  <Box sx={{ width: 32, height: 32, borderRadius: '9px', bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PersonRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                )}
              </Stack>
            ))}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <TextField
            placeholder="Posez votre question…"
            size="small"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
          />
          <IconButton onClick={() => send(input)} sx={{ bgcolor: tokens.color.gold, color: tokens.color.navyDeep, '&:hover': { bgcolor: tokens.color.gold } }}>
            <SendRoundedIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </Stack>
      </Card>
    </Box>
  );
}

