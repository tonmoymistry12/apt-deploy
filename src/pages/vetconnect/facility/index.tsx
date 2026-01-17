import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import ChargeEventTabs from "@/components/ConfigureCharge";
import PrivateRoute from "@/components/PrivateRoute";
import Facility from "@/components/vetconnect/Facility";
import { Box, Typography } from "@mui/material";
import React from "react";

const Charges = () => {
  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#174a7c",
              mb: 3,
              textAlign: "center",
            }}
          >
          Maintain Facility
          </Typography>
          <Facility />
        </Box>
      </AuthenticatedLayout>
    </PrivateRoute>
  );
};

export default Charges;
