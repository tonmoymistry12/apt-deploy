import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import dayjs from "dayjs";
import "dayjs/locale/en";
import ConsultationPopup from "./OnlineConsultationPopup";
import { updateStatusArrive, updateConsultationStarted, updateStatusComplete } from "@/services/manageCalendar";

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
  appointmentStatus?: string; // 'Scheduled' or 'Arrived'
}

interface ListOfConsultationProps {
  selectedDate: Date | null;
  consultations: ConsultationItem[];
  onArriveClick: (consultation: ConsultationItem) => void;
  onRefresh?: () => void;
}

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const ListOfConsultation: React.FC<ListOfConsultationProps> = ({
  selectedDate,
  consultations,
  onArriveClick,
  onRefresh,
}) => {
  if (!selectedDate) {
    return null;
  }

  const day = dayjs(selectedDate).date();
  const month = dayjs(selectedDate).format("MMMM");
  const year = dayjs(selectedDate).year();
  const formattedDate = `${day}${getOrdinalSuffix(day)} ${month} ${year}`;

  const [arrivedConsultations, setArrivedConsultations] = useState<Set<number>>(new Set());
  const [openConsultationPopup, setOpenConsultationPopup] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationItem | null>(null);
  const [consultationType, setConsultationType] = useState<'online' | 'offline'>('online');
  const [loadingArrive, setLoadingArrive] = useState<Set<number>>(new Set());
  const [loadingConsultation, setLoadingConsultation] = useState<Set<number>>(new Set());
  const [consultationStarted, setConsultationStarted] = useState<Set<number>>(new Set());
  const [encounterIds, setEncounterIds] = useState<Map<number, string>>(new Map());
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleArrive = async (index: number, consultation: ConsultationItem) => {
    if (!consultation.patientMrn || !consultation.petOwnerUid || !consultation.patientUid || !consultation.appointmentId || !consultation.facilityId) {
      setSnackbar({
        open: true,
        message: 'Missing required patient information',
        severity: 'error'
      });
      return;
    }

    setLoadingArrive((prev) => new Set(prev).add(index));
    
    try {
      const response = await updateStatusArrive({
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        deviceStat: 'D',
        orgId: parseInt(localStorage.getItem('orgId') || '39'),
        facilityId: consultation.facilityId,
        patientMrn: consultation.patientMrn?.toString(),
        petOwnerUid: consultation.petOwnerUid,
        patientUid: consultation.patientUid?.toString(),
        appointmentId: consultation.appointmentId?.toString(),
        appointmentStatus: 'Scheduled',
        changeStatus: 'Arrive',
        meetingUrl: ''
      });

      if (response.status === 'Success') {
        setArrivedConsultations((prev) => new Set(prev).add(index));
        // Store encounterId for later use in updatestatuscomplete
        if (response.encounterId) {
          setEncounterIds((prev) => new Map(prev).set(index, response.encounterId));
        }
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'success'
        });
        onArriveClick?.(consultation);
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to update status',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update appointment status',
        severity: 'error'
      });
    } finally {
      setLoadingArrive((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const handleConsultationStarted = async (index: number, consultation: ConsultationItem, consultationType: 'online' | 'offline') => {
    if (!consultation.patientMrn || !consultation.petOwnerUid || !consultation.patientUid || !consultation.appointmentId || !consultation.facilityId) {
      setSnackbar({
        open: true,
        message: 'Missing required patient information',
        severity: 'error'
      });
      return;
    }

    setLoadingConsultation((prev) => new Set(prev).add(index));
    
    try {
      const response = await updateConsultationStarted({
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        deviceStat: 'D',
        orgId: localStorage.getItem('orgId') || '39',
        facilityId: consultation.facilityId?.toString() || '1',
        patientMrn: consultation.patientMrn?.toString(),
        petOwnerUid: consultation.petOwnerUid,
        patientUid: consultation.patientUid?.toString(),
        appointmentId: consultation.appointmentId?.toString(),
        appointmentStatus: 'Arrived',
        changeStatus: 'ConsultationStarted',
        consultationType: consultationType,
        meetingUrl: ''
      });

      if (response.status === 'Success') {
        setConsultationStarted((prev) => new Set(prev).add(index));
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'success'
        });
        
        // Open the consultation popup with the appropriate type
        setSelectedConsultation(consultation);
        setConsultationType(consultationType);
        setOpenConsultationPopup(true);
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to start consultation',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error starting consultation:', error);
      setSnackbar({
        open: true,
        message: 'Failed to start consultation',
        severity: 'error'
      });
    } finally {
      setLoadingConsultation((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const handleConsultOnline = (index: number, consultation: ConsultationItem) => {
    // Open dialog immediately with online type
    setSelectedConsultation(consultation);
    setConsultationType('online');
    setOpenConsultationPopup(true);
    // Make API call in background
    handleConsultationStarted(index, consultation, 'online');
  };

  const handleConsultOffline = (index: number, consultation: ConsultationItem) => {
    // Open dialog immediately with offline type
    setSelectedConsultation(consultation);
    setConsultationType('offline');
    setOpenConsultationPopup(true);
    // Make API call in background
    handleConsultationStarted(index, consultation, 'offline');
  };

  const handleViewCompleted = (consultation: ConsultationItem) => {
    // For completed consultations, just open the modal without calling API
    setSelectedConsultation(consultation);
    setConsultationType('online'); // Default to online for completed consultations
    setOpenConsultationPopup(true);
  };

  const handleCompleteConsultation = async (index: number, consultation: ConsultationItem) => {
    if (!consultation.patientMrn || !consultation.petOwnerUid || !consultation.patientUid || !consultation.appointmentId || !consultation.facilityId) {
      setSnackbar({
        open: true,
        message: 'Missing required patient information',
        severity: 'error'
      });
      return;
    }

    const encounterId = encounterIds.get(index);
    if (!encounterId) {
      setSnackbar({
        open: true,
        message: 'Encounter ID not found. Please arrive first.',
        severity: 'error'
      });
      return;
    }

    setLoadingConsultation((prev) => new Set(prev).add(index));
    
    try {
      const response = await updateStatusComplete({
        userName: localStorage.getItem('userName') || '',
        userPass: localStorage.getItem('userPwd') || '',
        deviceStat: 'D',
        orgId: parseInt(localStorage.getItem('orgId') || '39'),
        facilityId: consultation.facilityId,
        patientMrn: consultation.patientMrn?.toString() || '',
        petOwnerUid: consultation.petOwnerUid || '',
        patientUid: consultation.patientUid?.toString() || '',
        appointmentId: consultation.appointmentId?.toString() || '',
        encounterId: encounterId,
        appointmentStatus: 'Scheduled',
        changeStatus: 'Complete'
      });

      if (response.status === 'Success') {
        setSnackbar({
          open: true,
          message: response.message,
          severity: 'success'
        });
        // Close consultation popup
        setOpenConsultationPopup(false);
        setSelectedConsultation(null);
        // Refresh the consultations list
        onRefresh?.();
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to complete consultation',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error completing consultation:', error);
      setSnackbar({
        open: true,
        message: 'Failed to complete consultation',
        severity: 'error'
      });
    } finally {
      setLoadingConsultation((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  return (
    <Card
      sx={{
        mt: 4,
        mb: 2,
        width: "80%",
        maxWidth: 800,
        mx: "auto",
        borderRadius: 4,
        boxShadow: 6,
        background: "#fff",
        border: "1px solid #e0e0e0",
        p: 0,
      }}
    >
      <Box
        sx={{
          background: "#174a7c",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: 700,
            flexGrow: 1,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          List Of Consultation
        </Typography>
      </Box>
      <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#174a7c",
            fontWeight: 700,
            mb: 1.5,
            fontSize: '0.95rem'
          }}
        >
          {formattedDate}
        </Typography>
        {consultations.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              bgcolor: "#f8f9fa",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#617d98",
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
            >
              No appointments for this date
            </Typography>
          </Box>
        ) : (
          consultations.map((consultation, index) => {
            // Normalize appointment status for comparison
            const normalizedStatus = consultation.appointmentStatus?.toLowerCase();
            const isArrived = 
              normalizedStatus === 'arrived' || 
              normalizedStatus === 'consultation started' || 
              normalizedStatus === 'consultationstarted' || 
              arrivedConsultations.has(index);
            const isCompleted = normalizedStatus === 'completed' || normalizedStatus === 'complete';
            
            return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: isCompleted ? "#f5f5f5" : (isArrived ? "#f1f8ff" : "#e8f5e9"),
                p: 1.5,
                borderRadius: 2,
                border: isCompleted ? "1px solid #9e9e9e" : (isArrived ? "1px solid #2196F3" : "1px solid #4CAF50"),
                transition: 'all 0.2s ease',
                opacity: isCompleted ? 0.8 : 1,
                '&:hover': {
                  boxShadow: isCompleted ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
                  transform: isCompleted ? 'none' : 'translateY(-1px)'
                }
              }}
            >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
              {consultation.imageUrl && (
                <Box
                  component="img"
                  src={consultation.imageUrl}
                  alt={`${consultation.petName} image`}
                  sx={{ width: 45, height: 45, borderRadius: "50%", objectFit: "cover" }}
                />
              )}
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#174a7c", fontWeight: 600, fontSize: '0.875rem' }}>
                  {consultation.petName} of {consultation.ownerName?.replace(/\s+of Owner\s+\d+/gi, '')?.trim()}
                </Typography>
                <Typography variant="caption" sx={{ color: "#617d98", fontWeight: 500, fontSize: '0.75rem' }}>
                  TIME: {consultation.timeRange}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: isCompleted ? "#757575" : (isArrived ? "#2196F3" : "#4CAF50"), 
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  display: 'block',
                  mt: 0.5
                }}>
                  {consultation.appointmentStatus || 'SCHEDULED'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ ml: 1.5, flexShrink: 0 }}>
              {isCompleted ? (
                <Button
                  variant="contained"
                  onClick={() => handleViewCompleted(consultation)}
                  sx={{
                    bgcolor: "#757575",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    borderRadius: 1.5,
                    py: 0.75,
                    px: 2,
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#616161" },
                  }}
                >
                  VIEW
                </Button>
              ) : isArrived ? (
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.75,
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleConsultOnline(index, consultation)}
                    disabled={loadingConsultation.has(index)}
                    sx={{
                      bgcolor: "#2196F3",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      borderRadius: 1.5,
                      py: 0.75,
                      px: 1.5,
                      minWidth: { xs: 120, sm: 115 },
                      whiteSpace: "nowrap",
                      "&:hover": { bgcolor: "#1976D2" },
                      "&:disabled": { bgcolor: "#ccc" },
                    }}
                  >
                    {loadingConsultation.has(index) ? (
                      <CircularProgress size={14} sx={{ color: "#fff" }} />
                    ) : (
                      "ONLINE"
                    )}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleConsultOffline(index, consultation)}
                    disabled={loadingConsultation.has(index)}
                    sx={{
                      bgcolor: "#FF9800",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      borderRadius: 1.5,
                      py: 0.75,
                      px: 1.5,
                      minWidth: { xs: 120, sm: 115 },
                      whiteSpace: "nowrap",
                      "&:hover": { bgcolor: "#F57C00" },
                      "&:disabled": { bgcolor: "#ccc" },
                    }}
                  >
                    {loadingConsultation.has(index) ? (
                      <CircularProgress size={14} sx={{ color: "#fff" }} />
                    ) : (
                      "OFFLINE"
                    )}
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handleArrive(index, consultation)}
                  disabled={loadingArrive.has(index) || isCompleted}
                  sx={{
                    bgcolor: "#4CAF50",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    borderRadius: 1.5,
                    py: 0.75,
                    px: 2,
                    whiteSpace: "nowrap",
                    "&:hover": {
                      bgcolor: isCompleted ? "#ccc" : "#45a049",
                    },
                    "&:disabled": {
                      bgcolor: "#ccc",
                      color: "#999",
                    },
                  }}
                >
                  {loadingArrive.has(index) ? (
                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                  ) : (
                    "ARRIVE"
                  )}
                </Button>
              )}
            </Box>
          </Box>
          );
          })
        )}
      </CardContent>

      {/* Consultation Dialog - Used for both Online and Offline */}
      <Dialog open={openConsultationPopup} onClose={() => setOpenConsultationPopup(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {consultationType === 'online' ? 'Online Consultation' : 'Offline Consultation'}
          </Typography>
          <IconButton onClick={() => setOpenConsultationPopup(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ overflowY: "auto", maxHeight: "80vh" }}>
          {selectedConsultation && (() => {
            const normalizedStatus = selectedConsultation.appointmentStatus?.toLowerCase();
            const isCompleted = normalizedStatus === 'completed' || normalizedStatus === 'complete';
            return (
              <ConsultationPopup 
                consultation={selectedConsultation} 
                isCompleted={isCompleted}
                consultationType={consultationType}
                onCompleteConsultation={(consultation) => {
                  const index = consultations.findIndex(c => c.appointmentId === consultation.appointmentId);
                  if (index !== -1) {
                    handleCompleteConsultation(index, consultation);
                  }
                }}
              />
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ListOfConsultation;
