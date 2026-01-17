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
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { MedicalRecord } from './medical'; // Assuming same MedicalRecord type as in Allergy.tsx and PharmacyOrder.tsx

interface ProcedureOrderProps {
  record: MedicalRecord;
}

interface ProcedureEntry {
  source: 'ICD10' | 'Other' | 'Local';
  procedureName: string;
  cost?: string; // Only for Local Procedures
  schedule: 'Immediate' | string; // 'Immediate' or 'Within next X days'
  scheduleDays?: string; // Number of days for non-immediate schedule
  type: 'Invasive' | 'Non-invasive';
  purpose: 'Diagnostic' | 'Treatment';
  id: string;
}

const ProcedureOrder: React.FC<ProcedureOrderProps> = ({ record }) => {
  const [tabValue, setTabValue] = useState(0);
  const [procedureSource, setProcedureSource] = useState<'ICD10' | 'Other'>('ICD10');
  const [procedureName, setProcedureName] = useState('');
  const [cost, setCost] = useState(''); // Only for Local Procedures
  const [schedule, setSchedule] = useState<'Immediate' | string>('Immediate');
  const [scheduleDays, setScheduleDays] = useState('');
  const [procedureType, setProcedureType] = useState<'Invasive' | 'Non-invasive'>('Invasive');
  const [purpose, setPurpose] = useState<'Diagnostic' | 'Treatment'>('Diagnostic');
  const [procedureEntries, setProcedureEntries] = useState<ProcedureEntry[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    handleClear(); // Reset form when switching tabs
  };

  const handleClear = () => {
    setProcedureSource('ICD10');
    setProcedureName('');
    setCost('');
    setSchedule('Immediate');
    setScheduleDays('');
    setProcedureType('Invasive');
    setPurpose('Diagnostic');
  };

  const handleAddProcedure = () => {
    if (!procedureName || (schedule !== 'Immediate' && !scheduleDays) || (tabValue === 1 && !cost)) {
      alert('Please fill in all required fields.');
      return;
    }

    const newEntry: ProcedureEntry = {
      source: tabValue === 0 ? procedureSource : 'Local', // Local Procedures don't use source
      procedureName,
      cost: tabValue === 1 ? cost : undefined, // Only for Local Procedures
      schedule: schedule === 'Immediate' ? 'Immediate' : `Within next ${scheduleDays} days`,
      scheduleDays: schedule !== 'Immediate' ? scheduleDays : undefined,
      type: procedureType,
      purpose,
      id: `procedure-${Date.now()}`,
    };

    setProcedureEntries([newEntry, ...procedureEntries]);
    handleClear();
  };

  const handleCancel = () => {
    handleClear();
  };

  const handleFinish = () => {
    console.log('Procedure entries submitted:', procedureEntries);
    handleClear();
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 3 }, bgcolor: 'grey.50', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)', color: 'white' }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Procedure Order
        </Typography>
        <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.9)">
          Manage procedure orders for {record.patientInfo.patientName}
        </Typography>
      </Paper>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }} aria-label="Procedure Order Tabs">
        <Tab label="Procedures Advice" />
        <Tab label="Local Procedures" />
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
            aria-label={tabValue === 0 ? 'Procedures Advice Form' : 'Local Procedures Form'}
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  {tabValue === 0 ? 'Add Procedure (Procedures Advice)' : 'Add Local Procedure'}
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              <Stack spacing={2}>
                {tabValue === 0 && (
                  <FormControl component="fieldset">
                    <Typography variant="subtitle2" color="text.primary" sx={{ mb: 1 }}>
                      Procedure Source
                    </Typography>
                    <RadioGroup
                      row
                      value={procedureSource}
                      onChange={(e) => setProcedureSource(e.target.value as 'ICD10' | 'Other')}
                    >
                      <FormControlLabel value="ICD10" control={<Radio />} label="From ICD10" />
                      <FormControlLabel value="Other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                )}

                <Typography variant="subtitle2" color="text.primary">
                  Search
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Procedure Name"
                    value={procedureName}
                    onChange={(e) => setProcedureName(e.target.value)}
                    placeholder={tabValue === 0 ? 'e.g., Appendectomy' : 'e.g., Dressing Change'}
                    required
                    sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                  />
                  <Tooltip title="Search procedure">
                    <IconButton size="small">
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear procedure name">
                    <IconButton size="small" onClick={() => setProcedureName('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {tabValue === 1 && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="e.g., 1500 INR"
                    required
                    sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                  />
                )}

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

                <Typography variant="subtitle2" color="text.primary">
                  Type
                </Typography>
                <RadioGroup
                  row
                  value={procedureType}
                  onChange={(e) => setProcedureType(e.target.value as 'Invasive' | 'Non-invasive')}
                >
                  <FormControlLabel value="Invasive" control={<Radio />} label="Invasive" />
                  <FormControlLabel value="Non-invasive" control={<Radio />} label="Non-invasive" />
                </RadioGroup>

                <Typography variant="subtitle2" color="text.primary">
                  Purpose
                </Typography>
                <RadioGroup
                  row
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as 'Diagnostic' | 'Treatment')}
                >
                  <FormControlLabel value="Diagnostic" control={<Radio />} label="Diagnostic" />
                  <FormControlLabel value="Treatment" control={<Radio />} label="Treatment" />
                </RadioGroup>

                <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'flex-end' }}>
                  <Tooltip title="Add procedure">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddProcedure}
                      size="small"
                      aria-label="Add procedure"
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
                  <Tooltip title="Finish and submit">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleFinish}
                      size="small"
                      aria-label="Finish and submit"
                    >
                      Finish
                    </Button>
                  </Tooltip>
                  <Tooltip title="Cancel changes">
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

export default ProcedureOrder;