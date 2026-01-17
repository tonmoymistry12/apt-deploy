import React from 'react';

import {Box} from '@mui/material';

import LeftImageSection from '@/components/common/LeftImageSection';
import ForgotPasswordForm from '@/components/ForgotPassword';

export default function ForgotPassword() {
  
  return (
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex', 
        overflow: 'hidden'
      }}
    >
      {/* Left Background Section */}
      <LeftImageSection/>
      {/* Right Form Section */}
      <ForgotPasswordForm/>
    </Box>
  );
}
