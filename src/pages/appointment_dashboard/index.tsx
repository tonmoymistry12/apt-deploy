'use client';

import { AppointmentDashboard } from '@/components/Appointment_Dashboard';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import PrivateRoute from '@/components/PrivateRoute';
import { Container, Typography, Box } from '@mui/material';
import { useState } from 'react';

export default function DashboardPage() {
  return (
     <PrivateRoute>
      <AuthenticatedLayout>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                 <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                 <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                    Veterinary Management System
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Appointment management dashboard for receptionists
                </Typography>
            </Box>
            <AppointmentDashboard />
            </Container>
             </Box>
             </AuthenticatedLayout>
     </PrivateRoute>
  );
}