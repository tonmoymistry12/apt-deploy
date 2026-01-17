import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import { MedicalRecord } from './medical'; // Assuming same MedicalRecord type as in previous components

// Interfaces from previous components
interface AllergyEntry {
  date: string;
  time: string;
  description: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  isActive: boolean;
  recordedBy: string;
  id: string;
}

interface MedicineEntry {
  source: 'TrueMD' | 'Other' | 'Local';
  medicineName: string;
  genericName: string;
  brandName: string;
  duration: string;
  startDate: Date | null;
  stopDate: Date | null;
  frequency: string;
  notes: string;
  dispensedQuantity?: string;
  id: string;
}

interface ProcedureEntry {
  source: 'ICD10' | 'Other' | 'Local';
  procedureName: string;
  cost?: string;
  schedule: string;
  scheduleDays?: string;
  type: 'Invasive' | 'Non-invasive';
  purpose: 'Diagnostic' | 'Treatment';
  id: string;
}

interface NoteEntry {
  content: string;
  createdAt: string;
  id: string;
}

interface DocumentEntry {
  documentType: string;
  documentName: string;
  documentDate: Date | null;
  file: File | null;
  relatedToOpenOrders: boolean;
  sharedWith: string[];
  id: string;
}

interface AdviceSummaryProps {
  record: any & {
    allergies?: AllergyEntry[];
    medicines?: MedicineEntry[];
    procedures?: ProcedureEntry[];
    generalNotes?: NoteEntry[];
    privateNotes?: NoteEntry[];
    documents?: DocumentEntry[];
  };
}

const AdviceSummary: React.FC<AdviceSummaryProps> = ({ record }) => {
  const allergies:any = record.allergies || [];
  const medicines:any = record.medicines || [];
  const procedures = record.procedures || [];
  const generalNotes = record.generalNotes || [];
  const privateNotes = record.privateNotes || [];
  const documents = record.documents || [];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 3 }, bgcolor: 'grey.50', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)', color: 'white' }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Advice Summary
        </Typography>
        <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.9)">
          Summary of medical advice for {record.patientInfo.patientName}
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        {/* Allergies Section */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              background: 'linear-gradient(135deg, rgba(75, 108, 183, 0.05) 0%, rgba(24, 40, 72, 0.02) 100%)',
            }}
            role="region"
            aria-label="Allergies Summary"
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Allergies
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              {allergies.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  <Table size="small" aria-label="Allergies table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>Severity</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Reported</TableCell>
                        <TableCell>Recorded By</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allergies.map((allergy:any) => (
                        <TableRow key={allergy.id}>
                          <TableCell>{allergy.description}</TableCell>
                          <TableCell>{allergy.severity}</TableCell>
                          <TableCell sx={{ color: allergy.isActive ? 'error.main' : 'success.main' }}>
                            {allergy.isActive ? 'Active' : 'Resolved'}
                          </TableCell>
                          <TableCell>{`${allergy.date} ${allergy.time}`}</TableCell>
                          <TableCell>{allergy.recordedBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No allergies recorded.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pharmacy Orders Section */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              background: 'linear-gradient(135deg, rgba(75, 108, 183, 0.05) 0%, rgba(24, 40, 72, 0.02) 100%)',
            }}
            role="region"
            aria-label="Pharmacy Orders Summary"
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Pharmacy Orders
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              {medicines.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  <Table size="small" aria-label="Pharmacy Orders table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Medicine Name</TableCell>
                        <TableCell>Generic Name</TableCell>
                        <TableCell>Brand Name</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {medicines.map((medicine:any) => (
                        <TableRow key={medicine.id}>
                          <TableCell>{medicine.medicineName}</TableCell>
                          <TableCell>{medicine.genericName}</TableCell>
                          <TableCell>{medicine.brandName}</TableCell>
                          <TableCell>{medicine.duration}</TableCell>
                          <TableCell>{medicine.frequency}</TableCell>
                          <TableCell>{medicine.notes || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No pharmacy orders recorded.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Procedure Orders Section */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              background: 'linear-gradient(135deg, rgba(75, 108, 183, 0.05) 0%, rgba(24, 40, 72, 0.02) 100%)',
            }}
            role="region"
            aria-label="Procedure Orders Summary"
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Procedure Orders
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              {procedures.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  <Table size="small" aria-label="Procedure Orders table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Procedure Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Purpose</TableCell>
                        <TableCell>Schedule</TableCell>
                        <TableCell>Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {procedures.map((procedure:any) => (
                        <TableRow key={procedure.id}>
                          <TableCell>{procedure.procedureName}</TableCell>
                          <TableCell>{procedure.type}</TableCell>
                          <TableCell>{procedure.purpose}</TableCell>
                          <TableCell>{procedure.schedule}</TableCell>
                          <TableCell>{procedure.cost || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No procedures recorded.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* General Notes Section */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              background: 'linear-gradient(135deg, rgba(75, 108, 183, 0.05) 0%, rgba(24, 40, 72, 0.02) 100%)',
            }}
            role="region"
            aria-label="General Notes Summary"
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  General Notes (Patient-Visible)
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              {generalNotes.length > 0 ? (
                <Stack spacing={2}>
                  {generalNotes.map((note:any) => (
                    <Box key={note.id} sx={{ p: 1, bgcolor: 'rgba(0, 0, 0, 0.05)', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {note.createdAt}
                      </Typography>
                      <Box
                        sx={{ mt: 1, '& p': { margin: 0 } }}
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No general notes recorded.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Private Notes Section */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              background: 'linear-gradient(135deg, rgba(75, 108, 183, 0.05) 0%, rgba(24, 40, 72, 0.02) 100%)',
            }}
            role="region"
            aria-label="Private Notes Summary"
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Private Notes (Not Visible to Patient)
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              {privateNotes.length > 0 ? (
                <Stack spacing={2}>
                  {privateNotes.map((note:any) => (
                    <Box key={note.id} sx={{ p: 1, bgcolor: 'rgba(0, 0, 0, 0.05)', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {note.createdAt}
                      </Typography>
                      <Box
                        sx={{ mt: 1, '& p': { margin: 0 } }}
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No private notes recorded.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Documents Section */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              background: 'linear-gradient(135deg, rgba(75, 108, 183, 0.05) 0%, rgba(24, 40, 72, 0.02) 100%)',
            }}
            role="region"
            aria-label="Documents Summary"
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Documents
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              {documents.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  <Table size="small" aria-label="Documents table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Document Type</TableCell>
                        <TableCell>Document Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>File</TableCell>
                        <TableCell>Related to Open Orders</TableCell>
                        <TableCell>Shared With</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documents.map((document:any) => (
                        <TableRow key={document.id}>
                          <TableCell>{document.documentType}</TableCell>
                          <TableCell>{document.documentName}</TableCell>
                          <TableCell>
                            {document.documentDate
                              ? new Date(document.documentDate).toLocaleDateString('en-GB')
                              : '-'}
                          </TableCell>
                          <TableCell>{document.file?.name || '-'}</TableCell>
                          <TableCell>{document.relatedToOpenOrders ? 'Yes' : 'No'}</TableCell>
                          <TableCell>{document.sharedWith.join(', ') || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No documents recorded.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdviceSummary;