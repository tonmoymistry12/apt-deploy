'use client';

import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Typography, Box, Alert } from '@mui/material';

import { PatientHistorySection } from '@/components/manageEncounter/PatientHistorySection';
import { Vital } from '@/components/manageEncounter/Vital';
import Sidebar from '@/components/manageEncounter/Sidebar';
// import { sampleMedicalRecord } from '@/components/manageEncounter/sampleMedicalRecord';
import Complaint from '@/components/manageEncounter/Complaint';
import Allergy from '@/components/manageEncounter/Allergy';
import { MedicalRecord } from '@/components/manageEncounter/medical';
import { Assignment, Feedback, Home, LocalHospital, Lock, LockClock, Medication, MonitorHeart, Note, PersonAdd, Science, Summarize, Warning } from '@mui/icons-material';
import { History, Upload } from 'lucide-react';

const theme = createTheme({
  palette: {
    primary: { main: '#4B6CB7' }, // Matches Sidebar gradient start
    secondary: { main: '#182848' }, // Matches Sidebar gradient end
    background: { default: '#F5F7FA' }, // Light grey background
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const menuItems = [
  { id: 'home', label: 'Home', icon: <Home />, tooltip: 'Go to dashboard home' },
  { id: 'patient-history', label: 'Patient History', icon: <History />, tooltip: 'View patient medical records' },
  { id: 'vital', label: 'Vital', icon: <MonitorHeart />, tooltip: 'Check vital signs' },
  { id: 'complaint', label: 'Complaint', icon: <Feedback />, tooltip: 'Review patient complaints' },
  { id: 'allergy', label: 'Allergy', icon: <Warning />, tooltip: 'View allergy information' },
  { id: 'diagnosis', label: 'Diagnosis', icon: <Assignment />, tooltip: 'See medical diagnoses' },
  { id: 'lab-order', label: 'Lab Order', icon: <Science />, tooltip: 'Manage laboratory orders' },
  { id: 'pharmacy-order', label: 'Pharmacy Order', icon: <Medication />, tooltip: 'View prescribed medications' },
  { id: 'procedure', label: 'Procedure', icon: <LocalHospital />, tooltip: 'Check recommended procedures' },
  { id: 'general-note', label: 'General Note', icon: <Note />, tooltip: 'Read general notes' },
  { id: 'private-note', label: 'Private Note', icon: <LockClock />, tooltip: 'Access private notes' },
  { id: 'referral', label: 'Referral', icon: <PersonAdd />, tooltip: 'Manage patient referrals' },
  { id: 'upload-document', label: 'Upload Document', icon: <Upload />, tooltip: 'Upload patient documents' },
  { id: 'advice-summary', label: 'Advice Summary', icon: <Summarize />, tooltip: 'View treatment advice summary' },
];

export default function Page() {
  const [activeSection, setActiveSection] = useState('patient-history');

  // Create a default empty MedicalRecord
  const defaultRecord: MedicalRecord = {
    patientInfo: {
      patientName: '',
      doctorName: '',
      userName: '',
      date: '',
      time: '',
    },
    vitals: [],
    allergies: [],
    complaints: [],
    diagnoses: [],
    medicines: [],
    labOrders: [],
    procedureAdvices: [],
  };

  // Handle section rendering with error fallback
  const renderSection = () => {
    try {
      switch (activeSection) {
        case 'patient-history':
          return <PatientHistorySection record={defaultRecord} />;
        case 'vital':
          return <Vital record={defaultRecord} />;
        case 'complaint':
          return <Complaint record={defaultRecord} />;
        case 'allergy':
          return <Allergy record={defaultRecord} />;
        default:
          return (
            <Box>
              <Typography variant="h4" gutterBottom>
                {menuItems.find(item => item.id === activeSection)?.label || 'Unknown Section'}
              </Typography>
              <Typography variant="body1">
                Content for {activeSection} section is under development.
              </Typography>
            </Box>
          );
      }
    } catch (error) {
      console.error(`Error rendering ${activeSection} section:`, error);
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load {activeSection} section. Please try again or contact support.
        </Alert>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} menuItems={menuItems} />
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
          {renderSection()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}