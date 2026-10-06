import { Alert, Box, Button, Card, CircularProgress, Stack, Typography } from '@mui/material';

export function LoadingCard({ message = 'Chargement…' }) {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={1.5} alignItems="center">
        <CircularProgress size={28} />
        <Typography color="text.secondary">{message}</Typography>
      </Stack>
    </Card>
  );
}

export function ErrorCard({ error, onRetry }) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Alert severity="error">{error?.response?.data?.message || error?.message || 'Une erreur est survenue.'}</Alert>
        {onRetry ? (
          <Box>
            <Button variant="outlined" onClick={onRetry}>Réessayer</Button>
          </Box>
        ) : null}
      </Stack>
    </Card>
  );
}

export function EmptyCard({ title = 'Aucune donnée', message, action }) {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={1.2} alignItems="flex-start">
        <Typography variant="h6">{title}</Typography>
        {message ? <Typography color="text.secondary">{message}</Typography> : null}
        {action || null}
      </Stack>
    </Card>
  );
}
