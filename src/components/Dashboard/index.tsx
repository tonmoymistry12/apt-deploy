import { Container, Typography, Grid, Box } from '@mui/material';

import { UserAnalytics } from './user-analytics';
import { DiseaseAnalytics } from './disease-analytics';
import { AppointmentCalendar } from './appointment-calendar';
import { PetHealthMonitoring } from './pet-health-monitoring';

export default function DashboardPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Veterinary Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive overview of clinic operations and pet health monitoring
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Top Row */}
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <UserAnalytics />
              </Grid>
              <Grid item xs={12}>
                <DiseaseAnalytics />
              </Grid>
            </Grid>
          </Grid>
          
          {/* Right Column */}
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AppointmentCalendar />
              </Grid>
              <Grid item xs={12}>
                <PetHealthMonitoring />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

    </Box>
  );
}