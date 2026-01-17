import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Stack,
  Button,
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MedicalRecord } from './medical'; // Assuming same MedicalRecord type as in previous components

interface DocumentUploadProps {
  record: MedicalRecord;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface DocumentEntry {
  documentType: string;
  documentName: string;
  documentDate: Date | null;
  file: File | null;
  relatedToOpenOrders: boolean;
  sharedWith: string[]; // Array of doctor IDs
  id: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ record }) => {
  const [documentType, setDocumentType] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentDate, setDocumentDate] = useState<Date | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [relatedToOpenOrders, setRelatedToOpenOrders] = useState(false);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [documentEntries, setDocumentEntries] = useState<DocumentEntry[]>([]);

  // Mock list of doctors for the multi-select table
  const doctors: Doctor[] = [
    { id: 'doc1', name: 'Dr. Smith', specialty: 'Cardiology' },
    { id: 'doc2', name: 'Dr. Jones', specialty: 'Neurology' },
    { id: 'doc3', name: 'Dr. Lee', specialty: 'Orthopedics' },
    { id: 'doc4', name: 'Dr. Patel', specialty: 'General Medicine' },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleShareWithChange = (doctorId: string) => {
    setSharedWith((prev) =>
      prev.includes(doctorId) ? prev.filter((id) => id !== doctorId) : [...prev, doctorId]
    );
  };

  const handleClear = () => {
    setDocumentType('');
    setDocumentName('');
    setDocumentDate(null);
    setFile(null);
    setRelatedToOpenOrders(false);
    setSharedWith([]);
  };

  const handleSave = () => {
    if (!documentType || !documentName || !documentDate || !file) {
      alert('Please fill in all required fields and select a file.');
      return;
    }

    const newEntry: DocumentEntry = {
      documentType,
      documentName,
      documentDate,
      file,
      relatedToOpenOrders,
      sharedWith,
      id: `document-${Date.now()}`,
    };

    setDocumentEntries([newEntry, ...documentEntries]);
    handleClear();
  };

  const handleFinish = () => {
    console.log('Documents submitted:', documentEntries);
    handleClear();
  };

  const handleCancel = () => {
    handleClear();
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 3 }, bgcolor: 'grey.50', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)', color: 'white' }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Document Upload
        </Typography>
        <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.9)">
          Upload documents for {record.patientInfo.patientName}
        </Typography>
      </Paper>

      <Card
        elevation={2}
        sx={{
          background: 'linear-gradient(135deg, rgba(75, 108, 183, 0.05) 0%, rgba(24, 40, 72, 0.02) 100%)',
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        }}
        role="region"
        aria-label="Document Upload Form"
      >
        <CardHeader
          title={
            <Typography variant="h6" fontWeight="600" color="text.primary">
              Add Document
            </Typography>
          }
          sx={{ pb: 0, px: 2 }}
        />
        <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: '0.9rem' }}>Document Type</InputLabel>
              <Select
                value={documentType}
                label="Document Type"
                onChange={(e) => setDocumentType(e.target.value)}
                required
                sx={{ '& .MuiSelect-select': { py: 0.75, fontSize: '0.9rem' } }}
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
                <MenuItem value="Lab Report">Lab Report</MenuItem>
                <MenuItem value="Prescription">Prescription</MenuItem>
                <MenuItem value="Imaging">Imaging</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Document Name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Enter document name"
              required
              sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Document Date"
                value={documentDate}
                onChange={(newValue) => setDocumentDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    required: true,
                    placeholder: 'DD/MM/YYYY',
                    sx: { '& .MuiInputBase-input': { py: 0.75, fontSize: '0.9rem' } },
                  },
                }}
              />
            </LocalizationProvider>

            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                component="label"
                size="small"
                aria-label="Choose file"
              >
                Choose File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
              </Button>
              <Typography variant="body2" color="text.secondary">
                {file ? file.name : 'No file chosen'}
              </Typography>
            </Stack>

            <FormControlLabel
              control={
                <Checkbox
                  checked={relatedToOpenOrders}
                  onChange={(e) => setRelatedToOpenOrders(e.target.checked)}
                  aria-label="Related to open orders checkbox"
                />
              }
              label="Does this document relate to any open order(s)?"
              sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
            />

            <Typography variant="subtitle2" color="text.primary">
              Share With
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 200, overflowY: 'auto' }}>
              <Table size="small" aria-label="Doctors table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={sharedWith.length === doctors.length}
                        onChange={() => {
                          setSharedWith(
                            sharedWith.length === doctors.length
                              ? []
                              : doctors.map((doctor) => doctor.id)
                          );
                        }}
                        aria-label="Select all doctors"
                      />
                    </TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Specialty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={sharedWith.includes(doctor.id)}
                          onChange={() => handleShareWithChange(doctor.id)}
                          aria-label={`Share with ${doctor.name}`}
                        />
                      </TableCell>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'flex-end' }}>
              <Tooltip title="Save document">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  size="small"
                  aria-label="Save document"
                >
                  Save
                </Button>
              </Tooltip>
              <Tooltip title="Clear the form">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClear}
                  size="small"
                  aria-label="Clear the form"
                >
                  Clear
                </Button>
              </Tooltip>
              <Tooltip title="Finish and submit documents">
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleFinish}
                  size="small"
                  aria-label="Finish and submit documents"
                >
                  Finish
                </Button>
              </Tooltip>
              <Tooltip title="Cancel and exit">
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                  size="small"
                  aria-label="Cancel changes"
                >
                  Cancel
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DocumentUpload;