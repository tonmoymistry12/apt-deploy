import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import LoyaltyDiscount from './LoyaltyDiscount';
import CorporateDiscount from './CorporateDiscount';
import InsurerDiscount from './InsurerDiscount';

export default function DiscountTabs() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box>
        <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
          Manage Discount
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Loyalty Discount" />
          <Tab label="Corporate Discount" />
          <Tab label="Insurer Discount" />
        </Tabs>

        {tab === 0 && <LoyaltyDiscount />}
        {tab === 1 && <CorporateDiscount />}
        {tab === 2 && <InsurerDiscount />}
      </Box>
    </Paper>
  );
}