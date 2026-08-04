import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useState } from 'react';
import { Navigate, Outlet, useMatches } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import OfflineBanner from './OfflineBanner.jsx';
import { AppContext } from '../../context/AppContext.jsx';

export default function AppLayout() {
  const { isAuthenticated } = useContext(AppContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // < 1200px
  const [mobileOpen, setMobileOpen] = useState(false);

  const matches = useMatches();
  const current = matches[matches.length - 1]?.handle || {};

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    // IMPORTANT : ne PAS mettre overflowX (ou overflow) ici.
    // "overflow" différent de "visible" sur un ancêtre casse
    // "position: sticky" sur la Sidebar (elle perdrait son
    // comportement fixe et défilerait avec la page, laissant
    // un grand vide sous elle une fois scrollée).
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <OfflineBanner />
        <Topbar
          title={current.title || 'Smart Hotel 360°'}
          subtitle={current.subtitle}
          onToggleSidebar={() => setMobileOpen((prev) => !prev)}
        />
        {/* overflowX: hidden reste ici, sur le conteneur de contenu
            uniquement — c'est le bon endroit pour bloquer un éventuel
            débordement horizontal (ex: animations translateX du marquee),
            sans affecter le "sticky" de la Sidebar. */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 1.5, sm: 3, lg: 4 },
            py: 3.5,
            overflowX: 'hidden',
            width: '100%',
            maxWidth: '100%'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}