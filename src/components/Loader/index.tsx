import React, { useState, useEffect } from 'react';
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';
import { loaderService } from './loaderService';

const Loader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = loaderService.subscribe((loading) => {
      setIsLoading(loading);
    });

    // Initialize state
    setIsLoading(loaderService.isLoading());

    return unsubscribe;
  }, []);

  if (!isLoading) return null;

  return (
    <Backdrop
      open={isLoading}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          bgcolor: 'white',
          borderRadius: 4,
          p: 5,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          minWidth: 200,
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: '#174a7c',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Typography
          variant="body1"
          sx={{
            color: '#174a7c',
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: 0.5,
          }}
        >
          Loading...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default Loader;
