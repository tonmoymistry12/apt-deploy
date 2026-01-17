
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
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  Alert,
  CircularProgress,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import {
  CalendarToday,
  Person,
  LocalHospital,
  Save,
  Send,
  Cancel,
  Warning,
  CheckCircle,
  AccessTime,
  Badge,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';

// Define interfaces for type safety
interface PatientInfo {
  patientName?: string;
  patientId?: string;
  age?: number;
  gender?: string;
}

interface VisitInfo {
  doctorName?: string;
  department?: string;
}

interface MedicalRecord {
  patientInfo: PatientInfo;
  visitInfo?: VisitInfo;
}

interface DiagnosisFormData {
  diagnosisType: 'Initial Diagnosis' | 'Follow-up Diagnosis' | 'Emergency Diagnosis';
  diagnosisName: 'J45 - Asthma' | 'I10 - Hypertension' | 'Other';
  otherDiagnosis: string;
  diagnosisCode: string;
  onsetDate: string;
  symptoms: string;
  notes: string;
  date: string;
  time: string;
}

interface DiagnosisProps {
  record: MedicalRecord;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
  },
}));

const GradientPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 20,
  padding: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    pointerEvents: 'none',
  },
}));

const StyledTextField= styled(TextField)(( theme :any) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.12)',
      borderWidth: 1,
    },
    '&:hover fieldset': {
      borderColor: '#1976d2',
      borderWidth: 2,
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      borderWidth: 2,
      boxShadow: `0 0 0 3px ${('#1976d2')}20`,
    },
    '&.Mui-error fieldset': {
      borderColor:  '#d32f2f',
      backgroundColor: 'rgba(244, 67, 54, 0.04)',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    '&.Mui-focused': {
      color:  '#1976d2',
    },
  },
}));

const StyledSelect = styled(Select)(( { theme }) => ({
  borderRadius: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor:  '#1976d2',
    borderWidth: 2,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor:  '#1976d2',
    borderWidth: 2,
    boxShadow: `0 0 0 3px '#1976d2' 20`,
  },
}));

const ActionButton = styled(Button)(({}) => ({
  borderRadius: 12,
  //padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
}));

const PrimaryButton = styled(ActionButton)(( theme :any) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${(theme.palette.primary?.main || '#1976d2')}40`,
  },
  '&:disabled': {
    background: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0, 0, 0, 0.26)',
  },
}));

const SecondaryButton = styled(ActionButton)(( theme :any) => ({
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #3d8bfe 0%, #00d4fe 100%)',
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${(theme.palette.primary?.main || '#1976d2')}40`,
  },
}));

const OutlinedButton = styled(ActionButton)(({ theme }) => ({
  border: `2px solid ${theme.palette.grey?.[300] || '#e0e0e0'}`,
  color: theme.palette.grey?.[700] || '#616161',
  backgroundColor: 'white',
  '&:hover': {
    borderColor: theme.palette.grey?.[400] || '#bdbdbd',
    backgroundColor: theme.palette.grey?.[50] || '#fafafa',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  },
}));

const Diagnosis: React.FC<DiagnosisProps> = ({ record }) => {
  const today = new Date();
  const [formData, setFormData] = useState<DiagnosisFormData>({
    diagnosisType: 'Initial Diagnosis',
    diagnosisName: 'J45 - Asthma',
    otherDiagnosis: '',
    diagnosisCode: 'J45.9',
    onsetDate: format(today, 'yyyy-MM-dd'),
    symptoms: '',
    notes: '',
    date: format(today, 'dd/MM/yyyy'),
    time: format(today, 'HH:mm'),
  });
  const [diagnoses, setDiagnoses] = useState<DiagnosisFormData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: keyof DiagnosisFormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'diagnosisName') {
        if (value === 'J45 - Asthma') newData.diagnosisCode = 'J45.9';
        else if (value === 'I10 - Hypertension') newData.diagnosisCode = 'I10';
        else newData.diagnosisCode = '';
      }
      return newData;
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.diagnosisCode.trim()) {
      newErrors.diagnosisCode = 'Diagnosis code is required';
    } else if (!/^[A-Z][0-9]{1,2}(?:\.[0-9])?$/.test(formData.diagnosisCode)) {
      newErrors.diagnosisCode = 'Invalid ICD-10 code format (e.g., J45.9)';
    }
    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Symptoms description is required';
    }
    if (!formData.onsetDate.trim()) {
      newErrors.onsetDate = 'Onset date is required';
    } else if (new Date(formData.onsetDate) > today) {
      newErrors.onsetDate = 'Onset date cannot be in the future';
    }
    if (formData.diagnosisName === 'Other' && !formData.otherDiagnosis.trim()) {
      newErrors.otherDiagnosis = 'Please specify the diagnosis';
    }
    const diagnosisKey = formData.diagnosisName === 'Other' ? formData.otherDiagnosis : formData.diagnosisName;
    if (diagnoses.some(d => (d.diagnosisName === 'Other' ? d.otherDiagnosis : d.diagnosisName) === diagnosisKey)) {
      newErrors.diagnosisName = 'This diagnosis already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDiagnoses(prev => [...prev, formData]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      handleCancel();
    } catch (error) {
      console.error('Error submitting diagnosis:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('diagnosisDraft', JSON.stringify(formData));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      diagnosisType: 'Initial Diagnosis',
      diagnosisName: 'J45 - Asthma',
      otherDiagnosis: '',
      diagnosisCode: 'J45.9',
      onsetDate: format(today, 'yyyy-MM-dd'),
      symptoms: '',
      notes: '',
      date: format(today, 'dd/MM/yyyy'),
      time: format(today, 'HH:mm'),
    });
    setErrors({});
  };

  const getDiagnosisTypeColor = (type: DiagnosisFormData['diagnosisType']): 'primary' | 'info' | 'error' | 'default' => {
    switch (type) {
      case 'Initial Diagnosis': return 'primary';
      case 'Follow-up Diagnosis': return 'info';
      case 'Emergency Diagnosis': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4,
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Header */}
      <GradientPaper elevation={0} sx={{ mb: 4, position: 'relative' }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <LocalHospital sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight="700" sx={{ mb: 0.5 }}>
                Medical Diagnosis
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Comprehensive diagnosis for {record.patientInfo.patientName ?? 'Unknown Patient'}
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Person sx={{ fontSize: 20, opacity: 0.8 }} />
              <Typography variant="body2">ID: {record.patientInfo.patientId ?? 'N/A'}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTime sx={{ fontSize: 20, opacity: 0.8 }} />
              <Typography variant="body2">{formData.date} at {formData.time}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Badge sx={{ fontSize: 20, opacity: 0.8 }} />
              <Typography variant="body2">{record.visitInfo?.department ?? 'Unknown Department'}</Typography>
            </Stack>
          </Stack>
        </Box>
      </GradientPaper>

      {/* Success Alert */}
      {showSuccess && (
        <Alert 
          severity="success" 
          icon={<CheckCircle />}
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-message': { fontWeight: 500 }
          }}
        >
          {isSubmitting ? 'Submitting diagnosis...' : 'Diagnosis saved successfully!'}
        </Alert>
      )}

      {/* Main Content */}
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Left Column - Diagnosis Information */}
        <Grid item xs={12} lg={6}>
          <StyledCard>
            <CardHeader
              avatar={
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}>
                  <Warning sx={{ fontSize: 24 }} />
                </Box>
              }
              title={
                <Typography variant="h5" fontWeight="600" color="text.primary">
                  Diagnosis Information
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Primary diagnosis details and classification
                </Typography>
              }
            />
            <CardContent sx={{ pt: 1 }}>
              <Stack spacing={3}>
                {/* Diagnosis Type */}
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 500 }}>Diagnosis Type *</InputLabel>
                  <StyledSelect
                    value={formData.diagnosisType}
                    label="Diagnosis Type *"
                     onChange={(event)=>(handleChange('diagnosisType', event.target.value as string))}
                   /*  onChange={(event: SelectChangeEvent<string>) => handleChange('diagnosisType', event.target.value as string)} */
                    inputProps={{ 'aria-label': 'Diagnosis Type' }}
                  >
                    <MenuItem value="Initial Diagnosis">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip label="Initial" color="primary" size="small" />
                        <span>Initial Diagnosis</span>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="Follow-up Diagnosis">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip label="Follow-up" color="info" size="small" />
                        <span>Follow-up Diagnosis</span>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="Emergency Diagnosis">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip label="Emergency" color="error" size="small" />
                        <span>Emergency Diagnosis</span>
                      </Stack>
                    </MenuItem>
                  </StyledSelect>
                </FormControl>

                {/* Current Type Display */}
                <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(102, 126, 234, 0.08)' }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Chip 
                      label={formData.diagnosisType} 
                      color={getDiagnosisTypeColor(formData.diagnosisType)}
                      variant="filled"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Current diagnosis classification
                    </Typography>
                  </Stack>
                </Box>

                {/* Diagnosis Name */}
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                    Diagnosis Name *
                  </FormLabel>
                  <RadioGroup
                    value={formData.diagnosisName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('diagnosisName', e.target.value)}
                    aria-label="Diagnosis Name"
                  >
                    <FormControlLabel 
                      value="J45 - Asthma" 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={500}>J45 - Asthma</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Bronchial asthma, unspecified
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel 
                      value="I10 - Hypertension" 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={500}>I10 - Hypertension</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Essential hypertension
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel 
                      value="Other" 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={500}>Other</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Custom diagnosis specification
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>

                {/* Other Diagnosis Input */}
                {formData.diagnosisName === 'Other' && (
                  <StyledTextField
                    fullWidth
                    label="Other Diagnosis *"
                    value={formData.otherDiagnosis}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('otherDiagnosis', e.target.value)}
                    placeholder="Enter custom diagnosis"
                    error={!!errors.otherDiagnosis}
                    helperText={errors.otherDiagnosis}
                    inputProps={{ 'aria-label': 'Custom Diagnosis' }}
                  />
                )}

                {/* Diagnosis Code */}
                <StyledTextField
                  fullWidth
                  label="Diagnosis Code *"
                  value={formData.diagnosisCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('diagnosisCode', e.target.value)}
                  placeholder="Enter ICD-10 code (e.g., J45.9)"
                  error={!!errors.diagnosisCode}
                  helperText={errors.diagnosisCode || "International Classification of Diseases code"}
                  disabled={formData.diagnosisName !== 'Other'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="caption" sx={{ 
                          backgroundColor:  '#1976d2', 
                          color: 'white', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1,
                          fontWeight: 600
                        }}>
                          ICD-10
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ 'aria-label': 'Diagnosis Code' }}
                />
              </Stack>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Right Column - Clinical Details */}
        <Grid item xs={12} lg={6}>
          <StyledCard>
            <CardHeader
              avatar={
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white'
                }}>
                  <CalendarToday sx={{ fontSize: 24 }} />
                </Box>
              }
              title={
                <Typography variant="h5" fontWeight="600" color="text.primary">
                  Clinical Details
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Symptoms, notes, and timeline information
                </Typography>
              }
            />
            <CardContent sx={{ pt: 1 }}>
              <Stack spacing={3}>
                {/* Symptoms */}
                <StyledTextField
                  fullWidth
                  label="Symptoms *"
                  value={formData.symptoms}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange('symptoms', e.target.value)}
                  placeholder="Describe patient symptoms in detail..."
                  multiline
                  rows={4}
                  error={!!errors.symptoms}
                  helperText={errors.symptoms || "Detailed description of observed symptoms"}
                  inputProps={{ 'aria-label': 'Symptoms' }}
                />

                {/* Clinical Notes */}
                <StyledTextField
                  fullWidth
                  label="Clinical Notes"
                  value={formData.notes}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange('notes', e.target.value)}
                  placeholder="Additional observations, treatment plans, or notes..."
                  multiline
                  rows={4}
                  helperText="Optional additional clinical observations"
                  inputProps={{ 'aria-label': 'Clinical Notes' }}
                />

                {/* Onset Date */}
                <StyledTextField
                  fullWidth
                  label="Onset Date *"
                  type="date"
                  value={formData.onsetDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('onsetDate', e.target.value)}
                  error={!!errors.onsetDate}
                  helperText={errors.onsetDate || "Date when symptoms first appeared"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color:  '#1976d2' }} />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ max: format(today, 'yyyy-MM-dd'), 'aria-label': 'Onset Date' }}
                />

                {/* Patient Info Summary */}
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.08) 0%, rgba(0, 242, 254, 0.08) 100%)',
                  border: '1px solid rgba(79, 172, 254, 0.2)'
                }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
                    Patient Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Age</Typography>
                      <Typography variant="body2" fontWeight={500}>{record.patientInfo.age ?? 'N/A'} years</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Gender</Typography>
                      <Typography variant="body2" fontWeight={500}>{record.patientInfo.gender ?? 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Doctor</Typography>
                      <Typography variant="body2" fontWeight={500}>{record.visitInfo?.doctorName ?? 'Unknown Doctor'}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Action Buttons */}
    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={2}
    sx={{ width: { xs: "100%", sm: "auto" } }}
  >
    {/* Cancel */}
    <Tooltip title="Cancel and reset form">
      <Button
        variant="contained"
        color="error" // ❌ Red tone for cancel/destructive action
        startIcon={<Cancel />}
        onClick={handleCancel}
        sx={{
          minWidth: 180,
          height: 48,
          borderRadius: 2,
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
        }}
        aria-label="Cancel and reset form"
      >
        Cancel
      </Button>
    </Tooltip>

    {/* Save Draft */}
    <Tooltip title="Save current progress">
      <Button
        variant="contained"
        color="warning" // 🟠 Orange tone for draft/save later
        startIcon={<Save />}
        onClick={handleSaveDraft}
        sx={{
          minWidth: 180,
          height: 48,
          borderRadius: 2,
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
        }}
        aria-label="Save draft"
      >
        Save Draft
      </Button>
    </Tooltip>

    {/* Submit */}
    <Tooltip title="Submit final diagnosis">
      <Button
        variant="contained"
        color="primary" // 🔵 Main call-to-action
        startIcon={
          isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Send />
          )
        }
        onClick={handleSubmit}
        disabled={isSubmitting}
        sx={{
          minWidth: 180,
          height: 48,
          borderRadius: 2,
          fontWeight: 700,
          textTransform: "none",
          boxShadow: "none",
        }}
        aria-label="Submit diagnosis"
      >
        {isSubmitting ? "Submitting..." : "Submit Diagnosis"}
      </Button>
    </Tooltip>
  </Stack>
</Box>

    </Box>
  );
};

export default Diagnosis;
