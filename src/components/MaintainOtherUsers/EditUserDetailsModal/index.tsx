import React, { useState, useEffect, ChangeEvent } from 'react';
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
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import styles from '../DoctorDetailsModal/styles.module.scss';

interface User {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  area: string;
  country: string;
  state: string;
  pin: string;
  cellNo: string;
  userName: string;
  status: string;
  image?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (user: User) => void;
}

const titleOptions = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];
const statusOptions = ['Active', 'Inactive'];

const EditUserDetailsModal: React.FC<Props> = ({ open, onClose, user, onSubmit }) => {
  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [pin, setPin] = useState('');
  const [cellNo, setCellNo] = useState('');
  const [userName, setUserName] = useState('');
  const [status, setStatus] = useState('Active');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user) {
      setTitle(user.title || 'Mr.');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setAddress1(user.address1 || '');
      setAddress2(user.address2 || '');
      setCity(user.city || '');
      setArea(user.area || '');
      setCountry(user.country || '');
      setState(user.state || '');
      setPin(user.pin || '');
      setCellNo(user.cellNo || '');
      setUserName(user.userName || '');
      setStatus(user.status || 'Active');
      setImage(user.image);
    }
  }, [user, open]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = () => {
    if (!firstName || !email || !address1 || !city || !area || !country || !state || !pin || !cellNo || !userName) {
      setError(true);
      return;
    }
    setError(false);
    if (user) {
      onSubmit({
        ...user,
        title,
        firstName,
        lastName,
        email,
        address1,
        address2,
        city,
        area,
        country,
        state,
        pin,
        cellNo,
        userName,
        status,
        image,
      });
    }
    onClose();
  };

  const handleCancel = () => {
    setError(false);
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="md" classes={{ paper: styles.modalPaper }}>
      <DialogTitle className={styles.title}>USER DETAILS</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ fontWeight: 'bold', mb: 2 }}>
            Please provide all required details!
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, mb: 3, mt: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <FormControl sx={{ minWidth: 100 }} size="small">
                <InputLabel>Title</InputLabel>
                <Select value={title} label="Title" onChange={e => setTitle(e.target.value)}>
                  {titleOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label="First" value={firstName} onChange={e => setFirstName(e.target.value)} size="small" required sx={{ flex: 1 }} />
              <TextField label="Last" value={lastName} onChange={e => setLastName(e.target.value)} size="small" sx={{ flex: 1 }} />
              <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} size="small" required sx={{ flex: 2 }} />
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
              <FormControl fullWidth required sx={{ flex: 1 }}>
                <InputLabel>Status</InputLabel>
                <Select value={status} label="Status" onChange={e => setStatus(e.target.value)}>
                  {statusOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box sx={{ minWidth: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 150, height: 150, bgcolor: '#f5f5f5', borderRadius: 2, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {image ? (
                <img src={image} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src="/images/avatar-placeholder.png" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </Box>
            <Button variant="contained" component="label" sx={{ bgcolor: '#174a7c' }}>
              Attach Image
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
        <Button onClick={handleSubmit} variant="contained" className={styles.proceedButton}>
          Submit
        </Button>
        <Button onClick={handleCancel} variant="contained" className={styles.cancelButton}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDetailsModal; 