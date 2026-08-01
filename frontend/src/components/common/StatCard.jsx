import { Card, Box, Typography, Stack } from '@mui/material';
import { tokens } from '../../theme.js';

export default function StatCard({ icon, label, value, sub, accent = tokens.color.navy }) {
  return (
    <Card sx={{ p: 2.5, height: '100%' }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${accent}14`,
            color: accent,
            flexShrink: 0
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: 11 }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontSize: 26, lineHeight: 1.2 }}>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {sub}
            </Typography>
          )}
        </Box>
      </Stack>
    </Card>
  );
}
