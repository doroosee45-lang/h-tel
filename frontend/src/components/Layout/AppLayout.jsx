import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import OfflineBanner from './OfflineBanner.jsx';

export default function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // < 1200px
  const [mobileOpen, setMobileOpen] = useState(false);

  const matches = useMatches();
  const current = matches[matches.length - 1]?.handle || {};

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <OfflineBanner />
        <Topbar
          title={current.title || 'Smart Hotel 360°'}
          subtitle={current.subtitle}
          onToggleSidebar={() => setMobileOpen((prev) => !prev)}
        />
        <Box sx={{ px: { xs: 2, sm: 3, lg: 4 }, py: 3.5 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
