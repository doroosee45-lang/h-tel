import { Alert, Box } from '@mui/material';
import { EmptyCard } from '../components/common/StateViews.jsx';

export default function RoomService() {
  return (
    <Box>
      <Alert severity="warning" sx={{ mb: 2.5 }}>
        Aucun endpoint backend dédié au room service n'a été trouvé (pas de route /api/room-service ni d'origine distincte autre que restaurant/bar).
      </Alert>
      <EmptyCard title="Room service non branché" message="L'UI est conservée mais reste volontairement vide jusqu'à l'ajout d'un endpoint backend réel pour ce module." />
    </Box>
  );
}
