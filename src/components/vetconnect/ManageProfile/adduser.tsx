import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { SelectChangeEvent } from "@mui/material/Select";

interface AddUserProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  addType: string | null;
}

const AddUser: React.FC<AddUserProps> = ({ onSave, onCancel, addType }) => {
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    email: "",
    status: "Active",
    city: "",
    state: "",
    pin: "",
    country: "",
    address: "",
    institution: "",
    degree: "",
    fieldOfStudy: "",
    grade: "",
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
    jobTitle: "",
    employmentType: "",
    companyName: "",
    location: "",
  });

  const handleChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: string }>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleSelectChange =
    (field: string) => (event: SelectChangeEvent<string>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleDateChange = (field: string) => (date: Dayjs | null) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSave = () => {
    const data = {
      ...formData,
      startDate: formData.startDate
        ? formData.startDate.format("YYYY-MM-DD")
        : "",
      endDate: formData.endDate ? formData.endDate.format("YYYY-MM-DD") : "",
    };
    onSave(data);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Insurer Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            label="Name"
            fullWidth
            value={formData.name}
            onChange={handleChange("name")}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            label="Contact No."
            fullWidth
            value={formData.contactNo}
            onChange={handleChange("contactNo")}
            inputProps={{ pattern: "[0-9]{10}" }}
            helperText="Format: 10 digits"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleChange("email")}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={handleSelectChange("status")}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            label="City"
            fullWidth
            value={formData.city}
            onChange={handleChange("city")}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            label="State"
            fullWidth
            value={formData.state}
            onChange={handleChange("state")}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            label="PIN"
            fullWidth
            value={formData.pin}
            onChange={handleChange("pin")}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            label="Country"
            fullWidth
            value={formData.country}
            onChange={handleChange("country")}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            label="Address"
            fullWidth
            value={formData.address}
            onChange={handleChange("address")}
            multiline
            rows={4}
          />
        </Grid>
        {addType === "education" && (
          <>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                label="Institution"
                fullWidth
                value={formData.institution}
                onChange={handleChange("institution")}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                label="Degree"
                fullWidth
                value={formData.degree}
                onChange={handleChange("degree")}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Field of Study"
                fullWidth
                value={formData.fieldOfStudy}
                onChange={handleChange("fieldOfStudy")}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Grade"
                fullWidth
                value={formData.grade}
                onChange={handleChange("grade")}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={handleDateChange("startDate")}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={handleDateChange("endDate")}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </>
        )}
        {addType === "experience" && (
          <>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                label="Job Title"
                fullWidth
                value={formData.jobTitle}
                onChange={handleChange("jobTitle")}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                label="Employment Type"
                fullWidth
                value={formData.employmentType}
                onChange={handleChange("employmentType")}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Company Name"
                fullWidth
                value={formData.companyName}
                onChange={handleChange("companyName")}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Location"
                fullWidth
                value={formData.location}
                onChange={handleChange("location")}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={handleDateChange("startDate")}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={handleDateChange("endDate")}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </>
        )}
        {/*         <Grid item xs={12}>
          <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>
            Save
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default AddUser;
