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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MedicalRecord } from "./medical";

interface AllergyEntry {
  date: string;
  time: string;
  description: string;
  severity: "Mild" | "Moderate" | "Severe";
  isActive: boolean;
  recordedBy: string;
  id: string;
}

interface AllergyProps {
  record: MedicalRecord;
}

interface SortableItemProps {
  allergy: AllergyEntry;
  index: number;
  onShowAllergy: (allergy: AllergyEntry) => void;
  onResolveAllergy: (index: number) => void;
  onRemoveAllergy: (index: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  allergy,
  index,
  onShowAllergy,
  onResolveAllergy,
  onRemoveAllergy,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: allergy.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "move",
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={1}
      sx={{
        p: 1.5,
        mb: 1.5,
        bgcolor: "rgba(24, 40, 72, 0.05)",
        "&:hover": { bgcolor: "rgba(24, 40, 72, 0.1)" },
      }}
    >
      <Stack spacing={0.5} alignItems="flex-start">
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontWeight: 500, fontSize: "0.9rem" }}
        >
          {allergy.description} (Severity: {allergy.severity})
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Reported: {allergy.date} {allergy.time} | Recorded by:{" "}
          {allergy.recordedBy} |{" "}
          <Typography
            component="span"
            color={allergy.isActive ? "error.main" : "success.main"}
          >
            {allergy.isActive ? "Active" : "Resolved"}
          </Typography>
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
          <Tooltip title="View allergy details">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onShowAllergy(allergy)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {allergy.isActive && (
            <Tooltip title="Resolve this allergy">
              <IconButton
                size="small"
                color="secondary"
                onClick={() => onResolveAllergy(index)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Remove this allergy">
            <IconButton
              size="small"
              color="error"
              onClick={() => onRemoveAllergy(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            {...attributes}
            {...listeners}
            sx={{ cursor: "grab" }}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
};

const Allergy: React.FC<AllergyProps> = ({ record }) => {
  const [newAllergy, setNewAllergy] = useState("");
  const [severity, setSeverity] = useState<"Mild" | "Moderate" | "Severe">(
    "Mild"
  );
  const [isOtherAllergy, setIsOtherAllergy] = useState(false);
  const [isActive, setIsActive] = useState(true); // Default to Unresolved (true)
  const [selectedAllergy, setSelectedAllergy] = useState<AllergyEntry | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [allergiesHistory, setAllergiesHistory] = useState<AllergyEntry[]>(
    Array.isArray(record.allergies) && record.allergies.length > 0
      ? record.allergies.map((a, i) => ({ ...a, id: `allergy-${i}` }))
      : [
          {
            date: "26/08/2025",
            time: "09:00 AM",
            description: "Penicillin",
            severity: "Severe",
            isActive: true,
            recordedBy: "Dr. Smith",
            id: "allergy-0",
          },
          {
            date: "25/08/2025",
            time: "02:30 PM",
            description: "Pollen",
            severity: "Mild",
            isActive: false,
            recordedBy: "Dr. Jones",
            id: "allergy-1",
          },
          {
            date: "24/08/2025",
            time: "11:15 AM",
            description: "Peanuts",
            severity: "Moderate",
            isActive: true,
            recordedBy: "Dr. Lee",
            id: "allergy-2",
          },
        ]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setAllergiesHistory((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddAllergy = () => {
    if (isOtherAllergy && !newAllergy.trim()) {
      alert("Please enter an allergy description.");
      return;
    }
    const description = isOtherAllergy ? newAllergy : "Other";
    const newEntry: AllergyEntry = {
      date: new Date().toLocaleDateString("en-GB"),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      description,
      severity,
      isActive,
      recordedBy: record.patientInfo.doctorName || "Unknown Doctor",
      id: `allergy-${Date.now()}`,
    };
    setAllergiesHistory([newEntry, ...allergiesHistory]);
    setNewAllergy("");
    setSeverity("Mild");
    setIsOtherAllergy(false);
    setIsActive(true); // Reset to Unresolved
    console.log("New allergy added:", newEntry);
  };

  const handleClear = () => {
    setNewAllergy("");
    setSeverity("Mild");
    setIsOtherAllergy(false);
    setIsActive(true); // Reset to Unresolved
  };

  const handleCancel = () => {
    console.log("Cancel clicked - Discard changes");
    handleClear();
  };

  const handleResolveAllergy = (index: number) => {
    const updatedHistory = [...allergiesHistory];
    updatedHistory[index] = { ...updatedHistory[index], isActive: false };
    setAllergiesHistory(updatedHistory);
    console.log("Allergy resolved at index:", index);
  };

  const handleRemoveAllergy = (index: number) => {
    if (window.confirm("Are you sure you want to remove this allergy?")) {
      setAllergiesHistory(allergiesHistory.filter((_, i) => i !== index));
      console.log("Allergy removed at index:", index);
    }
  };

  const handleShowAllergy = (allergy: AllergyEntry) => {
    setSelectedAllergy(allergy);
  };

  const handleCloseDialog = () => {
    setSelectedAllergy(null);
  };

  const filteredAllergies = allergiesHistory.filter((allergy) =>
    allergy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 3 },
        bgcolor: "grey.50",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          background: "linear-gradient(135deg, #4B6CB7 0%, #182848 100%)",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Allergies Overview
        </Typography>
        <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.9)">
          Detailed view of patient&apos;s allergies for{" "}
          {record.patientInfo.patientName}
        </Typography>
      </Paper>

      <Grid container spacing={2}>
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
            role="region"
            aria-label="Allergy History"
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Allergy History
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              <Stack spacing={1.5}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label="Search Allergies"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        sx={{ color: "action.active", mr: 1, fontSize: "1rem" }}
                      />
                    ),
                  }}
                  placeholder="Search by allergy name..."
                  sx={{
                    "& .MuiInputBase-input": { py: 0.75, fontSize: "0.9rem" },
                  }}
                />
                <Box sx={{ maxHeight: 350, overflowY: "auto" }}>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={filteredAllergies.map((a) => a.id)}>
                      {filteredAllergies.length > 0 ? (
                        filteredAllergies.map((allergy, index) => (
                          <SortableItem
                            key={allergy.id}
                            allergy={allergy}
                            index={index}
                            onShowAllergy={handleShowAllergy}
                            onResolveAllergy={handleResolveAllergy}
                            onRemoveAllergy={handleRemoveAllergy}
                          />
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ p: 2, textAlign: "center", fontSize: "0.9rem" }}
                        >
                          No matching allergies found.
                        </Typography>
                      )}
                    </SortableContext>
                  </DndContext>
                </Box>
              </Stack>
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
            role="region"
            aria-label="Add New Allergy"
          >
            <CardHeader
              title={
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Add Allergy
                </Typography>
              }
              sx={{ pb: 0, px: 2 }}
            />
            <CardContent sx={{ pt: 1, pb: 2, px: 2 }}>
              <Stack spacing={1.5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isOtherAllergy}
                      onChange={(e) => setIsOtherAllergy(e.target.checked)}
                      aria-label="Other allergy checkbox"
                    />
                  }
                  label="Other Allergy"
                  sx={{
                    "& .MuiFormControlLabel-label": { fontSize: "0.9rem" },
                  }}
                />
                {isOtherAllergy && (
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Enter Allergy"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="e.g., Penicillin, Pollen, Peanuts..."
                    required
                    sx={{
                      "& .MuiInputBase-input": { py: 0.75, fontSize: "0.9rem" },
                    }}
                  />
                )}
                <Stack direction="row" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        onClick={() => setIsActive(true)} // Ensure only one is checked
                        aria-label="Unresolved allergy checkbox"
                      />
                    }
                    label="Unresolved"
                    sx={{
                      "& .MuiFormControlLabel-label": { fontSize: "0.9rem" },
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!isActive}
                        onChange={(e) => setIsActive(!e.target.checked)}
                        onClick={() => setIsActive(false)} // Ensure only one is checked
                        aria-label="Resolved allergy checkbox"
                      />
                    }
                    label="Resolved"
                    sx={{
                      "& .MuiFormControlLabel-label": { fontSize: "0.9rem" },
                    }}
                  />
                </Stack>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: "0.9rem" }}>Severity</InputLabel>
                  <Select
                    value={severity}
                    label="Severity"
                    onChange={(e) =>
                      setSeverity(
                        e.target.value as "Mild" | "Moderate" | "Severe"
                      )
                    }
                    sx={{
                      "& .MuiSelect-select": { py: 0.75, fontSize: "0.9rem" },
                    }}
                  >
                    <MenuItem value="Mild">Mild</MenuItem>
                    <MenuItem value="Moderate">Moderate</MenuItem>
                    <MenuItem value="Severe">Severe</MenuItem>
                  </Select>
                </FormControl>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 1.5, justifyContent: "flex-end" }}
                >
                  <Tooltip title="Add new allergy">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddAllergy}
                      size="small"
                      aria-label="Add new allergy"
                    >
                      Add
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
                  <Tooltip title="Cancel changes">
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
        </Grid>
      </Grid>

      <Dialog open={!!selectedAllergy} onClose={handleCloseDialog}>
        <DialogTitle>Allergy Details</DialogTitle>
        <DialogContent>
          {selectedAllergy && (
            <Stack spacing={1}>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ fontSize: "0.9rem" }}
              >
                {selectedAllergy.description} (Severity:{" "}
                {selectedAllergy.severity})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Reported: {selectedAllergy.date} {selectedAllergy.time}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Recorded by: {selectedAllergy.recordedBy}
              </Typography>
              <Typography
                variant="caption"
                color={selectedAllergy.isActive ? "error.main" : "success.main"}
              >
                Status: {selectedAllergy.isActive ? "Active" : "Resolved"}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Allergy;
