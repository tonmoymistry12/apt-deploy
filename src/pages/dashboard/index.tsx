import React, { useState, useEffect } from "react";
import axiosInstance from "@/common/http";
import PrivateRoute from "@/components/PrivateRoute";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Paper,
  Checkbox,
  Avatar,
  Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import styles from "./style.module.scss";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useRouter } from "next/router";
import DashboardPage from "@/components/Dashboard";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get user data from session storage
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('isAuthenticated');
    router.push('/signin');
  };

  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        {/* <Box className={styles.dashboardContainer}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                  Welcome, {userData?.firstName} {userData?.lastName}
                </Typography>
                <Button variant="outlined" color="primary" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Facility: {userData?.facilities[0]?.facilityName}
              </Typography>
              
            </>
          )}
        </Box> */}
        <DashboardPage/>
      </AuthenticatedLayout>
    </PrivateRoute>
  );
};

export default Dashboard;
