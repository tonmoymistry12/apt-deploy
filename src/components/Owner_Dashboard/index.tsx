import { Container, Typography, Grid, Box } from '@mui/material';

import { UserAnalytics } from './Owner_user_analytics';
import { ExpenditureAnalytics } from './ExpenditureAnalytics';

export default function OwnerDashboardPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Veterinary Owner Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive overview of clinic operations and pet health monitoring
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <UserAnalytics />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <ExpenditureAnalytics/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}