import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // English locale

interface ConsultationDetailsProps {
  selectedDate: Date | null;
  onStartConsultation: () => void;
}

// Function to get the correct ordinal suffix
const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const ConsultationDetails: React.FC<ConsultationDetailsProps> = ({
  selectedDate,
  onStartConsultation,
}) => {
  if (!selectedDate) return null;

  const day = dayjs(selectedDate).date();
  const month = dayjs(selectedDate).format('MMMM');
  const year = dayjs(selectedDate).year();
  const formattedDate = `${day}${getOrdinalSuffix(day)} ${month} ${year}`;

  const slot = "SLOT 2";
  const timeRange = "13:00 - 23:00";

  return (
    <Card
      sx={{
        mt: 4,
        mb: 2,
        width: '90%',
        maxWidth: 800,
        mx: 'auto',
        borderRadius: 4,
        boxShadow: 6,
        background: '#fff',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ background: '#174a7c', p: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1 }}>
          Select Your Slot
        </Typography>
      </Box>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, flexWrap: 'wrap', gap: 2 }}>
        
        {/* Left Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>
            {formattedDate}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#fff3e0', p: 1, px: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#f57c00', fontWeight: 600 }}>
                {slot}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#78909c', fontWeight: 600 }}>
              {timeRange}
            </Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Button
          variant="contained"
          onClick={onStartConsultation}
          sx={{
            bgcolor: '#4CAF50',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 3,
            py: 1.5,
            px: 4,
            '&:hover': {
              bgcolor: '#45a049',
            },
          }}
        >
          Start Consultation
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConsultationDetails;
