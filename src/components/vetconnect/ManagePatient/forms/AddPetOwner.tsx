import React, {
	useEffect,
	useRef,
	useState,
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
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "lodash.debounce";
import { useForm, Controller } from "react-hook-form";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
	getCityList,
	getAreaListSearchText,
	addNewFacility,
} from "@/services/faclilityService";
import { FaclityServiceResponse } from "@/interfaces/facilityInterface";
import { savePatient } from "@/services/managePatientService";

/* -------------------- Types -------------------- */

interface City {
	cityId: number;
	cityName: string;
	stateName?: string;
	country?: string;
}

interface Area {
	areaName: string;
	cityPincodeMappingId: number;
	pincode: string;
}

interface FormValues {
	firstName: string;
	lastName: string;
	gender: string;
	petName: string;
	petCategory: string;
	dob: string;
	email: string;
	phoneNumber: string;
	address1: string;
	address2: string;

	city: string;
	cityId: number | "";
	state: string;
	country: string;

	areaName: string;
	cityPincodeMappingId: number;
	pin: string;

	cityObj: City | null;
	areaObj: Area | null;
}

type AddPetOwnerProps = {
	onSubmit?: (facility: FaclityServiceResponse) => void;
};

/* -------------------- Component -------------------- */

const AddPetOwner = forwardRef(function AddPetOwner(
	{ onSubmit }: AddPetOwnerProps,
	ref
) {
	const {
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			firstName: "",
			lastName: "",
			gender: "",
			petCategory: "",
			petName: "",
			dob: "",
			email: "",
			phoneNumber: "",
			address1: "",
			address2: "",
			city: "",
			cityId: "",
			state: "",
			country: "",
			areaName: "",
			cityPincodeMappingId: 0,
			pin: "",
			cityObj: null,
			areaObj: null,
		},
	});

	const formRef = useRef<HTMLFormElement>(null);

	const [cityOptions, setCityOptions] = useState<City[]>([]);
	const [areaOptions, setAreaOptions] = useState<Area[]>([]);
	const [cityLoading, setCityLoading] = useState(false);
	const [areaLoading, setAreaLoading] = useState(false);

	const selectedCity = watch("cityObj");

	/* -------------------- Debounced APIs -------------------- */

	const fetchCities = debounce(async (text: string) => {
		setCityLoading(true);
		const data = await getCityList(text);
		setCityOptions(data || []);
		setCityLoading(false);
	}, 400);

	const fetchAreas = debounce(async (cityId: number, text: string) => {
		setAreaLoading(true);
		const data = await getAreaListSearchText(String(cityId), text);
		setAreaOptions(data || []);
		setAreaLoading(false);
	}, 400);

	/* -------------------- City Change Effect -------------------- */

	useEffect(() => {
		if (!selectedCity) return;

		setValue("city", selectedCity.cityName);
		setValue("cityId", selectedCity.cityId);
		setValue("state", selectedCity.stateName || "");
		setValue("country", selectedCity.country || "");
		setValue("areaName", "");
		setValue("cityPincodeMappingId", 0);
		setValue("pin", "");
		setAreaOptions([]);
	}, [selectedCity, setValue]);

	/* -------------------- Submit -------------------- */

	const submitCallbacksRef = useRef<{
		onSuccess?: () => void;
		onError?: () => void;
	}>({});
	const submitForm = async (data: FormValues) => {
		let callbacks: { onSuccess?: () => void; onError?: () => void } = {};
		const finalData = {
			//...data,
			loggedInFacilityId: localStorage.getItem("loggedinFacilityId"),
			callingFrom: "web",
			userName: localStorage.getItem("userName") || "",
			userPwd: localStorage.getItem("userPwd") || "",
			deviceStat: "M",
			orgId: localStorage.getItem("orgId") || "",
			facilityType: "practice",
			gender: data.gender,
			firstName: data.firstName,
			lastName: data.lastName,
			petName: data.petName,
			petCategory: data.petCategory,
			address1: data.address1,
			address2: data.address2,
			pin: data.pin,
			cityId: data.cityId,
			city: data.city,
			cityPincodeMappingId: data.cityPincodeMappingId,
			areaName: data.areaName,
			state: data.state,
			country: data.country,
			email: data.email,
			contactNo: data.phoneNumber,
			dob: data.dob,
		};
		console.log(finalData);
		try {
			await savePatient(finalData);
			submitCallbacksRef.current.onSuccess?.();
		} catch (error) {
			submitCallbacksRef.current.onError?.();
		}
		/* await addNewFacility({
			...data,
			loggedInFacilityId: localStorage.getItem("loggedinFacilityId"),
			callingFrom: "web",
			userName: localStorage.getItem("userName") || "",
			userPass: localStorage.getItem("userPwd") || "",
			deviceStat: "M",
			orgId: localStorage.getItem("orgId") || "",
			facilityType: "practice",
		}); */

		/* onSubmit?.(data as any);
		return true; */
	};

	useImperativeHandle(ref, () => ({
		submitForm: (callbacks?: {
			onSuccess?: () => void;
			onError?: () => void;
		}) => {
			submitCallbacksRef.current = callbacks || {};
			formRef.current?.requestSubmit(); // 🔥 triggers form submit
		},
	}));

	/* -------------------- UI -------------------- */

	return (
		<Box sx={{ p: 3 }}>
			<form ref={formRef} onSubmit={handleSubmit(submitForm)}>
				<Grid container spacing={2}>
					{/* First Name */}
					<Grid item xs={12} sm={4}>
						<Controller
							name='firstName'
							control={control}
							rules={{ required: "First Name is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='First Name'
									fullWidth
									error={!!errors.firstName}
									helperText={errors.firstName?.message}
								/>
							)}
						/>
					</Grid>

					{/* Last Name */}
					<Grid item xs={12} sm={4}>
						<Controller
							name='lastName'
							control={control}
							rules={{ required: "Last Name is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='Last Name'
									fullWidth
									error={!!errors.lastName}
									helperText={errors.lastName?.message}
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} sm={4}>
						<Controller
							name='petName'
							control={control}
							rules={{ required: "Pet Name is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='Pet Name'
									fullWidth
									error={!!errors.petName}
									helperText={errors.petName?.message}
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} sm={4}>
						<Controller
							name='petCategory'
							control={control}
							rules={{ required: "Category is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='Pet Category'
									fullWidth
									error={!!errors.petCategory}
									helperText={errors.petCategory?.message}
								/>
							)}
						/>
					</Grid>

					{/* Gender */}
					<Grid item xs={12} sm={4}>
						<Controller
							name='gender'
							control={control}
							rules={{ required: "Gender is required" }}
							render={({ field }) => (
								<FormControl fullWidth error={!!errors.gender}>
									<InputLabel>Gender</InputLabel>
									<Select {...field} label='Gender'>
										<MenuItem value='male'>Male</MenuItem>
										<MenuItem value='female'>Female</MenuItem>
									</Select>
								</FormControl>
							)}
						/>
					</Grid>

					<Grid item xs={12} sm={4}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<Controller
								name='dob'
								control={control}
								rules={{
									validate: (value) => {
										if (!value) return "Date Of Birth is required";

										const date = dayjs(value, "DD/MM/YYYY", true);
										if (!date.isValid())
											return "Enter a valid date (DD/MM/YYYY)";
										if (date.isAfter(dayjs(), "day"))
											return "Future dates are not allowed";

										return true;
									},
								}}
								render={({ field }) => (
									<DatePicker
										disableFuture
										label='Date of Birth'
										format='DD/MM/YYYY'
										value={
											dayjs(field.value, "DD/MM/YYYY", true).isValid()
												? dayjs(field.value, "DD/MM/YYYY")
												: null
										}
										onChange={(date) => {
											// Calendar selection
											if (date?.isValid()) {
												field.onChange(date.format("DD/MM/YYYY"));
											}
										}}
										onAccept={(date) => {
											// Capture typed valid input
											if (date?.isValid()) {
												field.onChange(date.format("DD/MM/YYYY"));
											}
										}}
										slots={{ textField: TextField }}
										slotProps={{
											textField: {
												fullWidth: true,
												error: !!errors.dob,
												helperText: errors.dob?.message,
											},
										}}
									/>
								)}
							/>
						</LocalizationProvider>
					</Grid>

					{/* Email */}
					<Grid item xs={12} sm={6}>
						<Controller
							name='email'
							control={control}
							rules={{ required: "Email is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='Email'
									fullWidth
									error={!!errors.email}
									helperText={errors.email?.message}
								/>
							)}
						/>
					</Grid>

					{/* Phone */}
					<Grid item xs={12} sm={6}>
						<Controller
							name='phoneNumber'
							control={control}
							rules={{ required: "Phone Number is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='Phone Number'
									fullWidth
									error={!!errors.phoneNumber}
									helperText={errors.phoneNumber?.message}
								/>
							)}
						/>
					</Grid>

					{/* Address */}
					<Grid item xs={12} sm={6}>
						<Controller
							name='address1'
							control={control}
							rules={{ required: "Address Line1 is required" }}
							render={({ field }) => (
								<TextField {...field} label='Address Line1' fullWidth />
							)}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Controller
							name='address2'
							control={control}
							render={({ field }) => (
								<TextField {...field} label='Address Line2' fullWidth />
							)}
						/>
					</Grid>

					{/* City */}
					<Grid item xs={12} sm={4}>
						<Controller
							name='cityObj'
							control={control}
							rules={{ required: "City is required" }}
							render={({ field }) => (
								<Autocomplete<City>
									{...field}
									options={cityOptions}
									loading={cityLoading}
									getOptionLabel={(o) =>
										`${o.cityName}${o.stateName ? ", " + o.stateName : ""}`
									}
									onInputChange={(_, v) => fetchCities(v)}
									onChange={(_, v) => field.onChange(v)}
									renderInput={(params) => (
										<TextField
											{...params}
											label='City'
											error={!!errors.cityObj}
											helperText={errors.cityObj?.message}
										/>
									)}
								/>
							)}
						/>
					</Grid>

					{/* Area */}
					<Grid item xs={12} sm={4}>
						<Controller
							name='areaObj'
							control={control}
							render={({ field }) => (
								<Autocomplete<Area>
									{...field}
									disabled={!selectedCity}
									options={areaOptions}
									loading={areaLoading}
									getOptionLabel={(o) => o.areaName}
									isOptionEqualToValue={(o, v) =>
										o.cityPincodeMappingId === v.cityPincodeMappingId
									}
									onInputChange={(_, v) =>
										selectedCity && fetchAreas(selectedCity.cityId, v)
									}
									onChange={(_, v) => {
										field.onChange(v);

										if (!v) return;

										// ✅ SET ALL DEPENDENT FIELDS
										setValue("areaName", v.areaName, { shouldValidate: true });
										setValue("cityPincodeMappingId", v.cityPincodeMappingId, {
											shouldValidate: true,
										});
										setValue("pin", v.pincode, { shouldValidate: true });
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label='Area'
											helperText={!selectedCity ? "Select city first" : ""}
										/>
									)}
								/>
							)}
						/>
					</Grid>

					{/* PIN */}
					<Grid item xs={12} sm={4}>
						<Controller
							name='pin'
							control={control}
							rules={{ required: "PIN is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='PIN'
									fullWidth
									error={!!errors.pin}
									helperText={errors.pin?.message}
								/>
							)}
						/>
					</Grid>

					{/* State */}
					<Grid item xs={12} sm={6}>
						<Controller
							name='state'
							control={control}
							rules={{ required: "State is required" }}
							render={({ field }) => (
								<TextField {...field} label='State' fullWidth />
							)}
						/>
					</Grid>

					{/* Country */}
					<Grid item xs={12} sm={6}>
						<Controller
							name='country'
							control={control}
							rules={{ required: "Country is required" }}
							render={({ field }) => (
								<TextField {...field} label='Country' fullWidth />
							)}
						/>
					</Grid>
				</Grid>
			</form>
		</Box>
	);
});

export default AddPetOwner;
