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
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  IconButton,
  Paper,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { MedicalRecord } from './medical'; // Assuming same MedicalRecord type as in previous components

interface LabOrderProps {
  record: MedicalRecord;
}

interface LabOrderEntry {
  source: 'LOINC' | 'Other' | 'Local';
  orderName: string;
  schedule: 'Immediate' | string;
  scheduleDays?: string;
  cost?: string; // Only for Locally Examined
  id: string;
}

const LabOrder: React.FC<LabOrderProps> = ({ record }) => {
  const [tabValue, setTabValue] = useState(0); // Lab Order Advice active by default
  const [source, setSource] = useState<'LOINC' | 'Other'>('LOINC');
  const [orderName, setOrderName] = useState('');
  const [schedule, setSchedule] = useState<'Immediate' | string>('Immediate');
  const [scheduleDays, setScheduleDays] = useState('');
  const [cost, setCost] = useState(''); // Only for Locally Examined
  const [labOrders, setLabOrders] = useState<LabOrderEntry[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    handleClear(); // Reset form when switching tabs
  };

  const handleClear = () => {
    setSource('LOINC');
    setOrderName('');
    setSchedule('Immediate');
    setScheduleDays('');
    setCost('');
  };

  const handleAddLabOrder = () => {
    if (!orderName || (schedule !== 'Immediate' && !scheduleDays) || (tabValue === 1 && !cost)) {
      alert('Please fill in all required fields.');
      return;
    }

    const newEntry: LabOrderEntry = {
      source: tabValue === 0 ? source : 'Local',
      orderName,
      schedule: schedule === 'Immediate' ? 'Immediate' : `Within next ${scheduleDays} days`,
      scheduleDays: schedule !== 'Immediate' ? scheduleDays : undefined,
      cost: tabValue === 1 ? cost : undefined, // Only for Locally Examined
      id: `lab-order-${Date.now()}`,
    };

    setLabOrders([newEntry, ...labOrders]);
    handleClear();
  };

  const handleFinish = () => {
    console.log('Lab orders submitted:', labOrders);
    handleClear();
  };

  const handleCancel = () => {
    handleClear();
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 3 }, bgcolor: 'grey.50', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)', color: 'white' }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Lab Order
        </Typography>
        <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.9)">
          Manage lab orders for {record.patientInfo.patientName}
        </Typography>
      </Paper>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }} aria-label="Lab Order Tabs">
        <Tab label="Lab Order Advice" />
        <Tab label="Locally Examined" />
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
            aria-label={tabValue === 0 ? 'Lab Order Advice Form' : 'Locally Examined Form'}
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  {tabValue === 0 ? 'Add Lab Order (Advice)' : 'Add Local Lab Order'}
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              <Stack spacing={2}>
                {tabValue === 0 && (
                  <FormControl component="fieldset">
                    <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1 }}>
                      Lab Order Source
                    </Typography>
                    <RadioGroup
                      row
                      value={source}
                      onChange={(e) => setSource(e.target.value as 'LOINC' | 'Other')}
                    >
                      <FormControlLabel value="LOINC" control={<Radio />} label="From LOINC" />
                      <FormControlLabel value="Other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                )}

                <Typography variant="subtitle2" color="text.primary">
                  Order Name
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Search for Lab Order"
                    value={orderName}
                    onChange={(e) => setOrderName(e.target.value)}
                    placeholder={tabValue === 0 ? 'e.g., Complete Blood Count' : 'e.g., Local Blood Test'}
                    required
                    sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1, fontSize: '1rem' }} />,
                    }}
                  />
                  <Tooltip title="Search lab order">
                    <IconButton size="small">
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Typography variant="subtitle2" color="text.primary">
                  Schedule
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                  >
                    <FormControlLabel value="Immediate" control={<Radio />} label="Immediate" />
                    <FormControlLabel
                      value="Within next days"
                      control={<Radio />}
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography>Within next</Typography>
                          <TextField
                            size="small"
                            type="number"
                            value={scheduleDays}
                            onChange={(e) => setScheduleDays(e.target.value)}
                            placeholder="e.g., 5"
                            disabled={schedule === 'Immediate'}
                            sx={{ width: 80, '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                          />
                          <Typography>days</Typography>
                        </Stack>
                      }
                    />
                  </RadioGroup>
                </FormControl>

                {tabValue === 1 && (
                  <>
                    <Typography variant="subtitle2" color="text.primary">
                      Cost
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      label="Cost"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      placeholder="e.g., 1000 INR"
                      required
                      sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                    />
                  </>
                )}

                <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'flex-end' }}>
                  <Tooltip title="Add lab order">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddLabOrder}
                      size="small"
                      aria-label="Add lab order"
                    >
                      Add
                    </Button>
                  </Tooltip>
                  <Tooltip title="Clear the form">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleClear}
                      size="small"
                      aria-label="Clear the form"
                    >
                      Clear
                    </Button>
                  </Tooltip>
                  <Tooltip title="Finish and submit lab orders">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleFinish}
                      size="small"
                      aria-label="Finish and submit lab orders"
                    >
                      Finish
                    </Button>
                  </Tooltip>
                  <Tooltip title="Cancel and exit">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleCancel}
                      size="small"
                      aria-label="Cancel changes"
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

export default LabOrder;