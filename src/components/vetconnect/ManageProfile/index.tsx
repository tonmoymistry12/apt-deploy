import React, { useState, useRef, useEffect } from "react";
import {
	Grid,
	TextField,
	Button,
	Typography,
	Card,
	CardContent,
	CardMedia,
	Box,
	Stack,
	Autocomplete,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import UploadBadge from "@/components/common/uploadBadge/UploadBadge";
import CommonTable from "@/components/common/table/Table";
import TableLinkButton from "@/components/common/buttons/TableLinkButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonDialog from "@/components/common/CummonDialog";
import AddEditModel, { AddDocumentRef } from "./add-edit-user";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
	getDoctorDetails,
	saveDoctorEducation,
	saveDoctorExperience,
	saveProfileApi,
} from "@/services/manageProfile";
import styles from "./styles.module.scss";
import { debounce } from "lodash";
import {
	getAreaListSearchText,
	getCityList,
} from "@/services/faclilityService";
import { Search } from "@mui/icons-material";
import Message from "@/components/common/Message";
import { getSpecalityList } from "@/services/userService";

interface FormValues {
	title: string;
	firstName: string;
	lastName: string;
	birthDate?: string;
	qualification: string;
	languageKnown?: string;
	speciality?: string;
	city?: string;
	state?: string;
	pin?: string;
	addressFirst?: string;
	email: string;
	cellNumber: string;
	areaName?: string;
	cityPincodeMappingId?: number;
}

function VetConnectUserProfile() {
	const formRef = useRef<AddDocumentRef>(null);
	const [profileData, setProfileData] = useState<any>(null);

	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [openAddExprienceDialog, setOpenAddExprienceDialog] = useState(false);
	const [showAddForm, setShowAddForm] = useState<
		"education" | "experience" | null
	>(null);
	const [selectedRow, setSelectedRow] = useState<any>(null);

	const [educationData, setEducationData] = useState<any[]>([]);
	const [experienceData, setExperienceData] = useState<any[]>([]);

	const [cityOptions, setCityOptions] = useState<any[]>([]);
	const [areaOptions, setAreaOptions] = useState<any[]>([]);
	const [cityLoading, setCityLoading] = useState(false);
	const [areaLoading, setAreaLoading] = useState(false);
	const [selectedCity, setSelectedCity] = useState<any>(null);
	const [file, setFile] = useState<any>(null);
	const [filename, setFileName] = useState("");

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success",
	);
	const [specalityList, setSpecalityList] = useState<any[]>([]);
	const educationColumns = [
		{ id: "institution", label: "Institution" },
		{ id: "degree", label: "Degree" },
		{ id: "fieldOfStudy", label: "Field of Study" },
		{ id: "grade", label: "Grade" },
		{ id: "startDate", label: "Start Date" },
		{ id: "endDate", label: "End Date" },
		{ id: "action", label: "Action" },
	];

	const experienceColumns = [
		{ id: "jobTitle", label: "Job Title" },
		{ id: "employmentType", label: "Employment Type" },
		{ id: "companyName", label: "Company Name" },
		{ id: "location", label: "Location" },
		{ id: "startDate", label: "Start Date" },
		{ id: "endDate", label: "End Date" },
		{ id: "action", label: "Action" },
	];

	const handleFileChange = (selectedFile: File, name: string) => {
		if (selectedFile) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFile(reader.result as string);
				setFileName(name); // Set filename inside reader.onload
			};
			reader.readAsDataURL(selectedFile); // You forgot this in your original
		}
	};

	const base64ToFile = (base64String: string): File | null => {
		if (!base64String) return null;

		const arr = base64String.split(",");
		const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new File([u8arr], filename, { type: mime });
	};

	const fetchCities = debounce(async (searchText: string) => {
		setCityLoading(true);
		try {
			const data = await getCityList(searchText);
			setCityOptions(data || []);
		} finally {
			setCityLoading(false);
		}
	}, 400);

	const fetchAreas = debounce(async (cityId: string, searchText: string) => {
		setAreaLoading(true);
		try {
			const data = await getAreaListSearchText(cityId, searchText);
			setAreaOptions(data || []);
		} finally {
			setAreaLoading(false);
		}
	}, 400);

	const fetchSpecalityList = async () => {
		const specalityList: any = await getSpecalityList();
		setSpecalityList(specalityList);
	};

	const {
		register,
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		defaultValues: {
			title: "",
			firstName: "",
			lastName: "",
			birthDate: undefined,
			qualification: "",
			languageKnown: "",
			speciality: "",
			city: "",
			state: "",
			pin: "",
			addressFirst: "",
			email: "",
			cellNumber: "",
			areaName: "",
			cityPincodeMappingId: 0,
		},
	});

	const fetchDoctorProfileDetails = async () => {
		try {
			const result: any = await getDoctorDetails({
				userName: localStorage.getItem("userName") || "",
				userPwd: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
			});
			setProfileData(result);
			console.log("result");
			console.log(result.imageFileName);
			setSelectedCity(result.city);
			// populate form fields
			reset({
				title: result.userTitle || "",
				firstName: result?.firstName || "",
				lastName: result.lastName || "",
				birthDate: result.birthDate
					? dayjs(result.birthDate, "DD/MM/YYYY").format("YYYY-MM-DD")
					: undefined,
				qualification: result.qualification || "",
				languageKnown: result.languageKnown || "",
				speciality: result.gblSpltyName || "",
				city: result.city || "",
				state: result.state || "",
				pin: result.pin || "",
				addressFirst: result.addressFirst || "",
				email: result.email || "",
				cellNumber: result.cellNumber || "",
				areaName: result.areaName || "",
				cityPincodeMappingId: result.cityPincodeMappingId || "",
			});

			// map education
			const eduRows = (result.educations || []).map(
				(edu: any, idx: number) => ({
					institution: edu.docEducationInstitute || "",
					degree: edu.docDegree || "",
					doctorEducationUid: edu.doctorEducationUid,
					fieldOfStudy: edu.docFieldOfStudy || "",
					grade: edu.docGrade || "",
					startDate: dayjs(edu.educationFromDt, "DD/MM/YYYY").format(
						"DD-MM-YYYY",
					),
					endDate: dayjs(edu.educationToDt, "DD/MM/YYYY").format("DD-MM-YYYY"),
					action: (
						<>
							<TableLinkButton
								text='Edit'
								icon={<EditIcon />}
								onClick={() => handleEdit("education", idx, edu)}
							/>
							{/* <TableLinkButton
								text='Delete'
								icon={<DeleteIcon />}
								color='error'
								onClick={() => handleDelete("education", idx)}
							/> */}
						</>
					),
				}),
			);
			setEducationData([]);
			setEducationData(eduRows);

			// map experience
			const expRows = (result.experiences || []).map(
				(exp: any, idx: number) => ({
					jobTitle: exp.docExperience || "",
					employmentType: exp.employmentType || "",
					companyName: exp.docExperienceInstitute || "",
					doctorExperienceUid: exp.doctorExperienceUid,
					location: exp.instituteAddress || "",
					startDate: dayjs(exp.experienceFromDt, "DD/MM/YYYY").format(
						"DD-MM-YYYY",
					),
					endDate: dayjs(exp.experienceToDt, "DD/MM/YYYY").format("DD-MM-YYYY"),
					action: (
						<>
							<TableLinkButton
								text='Edit'
								icon={<EditIcon />}
								onClick={() => handleEdit("experience", idx, exp)}
							/>
							{/* <TableLinkButton
								text='Delete'
								icon={<DeleteIcon />}
								color='error'
								onClick={() => handleDelete("experience", idx)}
							/> */}
						</>
					),
				}),
			);
			setExperienceData([]);
			setExperienceData(expRows);
		} catch (error) {
			console.error("Failed to fetch doctor profile details:", error);
		}
	};
	// Fetch profile and populate form
	useEffect(() => {
		fetchSpecalityList();
		fetchDoctorProfileDetails();
	}, [reset]);

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		// handle save logic
		console.log("Form data to save:", data);

		const sendObj = {
			userName: localStorage.getItem("userName") || "",
			userPass: localStorage.getItem("userPwd") || "",
			deviceStat: "M",
			searchcity: data.city,
			state: data.state,
			country: selectedCity.country,
			pinCode: data.pin,
			searcharea: data.areaName,
			citypincodemappingid: data.cityPincodeMappingId,
			specialty: data.speciality,
			firstname: data.firstName,
			lastname: data.lastName,
			birthdate: data.birthDate,
			address1: data.addressFirst,
			address2: "",
			email: data.email,
			mobile: data.cellNumber,
			language: data.languageKnown,
			treatmentCategories: "",
			practiceSpeciality: "",
			backFile: null,
			loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
			orgId: localStorage.getItem("orgId") || "",
			file: base64ToFile(file),
		};
		const formData = new FormData();

		Object.entries(sendObj).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				formData.append(key, value);
			}
		});
		try {
			await saveProfileApi(formData);
			setOpenSnackbar(true);
			setSnackbarSeverity("success");
			setSnackbarMessage("Profile Saved Successfully");
			/* const response = await fetch("/your/api/save-endpoint", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const result = await response.json();
			console.log("Save result:", result); */
			// optionally update UI/notify success
		} catch (err) {
			setOpenSnackbar(true);
			setSnackbarSeverity("error");
			setSnackbarMessage("Face some issue");
		}
	};

	const handleEdit = (
		type: "education" | "experience",
		index: number,
		row: any,
	) => {
		/* const row =
			type === "education" ? educationData[index] : experienceData[index]; */
		console.log("edit");
		setShowAddForm(type);
		console.log(row);
		setSelectedRow({ index, row });
		setOpenEditDialog(true);
	};

	const handleAdd = (type: "education" | "experience") => {
		setShowAddForm(type);
		setSelectedRow(null);
		setOpenAddExprienceDialog(true);
	};

	const saveTableChanges = (
		type: "education" | "experience",
		newRows: any[],
	) => {
		if (type === "education") {
			setEducationData(newRows);
		} else {
			setExperienceData(newRows);
		}
	};
	//need to refresh
	const onSaveAddEdit = async () => {
		console.log("hit");
		const loginDetails = {
			userName: localStorage.getItem("userName") || "",
			userPwd: localStorage.getItem("userPwd") || "",
			deviceStat: "M",
		};
		const formData: any = await formRef.current?.submit();
		if (selectedRow) {
			var { index, row } = selectedRow;
		}
		if (showAddForm === "education") {
			try {
				const data = {
					...loginDetails,
					doctorEducationUid: row?.doctorEducationUid
						? row?.doctorEducationUid
						: 0,
					doctorUid: profileData.userUid,
					docEducation: formData?.degree,
					docEducationInstitute: formData?.institution,
					docFieldOfStudy: formData?.fieldOfStudy,
					docDegree: formData?.degree,
					docGrade: formData?.grade,
					educationFromDt: formData?.startDate,
					educationToDt: formData?.endDate,
				};
				console.log("Hittt");
				saveDoctorEducation(data);
				setOpenSnackbar(true);
				setSnackbarSeverity("success");
				setSnackbarMessage("Details Saved Successfully");
				setTimeout(() => fetchDoctorProfileDetails(), 1000);
			} catch (error) {
				console.log(error);
				setOpenSnackbar(true);
				setSnackbarSeverity("error");
				setSnackbarMessage("Error Occured");
			}
		}
		if (showAddForm === "experience") {
			try {
				const data = {
					...loginDetails,
					doctorExperienceUid: row?.doctorExperienceUid
						? row?.doctorExperienceUid
						: 0,
					doctorUid: profileData.userUid,
					currentlyWorking: 0,
					docExperience: formData?.jobTitle,
					docExperienceInstitute: formData?.companyName,
					employmentType: formData?.employmentType,
					instituteAddress: formData?.location,
					experienceFromDt: formData?.startDate,
					experienceToDt: formData?.endDate,
				};
				console.log("Hittt111");
				saveDoctorExperience(data);

				setOpenSnackbar(true);
				setSnackbarSeverity("success");
				setSnackbarMessage("Details Saved Successfully");
				setTimeout(() => fetchDoctorProfileDetails(), 1000);
			} catch (error) {
				console.log(error);
				setOpenSnackbar(true);
				setSnackbarSeverity("error");
				setSnackbarMessage("Error Occured");
			}
		}
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	return (
		<Box sx={{ p: 3 }}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Card sx={{ maxWidth: 1345 }}>
					{/* <CardMedia
            component="img"
            height="140"
            image={
              profileData?.imageFileName
                ? `/images/${profileData.imageFileName}`
                : "/images/sample.jpeg"
            }
            alt="profile banner"
          /> */}
					<CardMedia
						component='img'
						height='140'
						image={"/images/sample.jpeg"}
						alt='profile banner'
					/>
					<CardContent>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={1}>
								{profileData?.imageFileName && (
									<UploadBadge
										path={`https://www.happyfurandfeather.com/${profileData.imageFileName}`}
										onFileChange={handleFileChange}
									/>
								)}
								{!profileData?.imageFileName && (
									<UploadBadge onFileChange={handleFileChange} />
								)}
							</Grid>
							<Grid
								item
								xs={12}
								sm={4}
								sx={{ marginTop: "50px", marginLeft: "25px" }}>
								<Typography gutterBottom variant='h5' component='div'>
									{`${profileData?.userTitle || ""} ${
										profileData?.firstName || ""
									} ${profileData?.lastName || ""}`}
								</Typography>
							</Grid>
						</Grid>

						<Box
							component='fieldset'
							sx={{
								border: "1px solid #ccc",
								padding: 2,
								borderRadius: 2,
								marginTop: 2,
							}}>
							<legend className={styles.personalLegend}>
								Personal Information
							</legend>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={4}>
									<Controller
										name='title'
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label='Title'
												fullWidth
												error={!!errors.title}
												helperText={errors.title?.message}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={4}>
									<Controller
										name='firstName'
										control={control}
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
								<Grid item xs={12} sm={4}>
									<Controller
										name='lastName'
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												fullWidth
												label='Last Name'
												error={!!errors.lastName}
												helperText={errors.lastName?.message}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={4}>
									<Controller
										name='email'
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												fullWidth
												label='Email'
												error={!!errors.email}
												helperText={errors.email?.message}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={4}>
									<Controller
										name='cellNumber'
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												fullWidth
												label='Phone'
												error={!!errors.cellNumber}
												helperText={errors.cellNumber?.message}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} sm={4}>
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<Controller
											name='birthDate'
											control={control}
											defaultValue={"01/12/2025"}
											render={({ field }) => (
												<DatePicker
													label='Date of Birth'
													value={field.value ? dayjs(field.value) : null}
													onChange={(date) => {
														field.onChange(date ? date.toISOString() : null);
													}}
													slots={{ textField: TextField }}
													slotProps={{ textField: { fullWidth: true } }}
												/>
											)}
										/>
									</LocalizationProvider>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='qualification'
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												fullWidth
												label='Education'
												error={!!errors.qualification}
												helperText={errors.qualification?.message}
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='languageKnown'
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												fullWidth
												label='Language'
												error={!!errors.languageKnown}
												helperText={errors.languageKnown?.message}
											/>
										)}
									/>
								</Grid>

								<Grid item xs={12} sm={4}>
									<Controller
										name='speciality'
										control={control}
										render={({ field }) => (
											<Select
												{...field}
												labelId='speciality-label'
												fullWidth
												placeholder='Speciality'
												error={!!errors.speciality}>
												{specalityList.map((s) => (
													<MenuItem key={s.specialtyId} value={s.specialtyName}>
														{s.specialtyName}
													</MenuItem>
												))}
											</Select>
										)}
									/>
								</Grid>
							</Grid>
						</Box>

						<Grid container spacing={2}>
							<Grid item xs={12} sm={12}>
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
												value={selectedCity || null}
												onInputChange={(_, value) => {
													fetchCities(value);
												}}
												onChange={(_, value) => {
													setSelectedCity(value);
													if (value && typeof value !== "string") {
														setValue("city", value.cityName || "");
														setValue("state", value.stateName || "");
														setValue("pin", value.pincode || "");
														// If you have country or area in your form values, update them too
													}
												}}
												renderInput={(params) => (
													<TextField
														{...params}
														label='City'
														fullWidth
														error={!!errors.city}
														helperText={errors.city?.message}
														InputProps={{
															...params.InputProps,
															endAdornment: (
																<>
																	{params.InputProps.endAdornment}
																	<Search
																		sx={{
																			color: "action.active",
																			mr: 1,
																			my: 0.5,
																		}}
																	/>
																</>
															),
														}}
													/>
												)}
											/>
										</Grid>

										<Grid item xs={12} sm={6}>
											<Controller
												name='areaName'
												control={control}
												render={({ field }) => (
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
														value={field.value || ""}
														onInputChange={(_, value) => {
															if (selectedCity && value) {
																fetchAreas(String(selectedCity.cityId), value);
															}
														}}
														onChange={(_, value) => {
															if (typeof value === "string") {
																setValue("areaName", value);
																setValue("cityPincodeMappingId", 0);
															} else if (value && value.areaName) {
																setValue("areaName", value.areaName);
																setValue(
																	"cityPincodeMappingId",
																	Number(value.cityPincodeMappingId) || 0,
																);
																setValue("pin", value.pincode || "");
															} else {
																setValue("areaName", "");
																setValue("cityPincodeMappingId", 0);
															}
														}}
														renderInput={(params) => (
															<TextField
																{...params}
																label='Area'
																fullWidth
																helperText={
																	!selectedCity ? "Select a city first" : ""
																}
																InputProps={{
																	...params.InputProps,
																	endAdornment: (
																		<>
																			{params.InputProps.endAdornment}
																			<Search
																				sx={{
																					color: "action.active",
																					mr: 1,
																					my: 0.5,
																				}}
																			/>
																		</>
																	),
																}}
															/>
														)}
														disabled={!selectedCity}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Controller
												name='state'
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														fullWidth
														label='State'
														error={!!errors.state}
														helperText={errors.state?.message}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Controller
												name='pin'
												control={control}
												rules={{ maxLength: 6 }}
												render={({ field }) => (
													<TextField
														{...field}
														fullWidth
														label='Pincode'
														error={!!errors.pin}
														helperText={errors.pin?.message}
													/>
												)}
											/>
										</Grid>
									</Grid>
								</Box>
							</Grid>
						</Grid>

						<Box
							component='fieldset'
							sx={{
								border: "1px solid #ccc",
								padding: 2,
								borderRadius: 2,
								marginTop: 2,
							}}>
							<legend className={styles.educationLegend}>Education</legend>
							<CommonTable
								heading=''
								colHeaders={educationColumns}
								rowData={educationData}
								showSearch={false}
								showAddButton={true}
								addButtonLabel='Add Education'
								onAddButtonClick={() => handleAdd("education")}
								showFilterButton={false}
							/>
						</Box>

						<Box
							component='fieldset'
							sx={{
								border: "1px solid #ccc",
								padding: 2,
								borderRadius: 2,
								marginTop: 2,
							}}>
							<legend className={styles.expirenceLegend}>Experience</legend>
							<CommonTable
								heading=''
								colHeaders={experienceColumns}
								rowData={experienceData}
								showSearch={false}
								showAddButton={true}
								addButtonLabel='Add Experience'
								onAddButtonClick={() => handleAdd("experience")}
								showFilterButton={false}
							/>
						</Box>

						<Box sx={{ mt: 3, textAlign: "right" }}>
							<Button variant='contained' type='submit' disabled={isSubmitting}>
								Save Profile
							</Button>
						</Box>

						<CommonDialog
							open={openEditDialog}
							title={`Edit ${
								showAddForm === "education" ? "Education" : "Experience"
							}`}
							onClose={() => setOpenEditDialog(false)}
							onSubmit={(newRowData) => {
								if (selectedRow) {
									const { index, row } = selectedRow;
									if (showAddForm === "education") {
										const newEdu = [...educationData];
										newEdu[index] = newRowData;
										onSaveAddEdit();
										setEducationData(newEdu);
									} else {
										const newExp = [...experienceData];
										newExp[index] = newRowData;
										onSaveAddEdit();
										setExperienceData(newExp);
									}
								}
								setOpenEditDialog(false);
							}}
							maxWidth='md'>
							{selectedRow && (
								<AddEditModel
									initialData={selectedRow.row}
									ref={formRef}
									formType={showAddForm}
								/>
							)}
						</CommonDialog>

						<CommonDialog
							open={openAddExprienceDialog}
							title={`Add ${
								showAddForm === "education" ? "Education" : "Experience"
							}`}
							onClose={() => setOpenAddExprienceDialog(false)}
							onSubmit={(newRowData) => {
								onSaveAddEdit();

								setEducationData((prev) => [...prev, newRowData]);

								setOpenAddExprienceDialog(false);
							}}
							maxWidth='md'>
							<AddEditModel
								initialData={{}}
								ref={formRef}
								formType={showAddForm}
							/>
						</CommonDialog>
					</CardContent>
				</Card>
			</form>
			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</Box>
	);
}

export default VetConnectUserProfile;
