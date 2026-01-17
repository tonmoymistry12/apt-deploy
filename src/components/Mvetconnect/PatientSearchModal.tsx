import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import {
	searchApptPatient,
	SearchApptPatientResponse,
	saveAppointment,
} from "@/services/manageCalendar";
import dayjs from "dayjs";

interface PatientSearchModalProps {
	open: boolean;
	onClose: () => void;
	onSearch: (searchData: any) => void;
	selectedTimeSlot?: {
		startTime: string;
		stopTime: string;
		date: string;
	} | null;
	selectedFacility?: {
		facilityId: number;
		facilityName: string;
	} | null;
	selectedDate?: Date | null;
	onAppointmentSuccess?: () => void; // Callback to refresh appointments list
	selectedDoctor?: any;
}

type SearchOption = "mrn" | "name" | "idProof" | "mobile";

const PatientSearchModal: React.FC<PatientSearchModalProps> = ({
	open,
	onClose,
	onSearch,
	selectedTimeSlot,
	selectedFacility,
	selectedDate,
	onAppointmentSuccess,
	selectedDoctor,
}) => {
	const [searchBy, setSearchBy] = useState<SearchOption>("mrn");
	const [searchValue, setSearchValue] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [idProofType, setIdProofType] = useState("passport");
	const [idProofValue, setIdProofValue] = useState("");
	const [searchResults, setSearchResults] = useState<
		SearchApptPatientResponse[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleSearch = async () => {
		setIsLoading(true);
		try {
			let payload: any = {
				userName: localStorage.getItem("userName") || "",
				userPwd: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				orgId: localStorage.getItem("orgId") || "",
			};

			if (searchBy === "name") {
				if (firstName.trim() || lastName.trim()) {
					payload.idProofType = "name";
					payload.searchValue1 = firstName.trim();
					payload.searchValue2 = lastName.trim();
				}
			} else if (searchBy === "idProof") {
				if (idProofValue.trim()) {
					payload.idProofType = "id";
					payload.searchValue1 = idProofType;
					payload.searchValue2 = idProofValue.trim();
				}
			} else if (searchValue.trim()) {
				if (searchBy === "mrn") {
					payload.idProofType = "mrn";
					payload.searchValue1 = searchValue.trim();
					payload.searchValue2 = "";
				} else if (searchBy === "mobile") {
					payload.idProofType = "phone";
					payload.searchValue1 = searchValue.trim();
					payload.searchValue2 = "";
				}
			}

			const results = await searchApptPatient(payload);

			console.log("API Response:", results);
			console.log("Results type:", typeof results);
			console.log("Is Array:", Array.isArray(results));

			// Handle different response formats
			if (Array.isArray(results)) {
				console.log("Setting search results:", results);
				setSearchResults(results);
			} else if (results && results.status === "notfound") {
				// Handle "notfound" status response
				console.log("No patients found");
				setSearchResults([]);
			} else {
				// Fallback for unexpected response format
				console.log("Unexpected response format:", results);
				setSearchResults([]);
			}

			setShowResults(true);
		} catch (error) {
			console.error("Error searching patients:", error);
			setSearchResults([]);
			setShowResults(true);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setSearchValue("");
		setFirstName("");
		setLastName("");
		setIdProofValue("");
		setIdProofType("passport");
		setSearchResults([]);
		setShowResults(false);
		setSearchBy("mrn");
		onClose();
	};

	const handleBookAppointment = async (patient: SearchApptPatientResponse) => {
		if (!selectedFacility?.facilityId) {
			console.error("No facility selected");
			return;
		}

		try {
			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				orgId: localStorage.getItem("orgId") || "2",
				facilityId: selectedFacility.facilityId,
				bookAppType: "timeslot",
				apptSelDate: selectedDate
					? dayjs(selectedDate).format("DD/MM/YYYY")
					: selectedTimeSlot?.date || "10/17/2025",
				startTime: selectedTimeSlot?.startTime || "01:00",
				stopTime: selectedTimeSlot?.stopTime || "01:10",
				episode: "new",
				petOwnerUid: patient.petOwnerUid.toString(),
				patientUid: patient.patientUid.toString(),
				patientId: patient.mrn,
			};

			console.log("Sending appointment payload:", payload);
			const response = await saveAppointment(payload, selectedDoctor);
			console.log("Appointment API response:", response);

			if (response.status === "success") {
				console.log("Appointment saved successfully:", response.message);
				console.log("onAppointmentSuccess at save time:", onAppointmentSuccess);
				console.log(
					"onAppointmentSuccess exists at save time:",
					!!onAppointmentSuccess
				);

				// Close the search modal first
				handleClose();

				// Show success modal
				setShowSuccessModal(true);
			} else {
				console.error("Failed to save appointment:", response.message);
				alert("Failed to save appointment: " + response.message);
			}
		} catch (error) {
			console.error("Error saving appointment:", error);
			alert("Error saving appointment. Please try again.");
		}
	};

	const handleSuccessModalClose = async () => {
		console.log("=== Success modal closing ===");
		console.log("onAppointmentSuccess exists:", !!onAppointmentSuccess);
		console.log("onAppointmentSuccess value:", onAppointmentSuccess);

		setIsRefreshing(true);

		// Wait 1 second before calling the refresh
		console.log("Waiting 1 second...");
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log("Wait complete!");

		// Call the refresh callback
		if (onAppointmentSuccess) {
			console.log("About to call onAppointmentSuccess...");
			try {
				onAppointmentSuccess();
				console.log("onAppointmentSuccess called successfully!");
			} catch (error) {
				console.error("Error calling onAppointmentSuccess:", error);
			}
		} else {
			console.error("onAppointmentSuccess is undefined or null!");
		}

		setIsRefreshing(false);
		setShowSuccessModal(false);
		console.log("=== Success modal closed ===");
	};

	const isSearchDisabled = () => {
		if (searchBy === "name") {
			return !firstName.trim() && !lastName.trim();
		}
		if (searchBy === "idProof") {
			return !idProofValue.trim();
		}
		return !searchValue.trim();
	};

	const getSearchPlaceholder = () => {
		switch (searchBy) {
			case "mrn":
				return "Enter Medical Record Number";
			case "mobile":
				return "Enter mobile number";
			default:
				return "Enter search value";
		}
	};

	const handleIdProofTypeChange = (event: SelectChangeEvent) => {
		setIdProofType(event.target.value);
	};

	const dialogMaxWidth = showResults ? "lg" : "sm";

	return (
		<>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth={dialogMaxWidth}
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: "12px",
						boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
					},
				}}>
				<DialogContent sx={{ p: 0 }}>
					{/* Header */}
					<Box
						sx={{
							bgcolor: "#174a7c",
							color: "white",
							p: 2,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							borderTopLeftRadius: "12px",
							borderTopRightRadius: "12px",
						}}>
						<Typography
							variant='h6'
							sx={{ fontWeight: 600, textTransform: "uppercase" }}>
							Search Patient
						</Typography>
						<IconButton onClick={handleClose} sx={{ color: "white" }}>
							<CloseIcon />
						</IconButton>
					</Box>

					{/* Content */}
					<Box sx={{ p: 3, bgcolor: "#f8f9fa" }}>
						{!showResults ? (
							<>
								{/* Search Options */}
								<FormControl component='fieldset' fullWidth sx={{ mb: 3 }}>
									<RadioGroup
										value={searchBy}
										onChange={(e) => {
											setSearchBy(e.target.value as SearchOption);
											setSearchValue("");
											setFirstName("");
											setLastName("");
											setIdProofValue("");
											setIdProofType("passport");
										}}
										sx={{
											"& .MuiFormControlLabel-root": {
												margin: "4px 0",
											},
											"& .MuiRadio-root": {
												color: "#174a7c",
												"&.Mui-checked": {
													color: "#174a7c",
												},
											},
											"& .MuiFormControlLabel-label": {
												color: "#34495e",
												fontWeight: 500,
											},
										}}>
										<Grid container spacing={2}>
											<Grid item xs={6}>
												<FormControlLabel
													value='mrn'
													control={<Radio />}
													label='By MRN'
												/>
											</Grid>
											<Grid item xs={6}>
												<FormControlLabel
													value='name'
													control={<Radio />}
													label='By Name'
												/>
											</Grid>
											<Grid item xs={6}>
												<FormControlLabel
													value='idProof'
													control={<Radio />}
													label='By Id Proof'
												/>
											</Grid>
											<Grid item xs={6}>
												<FormControlLabel
													value='mobile'
													control={<Radio />}
													label='By Mobile Number'
												/>
											</Grid>
										</Grid>
									</RadioGroup>
								</FormControl>

								{/* Search Input */}
								<Box sx={{ mb: 3 }}>
									{searchBy === "name" ? (
										// Two input fields for name search
										<Grid container spacing={2}>
											<Grid item xs={6}>
												<Typography
													variant='body1'
													sx={{
														fontWeight: 600,
														color: "#34495e",
														mb: 1,
														fontSize: "0.95rem",
													}}>
													First Name :
												</Typography>
												<TextField
													fullWidth
													variant='outlined'
													placeholder='Enter first name'
													value={firstName}
													onChange={(e) => setFirstName(e.target.value)}
													sx={{
														"& .MuiOutlinedInput-root": {
															bgcolor: "white",
															"& fieldset": {
																borderColor: "#dde2e7",
															},
															"&:hover fieldset": {
																borderColor: "#174a7c",
															},
															"&.Mui-focused fieldset": {
																borderColor: "#174a7c",
															},
														},
														"& .MuiInputBase-input": {
															color: "#34495e",
															fontWeight: 500,
														},
													}}
												/>
											</Grid>
											<Grid item xs={6}>
												<Typography
													variant='body1'
													sx={{
														fontWeight: 600,
														color: "#34495e",
														mb: 1,
														fontSize: "0.95rem",
													}}>
													Last Name :
												</Typography>
												<TextField
													fullWidth
													variant='outlined'
													placeholder='Enter last name'
													value={lastName}
													onChange={(e) => setLastName(e.target.value)}
													sx={{
														"& .MuiOutlinedInput-root": {
															bgcolor: "white",
															"& fieldset": {
																borderColor: "#dde2e7",
															},
															"&:hover fieldset": {
																borderColor: "#174a7c",
															},
															"&.Mui-focused fieldset": {
																borderColor: "#174a7c",
															},
														},
														"& .MuiInputBase-input": {
															color: "#34495e",
															fontWeight: 500,
														},
													}}
												/>
											</Grid>
										</Grid>
									) : searchBy === "idProof" ? (
										// Dropdown and input field for ID proof search
										<Grid container spacing={2}>
											<Grid item xs={6}>
												<Typography
													variant='body1'
													sx={{
														fontWeight: 600,
														color: "#34495e",
														mb: 1,
														fontSize: "0.95rem",
													}}>
													Id Proof Type :
												</Typography>
												<FormControl fullWidth>
													<Select
														value={idProofType}
														onChange={handleIdProofTypeChange}
														sx={{
															bgcolor: "white",
															"& .MuiOutlinedInput-notchedOutline": {
																borderColor: "#dde2e7",
															},
															"&:hover .MuiOutlinedInput-notchedOutline": {
																borderColor: "#174a7c",
															},
															"&.Mui-focused .MuiOutlinedInput-notchedOutline":
																{
																	borderColor: "#174a7c",
																},
															"& .MuiSelect-select": {
																color: "#34495e",
																fontWeight: 500,
															},
														}}>
														<MenuItem value='passport'>Passport</MenuItem>
														<MenuItem value='voterCard'>Voter Card</MenuItem>
														<MenuItem value='panCard'>PAN Card</MenuItem>
														<MenuItem value='drivingLicense'>
															Driving License
														</MenuItem>
														<MenuItem value='aadhaarCard'>
															Aadhaar Card
														</MenuItem>
													</Select>
												</FormControl>
											</Grid>
											<Grid item xs={6}>
												<Typography
													variant='body1'
													sx={{
														fontWeight: 600,
														color: "#34495e",
														mb: 1,
														fontSize: "0.95rem",
													}}>
													Id Proof Value :
												</Typography>
												<TextField
													fullWidth
													variant='outlined'
													placeholder='Enter ID proof number'
													value={idProofValue}
													onChange={(e) => setIdProofValue(e.target.value)}
													sx={{
														"& .MuiOutlinedInput-root": {
															bgcolor: "white",
															"& fieldset": {
																borderColor: "#dde2e7",
															},
															"&:hover fieldset": {
																borderColor: "#174a7c",
															},
															"&.Mui-focused fieldset": {
																borderColor: "#174a7c",
															},
														},
														"& .MuiInputBase-input": {
															color: "#34495e",
															fontWeight: 500,
														},
													}}
												/>
											</Grid>
										</Grid>
									) : (
										// Single input field for other search options
										<>
											<Typography
												variant='body1'
												sx={{
													fontWeight: 600,
													color: "#34495e",
													mb: 1,
													fontSize: "0.95rem",
												}}>
												{searchBy === "mrn" && "Patient MRN :"}
												{searchBy === "mobile" && "Mobile Number :"}
											</Typography>
											<TextField
												fullWidth
												variant='outlined'
												placeholder={getSearchPlaceholder()}
												value={searchValue}
												onChange={(e) => setSearchValue(e.target.value)}
												sx={{
													"& .MuiOutlinedInput-root": {
														bgcolor: "white",
														"& fieldset": {
															borderColor: "#dde2e7",
														},
														"&:hover fieldset": {
															borderColor: "#174a7c",
														},
														"&.Mui-focused fieldset": {
															borderColor: "#174a7c",
														},
													},
													"& .MuiInputBase-input": {
														color: "#34495e",
														fontWeight: 500,
													},
												}}
											/>
										</>
									)}
								</Box>

								{/* Action Buttons */}
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										gap: 2,
										pt: 1,
									}}>
									<Button
										variant='contained'
										onClick={handleSearch}
										disabled={isSearchDisabled() || isLoading}
										sx={{
											bgcolor: "#174a7c",
											color: "white",
											px: 4,
											py: 1.5,
											fontWeight: 600,
											textTransform: "none",
											borderRadius: "8px",
											minWidth: 120,
											"&:hover": {
												bgcolor: "#103a61",
											},
											"&:disabled": {
												bgcolor: "#bdc3c7",
												color: "#7f8c8d",
											},
										}}>
										{isLoading ? (
											<CircularProgress size={20} color='inherit' />
										) : (
											"Search"
										)}
									</Button>
									<Button
										variant='outlined'
										onClick={handleClose}
										sx={{
											borderColor: "#174a7c",
											color: "#174a7c",
											px: 4,
											py: 1.5,
											fontWeight: 600,
											textTransform: "none",
											borderRadius: "8px",
											minWidth: 120,
											"&:hover": {
												borderColor: "#103a61",
												bgcolor: "rgba(23, 74, 124, 0.04)",
											},
										}}>
										Cancel
									</Button>
								</Box>
							</>
						) : (
							// Search Results
							<Box>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										mb: 2,
									}}>
									<Typography
										variant='h6'
										sx={{ fontWeight: 600, color: "#34495e" }}>
										Search Results
									</Typography>
									<Button
										variant='outlined'
										onClick={() => setShowResults(false)}
										sx={{
											borderColor: "#174a7c",
											color: "#174a7c",
											"&:hover": {
												borderColor: "#103a61",
												bgcolor: "rgba(23, 74, 124, 0.04)",
											},
										}}>
										New Search
									</Button>
								</Box>

								{searchResults.length === 0 ? (
									<Box sx={{ textAlign: "center", py: 4 }}>
										<Typography sx={{ color: "#7f8c8d", fontStyle: "italic" }}>
											No patients found matching your search criteria.
										</Typography>
									</Box>
								) : (
									<TableContainer
										component={Paper}
										sx={{ borderRadius: "8px", overflow: "hidden" }}>
										<Table sx={{ minWidth: 650 }}>
											<TableHead sx={{ bgcolor: "#f7f9fc" }}>
												<TableRow>
													<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
														MRN
													</TableCell>
													<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
														Patient Name
													</TableCell>
													<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
														Contact Number
													</TableCell>
													<TableCell
														sx={{
															fontWeight: 600,
															color: "#34495e",
															textAlign: "center",
														}}>
														Action
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{(Array.isArray(searchResults)
													? searchResults
													: []
												).map((patient, index) => (
													<TableRow
														key={index}
														sx={{
															"&:hover": { bgcolor: "rgba(23, 74, 124, 0.04)" },
														}}>
														<TableCell
															sx={{ fontWeight: 500, color: "#2c3e50" }}>
															{patient.mrn}
														</TableCell>
														<TableCell
															sx={{ fontWeight: 500, color: "#2c3e50" }}>
															{patient.petName} of {patient.firstName}{" "}
															{patient.lastName}
														</TableCell>
														<TableCell sx={{ color: "#7f8c8d" }}>
															{patient.cellNumber}
														</TableCell>
														<TableCell sx={{ textAlign: "center" }}>
															<Button
																variant='text'
																onClick={() => handleBookAppointment(patient)}
																sx={{
																	color: "#174a7c",
																	textDecoration: "underline",
																	fontWeight: 600,
																	textTransform: "none",
																	"&:hover": {
																		bgcolor: "rgba(23, 74, 124, 0.04)",
																	},
																}}>
																Book Appointment
															</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								)}
							</Box>
						)}
					</Box>
				</DialogContent>
			</Dialog>

			{/* Success Modal */}
			<Dialog
				open={showSuccessModal}
				onClose={handleSuccessModalClose}
				maxWidth='sm'
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: "12px",
						boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
					},
				}}>
				<DialogContent sx={{ p: 3, textAlign: "center" }}>
					<Box sx={{ py: 2 }}>
						{isRefreshing ? (
							<>
								<CircularProgress size={48} sx={{ color: "#174a7c", mb: 2 }} />
								<Typography
									variant='h6'
									sx={{ fontWeight: 600, color: "#2c3e50", mb: 2 }}>
									Refreshing Appointments...
								</Typography>
								<Typography variant='body1' sx={{ color: "#7f8c8d" }}>
									Please wait while we update the appointments list.
								</Typography>
							</>
						) : (
							<>
								<Typography
									variant='h6'
									sx={{ fontWeight: 600, color: "#2c3e50", mb: 2 }}>
									Appointment Created Successfully
								</Typography>
								<Typography variant='body1' sx={{ color: "#7f8c8d", mb: 3 }}>
									The appointment has been successfully created for the selected
									patient.
								</Typography>
								<Button
									variant='contained'
									onClick={handleSuccessModalClose}
									sx={{
										bgcolor: "#174a7c",
										color: "white",
										px: 4,
										py: 1.5,
										fontWeight: 600,
										textTransform: "none",
										borderRadius: "8px",
										"&:hover": {
											bgcolor: "#103a61",
										},
									}}>
									OK
								</Button>
							</>
						)}
					</Box>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default PatientSearchModal;
