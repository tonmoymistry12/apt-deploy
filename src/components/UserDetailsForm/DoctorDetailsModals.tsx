import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.scss";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "lodash.debounce";
import {
	getCityList,
	getAreaListSearchText,
} from "@/services/faclilityService";
import {
	addUser,
	editUser,
	getSpecalityList,
	checkDoctorRegistration,
} from "@/services/userService";
import { InputAdornment } from "@mui/material";

const specialties = [
	"Select",
	"General Medicine",
	"Pediatrics",
	"Surgery",
	"Clinical Pathology",
];

type Mode = "short" | "full";

const StyledTextField = ({ sx, ...props }: any) => (
	<TextField
		{...props}
		variant='outlined'
		fullWidth
		sx={{
			width: "254px",
			bgcolor: "white",
			borderRadius: 2,
			"& .MuiOutlinedInput-root": {
				"& fieldset": {
					borderColor: "#0288d1",
				},
				"&:hover fieldset": {
					borderColor: "#01579b",
				},
				"&.Mui-focused fieldset": {
					borderColor: "#01579b",
					boxShadow: "0 0 8px rgba(2, 136, 209, 0.3)",
				},
			},
			...sx,
		}}
	/>
);

interface Council {
	councilId: string;
	councilName: string;
}

interface Props {
	open: boolean;
	onClose: () => void;
	mode?: Mode;
	initialData?: any;
	type?: string;
	councilList: Council[];
	onProceed?: (
		data: {
			councilId: string;
			yearOfReg: string;
			regNo: string;
		},
		registrationResponse?: any
	) => void;
	onSubmit: (data: (any & { image?: File | null }) | null | string) => void;
}

const DoctorDetailsModal: React.FC<Props> = ({
	open,
	onClose,
	mode = "short",
	initialData,
	councilList,
	onProceed,
	onSubmit,
	type = "add",
}) => {
	// Shared fields

	const [councilId, setCouncilId] = useState("");
	const [yearOfReg, setYearOfReg] = useState("");
	const [regNo, setRegNo] = useState("");
	const [error, setError] = useState(false);
	const [councilError, setCouncilError] = useState("");
	const [yearError, setYearError] = useState("");
	const [regNoError, setRegNoError] = useState("");

	// Full mode validation errors
	const [titleError, setTitleError] = useState("");
	const [firstNameError, setFirstNameError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [specialtyError, setSpecialtyError] = useState("");
	const [qualificationError, setQualificationError] = useState("");
	const [addressLine1Error, setAddressLine1Error] = useState("");
	const [cityError, setCityError] = useState("");
	const [areaError, setAreaError] = useState("");
	const [countryError, setCountryError] = useState("");
	const [stateError, setStateError] = useState("");
	const [pinError, setPinError] = useState("");
	const [cellNumberError, setCellNumberError] = useState("");
	const [userNameError, setUserNameError] = useState("");

	// Full mode fields
	const [userTitle, setUserTitle] = useState("Dr.");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [specialty, setSpecialty] = useState<any>("");
	const [orgUserQlfn, setOrgUserQlfn] = useState("");
	const [addressLine1, setAddressLine1] = useState("");
	const [addressLine2, setAddressLine2] = useState("");
	const [city, setCity] = useState("");
	const [areaName, setAreaName] = useState("");
	const [country, setCountry] = useState("");
	const [state, setState] = useState("");
	const [pin, setPin] = useState("");
	const [cellNumber, setCellNumber] = useState("");
	const [userName, setUserName] = useState("");
	const [profileDetails, setProfileDetails] = useState("");
	const [areaMappingId, setAreaMappingId] = useState("");
	const [imageFilePath, setImageFilePath] = useState<any>(undefined);
	const [activeInd, setActiveInd] = useState("Active");

	// Autocomplete states
	const [specalityList, setSpecalityList] = useState<any[]>([]);
	const [cityOptions, setCityOptions] = useState<any[]>([]);
	const [areaOptions, setAreaOptions] = useState<any[]>([]);
	const [cityLoading, setCityLoading] = useState(false);
	const [areaLoading, setAreaLoading] = useState(false);
	const [selectedCity, setSelectedCity] = useState<any>(null);
	const [apiError, setApiError] = useState<string>(""); // Main error for registration check
	const [cityAreaError, setCityAreaError] = useState<string>(""); // Separate error for city/area autocomplete
	const [registrationData, setRegistrationData] = useState<any>(null);

	// Debounced city search
	const fetchCities = debounce(async (searchText: string) => {
		setCityLoading(true);
		try {
			const data = await getCityList(searchText);
			setCityOptions(data || []);
			setCityAreaError("");
		} catch (error) {
			setCityAreaError("Failed to load city suggestions");
			setCityOptions([]);
		} finally {
			setCityLoading(false);
		}
	}, 400);

	// Debounced area search
	const fetchAreas = debounce(async (cityId: string, searchText: string) => {
		setAreaLoading(true);
		try {
			const data = await getAreaListSearchText(cityId, searchText);
			setAreaOptions(data || []);
			setCityAreaError("");
		} catch (error) {
			setCityAreaError("Failed to load area suggestions");
			setAreaOptions([]);
		} finally {
			setAreaLoading(false);
		}
	}, 400);

	const fetchSpecalityList = async () => {
		const specalityList: any = await getSpecalityList();
		setSpecalityList(specalityList);
	};
	useEffect(() => {
		fetchSpecalityList();
		if (initialData) {
			// Shared fields for both modes
			setCouncilId(initialData.councilId || "");
			setYearOfReg(initialData.yearOfReg?.toString() || ""); // Convert number to string
			setRegNo(initialData.regNo || "");

			// Full mode fields
			if (mode === "full") {
				setUserTitle(initialData.userTitle || "Dr.");
				setFirstName(initialData.firstName || "");
				setLastName(initialData.lastName || "");
				setEmail(initialData.email || "");
				setRegNo(initialData.registrationNumber || "");
				setSpecialty(initialData.glbSpltyId || ""); // Ensure specialty is set
				setOrgUserQlfn(initialData.orgUserQlfn || "");
				setAddressLine1(initialData.addressLine1 || "");
				setAddressLine2(initialData.addressLine2 || "");
				setCity(initialData.city || "");
				setAreaName(initialData.areaName || "");

				setCountry(initialData.country || "");
				setState(initialData.state || "");
				setPin(initialData.pin || "");
				setCellNumber(initialData.cellNumber || ""); // Ensure cellNumber is set
				setUserName(initialData.userName || ""); // Ensure userName is set
				setProfileDetails(initialData.profileDetails || "");
				setImageFilePath(initialData.imageFilePath || undefined);
				setActiveInd(initialData.activeInd === 1 ? "Active" : "Inactive");
				setAreaMappingId(initialData.cityMappingId || "");
				// Initialize selectedCity
				if (initialData.city) {
					setSelectedCity({
						cityName: initialData.city,
						stateName: initialData.state || "",
						country: initialData.country || "",
						cityId: initialData.cityId || 0,
					});
					fetchCities(initialData.city);
					const areas: any = fetchAreas(String(initialData.cityId), "");
					setAreaOptions(areas);
				}
			}
		}
	}, [initialData, mode]);

	// Update state and country when selectedCity changes
	useEffect(() => {
		if (selectedCity) {
			setCity(selectedCity.cityName);
			setState(selectedCity.stateName || "");
			setCountry(selectedCity.country || "");
			// setAreaName('');
			// setAreaOptions([]);
		}
	}, [selectedCity]);

	const handleProceed = async () => {
		let valid = true;
		if (!councilId) {
			setCouncilError("Medical Council is required");
			valid = false;
		} else setCouncilError("");

		if (!yearOfReg) {
			setYearError("Year of Registration is required");
			valid = false;
		} else setYearError("");

		if (!regNo) {
			setRegNoError("Reg. No. is required");
			valid = false;
		} else setRegNoError("");

		if (!valid) {
			setError(true);
			return;
		}
		setError(false);

		// Call registration details API when in short mode
		if (mode === "short" && onProceed) {
			try {
				setApiError(""); // Clear previous errors

				// Call the API to check doctor registration
				const response = await checkDoctorRegistration({
					councilId,
					yearReg: yearOfReg,
					registrationNumber: regNo,
				});

				console.log("Registration check response:", response);
				console.log("Status message:", response.statusMessage);

				// Store registration response data
				setRegistrationData(response);

				// Check if doctor already exists on platform (check if firstName is not null)
				if (response.firstName || response.lastName || response.email) {
					// Doctor exists - show simple error message
					setApiError(
						`Doctor already exists with Reg No: ${
							response.registrationNumber || regNo
						}`
					);
					setError(true);
					return;
				}

				// Doctor not found - proceed to next step with registration response
				onProceed({ councilId, yearOfReg, regNo }, response);
			} catch (error: any) {
				console.error("Error checking doctor registration:", error);
				setApiError("Failed to verify doctor registration. Please try again.");
				setError(true);
			}
		}

		if (mode === "full") {
			// Validate all required fields in full mode
			let isValid = true;

			// Clear previous errors
			setTitleError("");
			setFirstNameError("");
			setEmailError("");
			setSpecialtyError("");
			setQualificationError("");
			setAddressLine1Error("");
			setCityError("");
			setAreaError("");
			setCountryError("");
			setStateError("");
			setPinError("");
			setCellNumberError("");
			setUserNameError("");

			// Validate required fields
			if (!userTitle || userTitle.trim() === "") {
				setTitleError("Title is required");
				isValid = false;
			}

			if (!firstName || firstName.trim() === "") {
				setFirstNameError("First Name is required");
				isValid = false;
			}

			if (!email || email.trim() === "") {
				setEmailError("Email is required");
				isValid = false;
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				setEmailError("Please enter a valid email address");
				isValid = false;
			}

			if (!specialty || specialty === "" || specialty === "Select") {
				setSpecialtyError("Speciality is required");
				isValid = false;
			}

			if (!orgUserQlfn || orgUserQlfn.trim() === "") {
				setQualificationError("Qualification is required");
				isValid = false;
			}

			if (!addressLine1 || addressLine1.trim() === "") {
				setAddressLine1Error("Address Line 1 is required");
				isValid = false;
			}

			if (!city || city.trim() === "" || !selectedCity) {
				setCityError("City is required");
				isValid = false;
			}

			if (!areaName || areaName.trim() === "") {
				setAreaError("Area is required");
				isValid = false;
			} else if (!selectedCity) {
				setAreaError("Please select a city first");
				isValid = false;
			}

			// Validate country - if city was selected from autocomplete, country should be auto-filled
			if (!country || country.trim() === "") {
				// Only show error if not auto-filled from city selection
				if (!selectedCity || !selectedCity.country) {
					setCountryError("Country is required");
					isValid = false;
				}
			} else {
				setCountryError("");
			}

			// Validate state - if city was selected from autocomplete, state should be auto-filled
			if (!state || state.trim() === "") {
				// Only show error if not auto-filled from city selection
				if (!selectedCity || !selectedCity.stateName) {
					setStateError("State is required");
					isValid = false;
				}
			} else {
				setStateError("");
			}

			// Validate PIN - might be auto-filled from area selection
			if (!pin || pin.trim() === "") {
				setPinError("PIN is required");
				isValid = false;
			} else {
				setPinError("");
			}

			if (!cellNumber || cellNumber.trim() === "") {
				setCellNumberError("Cell Number is required");
				isValid = false;
			}

			if (type === "add" && (!userName || userName.trim() === "")) {
				setUserNameError("User Name is required");
				isValid = false;
			}

			if (!isValid) {
				setError(true);
				return;
			}

			try {
				const formData = new FormData();

				// Common fields - Only include registration fields during add mode, not edit
				if (type === "add") {
					if (councilId) {
						formData.append("councilId", councilId);
					}
					if (yearOfReg) {
						formData.append("yearReg", yearOfReg);
					}
					if (regNo) {
						formData.append("registrationNumber", regNo);
					}
				}
				formData.append("userName", localStorage.getItem("userName") || "");
				formData.append("userPwd", localStorage.getItem("userPwd") || "");
				formData.append("orgId", localStorage.getItem("orgId") || "");
				formData.append(
					"loggedinFacilityId",
					localStorage.getItem("loggedinFacilityId") || ""
				);

				// Add adminIsADoctorConf field
				// "Yes" if logged-in user is adding themselves as doctor, "No" otherwise
				const adminIsDoctor =
					localStorage.getItem("adminIsADoctorConf") || "No";
				formData.append("adminIsADoctorConf", adminIsDoctor);

				// Add userUid if doctor exists in platform (from registration check response)
				if (initialData?.userUid) {
					formData.append("userUid", initialData.userUid.toString());
				}

				if (type == "add") {
					formData.append("userLogin", userName || "");
				} else {
					formData.append("orgUserId", initialData?.orgUserId || "0");
				}
				formData.append("userTitle", userTitle);
				formData.append("firstName", firstName);
				formData.append("lastName", lastName);
				formData.append("addressFirst", addressLine1);
				formData.append("addressSecond", addressLine2 || "");
				formData.append("city", city);
				formData.append("areaName", areaName);
				formData.append("pin", pin);
				formData.append("state", state);
				formData.append("country", country);
				if (type != "add") {
					formData.append("activeInd", activeInd === "Active" ? "1" : "0");
				}
				formData.append("email", email);
				formData.append("cellNumber", cellNumber);

				// Doctor-specific
				formData.append("isDoctor", "1");
				if (type == "add") {
					formData.append("specialtyId", specialty || "");
				} else {
					formData.append("specialtyId", specialty || "");
				}
				formData.append("qualification", orgUserQlfn || "");

				// City mapping
				if (type == "add") {
					formData.append(
						"cityMasterId",
						selectedCity?.cityId?.toString() || ""
					);
				} else {
					formData.append("cityId", selectedCity?.cityId?.toString() || "");
				}
				formData.append(
					"cityPincodeMappingId",
					areaMappingId?.toString() || ""
				);

				// File upload
				if (imageFilePath && imageFilePath instanceof File) {
					formData.append("userImage", imageFilePath);
				}
				let action = "";
				if (type == "add") {
					action = "add";
					const result = await addUser(formData);
					console.log("✅ Doctor added:", result);
				} else {
					const result = await editUser(formData);
					console.log("✅ Doctor updated:", result);
				}
				//console.log("✅ Doctor updated:", result);
				if (onSubmit) {
					onSubmit(action + "success");
				}
				onClose();
			} catch (err: any) {
				console.error("❌ Error updating doctor:", err);
				const errorMessage =
					err.response?.data?.message || "Failed to update doctor details";
				onSubmit(errorMessage);
			}
		}
	};

	const handleCancel = () => {
		setError(false);
		setApiError("");
		setCityAreaError("");
		onClose();
	};

	return (
		<Dialog
			open={open}
			maxWidth='md'
			fullWidth
			classes={{ paper: styles.modalPaper }}>
			<DialogTitle className={styles.title}>DOCTOR DETAILS</DialogTitle>
			<DialogContent>
				{error && !apiError && (
					<Typography color='error' sx={{ fontWeight: "bold", mb: 2 }}>
						Please provide the following details!
					</Typography>
				)}
				{apiError && (
					<Typography
						color='error'
						sx={{
							fontWeight: "bold",
							mb: 2,
							bgcolor: "#ffebee",
							p: 2,
							borderRadius: 1,
							border: "1px solid #ef5350",
						}}>
						{apiError}
					</Typography>
				)}
				<Box sx={{ display: "flex", gap: 2, mb: 3, mt: 3 }}>
					<FormControl fullWidth required error={!!councilError}>
						<InputLabel>Medical Council</InputLabel>
						<Select
							value={councilId}
							label='Medical Council'
							disabled={type === "edit"}
							onChange={(e) => setCouncilId(e.target.value)}>
							<MenuItem value=''>Select</MenuItem>
							{councilList.map((c) => (
								<MenuItem key={c.councilId} value={c.councilId}>
									{c.councilName}
								</MenuItem>
							))}
						</Select>
						{councilError && (
							<Typography color='error' variant='caption'>
								{councilError}
							</Typography>
						)}
					</FormControl>
					<TextField
						label='Year of Registration'
						value={yearOfReg}
						onChange={(e) => setYearOfReg(e.target.value)}
						fullWidth
						required
						type='number'
						disabled={type === "edit"}
						error={!!yearError}
						helperText={yearError}
					/>
					<TextField
						label='Reg. No.'
						value={regNo}
						onChange={(e) => setRegNo(e.target.value)}
						fullWidth
						required
						disabled={type === "edit"}
						error={!!regNoError}
						helperText={regNoError}
					/>
				</Box>
				{mode === "full" && (
					<Box
						sx={{
							display: { xs: "block", md: "flex" },
							gap: 4,
							alignItems: "flex-start",
							mb: 2,
						}}>
						{/* Left: Form fields */}
						<Box sx={{ flex: 2 }}>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='Title'
									value={userTitle}
									onChange={(e) => {
										setUserTitle(e.target.value);
										setTitleError("");
									}}
									sx={{ width: 80 }}
									required
									error={!!titleError}
									helperText={titleError}
								/>
								<TextField
									label='First Name'
									value={firstName}
									onChange={(e) => {
										setFirstName(e.target.value);
										setFirstNameError("");
									}}
									required
									sx={{ flex: 2 }}
									error={!!firstNameError}
									helperText={firstNameError}
								/>
								<TextField
									label='Last Name'
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									sx={{ flex: 2 }}
								/>
								<TextField
									label='Email'
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										setEmailError("");
									}}
									required
									sx={{ flex: 2 }}
									error={!!emailError}
									helperText={emailError}
									type='email'
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<FormControl fullWidth required error={!!specialtyError}>
									<InputLabel>Speciality</InputLabel>
									<Select
										value={specialty}
										label='Speciality'
										onChange={(e) => {
											setSpecialty(e.target.value);
											setSpecialtyError("");
										}}>
										<MenuItem value=''>Select</MenuItem>
										{specalityList.map((s) => (
											<MenuItem key={s.specialtyId} value={s.specialtyId}>
												{s.specialtyName}
											</MenuItem>
										))}
									</Select>
									{specialtyError && (
										<Typography color='error' variant='caption'>
											{specialtyError}
										</Typography>
									)}
								</FormControl>
								<TextField
									label='Qualification'
									value={orgUserQlfn}
									onChange={(e) => {
										setOrgUserQlfn(e.target.value);
										setQualificationError("");
									}}
									required
									fullWidth
									error={!!qualificationError}
									helperText={qualificationError}
								/>
							</Box>
							<TextField
								label='Address Line1'
								value={addressLine1}
								onChange={(e) => {
									setAddressLine1(e.target.value);
									setAddressLine1Error("");
								}}
								fullWidth
								required
								sx={{ mb: 2 }}
								error={!!addressLine1Error}
								helperText={addressLine1Error}
							/>
							<TextField
								label='Address Line2'
								value={addressLine2}
								onChange={(e) => setAddressLine2(e.target.value)}
								fullWidth
								sx={{ mb: 2 }}
							/>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<Autocomplete
									freeSolo
									loading={cityLoading}
									options={cityOptions}
									getOptionLabel={(option) =>
										typeof option === "string"
											? option
											: `${option.cityName}${
													option.stateName ? ", " + option.stateName : ""
											  }`
									}
									value={city || ""}
									onInputChange={(_, value) => {
										fetchCities(value);
									}}
									onChange={(_, value) => {
										if (value && typeof value !== "string") {
											setSelectedCity({ ...value, cityId: value.cityId });
											setCity(value.cityName);
											setState(value.stateName || "");
											setCountry(value.country || "");
											setAreaName("");
											setAreaOptions([]);
											// Clear errors for auto-filled fields
											setStateError("");
											setCountryError("");
											setPinError("");
										} else {
											setSelectedCity(null);
											setCity(value || "");
											setState("");
											setCountry("");
											setAreaName("");
											setAreaOptions([]);
										}
										setCityAreaError("");
										setCityError("");
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label='City'
											required
											error={!!cityError || !!cityAreaError}
											helperText={cityError || cityAreaError}
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<>
														{params.InputProps.endAdornment}
														<IconButton size='small'>
															<SearchIcon />
														</IconButton>
													</>
												),
											}}
										/>
									)}
									sx={{ flex: 1 }}
								/>
								<Autocomplete
									freeSolo
									loading={areaLoading}
									options={areaOptions || []}
									getOptionLabel={(option) =>
										typeof option === "string" ? option : `${option.areaName}`
									}
									value={areaName || ""}
									onInputChange={(_, value) => {
										if (selectedCity && selectedCity.cityId) {
											fetchAreas(String(selectedCity.cityId), value || "");
										}
									}}
									onFocus={() => {
										if (
											selectedCity &&
											selectedCity.cityId &&
											!areaOptions.length
										) {
											fetchAreas(String(selectedCity.cityId), "");
										}
									}}
									onChange={(_, value) => {
										if (typeof value === "string") {
											setAreaName(value);
										} else if (value && value.areaName) {
											setAreaName(value.areaName);
											setAreaMappingId(value.cityPincodeMappingId);
											setPin(value?.pincode || "");
											// Clear PIN error when auto-filled from area selection
											setPinError("");
										}
										setCityAreaError("");
										setAreaError("");
									}}
									renderInput={(params) => (
										<StyledTextField
											{...params}
											label='Area'
											required
											error={!!areaError}
											helperText={areaError}
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<>
														{params.InputProps.endAdornment}
														<InputAdornment position='end'>
															<SearchIcon sx={{ color: "#0288d1" }} />
														</InputAdornment>
													</>
												),
											}}
										/>
									)}
									disabled={!selectedCity}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='Country'
									value={country}
									onChange={(e) => {
										setCountry(e.target.value);
										setCountryError("");
									}}
									required
									sx={{ flex: 1 }}
									error={!!countryError}
									helperText={countryError}
								/>
								<TextField
									label='State'
									value={state}
									onChange={(e) => {
										setState(e.target.value);
										setStateError("");
									}}
									required
									sx={{ flex: 1 }}
									error={!!stateError}
									helperText={stateError}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='PIN'
									value={pin}
									onChange={(e) => {
										setPin(e.target.value);
										setPinError("");
									}}
									required
									sx={{ flex: 1 }}
									error={!!pinError}
									helperText={pinError}
								/>
								<TextField
									label='Cell No.'
									value={cellNumber}
									onChange={(e) => {
										setCellNumber(e.target.value);
										setCellNumberError("");
									}}
									required
									sx={{ flex: 1 }}
									error={!!cellNumberError}
									helperText={cellNumberError}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='User Name'
									value={userName}
									disabled={type === "edit" ? true : false}
									onChange={(e) => {
										setUserName(e.target.value);
										setUserNameError("");
									}}
									required={type === "add"}
									sx={{ flex: 1 }}
									error={!!userNameError}
									helperText={userNameError}
								/>
							</Box>
						</Box>
						{/* Right: Image upload, Status, Profile Details */}
						<Box
							sx={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "flex-start",
								mt: { xs: 2, md: 0 },
							}}>
							<Box
								sx={{
									width: 150,
									height: 150,
									border: "2px dashed #bfc5cc",
									borderRadius: 2,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									position: "relative",
									bgcolor: "#f5f5f5",
									transition: "border-color 0.2s",
									"&:hover": { borderColor: "#0288d1" },
									mb: 2,
								}}>
								<Avatar
									src={
										imageFilePath instanceof File
											? URL.createObjectURL(imageFilePath)
											: imageFilePath
									}
									alt='Doctor'
									sx={{
										width: 134,
										height: 134,
										bgcolor: "#e0e0e0",
										fontSize: 40,
										borderRadius: 2,
									}}>
									{!imageFilePath && userTitle?.[0]}
								</Avatar>
								{imageFilePath && (
									<IconButton
										size='small'
										sx={{
											position: "absolute",
											top: 4,
											right: 4,
											bgcolor: "white",
											p: 0.5,
										}}
										onClick={() => setImageFilePath(undefined)}>
										<CloseIcon fontSize='small' />
									</IconButton>
								)}
								<Tooltip title='Attach Image'>
									<IconButton
										component='label'
										sx={{
											position: "absolute",
											bottom: 4,
											right: 4,
											bgcolor: "#174a7c",
											color: "white",
											"&:hover": { bgcolor: "#0288d1" },
											boxShadow: 2,
										}}>
										<CameraAltIcon />
										<input
											type='file'
											accept='image/*'
											hidden
											onChange={(e) => {
												if (e.target.files && e.target.files[0]) {
													setImageFilePath(e.target.files[0]); // store File
												}
											}}
										/>
									</IconButton>
								</Tooltip>
							</Box>
							<FormControl fullWidth required sx={{ mb: 2 }}>
								<InputLabel>Status</InputLabel>
								<Select
									value={activeInd}
									label='Status'
									disabled={type === "edit" ? false : true}
									onChange={(e) => setActiveInd(e.target.value)}>
									<MenuItem value='Active'>Active</MenuItem>
									<MenuItem value='Inactive'>Inactive</MenuItem>
								</Select>
							</FormControl>
							<TextField
								label='Profile Details'
								value={profileDetails}
								onChange={(e) => setProfileDetails(e.target.value)}
								fullWidth
								sx={{ mb: 2 }}
							/>
						</Box>
					</Box>
				)}
			</DialogContent>
			<DialogActions sx={{ justifyContent: "center", mb: 2 }}>
				<Button
					onClick={handleProceed}
					variant='contained'
					className={styles.proceedButton}
					sx={{ mr: 2 }}>
					{mode === "short" ? "Proceed" : "Submit"}
				</Button>
				<Button
					onClick={handleCancel}
					variant='contained'
					className={styles.cancelButton}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DoctorDetailsModal;
