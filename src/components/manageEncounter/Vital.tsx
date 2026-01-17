import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Paper,
  Stack,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  Tooltip,
  FormControl,
  FormLabel,
  Alert,
} from '@mui/material';
import {
  Height,
  FitnessCenter,
  BloodtypeOutlined,
  Favorite,
  Thermostat,
} from '@mui/icons-material';
import { MedicalRecord } from './medical'; // Alias - verify in tsconfig.json

interface VitalProps {
  record: MedicalRecord;
}

interface VitalFormData {
  height: string;
  heightUnit: 'cm' | 'ft';
  weight: string;
  weightUnit: 'kg' | 'lb';
  bloodPressure: string;
  pulse: string;
  respiratoryRate: string;
  temperature: string;
  temperatureUnit: 'F' | 'C';
}

const VitalMetric: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}> = ({ icon, label, value, color = 'text.secondary' }) => (
  <Box display="flex" alignItems="center" gap={1} py={0.5}>
    <Box sx={{ color, display: 'flex', alignItems: 'center' }}>{icon}</Box>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 65 }}>
      {label}:
    </Typography>
    <Typography variant="body2" fontWeight={500} color="text.primary">
      {value}
    </Typography>
  </Box>
);

export const Vital: React.FC<VitalProps> = ({ record }) => {
  const [formData, setFormData] = useState<VitalFormData>({
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    bloodPressure: '',
    pulse: '',
    respiratoryRate: '',
    temperature: '',
    temperatureUnit: 'F',
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof VitalFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
    setError(null);
  };

  const handleUnitChange = (field: 'heightUnit' | 'weightUnit' | 'temperatureUnit') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.value as any });
  };

  const calculateBMI = () => {
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    if (!height || !weight) return '';
    const heightInMeters = formData.heightUnit === 'cm' ? height / 100 : height * 0.3048;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const handleAdd = () => {
    if (!formData.height || !formData.weight) {
      setError('Height and Weight are required fields.');
      return;
    }
    // Implement add logic (e.g., API call to save vital)
    console.log('Adding vital:', formData);
    setError(null);
  };

  const handleClear = () => {
    setFormData({
      height: '',
      heightUnit: 'cm',
      weight: '',
      weightUnit: 'kg',
      bloodPressure: '',
      pulse: '',
      respiratoryRate: '',
      temperature: '',
      temperatureUnit: 'F',
    });
    setError(null);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 3 },
        bgcolor: 'grey.50',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="main"
      aria-label="Vital Signs Dashboard"
    >
      {/* Header Section */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Vital Signs Overview
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Detailed view of patient&apos;s vital measurements for{' '}
          <b>{record.patientInfo.patientName}</b>
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} role="alert">
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* History Section */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              background:
                'linear-gradient(135deg, rgba(75,108,183,0.05) 0%, rgba(24,40,72,0.02) 100%)',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-3px)',
              },
            }}
            role="region"
            aria-label="Vital Signs History"
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  History
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, maxHeight: 420, overflowY: 'auto' }}>
              {record.vitals.length > 0 ? (
                record.vitals.map((vital, index) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(24,40,72,0.05)',
                    }}
                  >
                    <Stack spacing={0.5}>
                      <VitalMetric
                        icon={<Height fontSize="small" />}
                        label="Height"
                        value={vital.height}
                        color="success.main"
                      />
                      <VitalMetric
                        icon={<FitnessCenter fontSize="small" />}
                        label="Weight"
                        value={vital.weight}
                        color="success.main"
                      />
                      <VitalMetric
                        icon={<BloodtypeOutlined fontSize="small" />}
                        label="BP"
                        value={vital.bloodPressure}
                        color="success.main"
                      />
                      <VitalMetric
                        icon={<Favorite fontSize="small" />}
                        label="HR"
                        value={vital.heartRate}
                        color="success.main"
                      />
                      <VitalMetric
                        icon={<Thermostat fontSize="small" />}
                        label="Temp"
                        value={vital.temperature}
                        color="success.main"
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {vital.date} {vital.time}
                      </Typography>
                    </Stack>
                  </Paper>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2, textAlign: 'center' }}
                >
                  No vital signs recorded.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Measured Now Section */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              background:
                'linear-gradient(135deg, rgba(75,108,183,0.05) 0%, rgba(24,40,72,0.02) 100%)',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-3px)',
              },
            }}
            role="region"
            aria-label="Record New Vital Signs"
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Measured Now
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2 }}>
              <Stack spacing={1.5}>
                <Grid container spacing={1.5}>
                  {/* Height */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <FormLabel sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.9rem' }}>
                        * Height:
                      </FormLabel>
                      <RadioGroup
                        row
                        value={formData.heightUnit}
                        onChange={handleUnitChange('heightUnit')}
                        aria-label="Height unit selection"
                        sx={{ mb: 0.5 }}
                      >
                        <FormControlLabel
                          value="cm"
                          control={<Radio size="small" />}
                          label="cm"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                        />
                        <FormControlLabel
                          value="ft"
                          control={<Radio size="small" />}
                          label="ft"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                        />
                      </RadioGroup>
                      <TextField
                        size="small"
                        placeholder="Enter value"
                        value={formData.height}
                        onChange={handleInputChange('height')}
                        type="number"
                        inputProps={{ 'aria-label': 'Height value' }}
                        fullWidth
                        sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                      />
                    </FormControl>
                  </Grid>

                  {/* Weight */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <FormLabel sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.9rem' }}>
                        * Weight:
                      </FormLabel>
                      <RadioGroup
                        row
                        value={formData.weightUnit}
                        onChange={handleUnitChange('weightUnit')}
                        aria-label="Weight unit selection"
                        sx={{ mb: 0.5 }}
                      >
                        <FormControlLabel
                          value="kg"
                          control={<Radio size="small" />}
                          label="kg"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                        />
                        <FormControlLabel
                          value="lb"
                          control={<Radio size="small" />}
                          label="lb"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                        />
                      </RadioGroup>
                      <TextField
                        size="small"
                        placeholder="Enter value"
                        value={formData.weight}
                        onChange={handleInputChange('weight')}
                        type="number"
                        inputProps={{ 'aria-label': 'Weight value' }}
                        fullWidth
                        sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                      />
                    </FormControl>
                  </Grid>

                  {/* BMI */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <FormLabel sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.9rem' }}>
                        BMI:
                      </FormLabel>
                      <TextField
                        size="small"
                        value={calculateBMI()}
                        disabled
                        inputProps={{ 'aria-label': 'Calculated BMI' }}
                        fullWidth
                        sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                      />
                    </FormControl>
                  </Grid>

                  {/* Blood Pressure */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <FormLabel sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.9rem' }}>
                        BP:
                      </FormLabel>
                      <TextField
                        size="small"
                        placeholder="e.g., 120/80"
                        value={formData.bloodPressure}
                        onChange={handleInputChange('bloodPressure')}
                        inputProps={{ 'aria-label': 'Blood Pressure value' }}
                        fullWidth
                        sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                      />
                    </FormControl>
                  </Grid>

                  {/* Pulse */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <FormLabel sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.9rem' }}>
                        Pulse:
                      </FormLabel>
                      <TextField
                        size="small"
                        placeholder="Enter value"
                        value={formData.pulse}
                        onChange={handleInputChange('pulse')}
                        type="number"
                        inputProps={{ 'aria-label': 'Pulse value' }}
                        fullWidth
                        sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                      />
                    </FormControl>
                  </Grid>

                  {/* Respiratory Rate */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <FormLabel sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.9rem' }}>
                        RR:
                      </FormLabel>
                      <TextField
                        size="small"
                        placeholder="Enter value"
                        value={formData.respiratoryRate}
                        onChange={handleInputChange('respiratoryRate')}
                        type="number"
                        inputProps={{ 'aria-label': 'Respiratory Rate value' }}
                        fullWidth
                        sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                      />
                    </FormControl>
                  </Grid>

                  {/* Temperature */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <FormLabel sx={{ fontWeight: 500, mb: 0.5, fontSize: '0.9rem' }}>
                        Temperature:
                      </FormLabel>
                      <RadioGroup
                        row
                        value={formData.temperatureUnit}
                        onChange={handleUnitChange('temperatureUnit')}
                        aria-label="Temperature unit selection"
                        sx={{ mb: 0.5 }}
                      >
                        <FormControlLabel
                          value="F"
                          control={<Radio size="small" />}
                          label="°F"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                        />
                        <FormControlLabel
                          value="C"
                          control={<Radio size="small" />}
                          label="°C"
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.85rem' } }}
                        />
                      </RadioGroup>
                      <TextField
                        size="small"
                        placeholder="Enter value"
                        value={formData.temperature}
                        onChange={handleInputChange('temperature')}
                        type="number"
                        inputProps={{ 'aria-label': 'Temperature value' }}
                        fullWidth
                        sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1} justifyContent="flex-end" pt={1.5}>
                  <Tooltip title="Add vital measurement">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAdd}
                      aria-label="Add vital measurement"
                      size="small"
                    >
                      Add
                    </Button>
                  </Tooltip>
                  <Tooltip title="Clear form">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleClear}
                      aria-label="Clear form"
                      size="small"
                    >
                      Clear
                    </Button>
                  </Tooltip>
                  <Tooltip title="Finish and save">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAdd}
                      aria-label="Finish and save"
                      size="small"
                    >
                      Finish
                    </Button>
                  </Tooltip>
                  <Tooltip title="Cancel changes">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleClear}
                      aria-label="Cancel changes"
                      size="small"
                    >
                      Cancel
                    </Button>
                  </Tooltip>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};