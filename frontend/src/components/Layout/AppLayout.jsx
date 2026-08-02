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
    <Box sx={{ display: 'flex', minHeight: '100vh', maxWidth: '100%', overflowX: 'hidden' }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <Box sx={{ flex: 1, minWidth: 0, maxWidth: '100%' }}>
        <OfflineBanner />
        <Topbar
          title={current.title || 'Smart Hotel 360°'}
          subtitle={current.subtitle}
          onToggleSidebar={() => setMobileOpen((prev) => !prev)}
        />
        <Box sx={{ px: { xs: 1.5, sm: 3, lg: 4 }, py: 3.5, overflowX: 'hidden', maxWidth: '100%' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
