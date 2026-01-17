import React, { useState } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import FacilityDropdown from "@/components/Mvetconnect/FacilityDropdown";
import CreateNewCalendar from "@/components/Mvetconnect/CreateNewCalendar";
import ConfirmWeeklyCalendar from "@/components/Mvetconnect/ConfirmWeeklyCalendar";
import TempAdjustment from "@/components/Mvetconnect/TempAdjustment";
import { FaclityServiceResponse } from "@/interfaces/facilityInterface";
import {
	checkDuplicateSlot,
	addSlot,
	getdoctorSlots,
	getEditSlotData,
} from "@/services/manageCalendar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

const Calendar: React.FC = () => {
	const [selectedFacility, setSelectedFacility] =
		useState<FaclityServiceResponse | null>(null);
	const [showFacilityHelper, setShowFacilityHelper] = useState(false);
	const [openCreateCalendar, setOpenCreateCalendar] = useState(false);
	const [openConfirmWeekly, setOpenConfirmWeekly] = useState(false);
	const [openTempAdjustment, setOpenTempAdjustment] = useState(false);
	const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
		start: "",
		end: "",
	});
	const [calendars, setCalendars] = useState<any[]>([]);
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [editPrefill, setEditPrefill] = useState<any | null>(null);
	const [tempAdjustmentData, setTempAdjustmentData] = useState<any | null>(
		null,
	);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error" | "warning" | "info",
	});
	const [isLoading, setIsLoading] = useState(false);

	// Pagination state
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Function to fetch existing calendars
	const fetchExistingCalendars = async (facilityId: string) => {
		setIsLoading(true);
		try {
			console.log("Fetching calendars for facility:", facilityId);
			console.log("Using orgId:", localStorage.getItem("orgId"));

			const orgId = localStorage.getItem("orgId") || "39"; // Fallback to hardcoded value if not in localStorage
			console.log("Using orgId:", orgId);

			const response = await getdoctorSlots({
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				orgId: orgId,
				facilityId: facilityId,
			});

			console.log("Full API Response:", response);
			console.log("Response status:", response.status);
			console.log("Response data:", response.data);

			if (response.status === "Success" && response.data) {
				// Handle both single object and array responses
				const dataArray = Array.isArray(response.data)
					? response.data
					: [response.data];
				console.log("Processed data array:", dataArray);
				console.log("Array length:", dataArray.length);

				// Store the raw API data directly
				setCalendars(dataArray);
			} else if (response.data && Array.isArray(response.data)) {
				// Fallback: if response.data is directly an array
				console.log("Using response.data directly as array");
				setCalendars(response.data);
			} else if (response && Array.isArray(response)) {
				// Fallback: if the entire response is an array
				console.log("Using entire response as array");
				setCalendars(response);
			} else {
				console.log("No data or unsuccessful response");
				setCalendars([]);
			}
		} catch (error) {
			console.error("Error fetching existing calendars:", error);
			setSnackbar({
				open: true,
				message: "Error fetching existing calendars",
				severity: "error",
			});
			setCalendars([]);
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch existing calendars on component mount
	React.useEffect(() => {
		// Don't fetch calendars initially - wait for facility selection
		// fetchExistingCalendars(2); // Initial call with a default facilityId
	}, []);

	const handleFacilitySelect = async (
		facility: FaclityServiceResponse | null,
	) => {
		setSelectedFacility(facility);
		if (facility) {
			setShowFacilityHelper(false);
			// Clear existing calendars while loading new ones
			setCalendars([]);
			// Reset pagination to first page
			setPage(0);
			// Fetch calendars for the selected facility
			await fetchExistingCalendars(facility.facilityId.toString());
		} else {
			// Clear calendars when no facility is selected
			setCalendars([]);
			// Reset pagination to first page
			setPage(0);
		}
	};

	const handleCreateCalendarClick = () => {
		if (!selectedFacility) {
			setShowFacilityHelper(true);
		} else {
			setOpenCreateCalendar(true);
		}
	};

	const handleConfirm = async (
		selectedDays: string[],
		slots: any[],
		appointmentType: string,
		slotDuration: string,
		facility: FaclityServiceResponse | null,
		startDate: string,
		endDate: string,
	) => {
		try {
			if (!facility) {
				setSnackbar({
					open: true,
					message: "No facility selected",
					severity: "error",
				});
				return;
			}

			// Format the payload for the API
			const dayTimeMapping: { [key: string]: string } = {
				Mon: "Monday",
				Tue: "Tuesday",
				Wed: "Wednesday",
				Thu: "Thursday",
				Fri: "Friday",
				Sat: "Saturday",
				Sun: "Sunday",
			};

			// Convert selected days to full names
			const checkedDay = selectedDays
				.map((day) => dayTimeMapping[day] || day)
				.join(",");

			// Format time slots for API (HH-MM-HH-MM format)
			// Filter out incomplete slots (only keep slots with all time fields filled)
			const completeSlots = slots.filter(
				(slot) => slot.fromHour && slot.fromMin && slot.toHour && slot.toMin,
			);

			// Format time slots for API (HH-MM-HH-MM format)
			const dayTime = completeSlots
				.map((slot) => {
					const fromTime = `${slot.fromHour}-${slot.fromMin}`;
					const toTime = `${slot.toHour}-${slot.toMin}`;
					return `${fromTime}-${toTime}`;
				})
				.join("~");

			// Convert dates from DD.MM.YY to DD/MM/YYYY format
			const formatDateForAPI = (dateStr: string) => {
				const [day, month, year] = dateStr.split(".");
				return `${day}/${month}/20${year}`;
			};

			const startDateFormatted = formatDateForAPI(startDate);
			const endDateFormatted = formatDateForAPI(endDate);

			// Determine bookAppType
			const bookAppType =
				appointmentType === "TIMESLOT" ? "timeslot" : "sequence";

			// Prepare API payload
			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				orgId: localStorage.getItem("orgId") || "",
				facilityId: facility.facilityId, // use selected facility ID
				bookAppType: bookAppType,
				checkedDay: checkedDay,
				dayTime: dayTime,
				startDate: startDateFormatted,
				stopDate: endDateFormatted,
				slotDuration: slotDuration || "",
				slotDuration2: "",
				// Add slotId for edit case
				...(editPrefill?.originalData?.slotId && {
					slotId: editPrefill.originalData.slotId,
				}),
			};

			// Call the API
			const response = await addSlot(payload);

			if (response.status === "Success") {
				// Refresh the calendar list from API instead of just adding to local state
				await fetchExistingCalendars(
					(selectedFacility?.facilityId || 2).toString(),
				);

				setOpenConfirmWeekly(false);
				setEditPrefill(null);
				setEditIndex(null); // Reset edit index

				setSnackbar({
					open: true,
					message: editPrefill?.originalData?.slotId
						? "Calendar updated successfully!"
						: "Calendar created successfully!",
					severity: "success",
				});
			} else {
				setSnackbar({
					open: true,
					message: response.message || "Failed to create calendar",
					severity: "error",
				});
			}
		} catch (error) {
			console.error("Error creating calendar:", error);
			setSnackbar({
				open: true,
				message: "Error creating calendar. Please try again.",
				severity: "error",
			});
		}
	};

	const handleTempAdjustment = async (idx: number) => {
		const cal = calendars[idx];
		console.log("Temp adjustment clicked for calendar:", cal);

		// Set the calendar data for the modal
		setTempAdjustmentData(cal);

		// Open the temp adjustment modal
		setOpenTempAdjustment(true);
	};

	const handleEdit = async (idx: number) => {
		const cal = calendars[idx];
		setEditIndex(idx);

		try {
			// Call API to get edit slot data
			const response = await getEditSlotData({
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				slotId: cal.slotId || 2, // Use slotId from the row data, fallback to 2
			});

			// The response is a direct object, not wrapped in status/data
			if (response && response.slotId) {
				console.log("Edit slot data received:", response);

				// Transform API data to match component's expected format
				const editData = response;

				// Extract active days from availability flags
				const activeDays = [];
				if (editData.mondayAvailable === 1) activeDays.push("Mon");
				if (editData.tuesdayAvailable === 1) activeDays.push("Tue");
				if (editData.wednesdayAvailable === 1) activeDays.push("Wed");
				if (editData.thursdayAvailable === 1) activeDays.push("Thu");
				if (editData.fridayAvailable === 1) activeDays.push("Fri");
				if (editData.saturdayAvailable === 1) activeDays.push("Sat");
				if (editData.sundayAvailable === 1) activeDays.push("Sun");

				// Build time slots from individual day time fields
				const slots: Array<{
					fromHour: string;
					fromMin: string;
					toHour: string;
					toMin: string;
					patients: string;
				}> = [];

				// Helper function to add time slots for a day
				const addDaySlots = (
					startTime1: string,
					stopTime1: string,
					startTime2: string,
					stopTime2: string,
				) => {
					if (startTime1 && startTime1 !== "00:00") {
						const [hour1, min1] = startTime1.split(":");
						const [hour2, min2] = stopTime1.split(":");
						slots.push({
							fromHour: hour1,
							fromMin: min1,
							toHour: hour2,
							toMin: min2,
							patients: editData.noOfPatients?.toString() || "",
						});
					}
					if (startTime2 && startTime2 !== "00:00") {
						const [hour1, min1] = startTime2.split(":");
						const [hour2, min2] = stopTime2.split(":");
						slots.push({
							fromHour: hour1,
							fromMin: min1,
							toHour: hour2,
							toMin: min2,
							patients: editData.noOfPatients?.toString() || "",
						});
					}
				};

				// Add slots for each active day
				if (editData.mondayAvailable === 1) {
					addDaySlots(
						editData.mondayStartTime1,
						editData.mondayStopTime1,
						editData.mondayStartTime2,
						editData.mondayStopTime2,
					);
				}
				if (editData.tuesdayAvailable === 1) {
					addDaySlots(
						editData.tuesdayStartTime1,
						editData.tuesdayStopTime1,
						editData.tuesdayStartTime2,
						editData.tuesdayStopTime2,
					);
				}
				if (editData.wednesdayAvailable === 1) {
					addDaySlots(
						editData.wednesdayStartTime1,
						editData.wednesdayStopTime1,
						editData.wednesdayStartTime2,
						editData.wednesdayStopTime2,
					);
				}
				if (editData.thursdayAvailable === 1) {
					addDaySlots(
						editData.thursdayStartTime1,
						editData.thursdayStopTime1,
						editData.thursdayStartTime2,
						editData.thursdayStopTime2,
					);
				}
				if (editData.fridayAvailable === 1) {
					addDaySlots(
						editData.fridayStartTime1,
						editData.fridayStopTime1,
						editData.fridayStartTime2,
						editData.fridayStopTime2,
					);
				}
				if (editData.saturdayAvailable === 1) {
					addDaySlots(
						editData.saturdayStartTime1,
						editData.saturdayStopTime1,
						editData.saturdayStartTime2,
						editData.saturdayStopTime2,
					);
				}
				if (editData.sundayAvailable === 1) {
					addDaySlots(
						editData.sundayStartTime1,
						editData.sundayStopTime1,
						editData.sundayStartTime2,
						editData.sundayStopTime2,
					);
				}

				// Create transformed prefill data
				const transformedPrefill = {
					selectedDays: activeDays,
					slots: slots,
					appointmentType:
						editData.bookAppType === "timeslot" ? "TIMESLOT" : "SEQUENCE",
					slotDuration: editData.slotDuration || "",
					// Keep original API data for reference
					originalData: editData,
				};

				console.log("Transformed prefill data:", transformedPrefill);

				// Set the transformed prefill data
				setEditPrefill(transformedPrefill);

				// Set date range from API response
				setDateRange({
					start: editData.scheduleStartDt || "",
					end: editData.scheduleStopDt || "",
				});

				// Open the confirm weekly dialog
				setOpenConfirmWeekly(true);
			} else {
				console.error(
					"Failed to get edit slot data: No slotId found in response",
				);
				setSnackbar({
					open: true,
					message: "Failed to load calendar data for editing",
					severity: "error",
				});
			}
		} catch (error) {
			console.error("Error fetching edit slot data:", error);
			setSnackbar({
				open: true,
				message: "Error loading calendar data for editing",
				severity: "error",
			});
		}
	};

	const handleCloseSnackbar = (
		event?: React.SyntheticEvent | Event,
		reason?: string,
	) => {
		if (reason === "clickaway") return;
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	// Pagination handlers
	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<PrivateRoute>
			<AuthenticatedLayout>
				<Box sx={{ maxWidth: 1100, mx: "auto" }}>
					<Box sx={{ mb: 3, px: 2, textAlign: "center" }}>
						<Typography
							variant='h5'
							component='h1'
							sx={{ fontWeight: 700, color: "#2c3e50" }}>
							Calendar Management
						</Typography>
						<Typography variant='body1' sx={{ color: "#555", mt: 1 }}>
							Select a facility to view or create your weekly calendars.
						</Typography>
					</Box>

					<Paper
						elevation={0}
						sx={{ border: "1px solid #e0e0e0", borderRadius: "16px" }}>
						<Box sx={{ p: { xs: 2, sm: 3 } }}>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
									gap: 3,
									alignItems: "flex-end",
								}}>
								<Box>
									<Typography
										variant='subtitle1'
										sx={{ fontWeight: 600, mb: 1.5, color: "#34495e" }}>
										1. Select Your Facility
									</Typography>
									<FacilityDropdown
										selectedFacility={selectedFacility}
										onFacilitySelect={handleFacilitySelect}
										showHelper={showFacilityHelper}
									/>
								</Box>
								<Button
									variant='contained'
									onClick={handleCreateCalendarClick}
									disabled={!selectedFacility || isLoading}
									sx={{
										py: 1.75,
										bgcolor: "#174a7c",
										"&:hover": { bgcolor: "#103a61" },
									}}>
									Create New Calendar
								</Button>
							</Box>

							{calendars.length > 0 && (
								<>
									<Divider sx={{ my: 4 }} />
									<Typography
										variant='h6'
										sx={{ fontWeight: 600, mb: 2, color: "#34495e" }}>
										Your Created Calendars
									</Typography>
									<TableContainer
										component={Paper}
										variant='outlined'
										sx={{ borderRadius: "12px" }}>
										<Table>
											<TableHead sx={{ bgcolor: "#f7f9fc" }}>
												<TableRow>
													<TableCell sx={{ fontWeight: "bold" }}>
														Facility
													</TableCell>
													<TableCell sx={{ fontWeight: "bold" }}>
														Start Date
													</TableCell>
													<TableCell sx={{ fontWeight: "bold" }}>
														End Date
													</TableCell>
													<TableCell sx={{ fontWeight: "bold" }}>
														Active Days
													</TableCell>
													<TableCell sx={{ fontWeight: "bold" }}>
														Slots
													</TableCell>
													<TableCell align='right' sx={{ fontWeight: "bold" }}>
														Actions
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{calendars.map((cal, idx) => {
													// Calculate active days from availability flags
													const activeDays = [];
													if (cal.mondayAvailable === 1) activeDays.push("Mon");
													if (cal.tuesdayAvailable === 1)
														activeDays.push("Tue");
													if (cal.wednesdayAvailable === 1)
														activeDays.push("Wed");
													if (cal.thursdayAvailable === 1)
														activeDays.push("Thu");
													if (cal.fridayAvailable === 1) activeDays.push("Fri");
													if (cal.saturdayAvailable === 1)
														activeDays.push("Sat");
													if (cal.sundayAvailable === 1) activeDays.push("Sun");

													// Calculate total slots from time fields
													let slotCount = 0;
													if (
														cal.mondayStartTime1 &&
														cal.mondayStartTime1 !== "00:00"
													)
														slotCount++;
													if (
														cal.mondayStartTime1 &&
														cal.mondayStartTime2 !== "00:10"
													)
														slotCount++;
													if (
														cal.tuesdayStartTime1 &&
														cal.tuesdayStartTime1 !== "00:20"
													)
														slotCount++;
													if (
														cal.tuesdayStartTime1 &&
														cal.tuesdayStartTime2 !== "00:30"
													)
														slotCount++;
													if (
														cal.wednesdayStartTime1 &&
														cal.wednesdayStartTime1 !== "00:40"
													)
														slotCount++;
													if (
														cal.wednesdayStartTime1 &&
														cal.wednesdayStartTime2 !== "00:50"
													)
														slotCount++;
													if (
														cal.thursdayStartTime1 &&
														cal.thursdayStartTime1 !== "00:60"
													)
														slotCount++;
													if (
														cal.thursdayStartTime1 &&
														cal.thursdayStartTime2 !== "00:70"
													)
														slotCount++;
													if (
														cal.fridayStartTime1 &&
														cal.fridayStartTime1 !== "00:80"
													)
														slotCount++;
													if (
														cal.fridayStartTime1 &&
														cal.fridayStartTime2 !== "00:90"
													)
														slotCount++;
													if (
														cal.saturdayStartTime1 &&
														cal.saturdayStartTime1 !== "00:10"
													)
														slotCount++;
													if (
														cal.saturdayStartTime1 &&
														cal.saturdayStartTime2 !== "00:00"
													)
														slotCount++;
													if (
														cal.sundayStartTime1 &&
														cal.sundayStartTime1 !== "00:00"
													)
														slotCount++;
													if (
														cal.sundayStartTime1 &&
														cal.sundayStartTime2 !== "00:00"
													)
														slotCount++;

													return (
														<TableRow
															key={idx}
															hover
															sx={{
																"&:last-child td, &:last-child th": {
																	border: 0,
																},
															}}>
															<TableCell component='th' scope='row'>
																{selectedFacility?.facilityName ||
																	cal.facilityName ||
																	"N/A"}
															</TableCell>
															<TableCell>
																{cal.scheduleStartDt || "N/A"}
															</TableCell>
															<TableCell>
																{cal.scheduleStopDt || "N/A"}
															</TableCell>
															<TableCell>
																{activeDays.length > 0
																	? activeDays.join(", ")
																	: "No active days"}
															</TableCell>
															<TableCell>{slotCount}</TableCell>
															<TableCell align='right'>
																<Box
																	sx={{
																		display: "flex",
																		gap: 1,
																		justifyContent: "flex-end",
																	}}>
																	<Button
																		variant='outlined'
																		size='small'
																		onClick={() =>
																			handleEdit(page * rowsPerPage + idx)
																		}
																		sx={{
																			color: "#174a7c",
																			borderColor: "#174a7c",
																			"&:hover": {
																				borderColor: "#103a61",
																				bgcolor: "rgba(23, 74, 124, 0.04)",
																			},
																		}}>
																		Edit
																	</Button>
																	<Button
																		variant='outlined'
																		size='small'
																		onClick={() =>
																			handleTempAdjustment(
																				page * rowsPerPage + idx,
																			)
																		}
																		sx={{
																			color: "#e67e22",
																			borderColor: "#e67e22",
																			"&:hover": {
																				borderColor: "#d35400",
																				bgcolor: "rgba(230, 126, 34, 0.04)",
																			},
																		}}>
																		Temp Adjustment
																	</Button>
																</Box>
															</TableCell>
														</TableRow>
													);
												})}
											</TableBody>
										</Table>
									</TableContainer>

									{/* Pagination */}
									<TablePagination
										rowsPerPageOptions={[10, 15, 20, 30, 50]}
										component='div'
										count={calendars.length}
										rowsPerPage={rowsPerPage}
										page={page}
										onPageChange={handleChangePage}
										onRowsPerPageChange={handleChangeRowsPerPage}
										labelRowsPerPage='Rows per page:'
										labelDisplayedRows={({ from, to, count }) =>
											`${from}-${to} of ${
												count !== -1 ? count : `more than ${to}`
											}`
										}
										sx={{
											".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
												{
													fontSize: "0.875rem",
													color: "#666",
												},
											".MuiTablePagination-select": {
												fontSize: "0.875rem",
											},
										}}
									/>
								</>
							)}

							{isLoading && (
								<Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
									<Typography variant='body2' sx={{ color: "#7f8c8d" }}>
										Loading calendars...
									</Typography>
								</Box>
							)}

							{!isLoading && calendars.length === 0 && (
								<Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
									<Typography variant='body2' sx={{ color: "#7f8c8d" }}>
										{selectedFacility
											? "No calendar data found for this facility. Create your first calendar above."
											: "Please select a facility to view calendars."}
									</Typography>
								</Box>
							)}
						</Box>
					</Paper>
				</Box>

				<CreateNewCalendar
					open={openCreateCalendar}
					onCancel={() => setOpenCreateCalendar(false)}
					onOk={async (start, end) => {
						if (start && end && selectedFacility) {
							try {
								// Convert dates to DD/MM/YYYY format for API
								const startDateFormatted = start.format("DD/MM/YYYY");
								const endDateFormatted = end.format("DD/MM/YYYY");

								// Check slot availability via API
								const response = await checkDuplicateSlot({
									userName: localStorage.getItem("userName") || "",
									userPass: localStorage.getItem("userPwd") || "", // hardcoded as per API spec
									deviceStat: "M",
									orgId: parseInt(localStorage.getItem("orgId") || "39"),
									facilityId: selectedFacility.facilityId, // use selected facility ID
									slotId: editPrefill?.originalData?.slotId || 2, // Use actual slotId when editing, fallback to 2
									startDate: startDateFormatted,
									stopDate: endDateFormatted,
								});

								if (response.status === "Success") {
									// Check if the message indicates slot is not available
									if (
										response.message &&
										response.message.includes("Slot exists with same location")
									) {
										// Slot exists - show backend message as warning and don't open modal
										setSnackbar({
											open: true,
											message: response.message,
											severity: "warning",
										});
									} else {
										// Slot is actually available - proceed with calendar creation
										setOpenCreateCalendar(false);
										setDateRange({
											start: start.format("DD.MM.YY"),
											end: end.format("DD.MM.YY"),
										});
										setSnackbar({
											open: true,
											message: "Slot is available",
											severity: "success",
										});
										setTimeout(() => setOpenConfirmWeekly(true), 1000);
									}
								} else {
									// Handle slot not available
									setSnackbar({
										open: true,
										message:
											response.message ||
											"Slot is not available for selected dates",
										severity: "warning",
									});
								}
							} catch (error) {
								console.error("Error checking slot availability:", error);
								setSnackbar({
									open: true,
									message:
										"Error checking slot availability. Please try again.",
									severity: "error",
								});
							}
						}
					}}
					usedRanges={calendars.map((cal) => ({
						start: cal.scheduleStartDt || "",
						end: cal.scheduleStopDt || "",
					}))}
				/>
				<ConfirmWeeklyCalendar
					open={openConfirmWeekly}
					onCancel={() => {
						setOpenConfirmWeekly(false);
						setEditIndex(null);
						setEditPrefill(null);
					}}
					onBack={() => {
						setOpenConfirmWeekly(false);
						setOpenCreateCalendar(true);
						setEditIndex(null);
						setEditPrefill(null);
					}}
					onConfirm={handleConfirm}
					facility={selectedFacility}
					startDate={dateRange.start}
					endDate={dateRange.end}
					prefill={editPrefill}
					slotId={editPrefill?.originalData?.slotId}
					onEditSuccess={() => {
						// Refresh the calendar list after successful edit
						if (selectedFacility) {
							fetchExistingCalendars(selectedFacility.facilityId.toString());
						}
					}}
				/>

				<TempAdjustment
					open={openTempAdjustment}
					onClose={() => {
						setOpenTempAdjustment(false);
						setTempAdjustmentData(null);
					}}
					calendarData={tempAdjustmentData}
					facility={selectedFacility}
					onSuccess={() => {
						// Refresh the calendar list after successful temp adjustment
						if (selectedFacility) {
							fetchExistingCalendars(selectedFacility.facilityId.toString());
						}
					}}
				/>
				<Snackbar
					open={snackbar.open}
					autoHideDuration={3000}
					onClose={handleCloseSnackbar}
					anchorOrigin={{ vertical: "top", horizontal: "center" }}>
					<Alert severity={snackbar.severity} sx={{ width: "100%" }}>
						{snackbar.message}
					</Alert>
				</Snackbar>
			</AuthenticatedLayout>
		</PrivateRoute>
	);
};

export default Calendar;
