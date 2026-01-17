import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from './styles.module.scss';

interface Props {
  open: boolean;
  onYes: () => void;
  onNo: () => void;
}

const UserSelfConfirmModal: React.FC<Props> = ({ open, onYes, onNo }) => (
  <Dialog open={open} classes={{ paper: styles.modalPaper }}>
    <DialogContent className={styles.content}>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        Are you yourself a user for the clinic?<br />
        In such a case, you need to add yourself first.
      </Typography>
      <DialogActions className={styles.actions}>
        <Button onClick={onYes} variant="contained" className={styles.yesButton}>Yes</Button>
        <Button onClick={onNo} variant="contained" className={styles.noButton}>No</Button>
      </DialogActions>
    </DialogContent>
  </Dialog>
);

export default UserSelfConfirmModal;