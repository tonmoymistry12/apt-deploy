import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Paper } from '@mui/material';
import ConsultationFees from './ConsultationFees';
import LocalPharmacyStore from './LocalPharmacyStore';
import LocalProcedure from './LocalProcedure';
import LocalOrders from './LocalOrders';

const FeesAndCharges: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box>
        <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
          Fees and Charges
        </Typography>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Consultation Fees" />
          <Tab label="Local Pharmacy Store" />
          <Tab label="Local Procedure" />
          <Tab label="Local Orders" />
        </Tabs>
        {activeTab === 0 && <ConsultationFees />}
        {activeTab === 1 && <LocalPharmacyStore />}
        {activeTab === 2 && <LocalProcedure />}
        {activeTab === 3 && <LocalOrders />}
      </Box>
    </Paper>
  );
};

export default FeesAndCharges;