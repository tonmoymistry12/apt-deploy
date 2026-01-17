'use client';

import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Typography, Box, Alert } from '@mui/material';
import { PatientHistorySection } from '@/components/manageEncounter/PatientHistorySection';
import { Vital } from '@/components/manageEncounter/Vital';
import Sidebar from '@/components/manageEncounter/Sidebar';
import { Assignment, Feedback, Home, LocalHospital, LockClock, Medication, MonitorHeart, Note, PersonAdd, Science, Summarize, Warning } from '@mui/icons-material';
import { History, Upload } from 'lucide-react';
import { MedicalRecord } from './medical';
import Complaint from './Complaint';
import Allergy from './Allergy';
import Referral from './Referral';
import Diagnosis from './Diagnosis';
import LabOrder from './LabOrder';
import PharmacyOrder from './PharmacyOrder';
import ProcedureOrder from './ProcedureOrder';
import GeneralNote from './GeneralNote';
import PrivateNote from './PrivateNote';
import DocumentUpload from './DocumentUpload';
import AdviceSummary from './AdviceSummary';

const theme = createTheme({
  palette: {
    primary: { main: '#4B6CB7' },
    secondary: { main: '#182848' },
    background: { default: '#F5F7FA' },
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

interface ManageEncounterProps {
  record: MedicalRecord;
}

const ManageEncounter: React.FC<ManageEncounterProps> = ({ record }) => {
  const [activeSection, setActiveSection] = useState('patient-history');

  const renderSection = () => {
    try {
      switch (activeSection) {
        case 'patient-history':
          return <PatientHistorySection record={record} />;
        case 'vital':
          return <Vital record={record} />;
        case 'complaint':
          return <Complaint record={record} />;
        case 'allergy':
          return <Allergy record={record} />;
            case 'referral':
          return <Referral record={record} />;
          case 'diagnosis':
          return <Diagnosis record={record} />;
            case 'lab-order':
          return <LabOrder record={record} />;
          case 'pharmacy-order':
          return <PharmacyOrder record={record} />;
          case 'procedure':
          return <ProcedureOrder record={record} />;
           case 'general-note':
          return <GeneralNote record={record} />;
           case 'private-note':
          return <PrivateNote record={record} />;
           case 'upload-document':
          return <DocumentUpload record={record} />;
          case 'advice-summary':
          return <AdviceSummary record={record} />;
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
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} menuItems={menuItems} />
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            bgcolor: 'background.default',
            overflowY: 'auto',
            maxHeight: '88vh',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.1)', // Subtle track
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(75, 108, 183, 0.5)', // Matches theme primary
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(75, 108, 183, 0.7)', // Darker on hover
              },
            },
          }}
        >
          {renderSection()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManageEncounter;