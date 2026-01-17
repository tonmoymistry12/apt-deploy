import React, { useEffect, useRef, useState } from "react";
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
	Stack,
	Chip,
	Card,
	CardContent,
	CardMedia,
	FormControlLabel,
	Switch,
	Divider,
	TableContainer,
	Paper,
	Table,
	TableRow,
	TableHead,
	TableCell,
	TableBody,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import styles from "./styles.module.scss";
import UploadBadge from "@/components/common/uploadBadge/UploadBadge";
import { dietData, dseaseHistory } from "./data/chipData";
import { ChipData } from "./interfaces/ChipData";
import CummonDialog from "@/components/common/CummonDialog";
import AddPet, { AddPetRef } from "./forms/AddPet";
import AddDocument, { AddDocumentRef } from "./forms/AddDocument";
import MonthList from "./forms/MonthList";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
	getPetDetails,
	savePatient,
	savePetCall,
	uploadDocument,
} from "@/services/managePatientService";
import Message from "@/components/common/Message";
import { Download } from "@mui/icons-material";

interface PatientDetailsProps {
	petList: any; // list of pets for owner
	dropDownList: any[];
	isEditClick: any;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({
	petList,
	dropDownList = [],
	isEditClick,
}) => {
	// chip defaults (keeps your original chipData)
	const [dietChips, setDietChips] = useState<any[]>(dietData);
	const [dieseaseHistoryChips, setdieseaseHistoryChips] =
		useState<any[]>(dseaseHistory);

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);

	// dialogs
	const [openAddDialoge, setOpenAddDialoge] = useState(false);
	const [openDocumentDialoge, setopenDocumentDialoge] = useState(false);
	const [openMonthDialoge, setOpenMonthDialoge] = useState(false);

	// selected pet (object). default to first pet if available
	const [selectedPet, setSelectedPet] = useState<any>(petList ?? null);
	console.log("petlist");
	console.log(selectedPet);
	const [selectedPetId, setSelectedPetId] = useState<any>(
		petList.patientUid ?? null
	);

	// training toggle (local UI state)
	const [checked, setChecked] = useState<boolean>(
		Boolean(selectedPet?.trainingDone)
	);

	dayjs.extend(customParseFormat);

	const parseApiDate = (apiDate: string | null) => {
		if (!apiDate) return null;

		const cleaned = apiDate.replace(/(\d+)(st|nd|rd|th)/, "$1"); // remove "th/st/etc"
		const parsed = dayjs(cleaned, "DD-MMM-YYYY", true);

		return parsed.isValid() ? parsed : null;
	};

	const addPetRef = useRef<AddPetRef>(null);
	const addDocumentRef = useRef<AddDocumentRef>(null);

	const fecthPetDetails = async (id: any) => {
		const petListObj = {
			userName: localStorage.getItem("userName") || "",
			userPwd: localStorage.getItem("userPwd") || "",
			deviceStat: "D",
			patientUid: id,
		};
		try {
			const response: any = await getPetDetails(petListObj);
			console.log("response");
			console.log(response);
			//const data: any = await response;

			return response;
			//setRowData(data);
		} catch (error: any) {
			console.log(error);
		}
	};

	// react-hook-form
	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			// Owner
			firstName: "",
			lastName: "",
			userName: "",
			email: "",
			cellNumber: "",
			// Pet
			petName: "",
			petBreed: "",
			petsDiet: "",
			livingEnvironment: "",
			petDetails: "",
			birthDt: "",
			gender: "",
			petCategory: "",
			// Address
			city: "",
			state: "",
			pin: "",
			address1: "",
			// Training
			trainingSchool: "",
			trainer: "",
			trainingDetails: "",
			startDate: "",
			endDate: "",
		},
	});

	// whenever petList arrives/changes, pick first pet by default
	useEffect(() => {
		if (petList && !selectedPet) {
			setSelectedPet(petList);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [petList]);

	// when selectedPet changes, populate form and UI states
	useEffect(() => {
		if (!selectedPet) {
			reset({});
			setChecked(false);
			return;
		}
		console.log(selectedPet.birthDt);
		// reset form fields with selectedPet values (use safe fallbacks)
		reset({
			firstName: selectedPet.firstName ?? "",
			lastName: selectedPet.lastName ?? "",
			userName: selectedPet.userName ?? "",
			email: selectedPet.email ?? "",
			cellNumber:
				selectedPet.cellNumber ??
				selectedPet.contactNo ??
				selectedPet.cellNumber ??
				"",
			petName: selectedPet.petName ?? "",
			petCategory: selectedPet.petCategory ?? "",
			petBreed: selectedPet.petBreed ?? "",
			petsDiet: selectedPet.petsDiet ?? "",
			livingEnvironment: selectedPet.livingEnvironment ?? "",
			petDetails: selectedPet.petDetails ?? selectedPet.petDetails ?? "",
			birthDt: selectedPet.birthDt ?? selectedPet.birthDt ?? "",
			gender: selectedPet.gender ?? selectedPet.gender ?? "",
			city: selectedPet.city ?? selectedPet.areaName ?? "",
			state: selectedPet.state ?? "",
			pin: selectedPet.pin ?? "",
			address1: selectedPet.address1 ?? selectedPet.address2 ?? "",
			trainingSchool: selectedPet.trainingSchool ?? "",
			trainer: selectedPet.trainer ?? "",
			trainingDetails:
				selectedPet.trainingDetails ?? selectedPet.trainingDetails ?? "",
		});

		// training toggle
		setChecked(selectedPet.trainingDone);
		const petsDietArray = selectedPet?.petsDiet
			? selectedPet?.petsDiet.split(",").map((item: any) => item.trim())
			: [];

		const updatedChips = dietData.map((chip) => ({
			...chip,
			variant: petsDietArray.includes(chip.label) ? "filled" : "outlined",
		}));

		setDietChips(updatedChips);

		const petsDiseaseArray = selectedPet?.petHistory
			? selectedPet?.petHistory.split(",").map((item: any) => item.trim())
			: [];

		const updatedDisease = dieseaseHistoryChips.map((chip) => ({
			...chip,
			variant: petsDiseaseArray.includes(chip.label) ? "filled" : "outlined",
		}));

		setdieseaseHistoryChips(updatedDisease);

		// optionally set chip selections from pet data if provided (e.g., petsDiet string)
		// If you have a mapping from selectedPet.petsDiet to chip variants, you can set here.
		// For now we keep the default chip arrays (as in original). If selectedPet provides a list
		// you can map to filled/outlined states here.
	}, [selectedPet, reset]);

	const handlePetSelectChange = async (e: any) => {
		const petId = e.target.value;
		setSelectedPetId(petId);
		console.log("Change Dropdown");
		console.log(petId);
		//test
		const response = await fecthPetDetails(petId);
		if (response) {
			setSelectedPet(response);
		}
		// const found = petList.find(p => p.patientUid === petId);
		// setSelectedPet(found ?? null);
	};

	const handleIsTrained = (_: any, val: boolean) => {
		setChecked(val);
	};

	const handleToggle = (id: number) => {
		setDietChips((prev) =>
			prev.map((chip) =>
				chip.id === id
					? {
							...chip,
							variant: chip.variant === "filled" ? "outlined" : "filled",
					  }
					: chip
			)
		);
	};

	const handleDiseaseToggle = (id: number) => {
		setdieseaseHistoryChips((prev) =>
			prev.map((chip) =>
				chip.id === id
					? {
							...chip,
							variant: chip.variant === "filled" ? "outlined" : "filled",
					  }
					: chip
			)
		);
	};

	const formattedDate = (rawData: any) => {
		const cleanedDate = rawData.replace(/(\d+)(st|nd|rd|th)/, "$1");

		// Parse and format to dd/mm/yyyy
		const formattedDate = dayjs(cleanedDate, "DD-MMM-YYYY").format(
			"DD/MM/YYYY"
		);

		return formattedDate;
	};

	const onSubmit = async (formData: any) => {
		// combine form data + training status + chips + selectedPet identifiers
		console.log(dietChips);
		const diatSelection = dietChips
			.filter((c) => c.variant == "filled")
			.map((x) => x.label);
		const petSelection = dieseaseHistoryChips
			.filter((c) => c.variant == "filled")
			.map((x) => x.label);
		diatSelection.toString();
		console.log(diatSelection);
		const payload = {
			...formData,
			trainingDone: checked ? "Yes" : "No",
			dietSelection: dietChips.map((c) => ({ id: c.id, variant: c.variant })),
			diseaseSelection: dieseaseHistoryChips.map((c) => ({
				id: c.id,
				variant: c.variant,
			})),
			patientUid: selectedPet?.patientUid,
			petOwnerUid: selectedPet?.petOwnerUid,
		};

		const newPayload = {
			userName: localStorage.getItem("userName") || "",
			userPwd: localStorage.getItem("userPwd") || "",
			deviceStat: "M",
			orgId: localStorage.getItem("orgId") || "",
			loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
			petOwnerUid: selectedPet?.petOwnerUid,
			patientUid: selectedPet?.patientUid,
			mrn: "5",
			gender: formData?.gender,
			firstName: selectedPet?.firstName,
			lastName: selectedPet?.lastName,
			petName: formData?.petName,
			petCategory: formData?.petCategory,
			petCategoryOther: "",
			address1: selectedPet.address1,
			address2: selectedPet.address2,
			pin: selectedPet.pin,
			cityId: selectedPet.cityId,
			city: selectedPet.city,
			cityPincodeMappingId: selectedPet.cityPincodeMappingId,
			areaName: selectedPet.areaName,
			state: selectedPet.state,
			country: selectedPet.country,
			email: selectedPet.email,
			contactNo: selectedPet.cellNumber,
			dob: formattedDate(formData.birthDt),
			petType: selectedPet.petType,
			petDetails: formData.petDetails,
			petBreed: formData.petBreed,
			livingEnvironment: formData.livingEnvironment,
			trainingDone: checked ? "Yes" : "No",
			trainer: formData.trainer,
			trainingSchool: formData.trainingSchool,
			trainingDetails: formData.trainingDetails,
			petsDiet: diatSelection.toString(),
			petHistory: petSelection.toString(),
		};
		try {
			console.log("Save payload:", newPayload);
			const response = await savePatient(newPayload);
			setOpenSnackbar(true);
			setSnackbarSeverity("success");
			setSnackbarMessage("Details Saved Successfully");
		} catch (e) {
			setOpenSnackbar(true);
			setSnackbarSeverity("error");
			setSnackbarMessage("Error Occured");
		} // TODO: call save API here
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const handleFileSubmit = async () => {
		const formData = addDocumentRef.current?.submit(); // 👈 calling the submit method from child

		if (!formData) {
			console.warn("Form data invalid or incomplete");
			return;
		}

		// 👇 Example payload based on your earlier message
		const payload = {
			userName: localStorage.getItem("userName") || "",
			userPwd: localStorage.getItem("userPwd") || "",
			deviceStat: "M",
			patientUid: selectedPet?.patientUid,
			docname: formData.documentName,
			appointmentId: "0",
			select_doctype_list: "2",
			docdate: formData.date,
			uploaded_file: formData.imageBase64,
		};

		const formDataUpload = new FormData();
		formDataUpload.append("userName", localStorage.getItem("userName") || "");
		formDataUpload.append("userPass", localStorage.getItem("userPwd") || ""); // 🔹 you can replace with actual login pwd
		formDataUpload.append("deviceStat", "M");
		formDataUpload.append("patientUid", selectedPet?.patientUid);
		formDataUpload.append("docname", formData.documentName);

		formDataUpload.append("orgId", localStorage.getItem("orgId") || "");
		formDataUpload.append(
			"loggedInFacilityId",
			localStorage.getItem("loggedinFacilityId") || ""
		);
		formDataUpload.append("doctorUId", localStorage.getItem("doctorUid") || "");

		formDataUpload.append("appointmentId", "0");
		formDataUpload.append("select_doctype_list", "2");
		formDataUpload.append("docdate", formData.date);
		if (formData?.imageBase64) {
			console.log("enter if block");
			formDataUpload.append("uploaded_file", formData?.imageBase64);
		}

		console.log("Payload to send:", payload);

		try {
			uploadDocument(formDataUpload);
			setopenDocumentDialoge(false);
			setOpenSnackbar(true);
			setSnackbarSeverity("success");
			// Close dialog on success
			setTimeout(async function () {
				const response = await fecthPetDetails(selectedPetId);
				if (response) {
					setSelectedPet(response);
					setSnackbarMessage("Added Successfully");
				}
			}, 1000);
			//need to refresh
		} catch (err) {
			setSnackbarSeverity("error");
			setSnackbarMessage("Error Occured"); // Close dialog on success

			console.error("Error uploading document:", err);
		}
	};

	const handleDialogSubmit = async () => {
		const data = addPetRef.current?.submit();
		console.log("submit");
		console.log(data);
		if (!data) return; // Form validation failed

		const payload = {
			userName: localStorage.getItem("userName") || "",
			userPwd: localStorage.getItem("userPwd") || "",
			deviceStat: "M",
			orgId: localStorage.getItem("orgId") || "",
			petOwnerUid: selectedPet?.petOwnerUid,
			petName: data.petName,
			dob: data.dob?.format("DD/MM/YYYY") || "",
			petCategory: data.petCategory,
			petCategoryOther: "",
			petType: data.petType,
			gender: data.gender,
			petsDiet: data.petsDiet,
			livingEnvironment: data.livingEnvironment,
			trainingDone: data.trainingDone ? "Yes" : "No",
			trainingSchool: data.trainingDone ? data.trainingSchool : "",
			petDetails: data.petDetails,
			trainer: data.trainingDone ? data.trainer : "",
			trainingDetails: data.trainingDone ? data.trainingDetails : "",
		};

		try {
			savePetCall(payload);
			setOpenAddDialoge(false);
			setOpenSnackbar(true);
			setSnackbarSeverity("success");
			setSnackbarMessage("Added Successfully");
			isEditClick(false);
		} catch (error) {
			setOpenSnackbar(true);
			setSnackbarSeverity("error");
			setSnackbarMessage("Face Some issue");
			console.error("Error submitting pet:", error);
		}
	};

	const handleDownload = (fileName: string) => {
		const fileUrl = `https://www.aptcarepet.com/${fileName}`;
		console.log(fileName);
		// Create a temporary anchor element
		/* const link = document.createElement("a");
		link.href = fileUrl;
		link.setAttribute("download", fileName); // 👈 triggers download
		document.body.appendChild(link);
		link.click(); // 👈 programmatically click the link
		document.body.removeChild(link); */
		window.open(fileUrl, "_blank");
	};

	return (
		<Box sx={{ p: 3 }}>
			<Card sx={{ maxWidth: 1345 }}>
				{/*  <CardMedia component="img" height="140" image={` ${selectedPet.ownerImageFileName}?https://www.aptcarepet.com/${selectedPet.ownerImageFileName}: '/images/sample.jpg'`} alt="pet cover" /> */}
				<CardMedia
					component='img'
					height='140'
					image='/images/sample.jpeg'
					alt='pet cover'
				/>

				<CardContent>
					<Grid container>
						<Grid item xs={12} sm={1}>
							<UploadBadge
								path={`https://www.aptcarepet.com/${selectedPet.ownerImageFileName}`}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							sm={6}
							sx={{ marginTop: "50px", marginLeft: "55px", marginRight: "25" }}>
							<Typography gutterBottom variant='h5' component='div'>
								Pet Of {selectedPet?.firstName ?? "Test User"}
							</Typography>
						</Grid>

						<Grid
							item
							xs={12}
							sm={2}
							sx={{ marginTop: "50px", marginRight: "25px" }}>
							<FormControl fullWidth variant='outlined'>
								<InputLabel id='demo-simple-select-label'>Pet Name</InputLabel>
								<Select
									labelId='demo-simple-select-label'
									id='demo-simple-select'
									label='Pet Name'
									value={selectedPet.patientUid ?? ""}
									onChange={handlePetSelectChange}>
									{dropDownList.map((option: any) => (
										<MenuItem key={option.patientUid} value={option.patientUid}>
											{option.petName}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12} sm={2} sx={{ marginTop: "60px" }}>
							<Button
								variant='contained'
								onClick={() => setOpenAddDialoge(true)}
								startIcon={<AddIcon />}
								className={styles.ovalButton}>
								Add Pet
							</Button>
						</Grid>
					</Grid>

					<form onSubmit={handleSubmit(onSubmit)}>
						{/* Owner Personal Information */}
						<Box
							component='fieldset'
							sx={{
								border: "1px solid #ccc",
								padding: 2,
								borderRadius: 2,
								marginTop: 2,
							}}>
							<legend className={styles.legend}>
								Owner Personal Information
							</legend>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={4}>
									<Controller
										name='firstName'
										disabled
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label='First Name'
												fullWidth
												required
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='lastName'
										disabled
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label='Last Name'
												fullWidth
												required
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='userName'
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label='Username'
												fullWidth
												disabled
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='email'
										control={control}
										render={({ field }) => (
											<TextField {...field} label='Email' fullWidth disabled />
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='cellNumber'
										control={control}
										disabled
										render={({ field }) => (
											<TextField {...field} label='Phone Number' fullWidth />
										)}
									/>
								</Grid>
							</Grid>
						</Box>

						{/* Pet Personal Information */}
						<Box
							component='fieldset'
							sx={{
								border: "1px solid #ccc",
								padding: 2,
								borderRadius: 2,
								marginTop: 2,
							}}>
							<legend className={styles.legend}>
								Pet Personal Information
							</legend>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={4}>
									<Controller
										name='petName'
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label='Pet Name'
												fullWidth
												required
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='birthDt'
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
											<LocalizationProvider dateAdapter={AdapterDayjs}>
												<DatePicker
													disableFuture
													label='DOB'
													value={parseApiDate(field.value)} // now this is Day.js object
													/* onChange={(date) => field.onChange(date)}  */ // keep it as Day.js object
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
													slotProps={{ textField: { fullWidth: true } }}
												/>
											</LocalizationProvider>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='gender'
										control={control}
										render={({ field }) => (
											<FormControl fullWidth>
												<InputLabel id='gender-label'>Gender</InputLabel>
												<Select
													{...field}
													labelId='gender-label'
													label='Gender'>
													<MenuItem value='male'>Male</MenuItem>
													<MenuItem value='female'>Female</MenuItem>
												</Select>
											</FormControl>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='petBreed'
										control={control}
										render={({ field }) => (
											<TextField {...field} label='Breed' fullWidth />
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='petCategory'
										control={control}
										render={({ field }) => (
											<TextField {...field} label='Pet Category' fullWidth />
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='livingEnvironment'
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label='Leaving Enviorment'
												fullWidth
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='petDetails'
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label='Description'
												fullWidth
												multiline
												rows={4}
											/>
										)}
									/>
								</Grid>
							</Grid>
						</Box>

						{/* Home Address */}
						<Box
							component='fieldset'
							sx={{
								border: "1px solid #ccc",
								padding: 2,
								borderRadius: 2,
								marginTop: 2,
							}}>
							<legend className={styles.homeLegend}>Home Address</legend>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<Controller
										name='city'
										disabled
										control={control}
										render={({ field }) => (
											<TextField {...field} label='City' fullWidth required />
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Controller
										name='state'
										disabled
										control={control}
										render={({ field }) => (
											<TextField {...field} label='State' fullWidth required />
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Controller
										name='pin'
										disabled
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label='Pincode'
												fullWidth
												required
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Controller
										name='address1'
										disabled
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label='Area Name'
												fullWidth
												required
											/>
										)}
									/>
								</Grid>
							</Grid>
						</Box>

						{/* Diet & Disease Chips */}
						<Grid container spacing={2} sx={{ mt: 2 }}>
							<Grid item xs={12} sm={6}>
								<Box
									component='fieldset'
									sx={{
										border: "1px solid #ccc",
										padding: 2,
										borderRadius: 2,
									}}>
									<legend className={styles.dietLegend}>Diet</legend>
									<Grid container spacing={2}>
										<Stack
											direction='row'
											spacing={1}
											sx={{
												margin: "25px",
												display: "grid",
												gridTemplateColumns: "repeat(5, 1fr)",
												gap: 1,
											}}>
											{dietChips.map((chip) => (
												<Chip
													key={chip.id}
													label={chip.label}
													variant={chip.variant}
													onClick={() => handleToggle(chip.id)}
													clickable
													color='primary'
												/>
											))}
										</Stack>
									</Grid>
								</Box>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Box
									component='fieldset'
									sx={{
										border: "1px solid #ccc",
										padding: 2,
										borderRadius: 2,
									}}>
									<legend className={styles.dieseaseHistoryLegend}>
										Disease History
									</legend>
									<Grid container spacing={2}>
										<Stack
											direction='row'
											spacing={1}
											sx={{
												margin: "25px",
												display: "grid",
												gridTemplateColumns: "repeat(5, 1fr)",
												gap: 1,
											}}>
											{dieseaseHistoryChips.map((chip) => (
												<Chip
													key={chip.id}
													label={chip.label}
													variant={chip.variant}
													onClick={() => handleDiseaseToggle(chip.id)}
													clickable
													color='primary'
												/>
											))}
										</Stack>
									</Grid>
								</Box>
							</Grid>
						</Grid>

						{/* Training */}
						<FormControlLabel
							control={
								<Switch
									color='primary'
									checked={checked}
									onChange={handleIsTrained}
								/>
							}
							label='Traning Done'
							labelPlacement='start'
						/>

						{checked && (
							<Box
								component='fieldset'
								sx={{
									border: "1px solid #ccc",
									padding: 2,
									borderRadius: 2,
									marginTop: 2,
								}}>
								<legend className={styles.traningInformation}>
									Traning Information
								</legend>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={4}>
										<Controller
											name='trainingSchool'
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label='Traning School'
													fullWidth
												/>
											)}
										/>
									</Grid>

									<Grid item xs={12} sm={4}>
										<Controller
											name='trainer'
											control={control}
											render={({ field }) => (
												<TextField {...field} label='Trainer Name' fullWidth />
											)}
										/>
									</Grid>

									<Grid item xs={12} sm={8}>
										<Controller
											name='trainingDetails'
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label='Traning Description'
													multiline
													rows={4}
													fullWidth
												/>
											)}
										/>
									</Grid>
								</Grid>
							</Box>
						)}

						{/* Shared Documents */}
						<Box
							component='fieldset'
							sx={{
								border: "1px solid #ccc",
								padding: 2,
								borderRadius: 2,
								marginTop: 2,
							}}>
							<legend className={styles.sharedDocumentLegend}>
								Shared Document
							</legend>

							<Box
								sx={{
									display: "flex",
									justifyContent: "flex-end",
									alignItems: "center",
									paddingBottom: "15px",
								}}>
								<Stack direction='row' spacing={1}>
									<Chip
										label={`Recent(${
											selectedPet?.uploadedDocumentsList?.length ?? 0
										})`}
										color='primary'
										variant='outlined'
									/>
									<Chip
										label='Last Month(0)'
										color='primary'
										variant='outlined'
									/>
									<Chip
										label='Select Month'
										onClick={() => setOpenMonthDialoge(true)}
										color='primary'
										variant='outlined'
									/>
								</Stack>
							</Box>

							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									paddingBottom: "20px",
								}}>
								<Button
									variant='contained'
									onClick={() => setopenDocumentDialoge(true)}
									endIcon={<AddCircleOutlineIcon />}
									size='large'>
									Add New Document
								</Button>
							</Box>

							<Divider />

							{/* Documents list */}
							<Box sx={{ mt: 2 }}>
								{selectedPet?.uploadedDocumentsList &&
								selectedPet.uploadedDocumentsList.length > 0 ? (
									<>
										<TableContainer
											component={Paper}
											className={styles.tableWrapper}>
											<Table size='small'>
												<TableHead>
													<TableRow>
														<TableCell>Document Type</TableCell>
														<TableCell>Document Name</TableCell>
														<TableCell>Document Date</TableCell>
														<TableCell>Action</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{selectedPet.uploadedDocumentsList.map(
														(row: any, index: any) => (
															<TableRow key={index}>
																<TableCell>{row.documentName}</TableCell>
																<TableCell>{row?.documentType}</TableCell>
																<TableCell>{row?.documentDate}</TableCell>
																<TableCell>
																	<Button
																		variant='outlined'
																		color='secondary'
																		size='small'
																		startIcon={<Download />}
																		onClick={() => {
																			handleDownload(row?.savedFileName);
																		}}
																		sx={{
																			mr: 1,
																		}}>
																		Download
																	</Button>
																</TableCell>
															</TableRow>
														)
													)}
												</TableBody>
											</Table>
										</TableContainer>
									</>
								) : (
									<Typography variant='body2' sx={{ mt: 1 }}>
										No shared documents.
									</Typography>
								)}
							</Box>
						</Box>

						{/* Save */}
						<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
							<Button type='submit' variant='contained' size='large'>
								Save
							</Button>
						</Box>
					</form>
				</CardContent>
			</Card>

			{/* Dialogs */}
			<CummonDialog
				open={openAddDialoge}
				onSubmit={handleDialogSubmit}
				onClose={() => setOpenAddDialoge(false)}
				maxWidth='md'
				title='Add New Pet'>
				<AddPet ref={addPetRef} />
			</CummonDialog>

			<CummonDialog
				open={openDocumentDialoge}
				onSubmit={handleFileSubmit}
				onClose={() => setopenDocumentDialoge(false)}
				maxWidth='sm'
				title='Add Document'>
				<AddDocument ref={addDocumentRef} />
			</CummonDialog>

			<CummonDialog
				open={openMonthDialoge}
				onClose={() => setOpenMonthDialoge(false)}
				maxWidth='xs'
				title='Select Month'>
				<MonthList />
			</CummonDialog>

			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</Box>
	);
};

export default PatientDetails;
