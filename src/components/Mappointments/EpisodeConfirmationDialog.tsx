import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface EpisodeConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
}

const EpisodeConfirmationDialog: React.FC<EpisodeConfirmationDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '16px', width: '100%', maxWidth: 400 } }}>
      <DialogContent sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
        <WarningAmberIcon sx={{ fontSize: 56, color: '#f39c12', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#2c3e50' }}>
          Alert!
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 4 }}>
          You have an episode, for which you have appointments on appointment created successfully dates. Do you want to continue with the same episode?
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={onClose}
            sx={{ p: 1.5, bgcolor: '#27ae60', '&:hover': { bgcolor: '#229954' } }}
          >
            Yes
          </Button>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={onClose}
            sx={{ p: 1.5, borderColor: '#dde2e7', color: '#34495e', '&:hover': { borderColor: '#174a7c', bgcolor: 'rgba(23, 74, 124, 0.04)' } }}
          >
            No
          </Button>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={onClose}
            sx={{ p: 1.5, bgcolor: '#f1c40f', color: '#2c3e50', '&:hover': { bgcolor: '#f39c12' } }}
          >
            Got it
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EpisodeConfirmationDialog;
