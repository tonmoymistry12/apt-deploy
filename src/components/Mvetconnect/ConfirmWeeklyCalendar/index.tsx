import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { FaclityServiceResponse } from "@/interfaces/facilityInterface";
import {
	editSlot,
	checkDayAvailability,
	addSlot,
} from "@/services/manageCalendar";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slotDurations = [5, 10, 15, 20, 30, 40, 45, 60];

// Function to get day of week from date string
const getDayOfWeek = (dateStr: string): string => {
	try {
		const date = parseDateString(dateStr);
		if (!date) {
			return "";
		}

		const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		return dayNames[date.day()]; // Use dayjs day() method
	} catch (error) {
		console.error("Error parsing date:", dateStr, error);
		return "";
	}
};

// Function to parse date string to Dayjs object
const parseDateString = (dateStr: string): any => {
	if (!dateStr) return null;

	try {
		let date: Date;

		if (dateStr.includes(".")) {
			// Format: DD.MM.YY
			const [day, month, year] = dateStr.split(".");
			date = new Date(
				2000 + parseInt(year),
				parseInt(month) - 1,
				parseInt(day)
			);
		} else if (dateStr.includes("/")) {
			// Format: DD/MM/YYYY
			const [day, month, year] = dateStr.split("/");
			date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
		} else {
			// Try to parse as is
			date = new Date(dateStr);
		}

		if (isNaN(date.getTime())) {
			return null;
		}

		// Convert to Dayjs object for DatePicker compatibility
		return dayjs(date);
	} catch (error) {
		console.error("Error parsing date:", dateStr, error);
		return null;
	}
};

// Function to check if a day falls within the date range
const isDayInRange = (
	day: string,
	startDate: string,
	endDate: string
): boolean => {
	if (!startDate || !endDate) return true; // If no dates, allow all days

	try {
		// Parse start and end dates
		const start = parseDateString(startDate);
		const end = parseDateString(endDate);

		if (!start || !end) return true;

		// Get all dates in the range
		const datesInRange: string[] = [];
		let current = start.clone(); // Clone the start date

		while (current.isBefore(end) || current.isSame(end, "day")) {
			const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
			datesInRange.push(dayNames[current.day()]);
			current = current.add(1, "day"); // Add one day using dayjs
		}

		return datesInRange.includes(day);
	} catch (error) {
		console.error("Error checking day range:", error);
		return true; // Fallback to allowing all days
	}
};

const allHours = Array.from({ length: 24 }, (_, i) =>
	i.toString().padStart(2, "0")
);
const morningHours = Array.from({ length: 13 }, (_, i) =>
	i.toString().padStart(2, "0")
);
const afternoonHours = Array.from({ length: 11 }, (_, i) =>
	(i + 13).toString().padStart(2, "0")
);
const allMinutes = Array.from({ length: 60 }, (_, i) =>
	i.toString().padStart(2, "0")
);

interface Slot {
	fromHour: string;
	fromMin: string;
	toHour: string;
	toMin: string;
	patients: string;
}

interface ConfirmWeeklyCalendarProps {
	open: boolean;
	onCancel: () => void;
	onConfirm: (
		selectedDays: string[],
		slots: Slot[],
		appointmentType: string,
		slotDuration: string,
		facility: FaclityServiceResponse | null,
		startDate: string,
		endDate: string
	) => void;
	onBack: () => void;
	facility: FaclityServiceResponse | null;
	startDate: string;
	endDate: string;
	prefill?: any;
	slotId?: string; // Add slotId for editing
	onEditSuccess?: () => void; // Callback to refresh calendar list after successful edit
	doctorUID?: any;
}

const ConfirmWeeklyCalendar: React.FC<ConfirmWeeklyCalendarProps> = ({
	open,
	onCancel,
	onConfirm,
	onBack,
	facility,
	startDate,
	endDate,
	prefill,
	slotId,
	onEditSuccess,
	doctorUID = null,
}) => {
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [showCreateNew, setShowCreateNew] = useState(false);
	const [slots, setSlots] = useState<Slot[]>([
		{ fromHour: "", fromMin: "", toHour: "", toMin: "", patients: "" },
	]);
	const [appointmentType, setAppointmentType] = useState("TIMESLOT");
	const [slotDuration, setSlotDuration] = useState("");
	const [slotErrors, setSlotErrors] = useState<string[]>([]);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error" | "warning" | "info",
	});

	// State for editable date range (only used when editing)
	const [editableStartDate, setEditableStartDate] = useState<string>(startDate);
	const [editableEndDate, setEditableEndDate] = useState<string>(endDate);
	const [isEditingDates, setIsEditingDates] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	// Function to check day availability and then call addSlot API
	const checkDayAvailabilityAPI = async (
		startDate: string,
		endDate: string
	): Promise<boolean> => {
		try {
			// Format dates to DD/MM/YYYY format for the API
			const formatDateForAPI = (dateStr: string) => {
				if (!dateStr) return "";

				// If already in DD/MM/YYYY format, return as is
				if (dateStr.includes("/")) {
					return dateStr;
				}

				// If in DD.MM.YY format, convert to DD/MM/YYYY
				if (dateStr.includes(".")) {
					const [day, month, year] = dateStr.split(".");
					return `${day}/${month}/20${year}`;
				}

				// If in other format, try to parse and format
				try {
					const date = parseDateString(dateStr);
					if (date) {
						return date.format("DD/MM/YYYY");
					}
				} catch (error) {
					console.error("Error formatting date:", error);
				}

				return dateStr; // Return original if parsing fails
			};

			const payload = {
				userName: localStorage.getItem("userName") || "", // This should come from user context
				userPass: localStorage.getItem("userPwd") || "", // This should come from user context
				deviceStat: "M",
				orgId: localStorage.getItem("orgId")?.toString() || "39", // This should come from user context
				startDate: formatDateForAPI(startDate),
				stopDate: formatDateForAPI(endDate),
			};

			console.log("Checking day availability:", payload);
			console.log("Original dates:", { startDate, endDate });
			console.log("Formatted dates for API:", {
				startDate: formatDateForAPI(startDate),
				stopDate: formatDateForAPI(endDate),
			});
			const result = await checkDayAvailability(payload, doctorUID);

			if (result.status === "Success") {
				setSnackbar({
					open: true,
					message: result.message || "Days are available",
					severity: "success",
				});

				// Return true to indicate days are available
				// The actual slot creation will be handled by the parent component
				return true;
			} else {
				setSnackbar({
					open: true,
					message: result.message || "Days are not available",
					severity: "error",
				});
				return false;
			}
		} catch (error) {
			console.error("Error checking day availability:", error);
			setSnackbar({
				open: true,
				message: "Error checking day availability. Please try again.",
				severity: "error",
			});
			return false;
		}
	};

	// Function to call editslot API
	const callEditSlotAPI = async (slotData: {
		selectedDays: string[];
		slots: Slot[];
		appointmentType: string;
		slotDuration: string;
		startDate: string;
		endDate: string;
	}) => {
		if (!slotId || !facility) {
			setSnackbar({
				open: true,
				message: "Missing slot ID or facility information",
				severity: "error",
			});
			return false;
		}

		try {
			setIsSubmitting(true);

			// Convert selected days to the format expected by API (Monday, Friday)
			const dayMapping: { [key: string]: string } = {
				Mon: "Monday",
				Tue: "Tuesday",
				Wed: "Wednesday",
				Thu: "Thursday",
				Fri: "Friday",
				Sat: "Saturday",
				Sun: "Sunday",
			};

			const checkedDay = slotData.selectedDays
				.map((day) => dayMapping[day] || day)
				.join(",");

			// Convert slots to dayTime format based on selected days
			// If 2 days selected and 2 slots provided: "10-00-12-00~14-00-16-00,10-00-12-00~14-00-16-00"
			// If 2 days selected and 1 slot provided: "10-00-03-00,01-00-03-00"
			let dayTime = "";

			console.log("=== DAYTIME GENERATION DEBUG ===");
			console.log("Selected days count:", slotData.selectedDays.length);
			console.log("Selected days:", slotData.selectedDays);
			console.log("Slots count:", slotData.slots.length);
			console.log("Available slots:", slotData.slots);

			if (slotData.selectedDays.length > 0 && slotData.slots.length > 0) {
				// Filter out incomplete slots (only keep slots with all time fields filled)
				const completeSlots = slotData.slots.filter(
					(slot) => slot.fromHour && slot.fromMin && slot.toHour && slot.toMin
				);

				console.log("Complete slots:", completeSlots);

				// Create the time slot string only from complete slots
				const timeSlotString = completeSlots
					.map((slot) => {
						const fromTime = `${slot.fromHour}-${slot.fromMin}`;
						const toTime = `${slot.toHour}-${slot.toMin}`;
						return `${fromTime}-${toTime}`;
					})
					.join("~");

				console.log("Time slot string:", timeSlotString);

				// Repeat the time slot for each selected day
				const dayTimeArray = [];
				for (let i = 0; i < slotData.selectedDays.length; i++) {
					dayTimeArray.push(timeSlotString);
				}

				console.log("Day time array:", dayTimeArray);
				dayTime = dayTimeArray.join(",");
				console.log("Final dayTime string:", dayTime);
			}

			console.log("=== END DAYTIME DEBUG ===");

			// Determine bookAppType - convert back to lowercase for API
			const bookAppType = slotData.appointmentType.toLowerCase();

			// Ensure dates are in DD/MM/YYYY format for the API
			const formatDateForAPI = (dateStr: string) => {
				if (!dateStr) return "";

				// If already in DD/MM/YYYY format, return as is
				if (dateStr.includes("/")) {
					return dateStr;
				}

				// If in DD.MM.YY format, convert to DD/MM/YYYY
				if (dateStr.includes(".")) {
					const [day, month, year] = dateStr.split(".");
					return `${day}/${month}/20${year}`;
				}

				// If in other format, try to parse and format
				try {
					const date = parseDateString(dateStr);
					if (date) {
						return date.format("DD/MM/YYYY");
					}
				} catch (error) {
					console.error("Error formatting date:", error);
				}

				return dateStr; // Return original if parsing fails
			};

			const payload = {
				userName: localStorage.getItem("userName") || "", // This should come from user context
				userPass: localStorage.getItem("userPwd") || "", // This should come from user context
				deviceStat: "M",
				orgId: localStorage.getItem("orgId")?.toString() || "39", // This should come from user context
				facilityId: facility.facilityId || 1,
				bookAppType: bookAppType,
				checkedDay: checkedDay,
				dayTime: dayTime,
				startDate: formatDateForAPI(slotData.startDate),
				stopDate: formatDateForAPI(slotData.endDate),
				slotDuration: slotData.slotDuration || "30",
				slotDuration2: slotData.slotDuration || "30",
				slotId: slotId,
			};

			console.log("Editslot API payload:", payload);
			console.log("Appointment type being sent:", bookAppType);
			console.log("Final dayTime value in payload:", payload.dayTime);
			console.log("Final checkedDay value in payload:", payload.checkedDay);

			const result = await editSlot(payload);

			if (result.status === "True") {
				setSnackbar({
					open: true,
					message: result.message || "Slot updated successfully",
					severity: "success",
				});
				return true;
			} else {
				setSnackbar({
					open: true,
					message: result.message || "Failed to update slot",
					severity: "error",
				});
				return false;
			}
		} catch (error) {
			console.error("Error calling editslot API:", error);
			setSnackbar({
				open: true,
				message: "Error updating slot. Please try again.",
				severity: "error",
			});
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle date changes and clear invalid selections
	const handleDateChange = (isStartDate: boolean, newDate: string) => {
		if (isStartDate) {
			setEditableStartDate(newDate);
		} else {
			setEditableEndDate(newDate);
		}

		// Validate date range
		const currentStartDate = isStartDate ? newDate : editableStartDate;
		const currentEndDate = isStartDate ? editableEndDate : newDate;

		if (currentStartDate && currentEndDate) {
			// Check if end date is before start date
			const startDate = parseDateString(currentStartDate);
			const endDate = parseDateString(currentEndDate);

			if (startDate && endDate && endDate.isBefore(startDate)) {
				setSnackbar({
					open: true,
					message: "End date cannot be before start date",
					severity: "error",
				});
				return;
			}

			// Clear any selected days that are no longer valid in the new date range
			const validDays = selectedDays.filter((day) =>
				isDayInRange(day, currentStartDate, currentEndDate)
			);
			if (validDays.length !== selectedDays.length) {
				setSelectedDays(validDays);
				if (validDays.length === 0) {
					setShowCreateNew(false);
				}
			}
		}
	};

	// Handle prefill data for editing
	useEffect(() => {
		if (prefill && open) {
			console.log("Prefill data received:", prefill);

			// Get the original API data - it's nested in originalData if transformed
			const originalData = prefill.originalData || prefill;
			console.log("Original API data:", originalData);

			// Parse the prefill data to extract selected days and slots
			const startDate =
				originalData.scheduleStartDt ||
				originalData.startDate ||
				prefill.scheduleStartDt ||
				prefill.startDate;
			const endDate =
				originalData.scheduleStopDt ||
				originalData.endDate ||
				prefill.scheduleStopDt ||
				prefill.endDate;

			// Set the editable dates
			setEditableStartDate(startDate);
			setEditableEndDate(endDate);

			// Set other form fields based on bookAppType
			const appointmentType =
				originalData.bookAppType?.toLowerCase() || "timeslot";
			setAppointmentType(
				appointmentType === "timeslot" ? "TIMESLOT" : "SEQUENCE"
			);

			// Set slot duration - convert to string for consistency
			const durationValue =
				originalData.slotDuration || originalData.slotDurationMinutes || "";
			setSlotDuration(durationValue.toString());

			console.log("Prefill data:", prefill);
			console.log("Original API data:", originalData);
			console.log(
				"Setting slot duration:",
				originalData.slotDuration,
				"|",
				durationValue
			);
			console.log(
				"Setting appointment type:",
				appointmentType === "timeslot" ? "TIMESLOT" : "SEQUENCE"
			);
			console.log("Original bookAppType from API:", originalData.bookAppType);

			// Set editable dates for editing mode - ensure they are properly formatted
			setEditableStartDate(startDate);
			setEditableEndDate(endDate);
			setIsEditingDates(false); // Start with dates not editable

			// Extract available days from the prefill data
			let availableDays: string[] = [];

			// Check if selectedDays already exists in prefill (processed data from parent)
			if (prefill.selectedDays && Array.isArray(prefill.selectedDays)) {
				availableDays = prefill.selectedDays;
			} else if (
				prefill.selectedDays &&
				typeof prefill.selectedDays === "string"
			) {
				availableDays = prefill.selectedDays
					.split(",")
					.map((day: string) => day.trim());
			} else {
				// Fallback to original logic for raw API response - use originalData
				const dayMapping: { [key: string]: string } = {
					sundayAvailable: "Sun",
					mondayAvailable: "Mon",
					tuesdayAvailable: "Tue",
					wednesdayAvailable: "Wed",
					thursdayAvailable: "Thu",
					fridayAvailable: "Fri",
					saturdayAvailable: "Sat",
				};

				Object.entries(originalData).forEach(([key, value]) => {
					if (dayMapping[key] && value === 1) {
						availableDays.push(dayMapping[key]);
					}
				});
			}

			console.log("Available days extracted:", availableDays);

			if (availableDays.length > 0) {
				setSelectedDays(availableDays);
				setShowCreateNew(true);

				// Parse time slots from individual day time fields
				const parsedSlots: Slot[] = [];

				// Collect all available time slots from the selected days
				const dayTimeMapping: {
					[key: string]: {
						start1: string;
						start2: string;
						stop1: string;
						stop2: string;
					};
				} = {
					sunday: {
						start1: "sundayStartTime1",
						start2: "sundayStartTime2",
						stop1: "sundayStopTime1",
						stop2: "sundayStopTime2",
					},
					monday: {
						start1: "mondayStartTime1",
						start2: "mondayStartTime2",
						stop1: "mondayStopTime1",
						stop2: "mondayStopTime2",
					},
					tuesday: {
						start1: "tuesdayStartTime1",
						start2: "tuesdayStartTime2",
						stop1: "tuesdayStopTime1",
						stop2: "tuesdayStopTime2",
					},
					wednesday: {
						start1: "wednesdayStartTime1",
						start2: "wednesdayStartTime2",
						stop1: "wednesdayStopTime1",
						stop2: "wednesdayStopTime2",
					},
					thursday: {
						start1: "thursdayStartTime1",
						start2: "thursdayStartTime2",
						stop1: "thursdayStopTime1",
						stop2: "thursdayStopTime2",
					},
					friday: {
						start1: "fridayStartTime1",
						start2: "fridayStartTime2",
						stop1: "fridayStopTime1",
						stop2: "fridayStopTime2",
					},
					saturday: {
						start1: "saturdayStartTime1",
						start2: "saturdayStartTime2",
						stop1: "saturdayStopTime1",
						stop2: "saturdayStopTime2",
					},
				};

				// Map short day names to full day names
				const dayNameMapping: { [key: string]: string } = {
					Sun: "sunday",
					Mon: "monday",
					Tue: "tuesday",
					Wed: "wednesday",
					Thu: "thursday",
					Fri: "friday",
					Sat: "saturday",
				};

				// Get all unique time slots from the selected days
				const allSlots: Slot[] = [];

				// Helper function to determine if a time belongs to slot 2 (afternoon/evening slots 13-23)
				const isSlot2Time = (timeStr: string): boolean => {
					if (!timeStr || timeStr === "00:00") return false;
					const [hour, min] = timeStr.split(":").map(Number);
					return hour >= 13; // 13:00 to 23:59 is slot 2 range
				};

				availableDays.forEach((shortDay) => {
					const fullDay = dayNameMapping[shortDay];
					if (fullDay && dayTimeMapping[fullDay]) {
						const timeFields = dayTimeMapping[fullDay];
						const start1 = originalData[timeFields.start1];
						const start2 = originalData[timeFields.start2];
						const stop1 = originalData[timeFields.stop1];
						const stop2 = originalData[timeFields.stop2];

						console.log(
							`Processing ${fullDay}: start1=${start1}, stop1=${stop1}, start2=${start2}, stop2=${stop2}`
						);
						console.log(`Is start1 slot2? ${isSlot2Time(start1)}`);

						// Check if start1 is in slot 2 range (13-23)
						if (start1 && stop1 && isSlot2Time(start1)) {
							console.log(
								`Adding slot2 data from start1: ${start1} - ${stop1}`
							);
							const [startHour, startMin] = start1.split(":").map(Number);
							const [stopHour, stopMin] = stop1.split(":").map(Number);

							const slot = {
								fromHour: startHour.toString().padStart(2, "0"),
								fromMin: startMin.toString().padStart(2, "0"),
								toHour: stopHour.toString().padStart(2, "0"),
								toMin: stopMin.toString().padStart(2, "0"),
								patients: "1", // Default value
							};

							// Only add if this slot doesn't already exist (avoid duplicates)
							const exists = allSlots.some(
								(s) =>
									s.fromHour === slot.fromHour &&
									s.fromMin === slot.fromMin &&
									s.toHour === slot.toHour &&
									s.toMin === slot.toMin
							);

							if (!exists) {
								allSlots.push(slot);
							}
						}

						// Check if start1 is in slot 1 range (00-12)
						if (
							start1 &&
							stop1 &&
							!isSlot2Time(start1) &&
							(start1 !== "00:00" || stop1 !== "00:00")
						) {
							const [startHour, startMin] = start1.split(":").map(Number);
							const [stopHour, stopMin] = stop1.split(":").map(Number);

							const slot = {
								fromHour: startHour.toString().padStart(2, "0"),
								fromMin: startMin.toString().padStart(2, "0"),
								toHour: stopHour.toString().padStart(2, "0"),
								toMin: stopMin.toString().padStart(2, "0"),
								patients: "1", // Default value
							};

							// Only add if this slot doesn't already exist (avoid duplicates)
							const exists = allSlots.some(
								(s) =>
									s.fromHour === slot.fromHour &&
									s.fromMin === slot.fromMin &&
									s.toHour === slot.toHour &&
									s.toMin === slot.toMin
							);

							if (!exists) {
								allSlots.push(slot);
							}
						}

						// Check if start2 is in slot 2 range (13-23) or any valid time
						if (start2 && stop2 && isSlot2Time(start2)) {
							const [startHour, startMin] = start2.split(":").map(Number);
							const [stopHour, stopMin] = stop2.split(":").map(Number);

							const slot = {
								fromHour: startHour.toString().padStart(2, "0"),
								fromMin: startMin.toString().padStart(2, "0"),
								toHour: stopHour.toString().padStart(2, "0"),
								toMin: stopMin.toString().padStart(2, "0"),
								patients: "1", // Default value
							};

							// Only add if this slot doesn't already exist (avoid duplicates)
							const exists = allSlots.some(
								(s) =>
									s.fromHour === slot.fromHour &&
									s.fromMin === slot.fromMin &&
									s.toHour === slot.toHour &&
									s.toMin === slot.toMin
							);

							if (!exists) {
								allSlots.push(slot);
							}
						}

						// Check if start2 is in slot 1 range (00-12)
						if (
							start2 &&
							stop2 &&
							!isSlot2Time(start2) &&
							(start2 !== "00:00" || stop2 !== "00:00")
						) {
							const [startHour, startMin] = start2.split(":").map(Number);
							const [stopHour, stopMin] = stop2.split(":").map(Number);

							const slot = {
								fromHour: startHour.toString().padStart(2, "0"),
								fromMin: startMin.toString().padStart(2, "0"),
								toHour: stopHour.toString().padStart(2, "0"),
								toMin: stopMin.toString().padStart(2, "0"),
								patients: "1", // Default value
							};

							// Only add if this slot doesn't already exist (avoid duplicates)
							const exists = allSlots.some(
								(s) =>
									s.fromHour === slot.fromHour &&
									s.fromMin === slot.fromMin &&
									s.toHour === slot.toHour &&
									s.toMin === slot.toMin
							);

							if (!exists) {
								allSlots.push(slot);
							}
						}
					}
				});

				// Sort slots by start time
				allSlots.sort((a, b) => {
					const aStart = parseInt(a.fromHour) * 60 + parseInt(a.fromMin);
					const bStart = parseInt(b.fromHour) * 60 + parseInt(b.fromMin);
					return aStart - bStart;
				});

				console.log("=== SLOT PARSING DEBUG ===");
				console.log("Available days:", availableDays);
				console.log("All slots before sorting:", allSlots);
				console.log("Number of slots parsed:", allSlots.length);

				// Determine if we have slot 2 data (13-23 range)
				const hasSlot2Data = allSlots.some(
					(slot) => parseInt(slot.fromHour) >= 13
				);
				console.log("Has slot 2 data (13-23 range):", hasSlot2Data);
				console.log("=== END SLOT DEBUG ===");

				if (allSlots.length > 0) {
					console.log("Setting slots with data:", allSlots);

					// If we have slot 2 data (hour >= 13), ensure we show both slot inputs
					// Create final slots array with proper ordering
					const finalSlots: Slot[] = [];

					// If we have slot 2 data, add it as the second slot
					if (hasSlot2Data) {
						// Find slot 2 data (hour >= 13)
						const slot2Data = allSlots.find(
							(slot) => parseInt(slot.fromHour) >= 13
						);
						if (slot2Data) {
							// Slot 1 (empty or earlier time)
							const slot1Data = allSlots.find(
								(slot) => parseInt(slot.fromHour) < 13
							);
							if (slot1Data) {
								finalSlots.push(slot1Data);
							} else {
								finalSlots.push({
									fromHour: "",
									fromMin: "",
									toHour: "",
									toMin: "",
									patients: "",
								});
							}
							// Slot 2 (with data)
							finalSlots.push(slot2Data);
						} else {
							finalSlots.push(...allSlots);
						}
					} else {
						// No slot 2 data, just use the parsed slots
						finalSlots.push(...allSlots);
						// If we only have 1 slot, add an empty slot to show both inputs
						if (finalSlots.length === 1) {
							finalSlots.push({
								fromHour: "",
								fromMin: "",
								toHour: "",
								toMin: "",
								patients: "",
							});
						}
					}

					console.log("Final slots to set:", finalSlots);
					setSlots(finalSlots);
				} else {
					console.log("No slots parsed, creating default empty slots");
					// If no slots parsed, create default empty slots
					if (appointmentType === "sequence") {
						// Check if there are patient count fields in the API response
						const patientCount = prefill.noOfPatients || 1;
						setSlots([
							{
								fromHour: "",
								fromMin: "",
								toHour: "",
								toMin: "",
								patients: patientCount.toString(),
							},
							{
								fromHour: "",
								fromMin: "",
								toHour: "",
								toMin: "",
								patients: "",
							},
						]);
					} else {
						setSlots([
							{
								fromHour: "",
								fromMin: "",
								toHour: "",
								toMin: "",
								patients: "1",
							},
							{
								fromHour: "",
								fromMin: "",
								toHour: "",
								toMin: "",
								patients: "",
							},
						]);
					}
				}
			} else {
				// Even if no days are available, in edit mode we should still show the form
				// with the existing data so user can modify it
				if (slotId && prefill) {
					setShowCreateNew(true);
					// For sequence appointments, use patient count from API
					if (appointmentType === "sequence") {
						const patientCount = prefill.noOfPatients || 1;
						setSlots([
							{
								fromHour: "",
								fromMin: "",
								toHour: "",
								toMin: "",
								patients: patientCount.toString(),
							},
						]);
					} else {
						setSlots([
							{
								fromHour: "",
								fromMin: "",
								toHour: "",
								toMin: "",
								patients: "1",
							},
						]);
					}
				}
			}
		} else if (!prefill && open) {
			// Reset form when creating new
			setSelectedDays([]);
			setShowCreateNew(false);
			setSlots([
				{ fromHour: "", fromMin: "", toHour: "", toMin: "", patients: "" },
			]);
			setAppointmentType("TIMESLOT");
			setSlotDuration("");
			setSlotErrors([]);

			// Reset editable dates
			setEditableStartDate(startDate);
			setEditableEndDate(endDate);
			setIsEditingDates(false);
		}
	}, [prefill, open, startDate, endDate]);

	// Clear invalid selections when date range changes
	useEffect(() => {
		const currentStartDate = isEditingDates ? editableStartDate : startDate;
		const currentEndDate = isEditingDates ? editableEndDate : endDate;

		if (currentStartDate && currentEndDate) {
			const validDays = selectedDays.filter((day) =>
				isDayInRange(day, currentStartDate, currentEndDate)
			);
			if (validDays.length !== selectedDays.length) {
				setSelectedDays(validDays);
				if (validDays.length === 0) {
					setShowCreateNew(false);
				}
			}
		}
	}, [
		startDate,
		endDate,
		editableStartDate,
		editableEndDate,
		isEditingDates,
		selectedDays,
	]);

	// Update editable dates when props change (e.g., switching between different records)
	useEffect(() => {
		if (!isEditingDates) {
			setEditableStartDate(startDate);
			setEditableEndDate(endDate);
		}
	}, [startDate, endDate, isEditingDates]);

	const handleDayToggle = (
		event: React.MouseEvent<HTMLElement>,
		newSelectedDays: string[]
	) => {
		// Always use editable dates for day selection logic
		const currentStartDate = editableStartDate;
		const currentEndDate = editableEndDate;

		// Filter out any disabled days that might have been selected
		const validSelectedDays = newSelectedDays.filter((day) =>
			isDayInRange(day, currentStartDate, currentEndDate)
		);

		// Check if any disabled days were attempted to be selected
		const attemptedDisabledDays = newSelectedDays.filter(
			(day) => !isDayInRange(day, currentStartDate, currentEndDate)
		);
		if (attemptedDisabledDays.length > 0) {
			setSnackbar({
				open: true,
				message: `Days ${attemptedDisabledDays.join(
					", "
				)} are not available in your selected date range.`,
				severity: "warning",
			});
		}

		setSelectedDays(validSelectedDays);

		// If days are selected, show the create new section
		if (validSelectedDays.length > 0) {
			setShowCreateNew(true);
			setSlots([
				{ fromHour: "", fromMin: "", toHour: "", toMin: "", patients: "" },
			]);
			setAppointmentType("TIMESLOT");
			setSlotDuration("");
			setSlotErrors([]);
		} else {
			setShowCreateNew(false);
		}
	};

	const handleAddSlot = () => {
		if (slots.length < 2) {
			setSlots([
				...slots,
				{ fromHour: "", fromMin: "", toHour: "", toMin: "", patients: "" },
			]);
			setSlotErrors([]);
		}
	};
	const handleDeleteSlot = (idx: number) => {
		setSlots(slots.filter((_, i) => i !== idx));
		setSlotErrors([]);
	};
	const handleSlotChange = (idx: number, field: keyof Slot, value: string) => {
		setSlots(
			slots.map((slot, i) => (i === idx ? { ...slot, [field]: value } : slot))
		);
		if (slotErrors.length) {
			setSlotErrors([]);
		}
	};

	const handleConfirmClick = async () => {
		// Validate that days are selected
		if (selectedDays.length === 0) {
			setSnackbar({
				open: true,
				message: "Please select at least one day",
				severity: "error",
			});
			return;
		}

		// Validate that all selected days are within the date range
		const currentStartDate = editableStartDate;
		const currentEndDate = editableEndDate;

		const invalidDays = selectedDays.filter(
			(day) => !isDayInRange(day, currentStartDate, currentEndDate)
		);
		if (invalidDays.length > 0) {
			setSnackbar({
				open: true,
				message: `Selected days ${invalidDays.join(
					", "
				)} are not within your date range. Please adjust your selection.`,
				severity: "error",
			});
			return;
		}

		// New validation logic: At least one complete slot is mandatory
		let hasCompleteSlot = false;
		const errors = slots.map((slot, idx) => {
			const { fromHour, fromMin, toHour, toMin } = slot;

			// Check if this slot is complete
			if (fromHour && fromMin && toHour && toMin) {
				hasCompleteSlot = true;
			}

			// Check if this slot has any partial data (some fields filled but not all)
			const hasPartialData = !!(fromHour || fromMin || toHour || toMin);
			const isEmpty = !fromHour && !fromMin && !toHour && !toMin;

			if (
				!isEmpty &&
				hasPartialData &&
				!(fromHour && fromMin && toHour && toMin)
			) {
				return "All time fields must be filled for this slot.";
			}

			if (fromHour && fromMin && toHour && toMin) {
				const fromTotalMinutes =
					parseInt(fromHour, 10) * 60 + parseInt(fromMin, 10);
				const toTotalMinutes = parseInt(toHour, 10) * 60 + parseInt(toMin, 10);
				if (fromTotalMinutes >= toTotalMinutes) {
					return "'To Time' must be after 'From Time'.";
				}
			}

			return "";
		});

		// Check if we have at least one complete slot
		if (!hasCompleteSlot) {
			setSnackbar({
				open: true,
				message:
					"At least one complete slot is required. Please fill in all time fields for at least one slot.",
				severity: "error",
			});
			return;
		}

		setSlotErrors(errors);
		const hasErrors = errors.some((error) => !!error);

		// Check for overlapping time slots (only for complete slots)
		if (slots.length > 1) {
			for (let i = 0; i < slots.length; i++) {
				for (let j = i + 1; j < slots.length; j++) {
					const slot1 = slots[i];
					const slot2 = slots[j];

					// Only check overlap if both slots are complete
					const slot1Complete =
						slot1.fromHour && slot1.fromMin && slot1.toHour && slot1.toMin;
					const slot2Complete =
						slot2.fromHour && slot2.fromMin && slot2.toHour && slot2.toMin;

					if (slot1Complete && slot2Complete) {
						const slot1Start =
							parseInt(slot1.fromHour, 10) * 60 + parseInt(slot1.fromMin, 10);
						const slot1End =
							parseInt(slot1.toHour, 10) * 60 + parseInt(slot1.toMin, 10);
						const slot2Start =
							parseInt(slot2.fromHour, 10) * 60 + parseInt(slot2.fromMin, 10);
						const slot2End =
							parseInt(slot2.toHour, 10) * 60 + parseInt(slot2.toMin, 10);

						if (slot1Start < slot2End && slot1End > slot2Start) {
							setSnackbar({
								open: true,
								message: `Time slots ${i + 1} and ${
									j + 1
								} overlap. Please adjust the times.`,
								severity: "error",
							});
							return;
						}
					}
				}
			}
		}

		// Additional validation for appointment type
		if (appointmentType === "TIMESLOT" && !slotDuration) {
			setSnackbar({
				open: true,
				message: "Please select slot duration for timeslot appointments",
				severity: "error",
			});
			return;
		}

		if (appointmentType === "SEQUENCE") {
			const hasPatientCounts = slots.every(
				(slot) => slot.patients && slot.patients.trim() !== ""
			);
			if (!hasPatientCounts) {
				setSnackbar({
					open: true,
					message: "Please enter number of patients for all slots",
					severity: "error",
				});
				return;
			}
		}

		if (!hasErrors) {
			// Check if this is an edit operation (has slotId and prefill data)
			const isEditingMode =
				slotId && prefill && Object.keys(prefill).length > 0;

			if (isEditingMode) {
				// First check day availability before saving (edit mode)
				const daysAvailable = await checkDayAvailabilityAPI(
					editableStartDate,
					editableEndDate
				);

				if (daysAvailable) {
					// For editing, always use the editable dates (which may have been changed by the user)
					const success = await callEditSlotAPI({
						selectedDays,
						slots,
						appointmentType,
						slotDuration,
						startDate: editableStartDate,
						endDate: editableEndDate,
					});

					if (success) {
						// Call the refresh callback to update the calendar list
						if (onEditSuccess) {
							onEditSuccess();
						}
						// Close the dialog or show success message
						onCancel();
					}
				}
			} else {
				// This is a create operation - check day availability before creating
				const daysAvailable = await checkDayAvailabilityAPI(
					currentStartDate,
					currentEndDate
				);

				if (daysAvailable) {
					// Call the original onConfirm to create new slot
					onConfirm(
						selectedDays,
						slots,
						appointmentType,
						slotDuration,
						facility,
						currentStartDate,
						currentEndDate
					);
				}
			}
		}
	};

	const renderSlotCreator = () => (
		<Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
			{slots.map((slot, idx) => (
				<Paper
					key={idx}
					variant='outlined'
					sx={{
						p: 2,
						position: "relative",
						borderRadius: "12px",
						borderColor: slotErrors[idx] ? "error.main" : "divider",
					}}>
					<Typography
						variant='subtitle2'
						sx={{ fontWeight: 600, color: "#34495e", mb: 2 }}>
						Slot {idx + 1}
					</Typography>
					{slots.length > 1 && (
						<IconButton
							size='small'
							onClick={() => handleDeleteSlot(idx)}
							sx={{ position: "absolute", top: 8, right: 8, color: "d32f2f" }}>
							<DeleteIcon fontSize='small' />
						</IconButton>
					)}
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
							gap: 3,
						}}>
						<Box>
							<Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
								From Time
							</Typography>
							<Box sx={{ display: "flex", gap: 1 }}>
								<FormControl fullWidth size='small'>
									<InputLabel>HH</InputLabel>
									<Select
										value={slot.fromHour}
										label='HH'
										onChange={(e) =>
											handleSlotChange(idx, "fromHour", e.target.value)
										}>
										{(idx === 0 ? morningHours : afternoonHours).map((hour) => (
											<MenuItem key={hour} value={hour}>
												{hour}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<FormControl fullWidth size='small'>
									<InputLabel>MM</InputLabel>
									<Select
										value={slot.fromMin}
										label='MM'
										onChange={(e) =>
											handleSlotChange(idx, "fromMin", e.target.value)
										}>
										{allMinutes.map((min) => (
											<MenuItem key={min} value={min}>
												{min}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
						</Box>
						<Box>
							<Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
								To Time
							</Typography>
							<Box sx={{ display: "flex", gap: 1 }}>
								<FormControl fullWidth size='small'>
									<InputLabel>HH</InputLabel>
									<Select
										value={slot.toHour}
										label='HH'
										onChange={(e) =>
											handleSlotChange(idx, "toHour", e.target.value)
										}>
										{(idx === 0 ? morningHours : afternoonHours).map((hour) => (
											<MenuItem key={hour} value={hour}>
												{hour}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<FormControl fullWidth size='small'>
									<InputLabel>MM</InputLabel>
									<Select
										value={slot.toMin}
										label='MM'
										onChange={(e) =>
											handleSlotChange(idx, "toMin", e.target.value)
										}>
										{allMinutes.map((min) => (
											<MenuItem key={min} value={min}>
												{min}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
						</Box>
					</Box>
					{slotErrors[idx] && (
						<Typography
							color='error'
							variant='caption'
							sx={{ mt: 2, display: "block" }}>
							{slotErrors[idx]}
						</Typography>
					)}
				</Paper>
			))}
			<Button
				variant='outlined'
				startIcon={<AddIcon />}
				onClick={handleAddSlot}
				sx={{ alignSelf: "flex-start" }}
				disabled={slots.length >= 2}>
				Add Slot
			</Button>
			<Divider sx={{ my: 1 }} />
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<Typography
					variant='subtitle1'
					sx={{ fontWeight: 600, color: "#34495e" }}>
					Appointment Settings
				</Typography>
				<FormControl>
					<Typography variant='body2' sx={{ fontWeight: 500, mb: 1 }}>
						Book Appointment By:
					</Typography>
					<RadioGroup
						row
						value={appointmentType}
						onChange={(e) => setAppointmentType(e.target.value)}>
						<FormControlLabel
							value='TIMESLOT'
							control={<Radio />}
							label='Timeslot'
						/>
						<FormControlLabel
							value='SEQUENCE'
							control={<Radio />}
							label='Sequence'
						/>
					</RadioGroup>
				</FormControl>
				{appointmentType === "TIMESLOT" ? (
					<FormControl fullWidth>
						<InputLabel>Slot Duration (Mins)</InputLabel>
						<Select
							value={slotDuration}
							label='Slot Duration (Mins)'
							onChange={(e: SelectChangeEvent) =>
								setSlotDuration(e.target.value)
							}>
							{slotDurations.map((d) => (
								<MenuItem key={d} value={d}>
									{d}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				) : (
					slots.map((slot, idx) => (
						<TextField
							key={idx}
							label={`Number of Patients (Slot ${idx + 1})`}
							value={slot.patients}
							onChange={(e) =>
								handleSlotChange(idx, "patients", e.target.value)
							}
							type='number'
							fullWidth
						/>
					))
				)}
			</Box>
		</Box>
	);

	return (
		<Dialog open={open} onClose={onCancel} maxWidth='sm' fullWidth>
			<DialogTitle
				sx={{ position: "relative", p: 2, borderBottom: "1px solid #e0e0e0" }}>
				<IconButton
					onClick={onBack}
					sx={{
						position: "absolute",
						left: 8,
						top: "50%",
						transform: "translateY(-50%)",
					}}>
					<ArrowBackIcon />
				</IconButton>
				<Typography
					variant='h6'
					component='div'
					sx={{ textAlign: "center", fontWeight: 600, color: "#174a7c" }}>
					{slotId && prefill
						? "Edit Weekly Calendar"
						: "Create Your Weekly Calendar"}
				</Typography>
			</DialogTitle>
			<DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
				<Paper
					elevation={0}
					sx={{ p: 2, bgcolor: "#f7f9fc", borderRadius: "12px", mb: 3 }}>
					<Typography
						variant='subtitle1'
						sx={{ fontWeight: 600, color: "#174a7c", textAlign: "center" }}>
						{facility?.facilityName}
					</Typography>
					<Typography
						variant='body2'
						sx={{ color: "#555", textAlign: "center" }}>
						{facility?.contactPersonName}
					</Typography>
					<Divider sx={{ my: 1.5 }} />

					{/* Date Range Section */}
					<Box sx={{ textAlign: "center" }}>
						{prefill && isEditingDates ? (
							// Editable date range for editing mode
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										gap: 2,
										flexWrap: "nowrap",
									}}>
									<DatePicker
										label='Start Date'
										value={parseDateString(editableStartDate || startDate)}
										onChange={(newValue) => {
											if (newValue) {
												const formattedDate = newValue.format("DD/MM/YYYY"); // Use dayjs format
												handleDateChange(true, formattedDate);
											}
										}}
										slotProps={{
											textField: {
												size: "small",
												sx: { minWidth: 140 },
											},
										}}
									/>
									<Typography sx={{ color: "#7f8c8d" }}>to</Typography>
									<DatePicker
										label='End Date'
										value={parseDateString(editableEndDate || endDate)}
										onChange={(newValue) => {
											if (newValue) {
												const formattedDate = newValue.format("DD/MM/YYYY"); // Use dayjs format
												handleDateChange(false, formattedDate);
											}
										}}
										slotProps={{
											textField: {
												size: "small",
												sx: { minWidth: 140 },
											},
										}}
									/>
								</Box>
								<Box
									sx={{
										mt: 2,
										display: "flex",
										justifyContent: "center",
										gap: 1,
									}}>
									<Button
										size='small'
										variant='outlined'
										onClick={() => {
											setIsEditingDates(false);
											// Reset to original API dates
											setEditableStartDate(startDate);
											setEditableEndDate(endDate);
										}}
										sx={{ fontSize: "0.75rem" }}>
										Cancel
									</Button>
									<Button
										size='small'
										variant='contained'
										onClick={() => {
											// Save the edited dates and update the component state
											setIsEditingDates(false);

											console.log("Saving edited dates:", {
												editableStartDate,
												editableEndDate,
											});

											// Clear any selected days that are no longer valid in the new date range
											const validDays = selectedDays.filter((day) =>
												isDayInRange(day, editableStartDate, editableEndDate)
											);
											if (validDays.length !== selectedDays.length) {
												setSelectedDays(validDays);
												if (validDays.length === 0) {
													setShowCreateNew(false);
												}
											}
										}}
										sx={{ fontSize: "0.75rem" }}>
										Save Dates
									</Button>
								</Box>
							</LocalizationProvider>
						) : (
							// Display date range with edit button for editing mode
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									gap: 2,
								}}>
								<Typography variant='body2' sx={{ fontWeight: 500 }}>
									{isEditingDates ? editableStartDate : startDate}
								</Typography>
								<Typography sx={{ color: "#7f8c8d" }}>to</Typography>
								<Typography variant='body2' sx={{ fontWeight: 500 }}>
									{isEditingDates ? editableEndDate : endDate}
								</Typography>
								{prefill && (
									<IconButton
										size='small'
										onClick={() => setIsEditingDates(true)}
										sx={{ ml: 1, color: "#174a7c" }}>
										<EditIcon />
									</IconButton>
								)}
							</Box>
						)}
					</Box>
				</Paper>

				<Typography
					variant='subtitle1'
					sx={{ fontWeight: 600, mb: 1.5, color: "#34495e" }}>
					Select Days
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
					<ToggleButtonGroup
						value={selectedDays}
						onChange={handleDayToggle}
						aria-label='days of the week'>
						{daysOfWeek.map((day) => {
							const isDisabled = !isDayInRange(
								day,
								editableStartDate,
								editableEndDate
							);
							const tooltipText = isDisabled
								? `This day (${day}) does not fall within your selected date range (${editableStartDate} to ${editableEndDate})`
								: `Select ${day}`;

							return (
								<Tooltip key={day} title={tooltipText} arrow>
									<span>
										<ToggleButton
											value={day}
											aria-label={day}
											disabled={isDisabled}
											sx={{
												textTransform: "none",
												opacity: isDisabled ? 0.5 : 1,
												minWidth: 60,
												height: 40,
												fontSize: "0.875rem",
												fontWeight: 500,
												border: "1px solid #e0e0e0",
												transition: "all 0.2s ease-in-out",
												"&.Mui-selected": {
													bgcolor: "#e3f2fd", // Light blue background
													color: "#1976d2", // Darker blue text
													border: "2px solid #2196f3", // Blue border
													fontWeight: 600,
													transform: "scale(1.05)",
													boxShadow: "0 2px 8px rgba(33, 150, 243, 0.3)",
													"&:hover": {
														bgcolor: "#bbdefb", // Slightly darker on hover
														transform: "scale(1.05)",
													},
												},
												"&:hover": {
													bgcolor: "#f5f5f5",
													transform: "scale(1.02)",
												},
												"&.Mui-disabled": {
													opacity: 0.5,
													color: "#999",
													backgroundColor: "#f5f5f5",
												},
											}}>
											{day}
										</ToggleButton>
									</span>
								</Tooltip>
							);
						})}
					</ToggleButtonGroup>
				</Box>

				{/* Show available days information */}
				{startDate && endDate && (
					<Box sx={{ textAlign: "center", mt: 2 }}>
						<Typography variant='body2' sx={{ color: "#7f8c8d", mb: 1 }}>
							Date Range: {editableStartDate} to {editableEndDate}
						</Typography>
						{(() => {
							const availableDays = daysOfWeek.filter((day) =>
								isDayInRange(day, editableStartDate, editableEndDate)
							);
							const disabledDays = daysOfWeek.filter(
								(day) => !isDayInRange(day, editableStartDate, editableEndDate)
							);

							if (availableDays.length === 0) {
								return (
									<Typography
										variant='caption'
										sx={{
											color: "#d32f2f",
											display: "block",
											fontWeight: 500,
										}}>
										⚠️ No days available in this date range. Please select a
										different date range.
									</Typography>
								);
							}

							return (
								<Typography
									variant='caption'
									sx={{ color: "#666", display: "block" }}>
									Available days: {availableDays.join(", ")}
									{disabledDays.length > 0 && (
										<span style={{ color: "#999" }}>
											{" "}
											• Disabled: {disabledDays.join(", ")}
										</span>
									)}
								</Typography>
							);
						})()}
					</Box>
				)}

				{selectedDays.length > 0 && (
					<Typography
						variant='body2'
						sx={{ textAlign: "center", color: "#7f8c8d", mt: 1 }}>
						Selected: {selectedDays.join(", ")} ({selectedDays.length} day
						{selectedDays.length !== 1 ? "s" : ""})
					</Typography>
				)}

				{selectedDays.length > 0 && !showCreateNew && (
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 2,
							my: 4,
						}}>
						<Button
							variant='contained'
							onClick={() => {
								setShowCreateNew(true);
								setSlotErrors([]);
							}}
							sx={{
								minWidth: 220,
								bgcolor: "#174a7c",
								"&:hover": { bgcolor: "#103a61" },
							}}>
							{slotId && prefill ? "Edit Schedule" : "Create New Schedule"}
						</Button>
						<Typography sx={{ color: "#7f8c8d" }}>or</Typography>
						<Button
							variant='outlined'
							onClick={() => {
								// TODO: Implement copy from other days functionality
								setSnackbar({
									open: true,
									message: "Copy from other days feature coming soon",
									severity: "info",
								});
							}}
							sx={{
								minWidth: 220,
								color: "#174a7c",
								borderColor: "#174a7c",
								"&:hover": {
									borderColor: "#103a61",
									bgcolor: "rgba(23, 74, 124, 0.04)",
								},
							}}>
							{slotId && prefill
								? "Copy from Other Days"
								: "Copy from Other Days"}
						</Button>
					</Box>
				)}

				{(selectedDays.length > 0 || (slotId && prefill)) &&
					showCreateNew &&
					renderSlotCreator()}
			</DialogContent>
			<DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
				<Button onClick={onCancel} sx={{ color: "#d32f2f" }}>
					Cancel
				</Button>
				<Button
					variant='contained'
					onClick={handleConfirmClick}
					disabled={isSubmitting}
					sx={{
						bgcolor: "#174a7c",
						"&:hover": { bgcolor: "#103a61" },
					}}>
					{isSubmitting
						? "Updating..."
						: slotId && prefill
						? "Update Slot"
						: "Confirm"}
				</Button>
			</DialogActions>
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Dialog>
	);
};

export default ConfirmWeeklyCalendar;
