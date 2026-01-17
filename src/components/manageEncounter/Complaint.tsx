import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Paper,
  Stack,
  TextField,
  Button,
  Tooltip,
  FormControlLabel,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { MedicalRecord } from "./medical";

interface ComplaintEntry {
  date: string;
  time: string;
  description: string;
  isOpen: boolean;
  recordedBy: string;
}

interface ComplaintProps {
  record: MedicalRecord;
}

const Complaint: React.FC<ComplaintProps> = ({ record }) => {
  const [newComplaint, setNewComplaint] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] =
    useState<ComplaintEntry | null>(null);

  // Use record.complaints if available, fallback to dummy data
  const [complaintsHistory, setComplaintsHistory] = useState<ComplaintEntry[]>(
    record.complaints.length > 0
      ? record.complaints.map((complaint: any) => ({
          date: complaint.date,
          time: complaint.time,
          description: complaint.description,
          isOpen: complaint.isOpen ?? true,
          recordedBy:
            complaint.recordedBy ??
            (record.patientInfo.doctorName || "Unknown Doctor"),
        }))
      : [
          {
            date: "26/08/2025",
            time: "09:00 AM",
            description: "Patient reported mild fever and fatigue.",
            isOpen: true,
            recordedBy: "Dr. Smith",
          },
          {
            date: "25/08/2025",
            time: "02:30 PM",
            description: "Complained of occasional dizziness.",
            isOpen: false,
            recordedBy: "Dr. Jones",
          },
          {
            date: "24/08/2025",
            time: "11:15 AM",
            description: "Noted persistent cough and sore throat.",
            isOpen: true,
            recordedBy: "Dr. Lee",
          },
        ]
  );

  const handleAddComplaint = () => {
    if (!newComplaint.trim()) {
      alert("Please enter a complaint.");
      return;
    }
    const newEntry: ComplaintEntry = {
      date: new Date().toLocaleDateString("en-GB"),
      time: "01:19 PM", // Current time in IST
      description: newComplaint,
      isOpen,
      recordedBy: record.patientInfo.doctorName || "Unknown Doctor",
    };
    setComplaintsHistory([newEntry, ...complaintsHistory]);
    setNewComplaint("");
    setIsOpen(false); // Reset to false after adding
    console.log("New complaint added:", newEntry);
  };

  const handleClear = () => {
    setNewComplaint("");
    setIsOpen(false);
  };

  const handleFinish = () => {
    console.log("Finish clicked - Save to backend", complaintsHistory);
    // Implement save logic here
  };

  const handleCancel = () => {
    console.log("Cancel clicked - Discard changes");
    handleClear();
    // Implement navigation or close logic
  };

  const handleCloseComplaint = (index: number) => {
    const updatedHistory = [...complaintsHistory];
    updatedHistory[index] = { ...updatedHistory[index], isOpen: false };
    setComplaintsHistory(updatedHistory);
    console.log("Complaint closed at index:", index);
  };

  const handleRemoveComplaint = (index: number) => {
    if (window.confirm("Are you sure you want to remove this complaint?")) {
      setComplaintsHistory(complaintsHistory.filter((_, i) => i !== index));
      console.log("Complaint removed at index:", index);
    }
  };

  const handleShowComplaint = (complaint: ComplaintEntry) => {
    setSelectedComplaint(complaint);
  };

  const handleCloseDialog = () => {
    setSelectedComplaint(null);
  };

  return (
    <Box sx={{ p: 3, bgcolor: "grey.50", minHeight: "100vh" }}>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #4B6CB7 0%, #182848 100%)",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Complaints Overview
        </Typography>
        <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.9)">
          Detailed view of patient's complaints for{" "}
          {record.patientInfo.patientName}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              background:
                "linear-gradient(135deg, rgba(75, 108, 183, 0.05) 0%, rgba(24, 40, 72, 0.02) 100%)",
              "&:hover": {
                boxShadow: 6,
                transform: "translateY(-2px)",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Complaint History
                </Typography>
              }
              sx={{ pb: 1, px: 2 }}
            />
            <CardContent
              sx={{ pt: 0, overflow: "auto", maxHeight: 400, px: 2 }}
            >
              {complaintsHistory.length > 0 ? (
                complaintsHistory.map((complaint, index) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{ p: 2, mb: 2, bgcolor: "rgba(24, 40, 72, 0.05)" }}
                  >
                    <Stack spacing={1} alignItems="flex-start">
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ fontWeight: 500 }}
                      >
                        {complaint.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Reported: {complaint.date} {complaint.time} | Recorded
                        by: {complaint.recordedBy} |{" "}
                        <Typography
                          component="span"
                          color={
                            complaint.isOpen ? "error.main" : "success.main"
                          }
                        >
                          {complaint.isOpen ? "Open" : "Resolved"}
                        </Typography>
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Tooltip title="View complaint details">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleShowComplaint(complaint)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {complaint.isOpen && (
                          <Tooltip title="Close this complaint">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handleCloseComplaint(index)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Remove this complaint">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveComplaint(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Paper>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2, textAlign: "center" }}
                >
                  No complaints recorded.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              background:
                "linear-gradient(135deg, rgba(75, 108, 183, 0.05) 0%, rgba(24, 40, 72, 0.02) 100%)",
              "&:hover": {
                boxShadow: 6,
                transform: "translateY(-2px)",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Complaint Now
                </Typography>
              }
              sx={{ pb: 1, px: 2 }}
            />
            <CardContent sx={{ pt: 0, px: 2 }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Enter Complaint"
                  multiline
                  rows={4}
                  value={newComplaint}
                  onChange={(e) => setNewComplaint(e.target.value)}
                  placeholder="Describe the patient's complaint..."
                  required
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isOpen}
                      onChange={(e) => setIsOpen(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Mark as Open (Unresolved)"
                />
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 3, justifyContent: "flex-end" }}
                >
                  <Tooltip title="Add new complaint">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddComplaint}
                    >
                      Add
                    </Button>
                  </Tooltip>
                  <Tooltip title="Clear the form">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  </Tooltip>
                  <Tooltip title="Finish and save">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleFinish}
                    >
                      Finish
                    </Button>
                  </Tooltip>
                  <Tooltip title="Cancel changes">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </Tooltip>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog for showing complaint details */}
      <Dialog open={!!selectedComplaint} onClose={handleCloseDialog}>
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <Stack spacing={1}>
              <Typography variant="body1" color="text.primary">
                {selectedComplaint.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Reported: {selectedComplaint.date} {selectedComplaint.time}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Recorded by: {selectedComplaint.recordedBy}
              </Typography>
              <Typography
                variant="caption"
                color={selectedComplaint.isOpen ? "error.main" : "success.main"}
              >
                Status: {selectedComplaint.isOpen ? "Open" : "Resolved"}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Complaint;
