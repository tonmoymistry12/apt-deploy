import { useForm, Controller } from "react-hook-form";
import React, {
	useState,
	useRef,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";
import {
	TextField,
	Grid,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Switch,
	Box,
	FormGroup,
	Autocomplete,
} from "@mui/material";
import Message from "@/components/common/Message";
import debounce from "lodash.debounce";
import {
	getCityList,
	getAreaListSearchText,
	addNewFacility,
	checkDuplicateFacility,
} from "@/services/faclilityService";

interface FacilityFormData {
	facilityName: string;
	address1: string;
	address2: string;
	city: string;
	searcharea: string;
	pin: string;
	fees: string;
}

interface FacilityFormProps {
	open: boolean;
	handleClose: () => void;
	facilityType: string;
	initialData?: FacilityFormData;
	onSubmit: (
		data: FacilityFormData & {
			facilityType: string;
			patientsToView: number;
			internBilling: number;
		}
	) => void;
}

const AddFacility: React.FC<FacilityFormProps> = ({
	open,
	handleClose,
	facilityType,
	initialData,
	onSubmit,
}) => {
	const [patientsToView, setPatientsToView] = useState(false);
	const [internBilling, setInternBilling] = useState(false);
	const [error, setErrors] = useState<{ [key: string]: string }>({});
	const formRef = useRef<HTMLFormElement>(null);
	const [cityOptions, setCityOptions] = useState<any[]>([]);
	const [areaOptions, setAreaOptions] = useState<any[]>([]);
	const [cityLoading, setCityLoading] = useState(false);
	const [areaLoading, setAreaLoading] = useState(false);
	const [selectedCity, setSelectedCity] = useState<any>(null);
	const [selectedArea, setSelectedArea] = useState<any>(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<FacilityFormData>({
		defaultValues: initialData || {
			facilityName: "",
			address1: "",
			address2: "",
			city: "",
			searcharea: "",
			pin: "",
			fees: "",
		},
		mode: "onChange",
	});

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	/* const [form, setForm] = useState<FaclityServiceResponse>({
    ...facility,
    facilityColor: facility.facilityColor || '#1a365d',
    internBilling: Number(facility.internBilling) || 0,
    patientsToView: Number(facility.patientsToView) || 0,
  }); */

	const fetchCities = debounce(async (searchText: string) => {
		setCityLoading(true);
		try {
			const data = await getCityList(searchText);
			setCityOptions(data || []);
		} catch (e) {
			setCityLoading(false);
			setSnackbarMessage("Failed to load City List");
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
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
			setSnackbarMessage("Failed to load Area List");
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
			setCityLoading(false);
		} finally {
			setAreaLoading(false);
		}
	}, 400);

	const checkDuplicateName = async (
		e: any,
		fieldOnChange: (...event: any[]) => void
	) => {
		const value = e.target.value;
		fieldOnChange(value); // keep form state updated
		try {
			if (facilityType == "practice" && value.length >= 3) {
				const payload = {
					callingFrom: "app",
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					deviceStat: "M",
					orgId: localStorage.getItem("orgId") || "",
					facilityId: 0,
					facilityName: value,
				};
				const data = await checkDuplicateFacility(payload);
				console.log(data);
				setSnackbarMessage(data.message);
				if (data.status == "Success") {
					setSnackbarSeverity("success");
				} else {
					setSnackbarSeverity("error");
				}
				setOpenSnackbar(true);
				setCityLoading(false);
			}

			if (facilityType == "Tele Medicine" && value.length >= 3) {
				const payload = {
					callingFrom: "app",
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					deviceStat: "M",
					orgId: localStorage.getItem("orgId") || "",
					loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
					facilityName: value,
					facilityId: 0,
				};
				const data = await checkDuplicateFacility(payload);
				console.log(data);
				setSnackbarMessage(data.message);
				if (data.status == "Success") {
					setSnackbarSeverity("success");
				} else {
					setSnackbarSeverity("error");
				}

				setOpenSnackbar(true);
				setCityLoading(false);
			}

			// call debounced API
		} catch (e) {
			setSnackbarMessage("Failed to load Area List");
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
			setCityLoading(false);
		}
	};
	/*  const checkDuplicateName =  (e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (...event: any[]) => {
  
    try {
      const data = await checkDuplicateFacility(searchText);
      console.log(data)
    } catch(e){
     
      setSnackbarMessage('Failed to check facility name');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
    finally {
     
    }
  }, 400); */

	useEffect(() => {
		if (open) {
			if (initialData) {
				reset(initialData);
				setSelectedCity({ cityName: initialData.city }); // optionally fetchCities if needed
			} else {
				reset(); // clear form
				setSelectedCity(null);
				setAreaOptions([]);
			}
		}
	}, [open]);

	// When city changes, reset area
	/*  useEffect(() => {
      if (selectedCity) {
        setForm((prev) => ({ ...prev, city: selectedCity.cityName, cityId: selectedCity.cityId }));
        setAreaOptions([]);
        setForm((prev) => ({ ...prev, areaName: '', cityPincodeMappingId: 0 }));
      }
    }, [selectedCity]); */

	/* const handleFormSubmit = (data: FacilityFormData) => {
    onSubmit({
      ...data,
      facilityType,
      isFeeVisible,
      isBillingEnabled,
    });
    handleClose();
  }; */

	const handleFormSubmit = async (data: FacilityFormData) => {
		try {
			const payload = {
				...data,
				facilityType,
				patientsToView: patientsToView ? 1 : 0,
				internBilling: internBilling ? 1 : 0,
				callingFrom: "app",
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				facilityId: "0",
				loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
				orgId: localStorage.getItem("orgId") || "",
				city: selectedCity?.cityName || data.city,
				state: selectedCity?.stateName || "",
				country: selectedCity?.country || "",
				searcharea: selectedArea?.areaName || data.searcharea,
				cityPincodeMappingId: selectedArea?.cityPincodeMappingId || null,
				pin: selectedArea?.pincode || data.pin,
				facilityColor: "",
				facilityImagePath: "",
			};

			console.log("Submitting Payload:", payload); // Optional: debug

			// 🔁 make sure your parent accepts this shape
			await addNewFacility(payload);

			await onSubmit(payload);
			// handleClose();
		} catch (err: any) {
			if (err.response?.status === 400) {
				setErrors((prev) => ({
					...prev,
					general: err.response?.data?.message || "Invalid input",
				}));
				setSnackbarMessage("Unexpected error during form submit");
				setSnackbarSeverity("success");
				setOpenSnackbar(true);
			} else {
				console.error("Unexpected error during form submit:", err);
				setSnackbarMessage("Unexpected error during form submit");
				setSnackbarSeverity("success");
				setOpenSnackbar(true);
			}
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
			<DialogTitle sx={{ bgcolor: "#0c3c69", color: "white", py: 2, px: 3 }}>
				<Typography variant='h6'>Add New Facility ({facilityType})</Typography>
			</DialogTitle>
			<DialogContent>
				<form id='facility-form' onSubmit={handleSubmit(handleFormSubmit)}>
					<Grid container spacing={2} sx={{ pt: 2 }}>
						<Grid item xs={12} sm={4}>
							<Controller
								name='facilityName'
								control={control}
								rules={{
									required: "Facilty Name is required",
									pattern: {
										value: /^[A-Za-z\s]{2,}$/,
										message:
											"Only letters and spaces allowed, minimum 2 characters",
									},
								}}
								render={({ field }) => (
									<TextField
										{...field}
										label='Facilty Name *'
										fullWidth
										onBlur={(e) => checkDuplicateName(e, field.onChange)}
										variant='outlined'
										error={!!errors.facilityName}
										helperText={errors.facilityName?.message}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Controller
								name='address1'
								control={control}
								rules={{
									required: "Address Line 1 is required",
									pattern: {
										value: /^[A-Za-z0-9\s,.-]{5,}$/,
										message:
											"Minimum 5 characters, letters, numbers, spaces, commas, periods, or hyphens",
									},
								}}
								render={({ field }) => (
									<TextField
										{...field}
										label='Address Line 1 *'
										fullWidth
										variant='outlined'
										error={!!errors.address1}
										helperText={errors.address1?.message}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Controller
								name='address2'
								control={control}
								rules={{
									pattern: {
										value: /^[A-Za-z0-9\s,.-]*$/,
										message:
											"Letters, numbers, spaces, commas, periods, or hyphens only",
									},
								}}
								render={({ field }) => (
									<TextField
										{...field}
										label='Address Line 2'
										fullWidth
										variant='outlined'
										error={!!errors.address2}
										helperText={errors.address2?.message}
									/>
								)}
							/>
						</Grid>

						<Grid item xs={12} sm={4}>
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
						<Grid item xs={12} sm={4}>
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
						<Grid item xs={12} sm={4}>
							<Controller
								name='pin'
								control={control}
								rules={{
									required: "PIN is required",
								}}
								render={({ field }) => (
									<TextField
										{...field}
										label='PIN *'
										fullWidth
										variant='outlined'
										error={!!errors.pin}
										helperText={errors.pin?.message || "Enter 6-digit PIN"}
									/>
								)}
							/>
						</Grid>

						<Grid item xs={12}>
							<Controller
								name='fees'
								control={control}
								rules={{
									required: "Fees is required",
									pattern: {
										value: /^\d+(\.\d{1,2})?$/,
										message: "Must be a valid amount (e.g., 100 or 100.00)",
									},
									validate: (value) =>
										parseFloat(value) > 0 || "Fees must be greater than 0",
								}}
								render={({ field }) => (
									<TextField
										{...field}
										label='Fees *'
										fullWidth
										variant='outlined'
										error={!!errors.fees}
										helperText={
											errors.fees?.message ||
											"Enter amount (e.g., 100 or 100.00)"
										}
									/>
								)}
							/>
						</Grid>
					</Grid>

					{/* Toggle switches */}
					<Box mt={4}>
						<FormGroup>
							<Box display='flex' alignItems='center' mb={2}>
								<Typography sx={{ mr: 2 }}>
									This Fees will be displayed to be viewed by patients
								</Typography>
								<Box display='flex' alignItems='center' ml='auto'>
									<Typography>No</Typography>
									<Switch
										checked={patientsToView}
										onChange={() => setPatientsToView(!patientsToView)}
										color='error'
										sx={{ mx: 1 }}
									/>
									<Typography>Yes</Typography>
								</Box>
							</Box>
							<Box display='flex' alignItems='center'>
								<Typography sx={{ mr: 2 }}>
									Would you also like to use it to generate and track bills?
								</Typography>
								<Box display='flex' alignItems='center' ml='auto'>
									<Typography>No</Typography>
									<Switch
										checked={internBilling}
										onChange={() => setInternBilling(!internBilling)}
										color='error'
										sx={{ mx: 1 }}
									/>
									<Typography>Yes</Typography>
								</Box>
							</Box>
						</FormGroup>
					</Box>
				</form>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color='secondary' variant='outlined'>
					Cancel
				</Button>
				<Button
					type='submit'
					form='facility-form'
					color='primary'
					variant='contained'
					disabled={Object.keys(errors).length > 0}>
					Submit
				</Button>
			</DialogActions>
			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</Dialog>
	);
};

export default AddFacility;
