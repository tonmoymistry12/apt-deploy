import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EpisodeConfirmationDialog from './EpisodeConfirmationDialog';

interface PatientSearchDialogProps {
  open: boolean;
  onClose: () => void;
  onAppointmentSuccess?: () => void;
  selectedFacility?: {
    facilityId: number;
    facilityName: string;
  } | null;
  selectedDate?: Date | null;
}

type View = 'initial' | 'searchPlatform' | 'searchFacility' | 'register';
type PlatformSearchOption = 'name' | 'email' | 'petName' | 'mobile';
type FacilitySearchOption = 'mrn' | 'name' | 'idProof' | 'mobile';

const PatientSearchDialog: React.FC<PatientSearchDialogProps> = ({ open, onClose, onAppointmentSuccess, selectedFacility, selectedDate }) => {
  const [view, setView] = useState<View>('initial');
  const [platformSearchBy, setPlatformSearchBy] = useState<PlatformSearchOption>('name');
  const [facilitySearchBy, setFacilitySearchBy] = useState<FacilitySearchOption>('name');
  const [idProofType, setIdProofType] = useState('aadhar');
  const [showResults, setShowResults] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleBack = () => {
    setView('initial');
    setShowResults(false);
  };

  const handleSearch = () => {
    setShowResults(true);
  };

  const handleConfirmClick = () => {
    setConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    onClose();
  };

  const renderInitialView = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 3 }}>
        Search Patient
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button onClick={() => setView('searchPlatform')} variant="outlined" sx={{ p: 1.5, borderColor: '#dde2e7', color: '#34495e', '&:hover': { borderColor: '#174a7c', bgcolor: 'rgba(23, 74, 124, 0.04)' } }}>
          Search Platform
        </Button>
        <Button onClick={() => setView('searchFacility')} variant="outlined" sx={{ p: 1.5, borderColor: '#dde2e7', color: '#34495e', '&:hover': { borderColor: '#174a7c', bgcolor: 'rgba(23, 74, 124, 0.04)' } }}>
          Search Facility
        </Button>
        <Button variant="contained" onClick={() => setView('register')} sx={{ p: 1.5, bgcolor: '#174a7c', '&:hover': { bgcolor: '#103a61' } }}>
          Add New Pet
        </Button>
      </Box>
    </Box>
  );

  const renderPlatformSearchView = () => (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 2, textAlign: 'center' }}>
        Search Patient
      </Typography>
      <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
        <RadioGroup
          aria-label="search-by-platform"
          name="search-by-platform-group"
          value={platformSearchBy}
          onChange={(e) => {
            setPlatformSearchBy(e.target.value as PlatformSearchOption);
            setShowResults(false);
          }}
        >
          <FormControlLabel value="name" control={<Radio />} label="By Name" />
          <FormControlLabel value="email" control={<Radio />} label="By Email" />
          <FormControlLabel value="petName" control={<Radio />} label="By Pet Name" />
          <FormControlLabel value="mobile" control={<Radio />} label="By Mobile" />
        </RadioGroup>
      </FormControl>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {platformSearchBy === 'name' && (
          <>
            <TextField label="First Name" placeholder="Please provide first name" fullWidth />
            <TextField label="Last Name" placeholder="Please provide last name" fullWidth />
          </>
        )}
        {platformSearchBy === 'email' && <TextField label="Email" placeholder="Please enter email" type="email" fullWidth />}
        {platformSearchBy === 'petName' && <TextField label="Pet Name" placeholder="Please enter pet name" fullWidth />}
        {platformSearchBy === 'mobile' && <TextField label="Mobile Number" placeholder="Please enter mobile number" fullWidth />}
      </Box>
      <Button 
        variant="contained" 
        fullWidth 
        onClick={handleSearch}
        sx={{ p: 1.5, bgcolor: '#174a7c', '&:hover': { bgcolor: '#103a61' }, mt: 3 }}
      >
        Search
      </Button>
      {showResults && renderSearchResults()}
    </Box>
  );
  
  const renderFacilitySearchView = () => (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 2, textAlign: 'center' }}>
        Search Patient in Facility
      </Typography>
      <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
        <RadioGroup
          aria-label="search-by-facility"
          name="search-by-facility-group"
          value={facilitySearchBy}
          onChange={(e) => {
            setFacilitySearchBy(e.target.value as FacilitySearchOption);
            setShowResults(false);
          }}
        >
          <FormControlLabel value="mrn" control={<Radio />} label="By MRN" />
          <FormControlLabel value="name" control={<Radio />} label="By Name" />
          <FormControlLabel value="idProof" control={<Radio />} label="By ID Proof" />
          <FormControlLabel value="mobile" control={<Radio />} label="By Mobile Number" />
        </RadioGroup>
      </FormControl>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {facilitySearchBy === 'mrn' && <TextField label="MRN" placeholder="Please provide MRN" fullWidth />}
        {facilitySearchBy === 'name' && (
          <>
            <TextField label="First Name" placeholder="Please provide first name" fullWidth />
            <TextField label="Last Name" placeholder="Please provide last name" fullWidth />
          </>
        )}
        {facilitySearchBy === 'idProof' && (
          <>
            <FormControl fullWidth>
              <InputLabel>ID Proof Type</InputLabel>
              <Select value={idProofType} label="ID Proof Type" onChange={(e: SelectChangeEvent) => setIdProofType(e.target.value)}>
                <MenuItem value="aadhar">Aadhar Card</MenuItem>
                <MenuItem value="driving">Driving License</MenuItem>
                <MenuItem value="pan">PAN Card</MenuItem>
                <MenuItem value="passport">Passport</MenuItem>
                <MenuItem value="voter">Voter Card</MenuItem>
              </Select>
            </FormControl>
            <TextField label="ID Proof Value" placeholder="Please provide ID Proof value" fullWidth />
          </>
        )}
        {facilitySearchBy === 'mobile' && <TextField label="Mobile Number" placeholder="Please enter mobile number" fullWidth />}
      </Box>
      <Button 
        variant="contained" 
        fullWidth 
        onClick={handleSearch}
        sx={{ p: 1.5, bgcolor: '#174a7c', '&:hover': { bgcolor: '#103a61' }, mt: 3 }}
      >
        Search
      </Button>
      {showResults && renderSearchResults()}
    </Box>
  );

  const renderRegisterView = () => (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 3, textAlign: 'center' }}>
        Register Pet
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField label="Owner's First Name" variant="outlined" fullWidth />
          <TextField label="Owner's Last Name" variant="outlined" fullWidth />
        </Box>
        <TextField label="Pet's Name" variant="outlined" fullWidth />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField label="Date of Birth" placeholder="DD/MM/YYYY" variant="outlined" fullWidth />
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select label="Gender">
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField label="Mobile Number" placeholder="Enter your 10-digit mobile number" variant="outlined" fullWidth />
          <TextField label="Email Address" type="email" variant="outlined" fullWidth />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            sx={{ 
              py: 1.25,
              px: 5,
              bgcolor: '#174a7c', 
              '&:hover': { bgcolor: '#103a61' },
            }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const renderSearchResults = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: '#34495e' }}>
        Search Results
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead sx={{ bgcolor: '#f7f9fc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>MRN</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Pet's Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contact No</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover>
              <TableCell>0</TableCell>
              <TableCell>Aneeta of Ms. Yugdev Em</TableCell>
              <TableCell>1234567898</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Button variant="contained" sx={{ bgcolor: '#27ae60', '&:hover': { bgcolor: '#229954' } }} size="small" onClick={handleConfirmClick}>Confirm</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderContent = () => {
    switch (view) {
      case 'register':
        return renderRegisterView();
      case 'searchPlatform':
        return renderPlatformSearchView();
      case 'searchFacility':
        return renderFacilitySearchView();
      default:
        return renderInitialView();
    }
  };
  
  const dialogMaxWidth = view === 'register' 
    ? 'md' 
    : (view === 'searchPlatform' || view === 'searchFacility') 
      ? (showResults ? 'lg' : 'sm') 
      : 'xs';

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth={dialogMaxWidth} 
      PaperProps={{ 
        sx: { 
          borderRadius: '16px',
          transition: 'max-width 0.2s ease-in-out'
        } 
      }}
    >
      <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: view === 'initial' ? 'flex-end' : 'space-between', alignItems: 'center', mb: view === 'initial' ? -1 : 2 }}>
          {view !== 'initial' && (
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {renderContent()}
      </DialogContent>
      <EpisodeConfirmationDialog
        open={confirmationOpen}
        onClose={handleConfirmationClose}
      />
    </Dialog>
  );
};

export default PatientSearchDialog; 