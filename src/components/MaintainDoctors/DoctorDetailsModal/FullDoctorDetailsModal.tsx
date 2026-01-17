import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import styles from '@/components/common/styles.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const councils = [
  'Andhra Pradesh Medical Council',
  'Arunachal Pradesh Medical Council',
  'Assam Council of Medical Registration',
  'Bihar Medical Council',
  'Chattisgarh Medical Council',
  'Delhi Medical Council',
  'Goa Medical Council',
  'Gujarat Medical Council',
  'Haryana Medical Council',
  'Himanchal Pradesh Medical Council',
  'Jammu & Kashmir Medical Council',
  'Jharkhand Medical Council',
  'Karnataka Medical Council',
  'Madhya Pradesh Medical Council',
  'Maharashtra Medical Council',
  'Manipur Medical Council',
  'Mizoram Medical Council',
  'Nagaland Medical Council',
];

const specialties = ['Select', 'General Medicine', 'Pediatrics', 'Surgery'];

const FullDoctorDetailsModal: React.FC<Props> = ({ open, onClose, initialData, onSubmit }) => {
  const [council, setCouncil] = useState('');
  const [year, setYear] = useState('');
  const [regNo, setRegNo] = useState('');
  const [title, setTitle] = useState('Dr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [speciality, setSpeciality] = useState('Select');
  const [qualification, setQualification] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');
  const [cellNo, setCellNo] = useState('');
  const [userName, setUserName] = useState('');
  const [profileDetails, setProfileDetails] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialData) {
      setCouncil(initialData.council || '');
      setYear(initialData.year || '');
      setRegNo(initialData.regNo || '');
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({
      council,
      year,
      regNo,
      title,
      firstName,
      lastName,
      email,
      speciality,
      qualification,
      address1,
      address2,
      city,
      area,
      country,
      state,
      pin,
      cellNo,
      userName,
      profileDetails,
      image,
    });
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle className={styles.commonDialogHeader}>
        DOCTOR DETAILS
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Medical Council</InputLabel>
            <Select
              value={council}
              label="Medical Council"
              onChange={e => setCouncil(e.target.value)}
            >
              <MenuItem value="">Select</MenuItem>
              {councils.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Year of Registration"
            value={year}
            onChange={e => setYear(e.target.value)}
            fullWidth
            required
            type="number"
          />
          <TextField
            label="Reg. No."
            value={regNo}
            onChange={e => setRegNo(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="Name" value={title} onChange={e => setTitle(e.target.value)} sx={{ width: 80 }} required />
          <TextField label="First" value={firstName} onChange={e => setFirstName(e.target.value)} required sx={{ flex: 1 }} />
          <TextField label="Last" value={lastName} onChange={e => setLastName(e.target.value)} sx={{ flex: 1 }} />
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} required sx={{ flex: 2 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Speciality</InputLabel>
            <Select
              value={speciality}
              label="Speciality"
              onChange={e => setSpeciality(e.target.value)}
            >
              {specialties.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Qualification" value={qualification} onChange={e => setQualification(e.target.value)} required fullWidth />
        </Box>
        <TextField label="Address Line1" value={address1} onChange={e => setAddress1(e.target.value)} fullWidth required sx={{ mb: 2 }} />
        <TextField label="Address Line2" value={address2} onChange={e => setAddress2(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="City" value={city} onChange={e => setCity(e.target.value)} required sx={{ flex: 1 }}
            InputProps={{ endAdornment: (
              <IconButton size="small"><SearchIcon /></IconButton>
            ) }}
          />
          <TextField label="Area" value={area} onChange={e => setArea(e.target.value)} required sx={{ flex: 1 }}
            InputProps={{ endAdornment: (
              <IconButton size="small"><SearchIcon /></IconButton>
            ) }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="Country" value={country} onChange={e => setCountry(e.target.value)} required sx={{ flex: 1 }} />
          <TextField label="State" value={state} onChange={e => setState(e.target.value)} required sx={{ flex: 1 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="PIN" value={pin} onChange={e => setPin(e.target.value)} required sx={{ flex: 1 }} />
          <TextField label="Cell No." value={cellNo} onChange={e => setCellNo(e.target.value)} required sx={{ flex: 1 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="User Name" value={userName} onChange={e => setUserName(e.target.value)} required sx={{ flex: 1 }} />
        </Box>
        <TextField label="Profile Details" value={profileDetails} onChange={e => setProfileDetails(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ width: 150, height: 150, bgcolor: '#f5f5f5', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {image ? (
              <img src={image} alt="Doctor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <img src="/images/avatar-placeholder.png" alt="Doctor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </Box>
          <Button variant="contained" component="label" sx={{ bgcolor: '#174a7c' }}>
            Attach Image
            <input type="file" accept="image/*" hidden onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setImage(URL.createObjectURL(e.target.files[0]));
              }
            }} />
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ 
            mr: 2,
            bgcolor: '#174a7c',
            '&:hover': {
              bgcolor: '#1b5e20'
            }
          }}
        >
          Submit
        </Button>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            bgcolor: '#3b5c7e',
            '&:hover': {
              bgcolor: '#2c4a6e'
            }
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FullDoctorDetailsModal; 