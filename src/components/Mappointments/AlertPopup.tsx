import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface AlertPopupProps {
  onClose: () => void;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ onClose }) => {
  return (
    <Box sx={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: 400,
      bgcolor: 'background.paper',
      borderRadius: 4,
      boxShadow: 24,
      p: 4,
      textAlign: 'center',
      zIndex: 1300,
    }}>
      <Box sx={{ color: '#FFC107', fontSize: 60, mb: 2 }}>
        <CalendarMonthIcon fontSize="inherit" />
      </Box>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
        Alert!
      </Typography>
      <Typography sx={{ mb: 3, color: '#555' }}>
        Please select today's date to continue
      </Typography>
      <Button
        variant="contained"
        sx={{
          bgcolor: '#FFC107',
          color: '#fff',
          fontWeight: 700,
          borderRadius: 3,
          py: 1.5,
          px: 4,
          '&:hover': {
            bgcolor: '#FFA000',
          },
        }}
        onClick={onClose}
      >
        Got it →
      </Button>
    </Box>
  );
};

export default AlertPopup; 