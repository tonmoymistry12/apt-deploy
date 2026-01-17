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
	Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ManageUsersEditProps } from "@/interfaces/manageUsersEdit";
import { User } from "@/interfaces/user";
import {
	getCityList,
	getAreaListSearchText,
} from "@/services/faclilityService";
import { editUser } from "@/services/userService";
import debounce from "lodash.debounce";
import Message from "../common/Message";

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

const ManageUsersEdit: React.FC<ManageUsersEditProps> = ({
	user,
	onSubmit,
	onCancel,
	roleGroupList = [],
}) => {
	const [formValues, setFormValues] = useState<User>({
		orgUserId: user.orgUserId || 0,
		userName: user.userName || "",
		roleName: user.roleName || "",
		userNameWithTitle: user.userNameWithTitle || "",
		email: user.email || "",
		userTitle: user.userTitle || "Mr.",
		firstName: user.firstName || "",
		lastName: user.lastName || "",
		cellNumber: user.cellNumber || "",
		imageFilePath: user.imageFilePath || "",
		addressLine1: user.addressLine1 || "",
		addressLine2: user.addressLine2 || "",
		pin: user.pin || "",
		city: user.city || "",
		state: user.state || "",
		country: user.country || "",
		areaName: user.areaName || "",
		profileDetails: user.profileDetails || "",
		activeInd: user.activeInd || 1,
		isDoctor: user.isDoctor || 0,
		userUid: user.userUid || 0,
		specialty: user.specialty || "",
		orgUserQlfn: user.orgUserQlfn || "",
		councilId: user.councilId || "",
		yearOfReg: user.yearOfReg || 0,
		cityId: user.cityId,
	});

	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(
		user.imageFilePath || null
	);
	const [cityOptions, setCityOptions] = useState<any[]>([]);
	const [areaOptions, setAreaOptions] = useState<any[]>([]);
	const [cityLoading, setCityLoading] = useState(false);
	const [areaLoading, setAreaLoading] = useState(false);
	const [selectedCity, setSelectedCity] = useState<any>(null);
	const [apiError, setApiError] = useState<string>("");
	const [areaMappingId, setAreaMappingId] = useState(user.cityMappingId);

	const [errors, setErrors] = useState<Partial<User & { image: string }>>({
		userTitle: "",
		firstName: "",
		email: "",
		addressLine1: "",
		city: "",
		areaName: "",
		country: "",
		state: "",
		pin: "",
		cellNumber: "",
		image: "",
		userName: "",
	});

	const validationRules: {
		[key in keyof (User & { image: string })]?: (
			value: any,
			preview?: string | null
		) => string;
	} = {
		userTitle: (value: string) => (value ? "" : "Title is required"),
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
		areaName: (value: string) => (value ? "" : "Area is required"),
		country: (value: string) => (value ? "" : "Country is required"),
		state: (value: string) => (value ? "" : "State is required"),
		pin: (value: string) => (value ? "" : "PIN is required"),
		cellNumber: (value: string) =>
			value
				? value.length === 10 && /^\d+$/.test(value)
					? ""
					: "Cell No. must be 10 digits"
				: "Cell No. is required",
		userName: (value: string) => (value ? "" : "Username is required"),
		image: (file: File | null, preview?: string | null | undefined) =>
			file || preview ? "" : "Image is required",
	};

	const validateForm = () => {
		const newErrors = Object.keys(validationRules).reduce((acc, key) => {
			if (key === "image") {
				acc[key] = validationRules[key]!(image, imagePreview);
			} else {
				(acc as any)[key] = (validationRules as any)[key]!(
					formValues[key as keyof typeof formValues]
				);
			}
			return acc;
		}, {} as typeof errors);

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

			const maxSize = 5 * 1024 * 1024;
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
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
	) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({
			...prev,
			[name]:
				validationRules[name as keyof typeof validationRules]?.(value) || "",
		}));
	};

	// Fetch city list based on search text
	const fetchCities = debounce(async (searchText: string) => {
		setCityLoading(true);
		try {
			const data = await getCityList(searchText);
			setCityOptions(data || []);
			setApiError("");
		} catch (error) {
			console.error("Error fetching cities:", error);
			setApiError("Failed to load city suggestions");
			setCityOptions([]);
		} finally {
			setCityLoading(false);
		}
	}, 400);

	// Fetch area list based on city and search text
	const fetchAreas = debounce(async (cityId: string, searchText: string) => {
		setAreaLoading(true);
		try {
			const data = await getAreaListSearchText(cityId, searchText);
			setAreaOptions(data || []);
			setApiError("");
		} catch (error) {
			console.error("Error fetching areas:", error);
			setApiError("Failed to load area suggestions");
			setAreaOptions([]);
		} finally {
			setAreaLoading(false);
		}
	}, 400);

	// Initialize selectedCity from initial user data
	useEffect(() => {
		if (user.city) {
			setSelectedCity({
				cityName: user.city,
				stateName: user.state || "",
				country: user.country || "",
				cityId: user.cityId || 0,
			});
			fetchCities(user.city);
		}
	}, [user.city, user.state, user.country, user.cityId]);

	// Update formValues when selectedCity changes
	useEffect(() => {
		if (selectedCity) {
			setFormValues((prev) => ({
				...prev,
				city: selectedCity.cityName,
				state: selectedCity.stateName || "",
				country: selectedCity.country || "",
				//areaName: '',
			}));
			const id = selectedCity.cityId ? selectedCity.cityId : user.cityId;
			const areas: any = fetchAreas(String(user.cityId), "");
			setAreaOptions(areas);
			setErrors((prev) => ({
				...prev,
				city: "",
				state: "",
				country: "",
				areaName: "",
			}));
		}
	}, [selectedCity]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			const formData = new FormData();

			// Required fields from payload spec
			formData.append("userName", localStorage.getItem("userName") || "");
			formData.append("userPwd", localStorage.getItem("userPwd") || ""); // 🔹 Do you want to hardcode or capture?
			formData.append("orgId", localStorage.getItem("orgId") || ""); // 🔹 Probably from context/auth?
			formData.append(
				"loggedinFacilityId",
				localStorage.getItem("loggedinFacilityId") || ""
			);
			formData.append("orgUserId", String(formValues.orgUserId));
			formData.append("userTitle", formValues.userTitle || "");
			formData.append("firstName", formValues.firstName || "");
			formData.append("lastName", formValues.lastName || "");
			formData.append("addressFirst", formValues.addressLine1 || "");
			formData.append("addressSecond", formValues.addressLine2 || "");
			formData.append("city", formValues.city || "");
			formData.append("areaName", formValues.areaName || "");
			formData.append("pin", formValues.pin || "");
			formData.append("state", formValues.state || "");
			formData.append("country", formValues.country || "");
			formData.append("activeInd", String(formValues.activeInd));
			formData.append("email", formValues.email || "");
			formData.append("cellNumber", formValues.cellNumber || "");
			formData.append("isDoctor", String(formValues.isDoctor ?? 0));
			formData.append("cityId", String(formValues.cityId || ""));
			formData.append("cityPincodeMappingId", areaMappingId || ""); // 🔹 Where to fetch this?

			// Image
			if (image) {
				formData.append("userImage", image);
			}
			console.log(formData);
			const result = await editUser(formData);
			onSubmit("success"); // forward to parent
		} catch (error: any) {
			onSubmit(error.response.data.message);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Grid container spacing={3}>
				{/* Title, First Name, Last Name in a row */}
				<Grid item xs={12} sm={4} md={2}>
					<FormControl fullWidth required error={!!errors.userTitle}>
						<InputLabel sx={{ color: "#0288d1" }}>Title</InputLabel>
						<Select
							name='userTitle'
							value={formValues.userTitle}
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
						{errors.userTitle && (
							<Typography variant='caption' color='error'>
								{errors.userTitle}
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
						error={!!errors.firstName}
						helperText={errors.firstName}
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
				{/* Username, Email in a row */}
				<Grid item xs={12} sm={6}>
					<StyledTextField
						label='Username'
						name='userName'
						value={formValues.userName}
						onChange={handleChange}
						required
						error={!!errors.userName}
						helperText={errors.userName}
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
						error={!!errors.email}
						helperText={errors.email}
					/>
				</Grid>
				{/* Address Line 1, Address Line 2 in a row */}
				<Grid item xs={12} sm={6}>
					<StyledTextField
						label='Address Line 1'
						name='addressLine1'
						value={formValues.addressLine1}
						onChange={handleChange}
						required
						error={!!errors.addressLine1}
						helperText={errors.addressLine1}
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
				{/* City, Area in a row */}
				<Grid item xs={12} sm={6}>
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
						value={selectedCity ? selectedCity.cityName : formValues.city || ""}
						onInputChange={(_, value) => {
							fetchCities(value);
						}}
						onChange={(_, value) => {
							if (value && typeof value !== "string") {
								setSelectedCity({ ...value, cityId: value.cityId });
							} else {
								setSelectedCity(null);
								setFormValues((prev) => ({
									...prev,
									city: value || "",
									state: "",
									country: "",
									areaName: "",
								}));
								setAreaOptions([]);
							}
							setApiError("");
						}}
						renderInput={(params) => (
							<StyledTextField
								{...params}
								label='City'
								required
								error={!!errors.city || !!apiError}
								helperText={errors.city || apiError}
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
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Autocomplete
						freeSolo
						loading={areaLoading}
						options={areaOptions || []}
						getOptionLabel={(option) =>
							typeof option === "string" ? option : `${option.areaName}`
						}
						value={formValues.areaName || ""}
						onInputChange={(_, value) => {
							if (selectedCity && selectedCity.cityId) {
								fetchAreas(String(selectedCity.cityId), value || "");
							}
						}}
						onFocus={() => {
							if (selectedCity && selectedCity.cityId && !areaOptions.length) {
								fetchAreas(String(selectedCity.cityId), "");
							}
						}}
						onChange={(_, value) => {
							if (typeof value === "string") {
								setFormValues((prev) => ({ ...prev, areaName: value }));
								setErrors((prev) => ({
									...prev,
									areaName: validationRules.areaName!(value),
								}));
							} else if (value && value.areaName) {
								setAreaMappingId(value?.cityPincodeMappingId || null);
								setFormValues((prev) => ({
									...prev,
									areaName: value.areaName,
								}));
								setErrors((prev) => ({ ...prev, areaName: "" }));
							}
							setApiError("");
						}}
						renderInput={(params) => (
							<StyledTextField
								{...params}
								label='Area'
								required
								helperText={
									!selectedCity
										? "Select a city first"
										: errors.areaName || apiError
								}
								error={!!errors.areaName || !!apiError}
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
				</Grid>
				{/* Country, State in a row */}
				<Grid item xs={12} sm={6}>
					<StyledTextField
						label='Country'
						name='country'
						value={formValues.country}
						onChange={handleChange}
						required
						error={!!errors.country}
						helperText={errors.country}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<StyledTextField
						label='State'
						name='state'
						value={formValues.state}
						onChange={handleChange}
						required
						error={!!errors.state}
						helperText={errors.state}
					/>
				</Grid>
				{/* PIN, Cell No. in a row */}
				<Grid item xs={12} sm={6}>
					<StyledTextField
						label='PIN'
						name='pin'
						value={formValues.pin}
						onChange={handleChange}
						required
						error={!!errors.pin}
						helperText={errors.pin}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<StyledTextField
						label='Cell No.'
						name='cellNumber'
						value={formValues.cellNumber}
						onChange={handleChange}
						type='tel'
						required
						error={!!errors.cellNumber}
						helperText={errors.cellNumber}
					/>
				</Grid>
				{/* Image Upload Section */}
				<Grid item xs={12} sm={6}>
					<Box
						sx={{
							bgcolor: "#f5f5f5",
							height: { xs: 80, sm: 90 },
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							borderRadius: 2,
							border: errors.image
								? "2px dashed #d32f2f"
								: "2px dashed #0288d1",
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
									width: "100",
									height: "100",
								}}
							/>
						) : (
							<Typography variant='body2' color='textSecondary'>
								Image Placeholder
							</Typography>
						)}
					</Box>
					{errors.image && (
						<Typography
							variant='caption'
							color='error'
							sx={{ mt: 1, display: "block" }}>
							{errors.image}
						</Typography>
					)}
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
						{(image || imagePreview) && (
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
				{/* Submit and Cancel Buttons */}
				<Grid item xs={12}>
					<Box
						sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
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
	);
};

export default ManageUsersEdit;
