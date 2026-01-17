'use client';

import React from 'react';
import { Box } from '@mui/material';
import styles from './styles.module.scss';
import SignIn from '@/components/SignIn';
import LeftImageSection from '@/components/common/LeftImageSection';

export default function LoginPage() {
  return (
    <Box className={styles.mainContainer}>
      <LeftImageSection />
      <Box className={styles.rightSection}>
        <SignIn />
      </Box>
    </Box>
  );
}
