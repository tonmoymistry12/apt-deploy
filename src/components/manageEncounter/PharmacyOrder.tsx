import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
  IconButton,
  Stack,
  Tooltip,
  Paper,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MedicalRecord } from './medical'; // Assuming same MedicalRecord type as in Allergy.tsx

interface PharmacyOrderProps {
  record: MedicalRecord;
}

interface MedicineEntry {
  source: 'TrueMD' | 'Other';
  medicineName: string;
  genericName: string;
  brandName: string;
  duration: string;
  startDate: Date | null;
  stopDate: Date | null;
  frequency: string;
  notes: string;
  dispensedQuantity?: string; // Only for Dispensed Locally
  id: string;
}

const PharmacyOrder: React.FC<PharmacyOrderProps> = ({ record }) => {
  const [tabValue, setTabValue] = useState(0);
  const [medicineSource, setMedicineSource] = useState<'TrueMD' | 'Other'>('TrueMD');
  const [medicineName, setMedicineName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [stopDate, setStopDate] = useState<Date | null>(null);
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [dispensedQuantity, setDispensedQuantity] = useState(''); // Only for Dispensed Locally
  const [medicineEntries, setMedicineEntries] = useState<MedicineEntry[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    handleClear(); // Reset form when switching tabs
  };

  const handleClear = () => {
    setMedicineSource('TrueMD');
    setMedicineName('');
    setGenericName('');
    setBrandName('');
    setDuration('');
    setStartDate(null);
    setStopDate(null);
    setFrequency('');
    setNotes('');
    setDispensedQuantity('');
  };

  const handleAddMedicine = () => {
    if (!medicineName || !genericName || !brandName || !duration || !startDate || !stopDate || !frequency) {
      alert('Please fill in all required fields.');
      return;
    }

    const newEntry: MedicineEntry = {
      source: medicineSource,
      medicineName,
      genericName,
      brandName,
      duration,
      startDate,
      stopDate,
      frequency,
      notes,
      dispensedQuantity: tabValue === 1 ? dispensedQuantity : undefined, // Only for Dispensed Locally
      id: `medicine-${Date.now()}`,
    };

    setMedicineEntries([newEntry, ...medicineEntries]);
    handleClear();
  };

  const handleCancel = () => {
    handleClear();
  };

  const handleFinish = () => {
    console.log('Medicine entries submitted:', medicineEntries);
    handleClear();
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 3 }, bgcolor: 'grey.50', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)', color: 'white' }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Pharmacy Order
        </Typography>
        <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.9)">
          Manage pharmacy orders for {record.patientInfo.patientName}
        </Typography>
      </Paper>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }} aria-label="Pharmacy Order Tabs">
        <Tab label="Pharmacy Advice" />
        <Tab label="Dispensed Locally" />
      </Tabs>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card
            elevation={2}
            sx={{
              background: 'linear-gradient(135deg, rgba(75, 108, 183, 0.05) 0%, rgba(24, 40, 72, 0.02) 100%)',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease-in-out',
              },
            }}
            role="region"
            aria-label={tabValue === 0 ? 'Pharmacy Advice Form' : 'Dispensed Locally Form'}
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  {tabValue === 0 ? 'Add Medicine (Pharmacy Advice)' : 'Add Local Medicine (Dispensed Locally)'}
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              <Stack spacing={2}>
                {tabValue === 0 && (
                  <FormControl component="fieldset">
                    <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1 }}>
                      Medicine Source
                    </Typography>
                    <RadioGroup row value={medicineSource} onChange={(e) => setMedicineSource(e.target.value as 'TrueMD' | 'Other')}>
                      <FormControlLabel value="TrueMD" control={<Radio />} label="From TrueMD" />
                      <FormControlLabel value="Other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                )}

                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Medicine Name"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder={tabValue === 0 ? 'Enter medicine name' : 'Enter local medicine name'}
                  required
                  sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                />

                <Typography variant="subtitle2" color="text.primary">
                  Medicine Details
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Generic Name"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    placeholder="e.g., Paracetamol"
                    required
                    sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                  />
                  <Tooltip title="Search generic name">
                    <IconButton size="small">
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear generic name">
                    <IconButton size="small" onClick={() => setGenericName('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Brand Name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., Crocin"
                    required
                    sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                  />
                  <Tooltip title="Search brand name">
                    <IconButton size="small">
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear brand name">
                    <IconButton size="small" onClick={() => setBrandName('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack direction="row" spacing={2}>
                    <DesktopDatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          required: true,
                          sx: { '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } },
                        },
                      }}
                    />
                    <DesktopDatePicker
                      label="Stop Date"
                      value={stopDate}
                      onChange={(newValue) => setStopDate(newValue)}
                      slotProps={{
                        textField: {
                          size: 'small',
                          required: true,
                          sx: { '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } },
                        },
                      }}
                    />
                  </Stack>
                </LocalizationProvider>

                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 5 days"
                  required
                  sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                />

                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.9rem' }}>Frequency</InputLabel>
                  <Select
                    value={frequency}
                    label="Frequency"
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                    sx={{ '& .MuiSelect-select': { py: 0.75, fontSize: '0.9rem' } }}
                  >
                    <MenuItem value="Once daily">Once daily</MenuItem>
                    <MenuItem value="Twice daily">Twice daily</MenuItem>
                    <MenuItem value="Thrice daily">Thrice daily</MenuItem>
                    {tabValue === 0 ? (
                      <>
                        <MenuItem value="Every 6 hours">Every 6 hours</MenuItem>
                        <MenuItem value="Custom">Custom</MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem value="Every 8 hours">Every 8 hours</MenuItem>
                        <MenuItem value="Custom">Custom</MenuItem>
                      </>
                    )}
                  </Select>
                </FormControl>

                {tabValue === 1 && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Dispensed Quantity"
                    value={dispensedQuantity}
                    onChange={(e) => setDispensedQuantity(e.target.value)}
                    placeholder="e.g., 10 tablets"
                    required
                    sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                  />
                )}

                <Typography variant="subtitle2" color="text.primary">
                  Notes / Instructions
                </Typography>
                <TextareaAutosize
                  minRows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={tabValue === 0 ? 'Enter dosage instructions, e.g., take after meals' : 'Enter additional details, e.g., substitution allowed, instructions'}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '0.9rem',
                    borderRadius: '4px',
                    borderColor: '#c4c4c4',
                    resize: 'vertical',
                  }}
                />

                <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'flex-end' }}>
                  <Tooltip title="Add medicine">
                    <Button variant="contained" color="primary" onClick={handleAddMedicine} size="small" aria-label="Add medicine">
                      Add
                    </Button>
                  </Tooltip>
                  <Tooltip title="Clear the form">
                    <Button variant="contained" color="secondary" onClick={handleClear} size="small" aria-label="Clear the form">
                      Clear
                    </Button>
                  </Tooltip>
                  <Tooltip title="Finish and submit">
                    <Button variant="contained" color="success" onClick={handleFinish} size="small" aria-label="Finish and submit">
                      Finish
                    </Button>
                  </Tooltip>
                  <Tooltip title="Cancel changes">
                    <Button variant="contained" color="error" onClick={handleCancel} size="small" aria-label="Cancel changes">
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

export default PharmacyOrder;