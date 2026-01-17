import React from 'react';
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
import styles from './styles.module.scss';

interface FilterUserModalProps {
  open: boolean;
  onClose: () => void;
  onOk: (filters: { facility: string; name: string; status: string }) => void;
  initialFilters?: { facility: string; name: string; status: string };
}

const FilterUserModal: React.FC<FilterUserModalProps> = ({ open, onClose, onOk, initialFilters }) => {
  const [facility, setFacility] = React.useState(initialFilters?.facility || 'All');
  const [name, setName] = React.useState(initialFilters?.name || '');
  const [status, setStatus] = React.useState(initialFilters?.status || 'All');

  const handleOk = () => {
    onOk({ facility, name, status });
  };

  React.useEffect(() => {
    if (open) {
      setFacility(initialFilters?.facility || 'All');
      setName(initialFilters?.name || '');
      setStatus(initialFilters?.status || 'All');
    }
  }, [open, initialFilters]);

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: styles.modalPaper }}>
      <DialogTitle className={styles.modalTitle}>
        FILTER USER
      </DialogTitle>
      <DialogContent>
        <Box className={styles.formBox}>
          <FormControl fullWidth className={styles.formControl}>
            <InputLabel>Facility</InputLabel>
            <Select
              value={facility}
              label="Facility"
              onChange={e => setFacility(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="First/Last Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            className={styles.formControl}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth className={styles.formControl} sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button onClick={handleOk} variant="contained" className={styles.okButton}>
          Ok
        </Button>
        <Button onClick={onClose} variant="contained" className={styles.cancelButton}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterUserModal; 