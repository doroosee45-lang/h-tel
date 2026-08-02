import { Dialog, DialogContent, Box, Typography, Stack, Chip, Grid, IconButton, Divider } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { tokens } from '../../theme.js';
import { currency } from '../../data/mockData.js';

export default function RoomDetailDialog({ room, open, onClose }) {
  if (!room) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12, zIndex: 3, bgcolor: 'rgba(255,255,255,0.9)' }}>
        <CloseRoundedIcon />
      </IconButton>

      <Grid container>
        <Grid item xs={12} sm={5}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5, height: { xs: 220, sm: '100%' } }}>
            {(room.gallery || [room.image]).slice(0, 4).map((img, i) => (
              <Box key={i} component="img" src={img} sx={{ width: '100%', height: '100%', objectFit: 'cover', gridColumn: i === 0 ? '1 / 3' : undefined }} />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} sm={7}>
          <DialogContent sx={{ p: 3 }}>
            <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: 'text.secondary' }}>{room.id} · Étage {room.etage}</Typography>
            <Typography variant="h5" sx={{ mt: 0.3 }}>{room.nom}</Typography>
            <Chip label={room.categorie} size="small" sx={{ mt: 1, bgcolor: tokens.color.goldSoft, color: tokens.color.navyDeep, fontWeight: 700 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>{room.description}</Typography>

<Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Surface</Typography>
                <Typography sx={{ fontWeight: 600 }}>{room.surface} m²</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Literie</Typography>
                <Typography sx={{ fontWeight: 600 }}>{room.lits}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Tarif / nuit</Typography>
                <Typography sx={{ fontWeight: 700, color: tokens.color.navy }}>{currency(room.prix)}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="overline" color="text.secondary">Équipements</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5, mb: 2 }}>
              {room.equipements?.map((e) => (
                <Chip key={e} label={e} size="small" sx={{ bgcolor: tokens.color.cream }} />
              ))}
            </Stack>

            <Typography variant="overline" color="text.secondary">Services associés</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
              {room.services?.map((s) => (
                <Chip key={s} label={s} size="small" sx={{ bgcolor: tokens.color.navy, color: '#fff' }} />
              ))}
            </Stack>
          </DialogContent>
        </Grid>
      </Grid>
    </Dialog>
  );
}
