import React, { useState, ChangeEvent, useEffect } from "react";
import {
	Box,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Grid,
	Typography,
	InputAdornment,
	SelectChangeEvent,
	debounce,
	Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { addUser, checkDuplicateUsername } from "@/services/userService";
import {
	getAreaListSearchText,
	getCityList,
} from "@/services/faclilityService";
import { Controller, useForm } from "react-hook-form";
import Message from "../common/Message";

// Reusable StyledTextField component
const StyledTextField = ({ sx, ...props }: any) => (
	<TextField
		{...props}
		variant='outlined'
		fullWidth
		sx={{
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

// Reusable StyledButton component for consistent button styling
const StyledButton = ({ sx, ...props }: any) => (
	<Button
		{...props}
		sx={{
			borderRadius: 2,
			px: { xs: 2, sm: 3 },
			py: 1,
			fontSize: { xs: "0.75rem", sm: "0.875rem" },
			boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
			"&:hover": {
				boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
				transform: "translateY(-2px)",
			},
			...sx,
		}}
	/>
);

interface FormValues {
	username: string;
	title: string;
	firstName: string;
	lastName: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	searcharea: string;
	pin: string;
	state: string;
	country: string;
	email: string;
	cellNo: string;
	userLogin: string;
	userImage: FileList;
}

const UserDetailsForm: React.FC<any> = ({ onSubmit, onCancel, open }) => {
	const [cityOptions, setCityOptions] = useState<any[]>([]);
	const [areaOptions, setAreaOptions] = useState<any[]>([]);
	const [cityLoading, setCityLoading] = useState(false);
	const [areaLoading, setAreaLoading] = useState(false);
	const [selectedCity, setSelectedCity] = useState<any>(null);
	const [selectedArea, setSelectedArea] = useState<any>(null);

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success",
	);

	const [isDuplicate, setIsDuplicate] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<FormValues>({
		mode: "onChange",
	});

	const fetchCities = debounce(async (searchText: string) => {
		setCityLoading(true);
		try {
			const data = await getCityList(searchText);
			setCityOptions(data || []);
		} catch (e) {
			console.log(e);
		} finally {
			setCityLoading(false);
		}
	}, 400);

	const fetchAreas = debounce(async (cityId: string, searchText: string) => {
		setAreaLoading(true);
		try {
			const data = await getAreaListSearchText(cityId, searchText);
			setAreaOptions(data || []);
		} catch (e) {
			console.log(e);
		} finally {
			setAreaLoading(false);
		}
	}, 400);

	useEffect(() => {
		if (open) {
			reset(); // clear form
			setSelectedCity(null);
			setAreaOptions([]);
		}
	}, [open]);

	const [formValues, setFormValues] = useState({
		title: "Mr.",
		firstName: "",
		lastName: "",
		email: "",
		addressLine1: "",
		addressLine2: "",
		city: "",
		searcharea: "",
		country: "",
		state: "",
		pin: "",
		cellNo: "",
		username: "",
	});

	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const [errors1, setErrors] = useState({
		title: "",
		firstName: "",
		email: "",
		addressLine1: "",
		city: "",
		searcharea: "",
		country: "",
		state: "",
		pin: "",
		cellNo: "",
		//image: '',
	});

	const validationRules = {
		title: (value: string) => (value ? "" : "Title is required"),
		firstName: (value: string) => (value ? "" : "First Name is required"),
		email: (value: string) =>
			value
				? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
					? ""
					: "Invalid email format"
				: "Email is required",
		addressLine1: (value: string) =>
			value ? "" : "Address Line 1 is required",
		city: (value: string) => (value ? "" : "City is required"),
		searcharea: (value: string) => (value ? "" : "Area is required"),
		country: (value: string) => (value ? "" : "Country is required"),
		state: (value: string) => (value ? "" : "State is required"),
		pin: (value: string) => (value ? "" : "PIN is required"),
		cellNo: (value: string) =>
			value
				? value.length === 10 && /^\d+$/.test(value)
					? ""
					: "Cell No. must be 10 digits"
				: "Cell No. is required",
		//image: (file: File | null, imagePreview: string | null) => (file ? '' : 'Image is required'),
	};

	// const validateForm = () => {
	//   const newErrors = Object.keys(validationRules).reduce((acc, key) => {
	//     if (key === 'image') {
	//       acc[key] = validationRules[key](image);
	//     } else {
	//       acc[key] = validationRules[key](formValues[key as keyof typeof formValues]);
	//     }
	//     return acc;
	//   }, {} as typeof errors);

	//   setErrors(newErrors);
	//   return !Object.values(newErrors).some((error) => error !== '');
	// };

	const validateForm = () => {
		const newErrors = Object.keys(validationRules).reduce(
			(acc, key) => {
				/* if (key === 'image') {
        acc[key] = validationRules[key]!(image, imagePreview);
      } else { */
				(acc as any)[key] = (validationRules as any)[key]!(
					formValues[key as keyof typeof formValues],
				);
				// }
				return acc;
			},
			{} as typeof errors1,
		);

		setErrors(newErrors);
		return !Object.values(newErrors).some((error) => error !== "");
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
			if (!allowedTypes.includes(file.type)) {
				setErrors((prev) => ({
					...prev,
					image: "Only PNG, JPEG, or JPG files are allowed",
				}));
				return;
			}

			const maxSize = 5 * 1024 * 1024; // 5MB in bytes
			if (file.size > maxSize) {
				setErrors((prev) => ({
					...prev,
					image: "Image size must be less than 5MB",
				}));
				return;
			}

			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
			setErrors((prev) => ({ ...prev, image: "" }));
		}
	};

	const handleClearImage = () => {
		setImage(null);
		setImagePreview(null);
		setErrors((prev) => ({ ...prev, image: "" }));
	};

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent,
	) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleFormSubmit = async (e: any) => {
		// e.preventDefault();
		console.log(selectedArea);
		// if (!validateForm()) return;
		try {
			const formData = new FormData();

			// common fields (map from your form)
			formData.append("userName", localStorage.getItem("userName") || "");
			formData.append("userPwd", localStorage.getItem("userPwd") || ""); // replace with real value if available
			formData.append("orgId", localStorage.getItem("orgId") || "");
			formData.append(
				"loggedinFacilityId",
				localStorage.getItem("loggedinFacilityId") || "",
			);
			formData.append("userLogin", formValues.username); // update if editing existing user
			formData.append("userTitle", formValues.title);
			formData.append("firstName", formValues.firstName);
			formData.append("lastName", formValues.lastName);
			formData.append("addressFirst", formValues.addressLine1);
			formData.append("addressSecond", formValues.addressLine2 || "");
			formData.append("city", formValues.city);
			formData.append("areaName", selectedArea.areaName);
			formData.append("pin", formValues.pin);
			formData.append("state", formValues.state);
			formData.append("country", formValues.country);
			formData.append("activeInd", "1");
			formData.append("email", formValues.email);
			formData.append("cellNumber", formValues.cellNo);
			formData.append("isDoctor", "0");
			formData.append("cityMasterId", selectedArea.cityId);
			formData.append(
				"cityPincodeMappingId",
				selectedArea?.cityPincodeMappingId,
			);
			if (image) {
				formData.append("userImage", image);
			}
			const obj = Object.fromEntries(formData.entries());
			console.log("Form Data Object:", obj);
			const result = await addUser(formData);
			// call API
			// console.log("✅ Success:", result);
			onSubmit("success");
		} catch (err: any) {
			onSubmit(err.response.data.message);
			console.error("❌ Error:", err);
		}
	};

	const checkDuplicateName = async (userName: any) => {
		if (!userName.trim()) return;
		console.log(userName);
		try {
			const payload = {
				userName: userName,
			};

			// Replace this with your actual API function
			const response: any = await checkDuplicateUsername(payload);
			console.log(response);
			if (response.status === "notfound") {
				setOpenSnackbar(true);
				setIsDuplicate(false);
				setSnackbarSeverity("success");
				setSnackbarMessage(response.message);
			} else {
				setIsDuplicate(true);
				setOpenSnackbar(true);
				setSnackbarSeverity("error");
				setSnackbarMessage(response.message);
			}
		} catch (error) {
			setOpenSnackbar(true);
			setSnackbarSeverity("error");
			setSnackbarMessage("Error checking role name.");
		}
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	return (
		<Box
			sx={{
				p: { xs: 2, sm: 4 },
				maxWidth: 900,
				mx: "auto",
				bgcolor: "linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)",
				borderRadius: 3,
				boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
				border: "1px solid rgba(255, 255, 255, 0.3)",
				mt: 2,
				mb: 4,
			}}>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={4} md={2}>
						<FormControl fullWidth required error={!!errors1.title}>
							<InputLabel sx={{ color: "#0288d1" }}>Title</InputLabel>
							<Select
								name='title'
								value={formValues.title}
								onChange={handleChange}
								label='Title'
								sx={{
									bgcolor: "white",
									borderRadius: 2,
									"& .MuiOutlinedInput-notchedOutline": {
										borderColor: "#0288d1",
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: "#01579b",
									},
								}}>
								<MenuItem value='Mr.'>Mr.</MenuItem>
								<MenuItem value='Ms.'>Ms.</MenuItem>
								<MenuItem value='Mrs.'>Mrs.</MenuItem>
							</Select>
							{errors1.title && (
								<Typography variant='caption' color='error'>
									{errors1.title}
								</Typography>
							)}
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={4} md={5}>
						<StyledTextField
							label='First Name'
							name='firstName'
							value={formValues.firstName}
							onChange={handleChange}
							required
							error={!!errors1.firstName}
							helperText={errors1.firstName}
						/>
					</Grid>
					<Grid item xs={12} sm={4} md={5}>
						<StyledTextField
							label='Last Name'
							name='lastName'
							value={formValues.lastName}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<StyledTextField
							label='Username'
							name='username'
							value={formValues.username}
							onChange={handleChange}
							onBlur={() => checkDuplicateName(formValues.username)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<StyledTextField
							label='Email'
							name='email'
							value={formValues.email}
							onChange={handleChange}
							type='email'
							required
							error={!!errors1.email}
							helperText={errors1.email}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<StyledTextField
							label='Address Line 1'
							name='addressLine1'
							value={formValues.addressLine1}
							onChange={handleChange}
							required
							error={!!errors1.addressLine1}
							helperText={errors1.addressLine1}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<StyledTextField
							label='Address Line 2'
							name='addressLine2'
							value={formValues.addressLine2}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Controller
							name='city'
							control={control}
							rules={{ required: "City is required" }}
							render={({ field }) => (
								<Autocomplete
									loading={cityLoading}
									options={cityOptions}
									getOptionLabel={(option) =>
										typeof option === "string"
											? option
											: `${option.cityName}${
													option.stateName ? ", " + option.stateName : ""
												}`
									}
									value={selectedCity}
									onChange={(_, value) => {
										setSelectedCity(value || null);
										field.onChange(value?.cityName || "");
										setAreaOptions([]);
										if (value) {
											setFormValues((prev) => ({
												...prev,
												city: value.cityName || "",
												cityId: value.cityId || "",
												state: value.stateName || "",
												country: value.country || "",
												areaName: "",
												cityPincodeMappingId: 0,
											}));
										} else {
											setFormValues((prev) => ({
												...prev,
												city: "",
												cityId: "",
												state: "",
												country: "",
												areaName: "",
												cityPincodeMappingId: 0,
											}));
										}
									}}
									onInputChange={(_, value) => {
										fetchCities(value);
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label='City *'
											error={!!errors.city}
											helperText={errors.city?.message}
										/>
									)}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Controller
							name='searcharea'
							control={control}
							rules={{ required: "Area is required" }}
							render={({ field }) => (
								<Autocomplete
									loading={areaLoading}
									options={areaOptions}
									getOptionLabel={(option) =>
										typeof option === "string" ? option : option.areaName
									}
									onChange={(_, value) => {
										setSelectedArea(value || null);
										field.onChange(value?.areaName || "");
										setValue("pin", value?.pincode || "");
										setFormValues((prev) => ({
											...prev,
											pin: value?.pincode || "",
										}));
									}}
									onInputChange={(_, value) => {
										if (selectedCity?.cityId) {
											fetchAreas(String(selectedCity.cityId), value);
										}
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label='Area *'
											error={!!errors.searcharea}
											helperText={
												errors.searcharea?.message ||
												(!selectedCity ? "Select a city first" : "")
											}
										/>
									)}
									disabled={!selectedCity}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<StyledTextField
							label='Country'
							name='country'
							value={formValues.country}
							onChange={handleChange}
							required
							error={!!errors1.country}
							helperText={errors1.country}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<StyledTextField
							label='State'
							name='state'
							value={formValues.state}
							onChange={handleChange}
							required
							error={!!errors1.state}
							helperText={errors1.state}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<StyledTextField
							label='Pin'
							name='pin'
							value={formValues.pin}
							onChange={handleChange}
							required
							error={!!errors1.pin}
							helperText={errors1.pin}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<StyledTextField
							label='Cell No.'
							name='cellNo'
							value={formValues.cellNo}
							onChange={handleChange}
							type='tel'
							required
							error={!!errors1.cellNo}
							helperText={errors1.cellNo}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Box
							sx={{
								bgcolor: "#f5f5f5",
								height: { xs: 80, sm: 90 },
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 2,
								border: "2px dashed #0288d1",
								"&:hover": {
									borderColor: "#01579b",
									boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
								},
							}}>
							{imagePreview ? (
								<img
									src={imagePreview}
									alt='Preview'
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover",
										borderRadius: "8px",
									}}
								/>
							) : (
								<Box sx={{ textAlign: "center" }}>
									<Typography
										variant='body2'
										color='textSecondary'
										sx={{ mb: 1 }}>
										📷 Profile Photo
									</Typography>
									<Typography variant='caption' color='textSecondary'>
										Click "Attach Image" to upload
									</Typography>
								</Box>
							)}
						</Box>
						{/*  {errors1.image && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors1.image}
              </Typography>
            )} */}
						<Box
							sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "center" }}>
							<StyledButton
								variant='contained'
								color='primary'
								size='small'
								component='label'
								sx={{
									bgcolor: "#0288d1",
									"&:hover": { bgcolor: "#01579b" },
								}}>
								Attach Image
								<input
									type='file'
									accept='image/png, image/jpeg, image/jpg'
									hidden
									onChange={handleImageChange}
								/>
							</StyledButton>
							{image && (
								<StyledButton
									variant='outlined'
									color='secondary'
									size='small'
									onClick={handleClearImage}
									sx={{
										borderColor: "#d32f2f",
										color: "#d32f2f",
										"&:hover": {
											borderColor: "#b71c1c",
											color: "#b71c1c",
										},
									}}>
									Clear
								</StyledButton>
							)}
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "flex-end",
								gap: 2,
								mt: 2,
							}}>
							<StyledButton
								variant='outlined'
								onClick={onCancel}
								sx={{
									borderColor: "#d32f2f",
									color: "#d32f2f",
									"&:hover": {
										borderColor: "#b71c1c",
										color: "#b71c1c",
									},
								}}>
								Cancel
							</StyledButton>
							<StyledButton
								variant='contained'
								disabled={isDuplicate}
								type='submit'
								sx={{
									bgcolor: "#0288d1",
									"&:hover": { bgcolor: "#01579b" },
								}}>
								Save
							</StyledButton>
						</Box>
					</Grid>
				</Grid>
			</form>
			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</Box>
	);
};

export default UserDetailsForm;
