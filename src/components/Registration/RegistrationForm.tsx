"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Message from "@/components/common/Message";
import {
  GetCityListResponse,
  GetAreaListSearchTextResponse,
  AddNewOrganizationPayload,
  CheckDuplicateOrgPayload,
} from "@/interfaces/registrationInterface";
import {
  checkOrgCinLlpin,
  getCityList,
  getAreaListSearchText,
  checkDuplicateOrgUsername,
  addNewOrganization,
  checkDuplicateOrg,
  getNoOfDoctors,
} from "@/services/registrationService";
import SubscriptionTable from "./SubscriptionTable";

export interface RegistrationFormData {
  organizationName: string;
  cinNumber: string;
  llpinNumber: string;
  facilityName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  area: string;
  pincode: string;
  state: string;
  numberOfDoctors: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  preferredUsername: string;
}

const validationSchema: yup.ObjectSchema<RegistrationFormData> = yup.object().shape({
  organizationName: yup.string().required("Organization name is required"),
  cinNumber: yup.string().required("CIN number is required"),
  llpinNumber: yup.string().required("LLPIN number is required"),
  facilityName: yup.string().required("Facility name is required"),
  addressLine1: yup.string().required("Address is required"),
  addressLine2: yup.string().optional(),
  city: yup.string().required("City is required"),
  area: yup.string().required("Area is required"),
  pincode: yup
    .string()
    .required("Pincode must be 6 digits")
    .matches(/^\d{6}$/, "Pincode must be 6 digits"),
  state: yup.string().required("State is required"),
  numberOfDoctors: yup.string().required("Number of doctors is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(/^\d{10}$/, "Mobile number must be 10 digits"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  preferredUsername: yup.string().required("Preferred username is required"),
});

/* const doctorOptions = [
  { label: "1-5 Doctors", value: "1" },
  { label: "6-10 Doctors", value: "2" },
  { label: "11-20 Doctors", value: "3" },
  { label: "21-50 Doctors", value: "4" },
  { label: "50+ Doctors", value: "5" },
]; */

interface SearchFieldProps {
  field: any;
  label: React.ReactNode;
  placeholder: string;
  error: boolean;
  helperText: string | undefined;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChange?: (e: any) => void;
}

const RegistrationForm: React.FC = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      organizationName: "",
      cinNumber: "",
      llpinNumber: "",
      facilityName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      area: "",
      pincode: "",
      state: "",
      numberOfDoctors: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      preferredUsername: "",
    },
  });

  const [cities, setCities] = useState<GetCityListResponse[]>([]);
  const [doctorOptions, setDoctors] = useState<any[]>([]);
  const [areas, setAreas] = useState<GetAreaListSearchTextResponse[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "error"
  );
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [duration, setDuration] = useState()
  const [openDialog, setIsOpenDialog] = useState(false);
  let noOfDaysExtended 
  let provRegOrgId
  const selectedCity = watch("city");
  const selectedArea = watch("area");
  const cinNumber = watch("cinNumber");
  const llpinNumber = watch("llpinNumber");
  const preferredUsername = watch("preferredUsername");
  
   const fetchDoctors = async () => {
      try {
        const response = await getNoOfDoctors();
        if (Array.isArray(response)) {
          setDoctors(response);
        } else {
          setDoctors([]);
        }
      } catch (error: any) {
        setDoctors([]);
        setSnackbarMessage(
          error?.response?.data?.message || "Failed to fetch doctors"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setIsLoadingCities(false);
      }
    };

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const response = await getCityList({ searchText: "" });
        if (Array.isArray(response)) {
          setCities(response);
        } else {
          setCities([]);
          setSnackbarMessage("Invalid city data received");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error: any) {
        console.error("getCityList error:", error);
        setCities([]);
        setSnackbarMessage(
          error?.response?.data?.message || "Failed to fetch cities"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setIsLoadingCities(false);
      }
    };
    fetchCities();
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      if (selectedCity) {
        const selectedCityObj = cities.find(
          (city) => city.cityName === selectedCity
        );
        if (selectedCityObj) {
          setIsLoadingAreas(true);
          try {
            const response = await getAreaListSearchText({
              cityId: selectedCityObj.cityId.toString(),
              searchWith: "area",
              searchText: "",
            });
            
            if (Array.isArray(response)) {
              setAreas(response);
              setValue("area", "");
              setValue("pincode", "");
              setValue("state", selectedCityObj.stateName);
              
            } else {
              setAreas([]);
              setSnackbarMessage("Invalid area data received");
              setSnackbarSeverity("error");
              setOpenSnackbar(true);
            }
          } catch (error: any) {
            console.error("getAreaListSearchText error:", error);
            setAreas([]);
            setSnackbarMessage(
              error?.response?.data?.message || "Failed to fetch areas"
            );
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          } finally {
            setIsLoadingAreas(false);
          }
        }
      } else {
        setAreas([]);
        setValue("area", "");
        setValue("pincode", "");
        setValue("state", "");
      }
    };
    fetchAreas();
  }, [selectedCity, cities, setValue]);

  useEffect(() => {
    if (selectedArea) {
      const selectedAreaObj = areas.find(
        (area) => area.areaName === selectedArea
      );
      if (selectedAreaObj && selectedAreaObj.pincode) {
        setValue("pincode", selectedAreaObj.pincode);
      } else {
        setValue("pincode", "");
      }
    } else {
      setValue("pincode", "");
    }
  }, [selectedArea, areas, setValue]);

  const changeDoctor = (value:any) =>{
    
     const obj:any = doctorOptions.filter((x=>x.facilityTypeId == value))
    setDuration(obj)
   
    noOfDaysExtended = obj
   
   
    
  }

  const handleCinLlpinBlur = async () => {
    if (cinNumber && llpinNumber) {
      try {
        const response = await checkOrgCinLlpin({
          cinNo: cinNumber,
          llpinNo: llpinNumber,
        });
        
        if (response.datafound !== "true") {
          setSnackbarMessage("Invalid CIN or LLPIN number");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          
        } else if (response.is_expire === "1") {
          setSnackbarMessage(`Subscription expired on ${response.expire_date}`);
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          
        }
      } catch (error: any) {
        console.error("checkOrgCinLlpin error:", error);
        setSnackbarMessage(
          error?.response?.data?.message || "Failed to validate CIN/LLPIN"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        
      }
    }
  };

  const handleUsernameBlur = async () => {

    if (preferredUsername) {
      try {
        const response = await checkDuplicateOrgUsername({
          userName: preferredUsername,
        });
        
        if (response.status === "found") {
          setSnackbarMessage(response.message || "Username already taken");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          
        }
      } catch (error: any) {
        console.error("checkDuplicateOrgUsername error:", error);
        setSnackbarMessage(
          error?.response?.data?.message || "Failed to validate username"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const onSubmit: SubmitHandler<any> = async (data:any) => {
   
    //noOfDaysExtended = data.numberOfDoctors.trialPeriod
    try {
      const duplicatePayload: CheckDuplicateOrgPayload = {
        orgName: data.organizationName,
        firstName: data.firstName,
        email: data.email,
        phoneNumber: data.mobileNumber,
        city: data.city,
      };
      const duplicateResponse = await checkDuplicateOrg(duplicatePayload);
      setIsOpenDialog(true)
      
      if (duplicateResponse.datafound === "true") {
        setSnackbarMessage(
          `Clinic already registered with contact: ${duplicateResponse.contactname_found}. Contact support at ${duplicateResponse.contactus_email}.`
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
       
        return;
      } else if (duplicateResponse.is_expire === 1) {
        setSnackbarMessage(
          `Subscription expired on ${duplicateResponse.expire_date}`
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        
        return;
      }

      const selectedCityObj = cities.find(
        (city) => city.cityName === data.city
      );
      const selectedAreaObj = areas.find((area) => area.areaName === data.area);
      if (!selectedCityObj || !selectedAreaObj) {
        setSnackbarMessage("Please select a valid city and area");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
       
        return;
      }

      const payload: AddNewOrganizationPayload = {
        provOrgId: 0,
        orgName: data.organizationName,
        cinNo: data.cinNumber,
        llpinNo: data.llpinNumber,
        facilityName: data.facilityName,
        addr1: data.addressLine1,
        addr2: data.addressLine2 || "",
        searchCity: data.city,
        searchArea: data.area,
        pin: data.pincode,
        state: data.state,
        country: selectedCityObj.country,
        areaValueId: selectedAreaObj.cityPincodeMappingId.toString(),
        primaryFacilityTypeId: data.numberOfDoctors,
         /*  doctorOptions.find((opt) => opt.label === data.numberOfDoctors)
            ?.value || "1", */
        firstName: data.firstName,
        lastName: data.lastName,
        mobile: data.mobileNumber,
        email: data.email,
        userName: data.preferredUsername,
        subscriptionSetupMasterId: "1",
      };

      const response = await addNewOrganization(payload);
      
      provRegOrgId = response.provOrgId;
      if (response.datasaved === "true") {
        setSnackbarMessage(
          `Organization registered successfully! Provisional Org ID: ${response.provOrgId}`
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        localStorage.setItem("provOrgId", response.provOrgId.toString());
        reset();
        //router.push(`/roles?orgId=${response.provOrgId}`);
      } else {
        setSnackbarMessage("Failed to register organization");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        
      }
    } catch (error: any) {
     
      setSnackbarMessage(
        error?.response?.data?.message || "Failed to register organization"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);

    }
  };

  const handleReset = () => {
    reset();

  };

  const handleCancel = () => {
    reset();
    
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false)
  }

 
  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span>
      <span style={{ color: "#ef4444" }}>*</span> {children}
    </span>
  );

  const SearchField: React.FC<SearchFieldProps> = ({
    field,
    label,
    placeholder,
    error,
    helperText,
    options,
    disabled,
    onChange,
  }) => {
   
    return (
      <FormControl
        fullWidth
        size="small"
        error={error}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
            "&:hover fieldset": { borderColor: "#60a5fa" },
            "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
          },
          "& .MuiInputLabel-root": {
            color: "#fff !important",
            backgroundColor: "transparent !important",
          },
          "& .MuiInputBase-input": { color: "white" },
        }}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          {...field}
          label={label}
          placeholder={placeholder}
          disabled={disabled || options.length === 0}
          onChange={(e) => {
            field.onChange(e);
            if (onChange) onChange(e);
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                size="small"
                sx={{ padding: 0.5, color: "rgba(255, 255, 255, 0.7)" }}
                disabled
              >
                <Search fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ padding: 0.5, color: "rgba(255, 255, 255, 0.7)" }}
                onClick={() => {
                  field.onChange("");
                  if (onChange) onChange({ target: { value: "" } });
                }}
                disabled={disabled || options.length === 0}
              >
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          }
        >
          <MenuItem value="" disabled>
            <em>{options.length === 0 ? "Loading..." : placeholder}</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && (
          <Typography
            variant="caption"
            sx={{ mt: 0.5, ml: 1, color: "rgba(255, 255, 255, 0.8)" }}
          >
            {helperText}
          </Typography>
        )}
      </FormControl>
    );
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "960px", mx: "auto", p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            color: "white",
            py: 2,
            px: 3,
            textAlign: "center",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
            Register Your Clinic
          </Typography>
        </Box>
        <Box sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="organizationName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label={
                        <RequiredLabel>Name of the Organization</RequiredLabel>
                      }
                      placeholder="Enter organization name"
                      error={!!errors.organizationName}
                      helperText={errors.organizationName?.message}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                          backgroundColor: "transparent",
                        },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                          backgroundColor: "transparent",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="cinNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label={<RequiredLabel>CIN No.</RequiredLabel>}
                      placeholder="Enter CIN number"
                      error={!!errors.cinNumber}
                      helperText={errors.cinNumber?.message}
                      onBlur={() => {
                        field.onBlur();
                        handleCinLlpinBlur();
                      }}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="llpinNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label={<RequiredLabel>LLPIN No.</RequiredLabel>}
                      placeholder="Enter LLPIN number"
                      error={!!errors.llpinNumber}
                      helperText={errors.llpinNumber?.message}
                      onBlur={() => {
                        field.onBlur();
                        handleCinLlpinBlur();
                      }}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider
              sx={{ my: 3, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            />

            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: "bold", color: "white" }}
            >
              <RequiredLabel>Primary Facility</RequiredLabel>
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="facilityName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label={<RequiredLabel>Facility Name</RequiredLabel>}
                      placeholder="Enter facility name"
                      error={!!errors.facilityName}
                      helperText={errors.facilityName?.message}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="addressLine1"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label={<RequiredLabel>Address Line 1</RequiredLabel>}
                      placeholder="Enter address"
                      error={!!errors.addressLine1}
                      helperText={errors.addressLine1?.message}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="addressLine2"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Address Line 2"
                      placeholder="Enter address line 2 (optional)"
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <SearchField
                      field={field}
                      label={<RequiredLabel>City</RequiredLabel>}
                      placeholder="Select city"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      options={cities.map((city) => ({
                        value: city.cityName,
                        label: city.cityName,
                      }))}
                      disabled={isLoadingCities}
                    />
                  )}
                />
                {isLoadingCities && (
                  <CircularProgress size={20} sx={{ ml: 2, mt: 1 }} />
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="area"
                  control={control}
                  render={({ field }) => (
                    <SearchField
                      field={field}
                      label={<RequiredLabel>Area</RequiredLabel>}
                      placeholder="Select area"
                      error={!!errors.area}
                      helperText={errors.area?.message}
                      options={areas.map((area) => ({
                        value: area.areaName,
                        label: area.areaName,
                      }))}
                      disabled={isLoadingAreas || !selectedCity}
                      onChange={(e) => {
                        const selectedAreaObj = areas.find(
                          (area) => area.areaName === e.target.value
                        );
                        if (selectedAreaObj && selectedAreaObj.pincode) {
                          setValue("pincode", selectedAreaObj.pincode);

                        } else {
                          setValue("pincode", "");
                
                        }
                      }}
                    />
                  )}
                />
                {isLoadingAreas && (
                  <CircularProgress size={20} sx={{ ml: 2, mt: 1 }} />
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="pincode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label={<RequiredLabel>Pincode</RequiredLabel>}
                      placeholder="Enter or select area to auto-fill"
                      error={!!errors.pincode}
                      helperText={errors.pincode?.message}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label={<RequiredLabel>State</RequiredLabel>}
                      placeholder="Select city to populate state"
                      error={!!errors.state}
                      helperText={errors.state?.message}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="numberOfDoctors"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.numberOfDoctors}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                      }}
                    >
                      <InputLabel>
                        <RequiredLabel>No. of Doctors</RequiredLabel>
                      </InputLabel>
                      <Select {...field} onChange={(event) => {
        field.onChange(event); // ✅ This updates the form value
        changeDoctor(event.target.value); // ✅ This calls your custom handler
      }} label="No. of Doctors">
                        <MenuItem value="">
                          <em>Select facility size</em>
                        </MenuItem>
                        {doctorOptions.map((option:any) => (

                          <MenuItem  key={option.facilityTypeId} value={option.facilityTypeId}>
                            {option.facilityType}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.numberOfDoctors && (
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.5,
                            ml: 1,
                            color: "rgba(255, 255, 255, 0.8)",
                          }}
                        >
                          {errors.numberOfDoctors.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>

            <Divider
              sx={{ my: 3, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            />

            <Typography
              variant="subtitle1"
              sx={{ mb: 2, fontWeight: "bold", color: "white" }}
            >
              <RequiredLabel>Contact Person</RequiredLabel>
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label={<RequiredLabel>First Name</RequiredLabel>}
                      placeholder="Enter first name"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label={<RequiredLabel>Last Name</RequiredLabel>}
                      placeholder="Enter last name"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label={<RequiredLabel>Mobile No.</RequiredLabel>}
                      placeholder="Enter 10-digit mobile number"
                      error={!!errors.mobileNumber}
                      helperText={errors.mobileNumber?.message}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      type="email"
                      label={<RequiredLabel>Email</RequiredLabel>}
                      placeholder="Enter email address"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider
              sx={{ my: 3, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            />

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="preferredUsername"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label={<RequiredLabel>Preferred Username</RequiredLabel>}
                      placeholder="Enter preferred username"
                      error={!!errors.preferredUsername}
                      helperText={errors.preferredUsername?.message}
                      onBlur={() => {
                        field.onBlur();
                        handleUsernameBlur();
                      }}
                      variant="outlined"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": { borderColor: "#60a5fa" },
                          "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#fff !important",
                          backgroundColor: "transparent !important",
                        },
                        "& .MuiInputBase-input": { color: "white" },
                        "& .MuiFormHelperText-root": {
                          color: "rgba(255, 255, 255, 0.8)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                type="button"
                variant="contained"
                onClick={handleReset}
                size="medium"
                sx={{
                  backgroundColor: "#60a5fa",
                  "&:hover": { backgroundColor: "#3b82f6" },
                  px: 4,
                  py: 1,
                  borderRadius: "8px",
                  color: "white",
                }}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                size="medium"
                sx={{
                  backgroundColor: isSubmitting ? "#a0a0a0" : "#60a5fa",
                  "&:hover": {
                    backgroundColor: isSubmitting ? "#a0a0a0" : "#3b82f6",
                  },
                  px: 4,
                  py: 1,
                  borderRadius: "8px",
                  color: "white",
                }}
              >
                Subscribe & Register
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={handleCancel}
                size="medium"
                sx={{
                  backgroundColor: "#60a5fa",
                  "&:hover": { backgroundColor: "#3b82f6" },
                  px: 4,
                  py: 1,
                  borderRadius: "8px",
                  color: "white",
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
        <Message
          openSnackbar={openSnackbar}
          handleCloseSnackbar={handleCloseSnackbar}
          snackbarSeverity={snackbarSeverity}
          snackbarMessage={snackbarMessage}
        />

      <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>
                  <Box bgcolor="#0a3c6b" color="white" p={1} textAlign="center">
                    <Typography variant="h6">Subscribe and register</Typography>
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <SubscriptionTable open={openDialog} noOfDaysExtended={duration} provRegOrgId={provRegOrgId}/>
                </DialogContent>
              </Dialog>
      </Paper>
    </Box>
  );
};

export default RegistrationForm;
