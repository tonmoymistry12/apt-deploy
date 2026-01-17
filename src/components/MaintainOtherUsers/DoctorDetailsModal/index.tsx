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
import Typography from '@mui/material/Typography';
import styles from './styles.module.scss';

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
  // ... add more as needed
];

interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (user: User) => void;
}

const EditUserDetailsModal: React.FC<Props> = ({ open, onClose, user, onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Active');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
      setStatus(user.status);
    }
  }, [user, open]);

  const handleSubmit = () => {
    if (!name || !phone || !email) {
      setError(true);
      return;
    }
    setError(false);
    if (user) {
      onSubmit({ ...user, name, phone, email, status });
    }
    onClose();
  };

  const handleCancel = () => {
    setError(false);
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="md" classes={{ paper: styles.modalPaper }}>
      <DialogTitle className={styles.title}>EDIT USER DETAILS</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ fontWeight: 'bold', mb: 2 }}>
            Please provide all required details!
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt:3 }}>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
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