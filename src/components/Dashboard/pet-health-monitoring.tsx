'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import {
  Syringe,
  Heart,
  Scale,
  Pill,
  Bell,
  CheckCircle,
  Calendar,
  TrendingDown,
  Plus,
} from 'lucide-react';

interface Vaccination {
  id: number;
  petName: string;
  ownerName: string;
  vaccine: string;
  dueDate: string;
  status: 'due' | 'upcoming' | 'scheduled';
  priority: 'high' | 'medium' | 'low';
}

interface HealthAlert {
  type: string;
  petName: string;
  severity: 'low' | 'moderate' | 'high';
  message: string;
}

interface HealthMetrics {
  metric: string;
  value: number;
  target: number;
  color: string;
}

interface Medication {
  petName: string;
  medication: string;
  dosage: string;
  frequency: string;
  remaining: number;
  total: number;
}

const upcomingVaccinations: Vaccination[] = [
  {
    id: 1,
    petName: 'Max',
    ownerName: 'John Smith',
    vaccine: 'Rabies',
    dueDate: '2025-01-20',
    status: 'due',
    priority: 'high',
  },
  {
    id: 2,
    petName: 'Luna',
    ownerName: 'Sarah Johnson',
    vaccine: 'DHPP',
    dueDate: '2025-01-25',
    status: 'upcoming',
    priority: 'medium',
  },
  {
    id: 3,
    petName: 'Charlie',
    ownerName: 'Mike Davis',
    vaccine: 'Bordetella',
    dueDate: '2025-02-01',
    status: 'scheduled',
    priority: 'low',
  },
];

const healthAlerts: HealthAlert[] = [
  {
    type: 'dehydration',
    petName: 'Bella',
    severity: 'moderate',
    message: 'Showing signs of mild dehydration - increased monitoring recommended',
  },
  {
    type: 'weight',
    petName: 'Rocky',
    severity: 'low',
    message: 'Weight gain detected - consider dietary adjustments',
  },
];

const healthMetrics: HealthMetrics[] = [
  { metric: 'Hydration', value: 72, target: 85, color: '#3b82f6' },
  { metric: 'Activity', value: 88, target: 90, color: '#10b981' },
  { metric: 'Appetite', value: 95, target: 90, color: '#f59e0b' },
  { metric: 'Sleep', value: 82, target: 85, color: '#8b5cf6' },
];

const medicationSchedule: Medication[] = [
  {
    petName: 'Max',
    medication: 'Antibiotics',
    dosage: '250mg',
    frequency: 'Twice daily',
    remaining: 8,
    total: 14,
  },
  {
    petName: 'Luna',
    medication: 'Pain Relief',
    dosage: '50mg',
    frequency: 'Once daily',
    remaining: 3,
    total: 7,
  },
];

export function PetHealthMonitoring() {
  const [activeTab, setActiveTab] = useState(0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'moderate':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Heart size={20} color="#ef4444" style={{ marginRight: 8 }} />
            <Typography variant="h6" fontWeight="bold">
              Vaccination, event
            </Typography>
          </Box>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            Track vaccinations, health metrics, and medication schedules
          </Typography>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Vaccinations" />
          <Tab label="Health Alerts" />
          <Tab label="Weight Track" />
          <Tab label="Medication" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Upcoming Vaccinations
              </Typography>
              <Button variant="contained" size="small" startIcon={<Calendar size={16} />}>
                Schedule
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {upcomingVaccinations.map((vaccination) => (
                <Paper
                  key={vaccination.id}
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Syringe size={20} color={getPriorityColor(vaccination.priority) === 'error' ? '#ef4444' : getPriorityColor(vaccination.priority) === 'warning' ? '#f59e0b' : '#10b981'} />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {vaccination.petName} - {vaccination.ownerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vaccination.vaccine} • Due: {vaccination.dueDate}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={vaccination.status}
                      color={
                        vaccination.status === 'due'
                          ? 'error'
                          : vaccination.status === 'upcoming'
                          ? 'primary'
                          : 'default'
                      }
                      size="small"
                    />
                    <Button variant="outlined" size="small" startIcon={<Bell size={12} />}>
                      Remind
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
              Health Metrics Dashboard
            </Typography>

            {/* Health Alerts */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
                Health Alerts
              </Typography>
              {healthAlerts.map((alert, index) => (
                <Alert key={index} severity={getSeverityColor(alert.severity)} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body2">
                      <strong>{alert.petName}</strong> - {alert.message}
                    </Typography>
                    <Chip label={alert.severity} variant="outlined" size="small" />
                  </Box>
                </Alert>
              ))}
            </Box>

            <Grid container spacing={2}>
              {healthMetrics.map((metric, index) => (
                <Grid item xs={6} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {metric.metric}
                      </Typography>
                      {metric.value >= metric.target ? (
                        <CheckCircle size={16} color="#10b981" />
                      ) : (
                        <TrendingDown size={16} color="#f59e0b" />
                      )}
                    </Box>
                    <LinearProgress variant="determinate" value={metric.value} sx={{ mb: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      {metric.value}% - Target: {metric.target}%
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Scale size={20} style={{ marginRight: 8 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Weight Tracking Analysis
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold">
                    27.8kg
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Current Weight
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" color="error.main34">
                    +1.8kg
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Above Target
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold">
                    25-27kg
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Healthy Range
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Pill size={20} style={{ marginRight: 8 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Medication Schedule
                </Typography>
              </Box>
              <Button variant="contained" size="small" startIcon={<Plus size={16} />}>
                Add Medication
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {medicationSchedule.map((medication, index) => (
                <Paper key={index} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {medication.petName} - {medication.medication}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {medication.dosage} • {medication.frequency}
                      </Typography>
                    </Box>
                    <Chip label={`${medication.remaining} days left`} variant="outlined" size="small" />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2">
                        {medication.total - medication.remaining}/{medication.total} days
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={((medication.total - medication.remaining) / medication.total) * 100}
                    />
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}