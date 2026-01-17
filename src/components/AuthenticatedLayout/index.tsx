import React from 'react';
import { Box } from '@mui/material';
import SideMenu from '@/components/SideMenu';
import Header from '@/components/Header';

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header notificationCount={3} />
      <SideMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: '56px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthenticatedLayout;

