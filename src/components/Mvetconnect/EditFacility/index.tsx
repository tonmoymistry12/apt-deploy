import React, {
	useState,
	useRef,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";
import {
	Grid,
	TextField,
	MenuItem,
	Box,
	Select,
	InputLabel,
	FormControl,
	Button,
	Typography,
	Paper,
	RadioGroup,
	FormControlLabel,
	Radio,
	FormLabel,
} from "@mui/material";
import { CloudUpload, Search } from "@mui/icons-material";
import { HexColorPicker } from "react-colorful";
import { FaclityServiceResponse } from "@/interfaces/facilityInterface";
import { addNewFacility } from "@/services/faclilityService";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "lodash.debounce";
import {
	getCityList,
	getAreaListSearchText,
} from "@/services/faclilityService";

type Facility = {
	name: string;
	address: string;
	contact: string;
	pin: string;
	email: string;
	phone: string;
	plan?: string;
	status: string;
};

type EditFacilityProps = {
	facility: FaclityServiceResponse;
	isEdit?: boolean;
	onSubmit?: (facility: FaclityServiceResponse) => void;
};

const EditFacility = forwardRef(function EditFacility(
	{ facility, isEdit = true, onSubmit }: EditFacilityProps,
	ref
) {
	console.log("EditFacility props", facility);
	console.log(
		"internBilling from facility:",
		facility.internBilling,
		typeof facility.internBilling
	);
	console.log(
		"patientsToView from facility:",
		facility.patientsToView,
		typeof facility.patientsToView
	);
	const [form, setForm] = useState<FaclityServiceResponse>({
		...facility,
		facilityColor: facility.facilityColor || "#1a365d",
		internBilling: Number(facility.internBilling) || 0,
		patientsToView: Number(facility.patientsToView) || 0,
	});
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [themeColor, setThemeColor] = useState(
		facility.facilityColor || "#1a365d"
	);
	const [hexInput, setHexInput] = useState(facility.facilityColor || "#1a365d");
	const colorPickerRef = useRef<HTMLDivElement>(null);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const formRef = useRef<HTMLFormElement>(null);
	const [cityOptions, setCityOptions] = useState<any[]>([]);
	const [areaOptions, setAreaOptions] = useState<any[]>([]);
	const [cityLoading, setCityLoading] = useState(false);
	const [areaLoading, setAreaLoading] = useState(false);
	const [selectedCity, setSelectedCity] = useState<any>(null);

	// Debounced city search
	const fetchCities = debounce(async (searchText: string) => {
		setCityLoading(true);
		try {
			const data = await getCityList(searchText);
			setCityOptions(data || []);
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
		} finally {
			setAreaLoading(false);
		}
	}, 400);

	// When city changes, reset area
	useEffect(() => {
		if (selectedCity) {
			setForm((prev) => ({
				...prev,
				city: selectedCity.cityName,
				cityId: selectedCity.cityId,
			}));
			setAreaOptions([]);
			setForm((prev) => ({ ...prev, areaName: "", cityPincodeMappingId: 0 }));
		}
	}, [selectedCity]);

	useEffect(() => {
		console.log(
			"useEffect - facility.internBilling:",
			facility.internBilling,
			typeof facility.internBilling
		);
		console.log(
			"useEffect - facility.patientsToView:",
			facility.patientsToView,
			typeof facility.patientsToView
		);
		const updatedForm = {
			...facility,
			secondContactNo:
				facility.secondContactNo != null
					? String(facility.secondContactNo)
					: "",
			secondContactEmail:
				facility.secondContactEmail != null
					? String(facility.secondContactEmail)
					: "",
			contactPersonName:
				facility.contactPersonName != null
					? String(facility.contactPersonName)
					: "",
			city: facility.city != null ? String(facility.city) : "",
			areaName: facility.areaName != null ? String(facility.areaName) : "",
			facilityColor: facility.facilityColor || "#1a365d",
			internBilling: Number(facility.internBilling) || 0,
			patientsToView: Number(facility.patientsToView) || 0,
		};
		console.log(
			"Updated form internBilling:",
			updatedForm.internBilling,
			typeof updatedForm.internBilling
		);
		console.log(
			"Updated form patientsToView:",
			updatedForm.patientsToView,
			typeof updatedForm.patientsToView
		);
		setForm(updatedForm);
		setThemeColor(facility.facilityColor || "#1a365d");
		setHexInput(facility.facilityColor || "#1a365d");
	}, [facility]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				colorPickerRef.current &&
				!colorPickerRef.current.contains(event.target as Node)
			) {
				setShowColorPicker(false);
			}
		}
		if (showColorPicker) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showColorPicker]);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleColorChange = (color: string) => {
		setThemeColor(color);
		setForm((prev) => ({ ...prev, facilityColor: color }));
	};

	const handleHexInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setHexInput(value);

		// Validate hex color format
		const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
		if (hexRegex.test(value)) {
			setThemeColor(value);
			setForm((prev) => ({ ...prev, facilityColor: value }));
		}
	};

	const handleHexInputBlur = () => {
		// Reset to last valid color if input is invalid
		if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexInput)) {
			setHexInput(themeColor);
		}
	};

	// Update hexInput when themeColor changes from picker
	useEffect(() => {
		setHexInput(themeColor);
	}, [themeColor]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	// Validation
	const validate = () => {
		const newErrors: { [key: string]: string } = {};
		if (!form.facilityName) newErrors.facilityName = "Name is required";
		if (!form.address1) newErrors.address1 = "Address Line1 is required";
		if (!form.pin) newErrors.pin = "PIN is required";
		if (!form.state) newErrors.state = "State is required";
		if (!form.country) newErrors.country = "Country is required";
		if (!form.city) newErrors.city = "City is required";
		if (!form.firstContactEmail)
			newErrors.firstContactEmail = "Contact Email(1) is required";
		if (!form.firstContactNo)
			newErrors.firstContactNo = "Contact Phone(1) is required";
		if (!form.contactPersonName)
			newErrors.contactPersonName = "Contact Person is required";
		setErrors(newErrors);
		console.log("Validation errors:", newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Update submitForm to accept callbacks
	const handleFormSubmit = async (
		eventOrCallbacks?:
			| React.FormEvent
			| { onSuccess?: () => void; onError?: () => void }
	) => {
		let event: React.FormEvent | undefined = undefined;
		let callbacks: { onSuccess?: () => void; onError?: () => void } = {};
		if (
			eventOrCallbacks &&
			(eventOrCallbacks as React.FormEvent).preventDefault
		) {
			event = eventOrCallbacks as React.FormEvent;
		} else if (eventOrCallbacks && typeof eventOrCallbacks === "object") {
			callbacks = eventOrCallbacks as {
				onSuccess?: () => void;
				onError?: () => void;
			};
		}
		if (event) event.preventDefault();
		if (!validate()) return false;
		try {
			await addNewFacility({
				...form,
				loggedInFacilityId: localStorage.getItem("loggedinFacilityId"),
				callingFrom: "web",
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				orgId: localStorage.getItem("orgId") || "",
				facilityType: "practice",
			});

			if (onSubmit) onSubmit(form);
			if (callbacks.onSuccess) callbacks.onSuccess();
			return true;
		} catch (error) {
			if (callbacks.onError) callbacks.onError();
			return false;
		}
	};

	useImperativeHandle(ref, () => ({
		submitForm: handleFormSubmit,
	}));

	console.log("EditFacility form", form);
	console.log(
		"Final form.internBilling:",
		form.internBilling,
		typeof form.internBilling
	);
	console.log(
		"Final form.patientsToView:",
		form.patientsToView,
		typeof form.patientsToView
	);

	return (
		<Box sx={{ p: 3 }}>
			<form ref={formRef} onSubmit={handleFormSubmit}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth disabled>
							<InputLabel>No of Doctors</InputLabel>
							<Select defaultValue='2-10' label='No of Doctors'>
								<MenuItem value='1'>Only 1 Doctor</MenuItem>
								<MenuItem value='2-10'>From 2 to 10 Doctors</MenuItem>
								<MenuItem value='10+'>More than 10 Doctors</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='facilityName'
							label='Name'
							fullWidth
							value={form.facilityName}
							onChange={handleChange}
							disabled={isEdit}
							error={!!errors.facilityName}
							helperText={errors.facilityName}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='address1'
							label='Address Line1'
							fullWidth
							value={form.address1}
							onChange={handleChange}
							error={!!errors.address1}
							helperText={errors.address1}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='address2'
							label='Address Line2'
							fullWidth
							value={form.address2 || ""}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='firstContactNo'
							label='Contact Phone(1)'
							fullWidth
							value={form.firstContactNo}
							onChange={handleChange}
							error={!!errors.firstContactNo}
							helperText={errors.firstContactNo}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='firstContactEmail'
							label='Contact Email(1)'
							fullWidth
							value={form.firstContactEmail}
							onChange={handleChange}
							error={!!errors.firstContactEmail}
							helperText={errors.firstContactEmail}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='secondContactNo'
							label='Contact Phone(2)'
							fullWidth
							value={form.secondContactNo || ""}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='secondContactEmail'
							label='Contact Email(2)'
							fullWidth
							value={form.secondContactEmail || ""}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='contactPersonName'
							label='Contact Person'
							fullWidth
							value={form.contactPersonName}
							onChange={handleChange}
							error={!!errors.contactPersonName}
							helperText={errors.contactPersonName}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<InputLabel>Status</InputLabel>
							<Select
								name='status'
								value={form.status || ""}
								label='Status'
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										status: e.target.value as string,
									}))
								}>
								<MenuItem value='1'>Active</MenuItem>
								<MenuItem value='2'>Inactive</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={4}>
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
							value={selectedCity || form.city}
							onInputChange={(_, value) => {
								fetchCities(value);
							}}
							onChange={(_, value) => {
								setSelectedCity(value);
								if (value && typeof value !== "string") {
									setForm((prev) => ({
										...prev,
										city: value.cityName,
										cityId: value.cityId,
										state: value.stateName || "",
										country: value.country || "",
										areaName: "",
										cityPincodeMappingId: 0,
									}));
								}
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label='City'
									fullWidth
									error={!!errors.city}
									helperText={errors.city}
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
												{params.InputProps.endAdornment}
												<Search
													sx={{ color: "action.active", mr: 1, my: 0.5 }}
												/>
											</>
										),
									}}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Autocomplete
							freeSolo
							loading={areaLoading}
							options={areaOptions}
							getOptionLabel={(option) =>
								typeof option === "string"
									? option
									: `${option.areaName}${
											option.cityPincodeMappingId
												? " (" + option.cityPincodeMappingId + ")"
												: ""
									  }`
							}
							value={form.areaName || ""}
							onInputChange={(_, value) => {
								if (selectedCity && value)
									fetchAreas(String(selectedCity.cityId), value);
							}}
							onChange={(_, value) => {
								if (typeof value === "string") {
									setForm((prev) => ({
										...prev,
										areaName: value,
										cityPincodeMappingId: 0,
									}));
								} else if (value && value.areaName) {
									setForm((prev) => ({
										...prev,
										areaName: value.areaName,
										cityPincodeMappingId:
											Number(value.cityPincodeMappingId) || 0,
									}));
								}
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label='Area'
									fullWidth
									helperText={!selectedCity ? "Select a city first" : ""}
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<>
												{params.InputProps.endAdornment}
												<Search
													sx={{ color: "action.active", mr: 1, my: 0.5 }}
												/>
											</>
										),
									}}
								/>
							)}
							disabled={!selectedCity}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							name='pin'
							label='PIN'
							fullWidth
							value={form.pin}
							onChange={handleChange}
							error={!!errors.pin}
							helperText={errors.pin}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='state'
							label='State'
							fullWidth
							value={form.state}
							onChange={handleChange}
							error={!!errors.state}
							helperText={errors.state}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='country'
							label='Country'
							fullWidth
							value={form.country}
							onChange={handleChange}
							error={!!errors.country}
							helperText={errors.country}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl component='fieldset'>
							<FormLabel component='legend'>
								Will the fees be displayed to be viewed by patients:
							</FormLabel>
							<RadioGroup
								row
								name='internBilling'
								value={String(form.internBilling ?? 0)}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										internBilling: Number(e.target.value),
									}))
								}>
								<FormControlLabel value='0' control={<Radio />} label='No' />
								<FormControlLabel value='1' control={<Radio />} label='Yes' />
							</RadioGroup>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl component='fieldset'>
							<FormLabel component='legend'>
								Would you also like to use the fees to generate and track bills
								of patients:
							</FormLabel>
							<RadioGroup
								row
								name='patientsToView'
								value={String(form.patientsToView ?? 0)}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										patientsToView: Number(e.target.value),
									}))
								}>
								<FormControlLabel value='0' control={<Radio />} label='No' />
								<FormControlLabel value='1' control={<Radio />} label='Yes' />
							</RadioGroup>
						</FormControl>
					</Grid>
					{/* Image Upload and Color Picker in one row (unchanged) */}
					<Grid item xs={12}>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								mt: 2,
								border: "1px solid #e0e0e0",
								borderRadius: 2,
							}}>
							<Grid container spacing={2} alignItems='center'>
								<Grid item xs={12} sm={6}>
									<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
										<input
											accept='image/*'
											style={{ display: "none" }}
											id='facility-image-upload'
											type='file'
											onChange={handleImageChange}
										/>
										<label htmlFor='facility-image-upload'>
											<Box
												sx={{
													width: 80,
													height: 80,
													borderRadius: "4px",
													border: "1px solid #e0e0e0",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													cursor: "pointer",
													overflow: "hidden",
													position: "relative",
													"&:hover": {
														backgroundColor: "rgba(26, 54, 93, 0.04)",
													},
												}}>
												{previewImage ? (
													<img
														src={previewImage}
														alt='Facility preview'
														style={{
															width: "100%",
															height: "100%",
															objectFit: "cover",
														}}
													/>
												) : (
													<CloudUpload
														sx={{ color: "#1a365d", fontSize: 24 }}
													/>
												)}
											</Box>
										</label>
										<Box>
											<Typography
												variant='body2'
												sx={{ color: "#666", mb: 0.5 }}>
												Facility Image
											</Typography>
											<Typography variant='caption' sx={{ color: "#999" }}>
												Recommended size: 200x200px
											</Typography>
										</Box>
									</Box>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
										<Box sx={{ position: "relative" }} ref={colorPickerRef}>
											<Button
												variant='outlined'
												onClick={() => setShowColorPicker(!showColorPicker)}
												sx={{
													width: 80,
													height: 80,
													minWidth: 80,
													borderColor: themeColor,
													color: themeColor,
													p: 0,
													"&:hover": {
														borderColor: themeColor,
														backgroundColor: `${themeColor}10`,
													},
												}}>
												<Box
													sx={{
														width: "100%",
														height: "100%",
														backgroundColor: themeColor,
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}
												/>
											</Button>
											{showColorPicker && (
												<Box
													sx={{
														position: "absolute",
														top: "100%",
														left: 0,
														zIndex: 1000,
														mt: 1,
														p: 2,
														backgroundColor: "white",
														borderRadius: 1,
														boxShadow: 3,
													}}>
													<HexColorPicker
														color={themeColor}
														onChange={handleColorChange}
													/>
												</Box>
											)}
										</Box>
										<Box sx={{ flex: 1 }}>
											<Typography
												variant='body2'
												sx={{ color: "#666", mb: 0.5 }}>
												Select Color
											</Typography>
											<TextField
												size='small'
												value={hexInput}
												onChange={handleHexInputChange}
												onBlur={handleHexInputBlur}
												placeholder='#000000'
												sx={{
													"& .MuiOutlinedInput-root": {
														height: 32,
														fontSize: "0.875rem",
														"& input": {
															padding: "4px 8px",
														},
													},
												}}
											/>
										</Box>
									</Box>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</form>
		</Box>
	);
});

export default EditFacility;
