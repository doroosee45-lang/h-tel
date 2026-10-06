import { Alert, Box } from '@mui/material';
import { EmptyCard } from '../../components/common/StateViews.jsx';

export default function ClientSupport() {
  return (
    <Box>
      <Alert severity="warning" sx={{ mb: 2.5 }}>
        Aucun endpoint backend de support/ticket client n'a été trouvé dans cette branche.
      </Alert>
      <EmptyCard title="Support non branché" message="L'interface est conservée, mais aucun endpoint /api/support ou équivalent n'existe encore côté backend pour remplacer les données fictives." />
    </Box>
  );
}
