import React from 'react';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Avatar,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  MonitorHeart,
  Feedback,
  LocalHospital,
  Medication,
  Science,
  Assignment,
  AccessTime,
  CalendarToday,
  Height,
  FitnessCenter,
  Favorite,
  Thermostat,
  BloodtypeOutlined,
  Save,
  Cancel
} from '@mui/icons-material';
import { MedicalRecord } from './medical';

interface PatientHistorySectionProps {
  record: MedicalRecord;
}

interface MedicalCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
}

const MedicalCard: React.FC<MedicalCardProps> = ({ title, icon, children, color }) => (
  <Card 
    elevation={2}
    sx={{ 
      height: 320,
      background: `linear-gradient(135deg, ${getGradientColors(color)})`,
      '&:hover': {
        elevation: 4,
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease-in-out'
      }
    }}
  >
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: `${color}.main`, color: 'white' }}>
          {icon}
        </Avatar>
      }
      title={
        <Typography variant="h6" fontWeight="600" color="text.primary">
          {title}
        </Typography>
      }
      sx={{ pb: 1 }}
    />
    <CardContent sx={{ pt: 0, height: 240, overflow: 'auto' }}>
      {children}
    </CardContent>
  </Card>
);

const getGradientColors = (color: string) => {
  const gradients = {
    primary: 'rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%',
    secondary: 'rgba(156, 39, 176, 0.05) 0%, rgba(156, 39, 176, 0.02) 100%',
    success: 'rgba(46, 125, 50, 0.05) 0%, rgba(46, 125, 50, 0.02) 100%',
    warning: 'rgba(237, 108, 2, 0.05) 0%, rgba(237, 108, 2, 0.02) 100%',
    info: 'rgba(2, 136, 209, 0.05) 0%, rgba(2, 136, 209, 0.02) 100%',
    error: 'rgba(211, 47, 47, 0.05) 0%, rgba(211, 47, 47, 0.02) 100%'
  };
  return gradients[color as keyof typeof gradients] || gradients.primary;
};

const VitalMetric: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  color?: string 
}> = ({ icon, label, value, color = 'text.secondary' }) => (
  <Box display="flex" alignItems="center" gap={1} py={0.5}>
    <Box sx={{ color, minWidth: 20 }}>{icon}</Box>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
      {label}:
    </Typography>
    <Typography variant="body2" fontWeight="500" color="text.primary">
      {value}
    </Typography>
  </Box>
);

const TimeStampChip: React.FC<{ date: string; time?: string }> = ({ date, time }) => (
  <Stack direction="row" spacing={1} mb={1}>
    <Chip
      icon={<CalendarToday sx={{ fontSize: 14 }} />}
      label={date}
      size="small"
      variant="outlined"
      sx={{ fontSize: '0.75rem', height: 24 }}
    />
    {time && (
      <Chip
        icon={<AccessTime sx={{ fontSize: 14 }} />}
        label={time}
        size="small"
        variant="outlined"
        sx={{ fontSize: '0.75rem', height: 24 }}
      />
    )}
  </Stack>
);

export const PatientHistorySection: React.FC<PatientHistorySectionProps> = ({ record }) => {
  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Paper elevation={1} sx={{ p: 3, mb: 3,     background: 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)',
          color: 'white', }}>
        <Typography variant="h4" fontWeight="700" color="white" gutterBottom>
          Patient Medical History
        </Typography>
        <Typography variant="subtitle1" color="rgba(255,255,255,0.9)">
          Comprehensive overview of patient's medical records and treatment history
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <MedicalCard title="Vital Signs" icon={<MonitorHeart />} color="success">
            {record.vitals.map((vital, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'rgba(46, 125, 50, 0.02)' }}>
                <TimeStampChip date={vital.date} time={vital.time} />
                <Stack spacing={0.5}>
                  <VitalMetric icon={<Height sx={{ fontSize: 16 }} />} label="Height" value={vital.height} color="success.main" />
                  <VitalMetric icon={<FitnessCenter sx={{ fontSize: 16 }} />} label="Weight" value={vital.weight} color="success.main" />
                  <VitalMetric icon={<BloodtypeOutlined sx={{ fontSize: 16 }} />} label="BP" value={vital.bloodPressure} color="success.main" />
                  <VitalMetric icon={<Favorite sx={{ fontSize: 16 }} />} label="HR" value={vital.heartRate} color="success.main" />
                  <VitalMetric icon={<Thermostat sx={{ fontSize: 16 }} />} label="Temp" value={vital.temperature} color="success.main" />
                </Stack>
              </Paper>
            ))}
          </MedicalCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <MedicalCard title="Patient Complaints" icon={<Feedback />} color="warning">
            {record.complaints.map((complaint, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'rgba(237, 108, 2, 0.02)' }}>
                <TimeStampChip date={complaint.date} time={complaint.time} />
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <Feedback sx={{ fontSize: 18, color: 'warning.main', mt: 0.5 }} />
                  <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                    {complaint.description}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </MedicalCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <MedicalCard title="Medical Diagnosis" icon={<LocalHospital />} color="primary">
            {record.diagnoses.map((diagnosis, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'rgba(25, 118, 210, 0.02)' }}>
                <TimeStampChip date={diagnosis.date} />
                <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
                  <LocalHospital sx={{ fontSize: 18, color: 'primary.main', mt: 0.5 }} />
                  <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                    {diagnosis.description}
                  </Typography>
                </Box>
                {diagnosis.icdCode && (
                  <Box ml={3}>
                    <Chip
                      label={diagnosis.icdCode}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}
                    />
                  </Box>
                )}
              </Paper>
            ))}
          </MedicalCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <MedicalCard title="Prescribed Medications" icon={<Medication />} color="secondary">
            {record.medicines.map((medicine, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'rgba(156, 39, 176, 0.02)' }}>
                <Stack direction="row" spacing={1} mb={1}>
                  <Chip
                    icon={<CalendarToday sx={{ fontSize: 14 }} />}
                    label={`${medicine.dateFrom} → ${medicine.dateTo}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Stack>
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <Medication sx={{ fontSize: 18, color: 'secondary.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="600" color="text.primary">
                      {medicine.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {medicine.dosage}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </MedicalCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <MedicalCard title="Laboratory Orders" icon={<Science />} color="info">
            {record.labOrders.map((labOrder, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'rgba(2, 136, 209, 0.02)' }}>
                <TimeStampChip date={labOrder.date} time={labOrder.time} />
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <Science sx={{ fontSize: 18, color: 'info.main', mt: 0.5 }} />
                  <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                    {labOrder.testName}
                  </Typography>
                </Box>
                {labOrder.status && (
                  <Box mt={1} ml={3}>
                    <Chip
                      label={labOrder.status}
                      size="small"
                      color="info"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </Box>
                )}
              </Paper>
            ))}
          </MedicalCard>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <MedicalCard title="Procedure Recommendations" icon={<Assignment />} color="error">
            {record.procedureAdvices.map((procedure, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'rgba(211, 47, 47, 0.02)' }}>
                <TimeStampChip date={procedure.date} />
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <Assignment sx={{ fontSize: 18, color: 'error.main', mt: 0.5 }} />
                  <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                    {procedure.description}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </MedicalCard>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
      <Tooltip title="Save current progress as draft">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          
        >
          Save
        </Button>
      </Tooltip>

      <Tooltip title="Cancel current encounter">
        <Button
          variant="contained"
          color="error"
          startIcon={<Cancel />}
         
        >
          Cancel
        </Button>
      </Tooltip>
    </Stack>
    </Box>
  );
};