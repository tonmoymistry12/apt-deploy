import React, { useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

interface ConsultationItem {
  petName: string;
  ownerName: string;
  timeRange: string;
  imageUrl?: string;
  // API fields for updatestatusarrive
  patientMrn?: number;
  petOwnerUid?: string;
  patientUid?: number;
  appointmentId?: number;
  facilityId?: number;
  encounterId?: string;
}

interface OfflineConsultationPopupProps {
  consultation: ConsultationItem;
  onCompleteConsultation?: (consultation: ConsultationItem) => void;
}

const OfflineConsultationPopup: React.FC<OfflineConsultationPopupProps> = ({ consultation, onCompleteConsultation }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB');
  const [startTime, endTime] = consultation.timeRange.split(' - ');
  const petImage = consultation.imageUrl;

  // Refs for file input buttons
  const docUploadRef = useRef<HTMLInputElement>(null);
  const presUploadRef = useRef<HTMLInputElement>(null);
  const addDocRef = useRef<HTMLInputElement>(null);
  const addPresRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (label: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`File uploaded from [${label}]:`, file.name);
      // Upload logic here
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: '#F9FBFF', borderRadius: 4 }}>
      {/* Profile Section */}
      <Box sx={{ mb: 3, p: 2, bgcolor: '#ffffff', borderRadius: 4, boxShadow: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box component="img" src={petImage} alt="Pet" sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2 }} />
          <Box component="img" src={petImage} alt="Pet Avatar" sx={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', mt: -4, border: '3px solid #fff' }} />
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
            {consultation.petName} <Typography component="span" variant="body2">of {consultation.ownerName}</Typography>
          </Typography>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">CURRENT CONSULTATION :</Typography>
          <Box sx={{ mt: 1, p: 1.5, border: '2px solid #9e9e9e', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#FFCA28', mb: 0.5 }}>IN PERSON</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">{formattedDate}</Typography>
              <Typography variant="body2">SLOT 2</Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{consultation.timeRange}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 2, gap: 1 }}>
              <Button variant="contained" sx={{ bgcolor: '#FFCA28', color: '#fff', '&:hover': { bgcolor: '#FFB300' } }}>START OFFLINE</Button>
              <Button variant="outlined" onClick={() => addPresRef.current?.click()}>Add Prescription</Button>
              <Button variant="outlined" onClick={() => addDocRef.current?.click()}>Add Documents</Button>
              <Button
                variant="contained"
                onClick={() => onCompleteConsultation?.(consultation)}
                sx={{
                  bgcolor: '#4CAF50',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#45a049',
                  },
                }}
              >
                Complete Consultation
              </Button>
              <input type="file" hidden ref={addPresRef} onChange={handleFileChange("Add Prescription")} />
              <input type="file" hidden ref={addDocRef} onChange={handleFileChange("Add Documents")} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* About Rocky */}
      <Box sx={{ mb: 3, p: 2, bgcolor: '#fff', borderRadius: 4, boxShadow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196F3' }} gutterBottom>About Rocky</Typography>
        <Typography variant="body2">DOB : 19.01.2020</Typography>
        <Typography variant="body2">Dog | Dog | Male</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Diet : Rice, Kibble, Meat, Fish, Vegetables, Grains, Hay, Leafy Greens, Pellets, Seeds, Nuts, Fruits, Insects, Fish Flakes
        </Typography>
        <Typography variant="body2">Living Environment : Houserr</Typography>
        <Typography variant="body2">Training : Yes</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>Gooddog Rocky</Typography>
      </Box>

      {/* Address and History */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, p: 2, bgcolor: '#fff', borderRadius: 4, boxShadow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196F3' }} gutterBottom>Address</Typography>
          <Typography variant="body2">New Town, Kolkata, Cornaredo, Milan, 10125, West Bengal 2</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, bgcolor: '#fff', borderRadius: 4, boxShadow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196F3' }} gutterBottom>History</Typography>
          <Typography variant="body2">
            Injury, Eye, Leg, Diabetes, Cardiac Arrest, Ear, Allergy, Asthma, Flu, Arthritis, Heart Disease, Pneumonia
          </Typography>
        </Box>
      </Box>

      {/* Shared Documents */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196F3', mb: 1 }}>Shared Documents</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', p: 2, borderRadius: 4, boxShadow: 1 }}>
          {["29.04.2025", "28.04.2025", "03.05.2025", "03.05.2025", "12.05.2025"].map((date, idx) => (
            <Button key={idx} variant="outlined" sx={{ width: 112 }} startIcon={<CloudDownloadIcon />}>{date}</Button>
          ))}
          <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} onClick={() => docUploadRef.current?.click()}>
            Upload
          </Button>
          <input type="file" hidden ref={docUploadRef} onChange={handleFileChange("Shared Documents Upload")} />
        </Box>

        {/* Prescriptions */}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196F3', mt: 3, mb: 1 }}>My Prescriptions</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', p: 2, borderRadius: 4, boxShadow: 1 }}>
          {["29.04.2025", "28.04.2025", "03.05.2025", "03.05.2025", "12.05.2025"].map((date, idx) => (
            <Button key={idx} variant="outlined" sx={{ width: 112 }} startIcon={<CloudDownloadIcon />}>{date}</Button>
          ))}
          <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} onClick={() => presUploadRef.current?.click()}>
            Upload
          </Button>
          <input type="file" hidden ref={presUploadRef} onChange={handleFileChange("Prescription Upload")} />
        </Box>
      </Box>
    </Box>
  );
};

export default OfflineConsultationPopup;
