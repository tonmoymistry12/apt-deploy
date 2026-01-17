import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  Paper,
} from '@mui/material';
import { MedicalRecord } from './medical'; // Assuming same MedicalRecord type as in previous components

interface ReferralProps {
  record: MedicalRecord;
}

interface ReferralEntry {
  referralReason: 'Emergency' | 'Continuity for Care';
  referralType: 'External Referral' | string; // Expandable for future types
  doctorName: string;
  doctorEmail: string;
  clinicName: string;
  clinicAddress: string;
  referralDate: string;
  id: string;
}

const Referral: React.FC<ReferralProps> = ({ record }) => {
  const [referralReason, setReferralReason] = useState<'Emergency' | 'Continuity for Care'>('Emergency');
  const [referralType, setReferralType] = useState<'External Referral' | string>('External Referral');
  const [doctorName, setDoctorName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);

  const handleClear = () => {
    setReferralReason('Emergency');
    setReferralType('External Referral');
    setDoctorName('');
    setDoctorEmail('');
    setClinicName('');
    setClinicAddress('');
  };

  const handleConfirmReferral = () => {
    if (!referralReason || !referralType || !doctorName || !doctorEmail || !clinicName || !clinicAddress) {
      alert('Please fill in all required fields.');
      return;
    }

    const newEntry: ReferralEntry = {
      referralReason,
      referralType,
      doctorName,
      doctorEmail,
      clinicName,
      clinicAddress,
      referralDate: new Date().toLocaleString('en-GB', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      }), // 11:22 PM IST, September 10, 2025
      id: `referral-${Date.now()}`,
    };

    setReferrals([newEntry, ...referrals]);
    handleClear();
  };

  const handleFinish = () => {
    console.log('Referrals submitted:', referrals);
    handleClear();
  };

  const handleCancel = () => {
    handleClear();
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 3 }, bgcolor: 'grey.50', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)', color: 'white' }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Referral
        </Typography>
        <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.9)">
          Create a referral for {record.patientInfo.patientName}
        </Typography>
      </Paper>

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
            aria-label="Referral Form"
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Add Referral
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" color="text.primary">
                  Referral Reason (required)
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={referralReason}
                    onChange={(e) => setReferralReason(e.target.value as 'Emergency' | 'Continuity for Care')}
                    aria-required
                  >
                    <FormControlLabel value="Emergency" control={<Radio />} label="Emergency" />
                    <FormControlLabel value="Continuity for Care" control={<Radio />} label="Continuity for Care" />
                  </RadioGroup>
                </FormControl>

                <Typography variant="subtitle2" color="text.primary">
                  Referral Type (required)
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={referralType}
                    onChange={(e) => setReferralType(e.target.value as 'External Referral')}
                    aria-required
                  >
                    <FormControlLabel value="External Referral" control={<Radio />} label="External Referral" />
                    {/* Placeholder for future types, currently only External Referral shown */}
                  </RadioGroup>
                </FormControl>

                <Typography variant="subtitle2" color="text.primary">
                  Doctor Details
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Doctor Name"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Enter doctor name"
                  required
                  sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Doctor Email"
                  value={doctorEmail}
                  onChange={(e) => setDoctorEmail(e.target.value)}
                  placeholder="Enter doctor email"
                  required
                  sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                />

                <Typography variant="subtitle2" color="text.primary">
                  Clinic / Hospital Details
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Clinic / Hospital Name"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="Enter clinic or hospital name"
                  required
                  sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Clinic Address"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  placeholder="Enter clinic address"
                  required
                  sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
                />

                <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'flex-end' }}>
                  <Tooltip title="Confirm referral">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleConfirmReferral}
                      size="small"
                      aria-label="Confirm referral"
                    >
                      Confirm Referral
                    </Button>
                  </Tooltip>
                  <Tooltip title="Finish and submit referral">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleFinish}
                      size="small"
                      aria-label="Finish and submit referral"
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

export default Referral;