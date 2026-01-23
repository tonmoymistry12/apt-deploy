import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Button,
	Paper,
	Divider,
	FormControlLabel,
	Switch,
	Chip,
	Card,
	CardContent,
	Avatar,
	Stack,
	TextField,
	Grid,
	CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
	updateHomeVisit,
	getHomeVisitData,
	getHomeVisitAppointments,
	getMatchingHomeVisitSlotTimings,
	cancelHomeVisitAppointment,
} from "@/services/manageCalendar";
import Message from "@/components/common/Message";
import styles from "./styles.module.scss";

function VetConnectHomeVisit() {
	const [allowHomeVisit, setAllowHomeVisit] = useState(true);
	const [emergencyRequest, setEmergencyRequest] = useState(true);
	// Default selected days - all days available for selection
	const [selectedDays, setSelectedDays] = useState([
		"MON",
		"TUE",
		"WED",
		"THU",
		"FRI",
		"SAT",
		"SUN",
	]);
	const [showAppointmentHistory, setShowAppointmentHistory] = useState(false);
	const [showTimeSlots, setShowTimeSlots] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingData, setIsLoadingData] = useState(true);
	const [homeVisitAppointments, setHomeVisitAppointments] = useState<any[]>([]);
	const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
	const [appointmentFilter, setAppointmentFilter] = useState<"all" | "future">(
		"all",
	);
	const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
	const [specificDateAppointments, setSpecificDateAppointments] = useState<
		any[]
	>([]);
	const [isLoadingSpecificDate, setIsLoadingSpecificDate] = useState(false);
	const [cancellingAppointmentId, setCancellingAppointmentId] = useState<
		number | null
	>(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success",
	);

	// Time slot states for each day
	const [timeSlots, setTimeSlots] = useState<
		Record<
			string,
			{
				slot1: { start: string; end: string };
				slot2: { start: string; end: string };
			}
		>
	>({
		MON: {
			slot1: { start: "10:00", end: "12:00" },
			slot2: { start: "18:00", end: "22:00" },
		},
		TUE: {
			slot1: { start: "10:00", end: "12:00" },
			slot2: { start: "18:00", end: "22:00" },
		},
		WED: {
			slot1: { start: "10:00", end: "12:00" },
			slot2: { start: "18:00", end: "22:00" },
		},
		THU: {
			slot1: { start: "10:00", end: "12:00" },
			slot2: { start: "18:00", end: "22:00" },
		},
		FRI: {
			slot1: { start: "10:00", end: "12:00" },
			slot2: { start: "18:00", end: "22:00" },
		},
		SAT: {
			slot1: { start: "10:00", end: "12:00" },
			slot2: { start: "18:00", end: "22:00" },
		},
		SUN: {
			slot1: { start: "10:00", end: "12:00" },
			slot2: { start: "18:00", end: "22:00" },
		},
	});

	const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
	const dayMapping: Record<string, string> = {
		MON: "Monday",
		TUE: "Tuesday",
		WED: "Wednesday",
		THU: "Thursday",
		FRI: "Friday",
		SAT: "Saturday",
		SUN: "Sunday",
	};

	const reverseDayMapping: Record<string, string> = {
		Monday: "MON",
		Tuesday: "TUE",
		Wednesday: "WED",
		Thursday: "THU",
		Friday: "FRI",
		Saturday: "SAT",
		Sunday: "SUN",
	};

	// Helper function to parse time format (remove timezone info)
	const parseTime = (timeStr: string): string => {
		// Remove timezone info like "+02" from "10:00+02"
		return timeStr.split("+")[0];
	};

	// Fetch home visit data on component mount
	useEffect(() => {
		const fetchHomeVisitData = async () => {
			setIsLoadingData(true);
			try {
				const payload = {
					userName: localStorage.getItem("userName") || "",
					userPwd: localStorage.getItem("userPwd") || "",
					deviceStat: "M",
				};

				const response = await getHomeVisitData(payload);

				// Update state with fetched data
				setAllowHomeVisit(response.homeVisit);
				setEmergencyRequest(response.emergencyRequest);

				// Update selected days
				if (
					response.preferredDaysSlots &&
					response.preferredDaysSlots.length > 0
				) {
					const days = response.preferredDaysSlots
						.map((slot) => reverseDayMapping[slot.day])
						.filter(Boolean);
					setSelectedDays(days);

					// Update time slots
					const newTimeSlots: Record<
						string,
						{
							slot1: { start: string; end: string };
							slot2: { start: string; end: string };
						}
					> = {};

					response.preferredDaysSlots.forEach((slot) => {
						const dayKey = reverseDayMapping[slot.day];
						if (dayKey) {
							newTimeSlots[dayKey] = {
								slot1: {
									start: parseTime(slot.slot_1.start_time),
									end: parseTime(slot.slot_1.end_time),
								},
								slot2: {
									start: parseTime(slot.slot_2.start_time),
									end: parseTime(slot.slot_2.end_time),
								},
							};
						}
					});

					setTimeSlots((prev) => ({ ...prev, ...newTimeSlots }));
				}
			} catch (error) {
				console.error("Error fetching home visit data:", error);
				// Keep default values if API fails
			} finally {
				setIsLoadingData(false);
			}
		};

		fetchHomeVisitData();
	}, []);

	// Fetch appointments for initial date and upcoming appointments
	useEffect(() => {
		if (selectedDate) {
			fetchSpecificDateAppointments(selectedDate);
		}
		// Fetch upcoming appointments on component mount
		fetchHomeVisitAppointments("future");
	}, []);

	const handleDayToggle = (day: string) => {
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
		);
	};

	const handleTimeSlotChange = (
		day: string,
		slot: "slot1" | "slot2",
		field: "start" | "end",
		value: string,
	) => {
		setTimeSlots((prev) => ({
			...prev,
			[day]: {
				...prev[day],
				[slot]: {
					...prev[day][slot],
					[field]: value,
				},
			},
		}));
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const handleSave = async () => {
		if (selectedDays.length === 0) {
			setSnackbarMessage("Please select at least one preferred day.");
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
			return;
		}

		setIsLoading(true);

		try {
			// Build preferredDaysSlots array
			const preferredDaysSlots = selectedDays.map((day) => ({
				day: dayMapping[day],
				slot_1: {
					start_time: timeSlots[day].slot1.start,
					end_time: timeSlots[day].slot1.end,
				},
				slot_2: {
					start_time: timeSlots[day].slot2.start,
					end_time: timeSlots[day].slot2.end,
				},
			}));

			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				orgId: localStorage.getItem("orgId") || "",
				preferredDaysSlots,
				homeVisit: allowHomeVisit ? "true" : "false",
				emergencyRequest: emergencyRequest ? "true" : "false",
			};

			const response = await updateHomeVisit(payload);

			if (response.status === "success") {
				setSnackbarMessage(response.message || "Home visit details configured");
				setSnackbarSeverity("success");
				setOpenSnackbar(true);
			} else {
				setSnackbarMessage(response.message || "Failed to save preferences.");
				setSnackbarSeverity("error");
				setOpenSnackbar(true);
			}
		} catch (error) {
			console.error("Error saving home visit preferences:", error);
			setSnackbarMessage(
				"An error occurred while saving preferences. Please try again.",
			);
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchHomeVisitAppointments = async (
		filter: "all" | "future" = "all",
	) => {
		setIsLoadingAppointments(true);
		try {
			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPwd: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				appointmentFilter: filter,
			};

			const response = await getHomeVisitAppointments(payload);
			setHomeVisitAppointments(response.homeVisitAppointments || []);
		} catch (error) {
			console.error("Error fetching home visit appointments:", error);
			setHomeVisitAppointments([]);
		} finally {
			setIsLoadingAppointments(false);
		}
	};

	const toggleAppointmentHistory = () => {
		const newShowState = !showAppointmentHistory;
		setShowAppointmentHistory(newShowState);

		// Fetch appointments when opening the history
		if (newShowState && homeVisitAppointments.length === 0) {
			fetchHomeVisitAppointments(appointmentFilter);
		}
	};

	const toggleTimeSlots = () => {
		setShowTimeSlots(!showTimeSlots);
	};

	const handleFilterChange = (filter: "all" | "future") => {
		setAppointmentFilter(filter);
		fetchHomeVisitAppointments(filter);
	};

	const fetchSpecificDateAppointments = async (date: Dayjs) => {
		setIsLoadingSpecificDate(true);
		try {
			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				checkedDay: date.format("YYYY-MM-DD"), // Format: "2025-09-04"
			};

			const response = await getMatchingHomeVisitSlotTimings(payload);
			setSpecificDateAppointments(response || []);
		} catch (error) {
			console.error("Error fetching specific date appointments:", error);
			setSpecificDateAppointments([]);
		} finally {
			setIsLoadingSpecificDate(false);
		}
	};

	const handleDateChange = (date: Dayjs | null) => {
		setSelectedDate(date);
		if (date) {
			fetchSpecificDateAppointments(date);
		}
	};

	const handleCancelAppointment = async (appointment: any) => {
		setCancellingAppointmentId(appointment.homeVisitAppointmentId);
		try {
			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				appointmentId: appointment.homeVisitAppointmentId,
				petOwnerUid: appointment.petOwnerUid,
				patientUid: appointment.patientUid,
			};

			const response = await cancelHomeVisitAppointment(payload);

			if (response.status === "True") {
				setSnackbarMessage(
					response.message || "Home Visit Appointment cancelled successfully!",
				);
				setSnackbarSeverity("success");
				setOpenSnackbar(true);

				// Refresh the appointments list for the current date
				if (selectedDate) {
					fetchSpecificDateAppointments(selectedDate);
				}
			} else {
				setSnackbarMessage(response.message || "Failed to cancel appointment");
				setSnackbarSeverity("error");
				setOpenSnackbar(true);
			}
		} catch (error) {
			console.error("Error cancelling appointment:", error);
			setSnackbarMessage(
				"An error occurred while cancelling the appointment. Please try again.",
			);
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
		} finally {
			setCancellingAppointmentId(null);
		}
	};

	// Helper function to format date and time
	const formatDateTime = (dateTimeStr: string) => {
		const date = new Date(dateTimeStr);
		return {
			date: date.toLocaleDateString(),
			time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
		};
	};

	return (
		<Box sx={{ maxWidth: 1100, mx: "auto" }}>
			{/* Header Section */}
			<Box sx={{ mb: 3, px: 2, textAlign: "center" }}>
				<Typography
					variant='h5'
					component='h1'
					sx={{ fontWeight: 700, color: "#2c3e50", mb: 0.5 }}>
					Home Visit
				</Typography>
				<Typography variant='body1' sx={{ color: "#555" }}>
					Manage your home visit preferences and view upcoming appointments.
				</Typography>
			</Box>

			{/* Main Content */}
			<Paper
				elevation={0}
				sx={{
					border: "1px solid #e0e0e0",
					borderRadius: "16px",
					overflow: "hidden",
				}}>
				<Box
					sx={{
						bgcolor: "#f7f9fc",
						p: { xs: 2, sm: 3 },
						borderBottom: "1px solid #e0e0e0",
					}}>
					<Typography variant='h6' sx={{ fontWeight: 600, color: "#174a7c" }}>
						<HomeIcon
							sx={{ fontSize: "1.5rem", mr: 1, verticalAlign: "middle" }}
						/>
						Home Visit Settings
					</Typography>
				</Box>

				<Box sx={{ p: { xs: 2, sm: 3 } }}>
					{/* Loading State */}
					{isLoadingData ? (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								py: 4,
							}}>
							<CircularProgress size={24} sx={{ mr: 2 }} />
							<Typography sx={{ color: "#7f8c8d" }}>
								Loading home visit preferences...
							</Typography>
						</Box>
					) : (
						<>
							{/* Allow Home Visit Setting */}
							<Box sx={{ mb: 4 }}>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										mb: 1,
									}}>
									<Typography
										variant='subtitle1'
										sx={{ fontWeight: 600, color: "#34495e" }}>
										Allow Home Visit
									</Typography>
									<FormControlLabel
										control={
											<Switch
												checked={allowHomeVisit}
												onChange={(e) => setAllowHomeVisit(e.target.checked)}
												sx={{
													"& .MuiSwitch-switchBase.Mui-checked": {
														color: "#174a7c",
													},
													"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
														{
															backgroundColor: "#174a7c",
														},
												}}
											/>
										}
										label=''
									/>
								</Box>
								<Typography variant='body2' sx={{ color: "#7f8c8d" }}>
									Enable/Disable Home Visit
								</Typography>
							</Box>

							{/* Preferred Days */}
							<Box sx={{ mb: 4 }}>
								<Typography
									variant='subtitle1'
									sx={{ fontWeight: 600, mb: 2, color: "#34495e" }}>
									Preferred Days
								</Typography>
								<Stack direction='row' spacing={1} flexWrap='wrap'>
									{daysOfWeek.map((day) => (
										<Chip
											key={day}
											label={day}
											onClick={() => handleDayToggle(day)}
											sx={{
												bgcolor: selectedDays.includes(day)
													? "#174a7c"
													: "#f5f5f5",
												color: selectedDays.includes(day)
													? "#ffffff"
													: "#7f8c8d",
												fontWeight: 600,
												borderRadius: "8px",
												cursor: "pointer",
												"&:hover": {
													bgcolor: selectedDays.includes(day)
														? "#103a61"
														: "#e0e0e0",
												},
											}}
										/>
									))}
								</Stack>

								{/* Time Slots Section */}
								{selectedDays.length > 0 && (
									<Box sx={{ mt: 3 }}>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												mb: 2,
											}}>
											<Typography
												variant='subtitle1'
												sx={{ fontWeight: 600, color: "#34495e" }}>
												Time Slots for Selected Days
											</Typography>
											<Button
												variant='text'
												onClick={toggleTimeSlots}
												sx={{
													color: "#174a7c",
													textTransform: "none",
													fontWeight: 600,
												}}>
												{showTimeSlots ? "Hide" : "Show"} Time Slots
											</Button>
										</Box>

										{showTimeSlots && (
											<Box
												sx={{ bgcolor: "#f7f9fc", borderRadius: "12px", p: 3 }}>
												<Grid container spacing={3}>
													{selectedDays.map((day) => (
														<Grid item xs={12} md={6} key={day}>
															<Box sx={{ mb: 2 }}>
																<Typography
																	variant='subtitle2'
																	sx={{
																		fontWeight: 600,
																		color: "#2c3e50",
																		mb: 2,
																	}}>
																	{dayMapping[day]}
																</Typography>

																{/* Slot 1 */}
																<Box sx={{ mb: 2 }}>
																	<Typography
																		variant='body2'
																		sx={{ color: "#7f8c8d", mb: 1 }}>
																		Slot 1
																	</Typography>
																	<Box sx={{ display: "flex", gap: 1 }}>
																		<TextField
																			size='small'
																			type='time'
																			value={timeSlots[day].slot1.start}
																			onChange={(e) =>
																				handleTimeSlotChange(
																					day,
																					"slot1",
																					"start",
																					e.target.value,
																				)
																			}
																			sx={{ flex: 1 }}
																		/>
																		<TextField
																			size='small'
																			type='time'
																			value={timeSlots[day].slot1.end}
																			onChange={(e) =>
																				handleTimeSlotChange(
																					day,
																					"slot1",
																					"end",
																					e.target.value,
																				)
																			}
																			sx={{ flex: 1 }}
																		/>
																	</Box>
																</Box>

																{/* Slot 2 */}
																<Box>
																	<Typography
																		variant='body2'
																		sx={{ color: "#7f8c8d", mb: 1 }}>
																		Slot 2
																	</Typography>
																	<Box sx={{ display: "flex", gap: 1 }}>
																		<TextField
																			size='small'
																			type='time'
																			value={timeSlots[day].slot2.start}
																			onChange={(e) =>
																				handleTimeSlotChange(
																					day,
																					"slot2",
																					"start",
																					e.target.value,
																				)
																			}
																			sx={{ flex: 1 }}
																		/>
																		<TextField
																			size='small'
																			type='time'
																			value={timeSlots[day].slot2.end}
																			onChange={(e) =>
																				handleTimeSlotChange(
																					day,
																					"slot2",
																					"end",
																					e.target.value,
																				)
																			}
																			sx={{ flex: 1 }}
																		/>
																	</Box>
																</Box>
															</Box>
														</Grid>
													))}
												</Grid>
											</Box>
										)}
									</Box>
								)}
							</Box>

							{/* Emergency Request Setting */}
							<Box sx={{ mb: 4 }}>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										mb: 1,
									}}>
									<Typography
										variant='subtitle1'
										sx={{ fontWeight: 600, color: "#34495e" }}>
										Emergency request
									</Typography>
									<FormControlLabel
										control={
											<Switch
												checked={emergencyRequest}
												onChange={(e) => setEmergencyRequest(e.target.checked)}
												sx={{
													"& .MuiSwitch-switchBase.Mui-checked": {
														color: "#174a7c",
													},
													"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
														{
															backgroundColor: "#174a7c",
														},
												}}
											/>
										}
										label=''
									/>
								</Box>
								<Typography variant='body2' sx={{ color: "#7f8c8d" }}>
									Turn ON/OFF emergency requests
								</Typography>
							</Box>

							{/* Save Button */}
							<Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
								<Button
									variant='contained'
									onClick={handleSave}
									disabled={isLoading}
									sx={{
										bgcolor: "#174a7c",
										"&:hover": { bgcolor: "#103a61" },
										"&:disabled": {
											bgcolor: "#bdc3c7",
											color: "#7f8c8d",
										},
										borderRadius: "8px",
										textTransform: "none",
										fontWeight: 600,
										px: 4,
										py: 1.5,
										minWidth: 120,
									}}>
									{isLoading ? (
										<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
											<CircularProgress size={16} sx={{ color: "inherit" }} />
											Saving...
										</Box>
									) : (
										"SAVE"
									)}
								</Button>
							</Box>

							<Divider sx={{ my: 4 }} />

							{/* Appointment History Section */}
							<Box sx={{ mb: 4 }}>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										bgcolor: "#f5f5f5",
										borderRadius: "12px",
										p: 2,
										cursor: "pointer",
										"&:hover": { bgcolor: "#e0e0e0" },
									}}
									onClick={toggleAppointmentHistory}>
									<Typography
										variant='subtitle1'
										sx={{ fontWeight: 600, color: "#34495e" }}>
										Appointment History
									</Typography>
									<ExpandMoreIcon
										sx={{
											color: "#7f8c8d",
											transform: showAppointmentHistory
												? "rotate(180deg)"
												: "rotate(0deg)",
											transition: "transform 0.3s ease",
										}}
									/>
								</Box>

								{/* Appointment History Content */}
								{showAppointmentHistory && (
									<Box
										sx={{
											mt: 2,
											bgcolor: "#f7f9fc",
											borderRadius: "12px",
											p: 3,
										}}>
										{/* Filter Buttons */}
										<Box sx={{ mb: 3 }}>
											<Typography
												variant='subtitle2'
												sx={{ fontWeight: 600, mb: 1, color: "#34495e" }}>
												Filter Appointments
											</Typography>
											<Stack direction='row' spacing={1}>
												<Button
													variant={
														appointmentFilter === "all"
															? "contained"
															: "outlined"
													}
													size='small'
													onClick={() => handleFilterChange("all")}
													sx={{
														bgcolor:
															appointmentFilter === "all"
																? "#174a7c"
																: "transparent",
														color:
															appointmentFilter === "all"
																? "#ffffff"
																: "#174a7c",
														borderColor: "#174a7c",
														textTransform: "none",
														fontWeight: 600,
														"&:hover": {
															bgcolor:
																appointmentFilter === "all"
																	? "#103a61"
																	: "rgba(23, 74, 124, 0.04)",
														},
													}}>
													All Appointments
												</Button>
												<Button
													variant={
														appointmentFilter === "future"
															? "contained"
															: "outlined"
													}
													size='small'
													onClick={() => handleFilterChange("future")}
													sx={{
														bgcolor:
															appointmentFilter === "future"
																? "#174a7c"
																: "transparent",
														color:
															appointmentFilter === "future"
																? "#ffffff"
																: "#174a7c",
														borderColor: "#174a7c",
														textTransform: "none",
														fontWeight: 600,
														"&:hover": {
															bgcolor:
																appointmentFilter === "future"
																	? "#103a61"
																	: "rgba(23, 74, 124, 0.04)",
														},
													}}>
													Future Only
												</Button>
											</Stack>
										</Box>

										{/* Appointments List */}
										{isLoadingAppointments ? (
											<Box
												sx={{
													display: "flex",
													justifyContent: "center",
													py: 3,
												}}>
												<CircularProgress size={24} sx={{ mr: 2 }} />
												<Typography sx={{ color: "#7f8c8d" }}>
													Loading appointments...
												</Typography>
											</Box>
										) : homeVisitAppointments.length > 0 ? (
											<Box sx={{ maxHeight: 400, overflowY: "auto" }}>
												{homeVisitAppointments.map((appointment) => {
													const startTime = formatDateTime(
														appointment.homeVisitStartTime,
													);
													const endTime = formatDateTime(
														appointment.homeVisitEndTime,
													);

													return (
														<Card
															key={appointment.homeVisitAppointmentId}
															sx={{ mb: 2, borderRadius: "8px" }}>
															<CardContent sx={{ p: 2 }}>
																<Box
																	sx={{
																		display: "flex",
																		alignItems: "center",
																		gap: 2,
																	}}>
																	<Box sx={{ display: "flex", gap: 1 }}>
																		<Avatar
																			sx={{
																				bgcolor: "#e0e0e0",
																				width: 32,
																				height: 32,
																			}}>
																			<PersonIcon
																				sx={{
																					color: "#7f8c8d",
																					fontSize: "1.2rem",
																				}}
																			/>
																		</Avatar>
																		<Avatar
																			sx={{
																				bgcolor: "#e0e0e0",
																				width: 32,
																				height: 32,
																			}}>
																			<PersonIcon
																				sx={{
																					color: "#7f8c8d",
																					fontSize: "1.2rem",
																				}}
																			/>
																		</Avatar>
																	</Box>

																	<Box sx={{ flex: 1 }}>
																		<Typography
																			variant='subtitle1'
																			sx={{
																				fontWeight: 600,
																				color: "#2c3e50",
																				mb: 1,
																			}}>
																			{appointment.petAndOwnerName}
																		</Typography>

																		<Box
																			sx={{
																				display: "flex",
																				alignItems: "center",
																				gap: 1,
																				mb: 1,
																			}}>
																			<AccessTimeIcon
																				sx={{
																					color: "#7f8c8d",
																					fontSize: "1rem",
																				}}
																			/>
																			<Typography
																				variant='body2'
																				sx={{ color: "#7f8c8d" }}>
																				TIME: {startTime.time} - {endTime.time}
																			</Typography>
																		</Box>

																		<Box
																			sx={{
																				display: "flex",
																				alignItems: "center",
																				gap: 1,
																				mb: 1,
																			}}>
																			<CalendarTodayIcon
																				sx={{
																					color: "#7f8c8d",
																					fontSize: "1rem",
																				}}
																			/>
																			<Typography
																				variant='body2'
																				sx={{ color: "#7f8c8d" }}>
																				{startTime.date}
																			</Typography>
																		</Box>

																		<Typography
																			variant='body2'
																			sx={{ color: "#7f8c8d" }}>
																			{appointment.address}
																		</Typography>
																	</Box>

																	<Chip
																		label={appointment.homeVisitCause.toUpperCase()}
																		sx={{
																			bgcolor:
																				appointment.homeVisitCause ===
																				"emergency"
																					? "#ffebee"
																					: "#e8f5e8",
																			color:
																				appointment.homeVisitCause ===
																				"emergency"
																					? "#c62828"
																					: "#2e7d32",
																			fontWeight: 600,
																			borderRadius: "16px",
																		}}
																	/>
																</Box>
															</CardContent>
														</Card>
													);
												})}
											</Box>
										) : (
											<Box sx={{ textAlign: "center", py: 3 }}>
												<Typography
													sx={{ color: "#7f8c8d", fontStyle: "italic" }}>
													No home visit appointments found for the selected
													filter.
												</Typography>
											</Box>
										)}
									</Box>
								)}
							</Box>

							{/* Specific Date Appointments Section */}
							<Box sx={{ mb: 4 }}>
								<Typography
									variant='subtitle1'
									sx={{ fontWeight: 600, mb: 2, color: "#174a7c" }}>
									Home Visit Requests by Date
								</Typography>

								<Box sx={{ mb: 3 }}>
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<Stack direction='row' spacing={2} alignItems='center'>
											<DatePicker
												label='Select Date'
												value={selectedDate}
												onChange={handleDateChange}
												sx={{
													flex: 1,
													"& .MuiOutlinedInput-root": {
														borderRadius: "8px",
														"& fieldset": {
															borderColor: "#e0e0e0",
														},
														"&:hover fieldset": {
															borderColor: "#174a7c",
														},
														"&.Mui-focused fieldset": {
															borderColor: "#174a7c",
														},
													},
												}}
											/>
											<Button
												variant='outlined'
												size='small'
												onClick={() => handleDateChange(dayjs())}
												sx={{
													borderColor: "#174a7c",
													color: "#174a7c",
													textTransform: "none",
													fontWeight: 600,
													borderRadius: "8px",
													"&:hover": {
														borderColor: "#103a61",
														bgcolor: "rgba(23, 74, 124, 0.04)",
													},
												}}>
												Today
											</Button>
										</Stack>
									</LocalizationProvider>
								</Box>

								{/* Specific Date Appointments List */}
								{isLoadingSpecificDate ? (
									<Box
										sx={{ display: "flex", justifyContent: "center", py: 3 }}>
										<CircularProgress size={24} sx={{ mr: 2 }} />
										<Typography sx={{ color: "#7f8c8d" }}>
											Loading appointments for selected date...
										</Typography>
									</Box>
								) : specificDateAppointments.length > 0 ? (
									<Box sx={{ maxHeight: 400, overflowY: "auto" }}>
										{specificDateAppointments.map((appointment) => {
											const startTime = formatDateTime(
												appointment.homeVisitStartTime,
											);
											const endTime = formatDateTime(
												appointment.homeVisitEndTime,
											);

											return (
												<Card
													key={appointment.homeVisitAppointmentId}
													sx={{ mb: 2, borderRadius: "8px" }}>
													<CardContent sx={{ p: 2 }}>
														<Box
															sx={{
																display: "flex",
																alignItems: "center",
																gap: 2,
															}}>
															<Box sx={{ display: "flex", gap: 1 }}>
																<Avatar
																	sx={{
																		bgcolor: "#e0e0e0",
																		width: 32,
																		height: 32,
																	}}>
																	<PersonIcon
																		sx={{
																			color: "#7f8c8d",
																			fontSize: "1.2rem",
																		}}
																	/>
																</Avatar>
																<Avatar
																	sx={{
																		bgcolor: "#e0e0e0",
																		width: 32,
																		height: 32,
																	}}>
																	<PersonIcon
																		sx={{
																			color: "#7f8c8d",
																			fontSize: "1.2rem",
																		}}
																	/>
																</Avatar>
															</Box>

															<Box sx={{ flex: 1 }}>
																<Typography
																	variant='subtitle1'
																	sx={{
																		fontWeight: 600,
																		color: "#2c3e50",
																		mb: 1,
																	}}>
																	{appointment.petAndOwnerName ||
																		`Appointment #${appointment.homeVisitAppointmentId}`}
																</Typography>

																<Box
																	sx={{
																		display: "flex",
																		alignItems: "center",
																		gap: 1,
																		mb: 1,
																	}}>
																	<AccessTimeIcon
																		sx={{ color: "#7f8c8d", fontSize: "1rem" }}
																	/>
																	<Typography
																		variant='body2'
																		sx={{ color: "#7f8c8d" }}>
																		TIME: {startTime.time} - {endTime.time}
																	</Typography>
																</Box>

																<Box
																	sx={{
																		display: "flex",
																		alignItems: "center",
																		gap: 1,
																		mb: 1,
																	}}>
																	<CalendarTodayIcon
																		sx={{ color: "#7f8c8d", fontSize: "1rem" }}
																	/>
																	<Typography
																		variant='body2'
																		sx={{ color: "#7f8c8d" }}>
																		{startTime.date}
																	</Typography>
																</Box>

																{appointment.address && (
																	<Typography
																		variant='body2'
																		sx={{ color: "#7f8c8d" }}>
																		{appointment.address}
																	</Typography>
																)}
															</Box>

															<Box
																sx={{
																	display: "flex",
																	flexDirection: "column",
																	gap: 1,
																}}>
																<Chip
																	label={appointment.homeVisitCause.toUpperCase()}
																	sx={{
																		bgcolor:
																			appointment.homeVisitCause === "emergency"
																				? "#ffebee"
																				: "#e8f5e8",
																		color:
																			appointment.homeVisitCause === "emergency"
																				? "#c62828"
																				: "#2e7d32",
																		fontWeight: 600,
																		borderRadius: "16px",
																	}}
																/>
																<Button
																	variant='outlined'
																	size='small'
																	onClick={() =>
																		handleCancelAppointment(appointment)
																	}
																	disabled={
																		cancellingAppointmentId ===
																		appointment.homeVisitAppointmentId
																	}
																	sx={{
																		borderColor: "#e74c3c",
																		color: "#e74c3c",
																		textTransform: "none",
																		fontWeight: 600,
																		minWidth: 80,
																		"&:hover": {
																			borderColor: "#c0392b",
																			bgcolor: "rgba(231, 76, 60, 0.04)",
																		},
																		"&:disabled": {
																			borderColor: "#bdc3c7",
																			color: "#bdc3c7",
																		},
																	}}>
																	{cancellingAppointmentId ===
																	appointment.homeVisitAppointmentId ? (
																		<CircularProgress
																			size={16}
																			sx={{ color: "#e74c3c" }}
																		/>
																	) : (
																		"Cancel"
																	)}
																</Button>
															</Box>
														</Box>
													</CardContent>
												</Card>
											);
										})}
									</Box>
								) : (
									<Box sx={{ textAlign: "center", py: 3 }}>
										<Typography sx={{ color: "#7f8c8d", fontStyle: "italic" }}>
											No home visit requests found for the selected date.
										</Typography>
									</Box>
								)}
							</Box>

							{/* Upcoming Appointments */}
							<Box>
								<Typography
									variant='subtitle1'
									sx={{ fontWeight: 600, mb: 2, color: "#174a7c" }}>
									Upcoming Appointments
								</Typography>

								{homeVisitAppointments.length > 0 ? (
									<Box sx={{ maxHeight: 400, overflowY: "auto" }}>
										{homeVisitAppointments.slice(0, 3).map((appointment) => {
											const startTime = formatDateTime(
												appointment.homeVisitStartTime,
											);
											const endTime = formatDateTime(
												appointment.homeVisitEndTime,
											);

											return (
												<Card
													key={appointment.homeVisitAppointmentId}
													sx={{
														mb: 2,
														borderRadius: "12px",
														boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
													}}>
													<CardContent sx={{ p: 3 }}>
														<Box
															sx={{
																display: "flex",
																alignItems: "center",
																gap: 2,
															}}>
															<Box sx={{ display: "flex", gap: 1 }}>
																<Avatar
																	sx={{
																		bgcolor: "#e0e0e0",
																		width: 32,
																		height: 32,
																	}}>
																	<PersonIcon
																		sx={{
																			color: "#7f8c8d",
																			fontSize: "1.2rem",
																		}}
																	/>
																</Avatar>
																<Avatar
																	sx={{
																		bgcolor: "#e0e0e0",
																		width: 32,
																		height: 32,
																	}}>
																	<PersonIcon
																		sx={{
																			color: "#7f8c8d",
																			fontSize: "1.2rem",
																		}}
																	/>
																</Avatar>
															</Box>

															<Box sx={{ flex: 1 }}>
																<Typography
																	variant='subtitle1'
																	sx={{
																		fontWeight: 600,
																		color: "#2c3e50",
																		mb: 1,
																	}}>
																	{appointment.petAndOwnerName ||
																		`Appointment #${appointment.homeVisitAppointmentId}`}
																</Typography>

																<Box
																	sx={{
																		display: "flex",
																		alignItems: "center",
																		gap: 1,
																		mb: 1,
																	}}>
																	<AccessTimeIcon
																		sx={{ color: "#7f8c8d", fontSize: "1rem" }}
																	/>
																	<Typography
																		variant='body2'
																		sx={{ color: "#7f8c8d" }}>
																		TIME: {startTime.time} - {endTime.time}
																	</Typography>
																</Box>

																<Box
																	sx={{
																		display: "flex",
																		alignItems: "center",
																		gap: 1,
																	}}>
																	<CalendarTodayIcon
																		sx={{ color: "#7f8c8d", fontSize: "1rem" }}
																	/>
																	<Typography
																		variant='body2'
																		sx={{ color: "#7f8c8d" }}>
																		{startTime.date}
																	</Typography>
																</Box>
															</Box>

															<Chip
																label={appointment.homeVisitCause.toUpperCase()}
																sx={{
																	bgcolor:
																		appointment.homeVisitCause === "emergency"
																			? "#ffebee"
																			: "#e8f5e8",
																	color:
																		appointment.homeVisitCause === "emergency"
																			? "#c62828"
																			: "#2e7d32",
																	fontWeight: 600,
																	borderRadius: "16px",
																}}
															/>
														</Box>
													</CardContent>
												</Card>
											);
										})}
									</Box>
								) : (
									<Box sx={{ textAlign: "center", py: 4 }}>
										<Typography sx={{ color: "#7f8c8d", fontStyle: "italic" }}>
											No upcoming appointments scheduled
										</Typography>
									</Box>
								)}
							</Box>
						</>
					)}
				</Box>
			</Paper>

			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</Box>
	);
}

export default VetConnectHomeVisit;
