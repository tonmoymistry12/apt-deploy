import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Box,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
	Divider,
	Paper,
	IconButton,
	Checkbox,
	FormControlLabel,
	Grid,
	Snackbar,
	Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import dayjs, { Dayjs } from "dayjs";
import { FaclityServiceResponse } from "@/interfaces/facilityInterface";
import {
	temporaryAdjustCalendar,
	getSlotDates,
	getSelectedDaySlots,
} from "@/services/manageCalendar";

interface TempAdjustmentProps {
	open: boolean;
	onClose: () => void;
	calendarData: any;
	selectedDoctor?: any;
	facility: FaclityServiceResponse | null;
	onSuccess?: () => void; // Callback to refresh calendar list after successful adjustment
}

interface TimeSlot {
	fromHour: string;
	fromMin: string;
	toHour: string;
	toMin: string;
	notAvailable: boolean;
}

const TempAdjustment: React.FC<TempAdjustmentProps> = ({
	open,
	onClose,
	calendarData,
	selectedDoctor,
	facility,
	onSuccess,
}) => {
	const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
	const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
		{
			fromHour: "00",
			fromMin: "00",
			toHour: "00",
			toMin: "00",
			notAvailable: false,
		},
	]);
	const [slotDuration, setSlotDuration] = useState("10");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error" | "warning" | "info",
	});
	const [slotDates, setSlotDates] = useState<{
		available: string[];
		notavailable: string[];
		fullavailable: string[];
	}>({
		available: [],
		notavailable: [],
		fullavailable: [],
	});
	const [isLoadingSlotDates, setIsLoadingSlotDates] = useState(false);
	const [isLoadingDaySlots, setIsLoadingDaySlots] = useState(false);

	const slotDurations = ["10", "15", "20", "30", "45", "60"];

	// Hour ranges for different slots (matching ConfirmWeeklyCalendar)
	const morningHours = Array.from({ length: 13 }, (_, i) =>
		i.toString().padStart(2, "0"),
	); // 00-12
	const afternoonHours = Array.from({ length: 11 }, (_, i) =>
		(i + 13).toString().padStart(2, "0"),
	); // 13-23
	const allMinutes = Array.from({ length: 60 }, (_, i) =>
		i.toString().padStart(2, "0"),
	);

	useEffect(() => {
		if (open && facility?.facilityId) {
			fetchSlotDates();
		}
	}, [open, facility?.facilityId]);

	// Reset and prefill time slots when modal opens - THIS MUST RUN EVERY TIME
	useEffect(() => {
		if (!open) {
			// Reset when closing
			setTimeSlots([
				{
					fromHour: "00",
					fromMin: "00",
					toHour: "00",
					toMin: "00",
					notAvailable: false,
				},
			]);
			return;
		}

		if (open && calendarData) {
			console.log("=== MODAL OPENED - PREFILL STARTING ===");
			console.log("Calendar data received:", calendarData);

			// First, check if ANY day has slot 2 time (13:00-23:00 range)
			const hasAnySlot2Time = [
				calendarData.sundayStartTime1,
				calendarData.mondayStartTime1,
				calendarData.tuesdayStartTime1,
				calendarData.wednesdayStartTime1,
				calendarData.thursdayStartTime1,
				calendarData.fridayStartTime1,
				calendarData.saturdayStartTime1,
				calendarData.sundayStartTime2,
				calendarData.mondayStartTime2,
				calendarData.tuesdayStartTime2,
				calendarData.wednesdayStartTime2,
				calendarData.thursdayStartTime2,
				calendarData.fridayStartTime2,
				calendarData.saturdayStartTime2,
			].some((time) => {
				if (!time || time === "00:00") return false;
				const hour = parseInt(time.split(":")[0]);
				return hour >= 13;
			});

			console.log("Has any slot 2 time (>= 13:00)?", hasAnySlot2Time);

			// Parse time slots from calendarData
			const allSlots: TimeSlot[] = [];

			// Helper function to determine if a time belongs to slot 2 (afternoon/evening slots 13-23)
			const isSlot2Time = (timeStr: string | null): boolean => {
				if (!timeStr || timeStr === "00:00") return false;
				const [hour] = timeStr.split(":").map(Number);
				return hour >= 13; // 13:00 to 23:59 is slot 2 range
			};

			// Helper function to parse time string (HH:MM format)
			const parseTimeSlot = (
				startTime: string | null,
				stopTime: string | null,
			): TimeSlot | null => {
				if (
					!startTime ||
					!stopTime ||
					(startTime === "00:00" && stopTime === "00:00")
				) {
					return null;
				}

				const [startHour, startMin] = startTime.split(":");
				const [stopHour, stopMin] = stopTime.split(":");

				return {
					fromHour: startHour.padStart(2, "0"),
					fromMin: startMin.padStart(2, "0"),
					toHour: stopHour.padStart(2, "0"),
					toMin: stopMin.padStart(2, "0"),
					notAvailable: false,
				};
			};

			// Check all possible time slots from the calendar data
			// We'll look for any day's time slots as a reference
			const dayFields = [
				{
					start1: "mondayStartTime1",
					stop1: "mondayStopTime1",
					start2: "mondayStartTime2",
					stop2: "mondayStopTime2",
				},
				{
					start1: "tuesdayStartTime1",
					stop1: "tuesdayStopTime1",
					start2: "tuesdayStartTime2",
					stop2: "tuesdayStopTime2",
				},
				{
					start1: "wednesdayStartTime1",
					stop1: "wednesdayStopTime1",
					start2: "wednesdayStartTime2",
					stop2: "wednesdayStopTime2",
				},
				{
					start1: "thursdayStartTime1",
					stop1: "thursdayStopTime1",
					start2: "thursdayStartTime2",
					stop2: "thursdayStopTime2",
				},
				{
					start1: "fridayStartTime1",
					stop1: "fridayStopTime1",
					start2: "fridayStartTime2",
					stop2: "fridayStopTime2",
				},
				{
					start1: "saturdayStartTime1",
					stop1: "saturdayStopTime1",
					start2: "saturdayStartTime2",
					stop2: "saturdayStopTime2",
				},
				{
					start1: "sundayStartTime1",
					stop1: "sundayStopTime1",
					start2: "sundayStartTime2",
					stop2: "sundayStopTime2",
				},
			];

			// Find the first day that has time slots defined
			for (const dayField of dayFields) {
				const startTime1 = calendarData[dayField.start1];
				const stopTime1 = calendarData[dayField.stop1];
				const startTime2 = calendarData[dayField.start2];
				const stopTime2 = calendarData[dayField.stop2];

				console.log(`Checking ${dayField.start1}:`, startTime1, "-", stopTime1);
				console.log(`Checking ${dayField.start2}:`, startTime2, "-", stopTime2);

				// Check if startTime1 is in slot 2 range (13-23)
				if (startTime1 && stopTime1 && isSlot2Time(startTime1)) {
					console.log(`${dayField.start1} is slot 2 time (>=13):`, startTime1);
					const slot = parseTimeSlot(startTime1, stopTime1);
					if (slot) {
						console.log("Parsed slot 2 from startTime1:", slot);
						allSlots.push(slot);
					}
				}

				// Check if startTime1 is in slot 1 range (00-12)
				if (
					startTime1 &&
					stopTime1 &&
					!isSlot2Time(startTime1) &&
					!(startTime1 === "00:00" && stopTime1 === "00:00")
				) {
					console.log(`${dayField.start1} is slot 1 time (<13):`, startTime1);
					const slot = parseTimeSlot(startTime1, stopTime1);
					if (slot) {
						console.log("Parsed slot 1 from startTime1:", slot);
						allSlots.push(slot);
					}
				}

				// Check if startTime2 is in slot 2 range (13-23)
				if (startTime2 && stopTime2 && isSlot2Time(startTime2)) {
					console.log(`${dayField.start2} is slot 2 time (>=13):`, startTime2);
					const slot = parseTimeSlot(startTime2, stopTime2);
					if (slot) {
						console.log("Parsed slot 2 from startTime2:", slot);
						// Only add if this slot doesn't already exist (avoid duplicates)
						const exists = allSlots.some(
							(s) =>
								s.fromHour === slot.fromHour &&
								s.fromMin === slot.fromMin &&
								s.toHour === slot.toHour &&
								s.toMin === slot.toMin,
						);
						if (!exists) allSlots.push(slot);
					}
				}

				// Check if startTime2 is in slot 1 range (00-12)
				if (
					startTime2 &&
					stopTime2 &&
					!isSlot2Time(startTime2) &&
					!(startTime2 === "00:00" && stopTime2 === "00:00")
				) {
					console.log(`${dayField.start2} is slot 1 time (<13):`, startTime2);
					const slot = parseTimeSlot(startTime2, stopTime2);
					if (slot) {
						console.log("Parsed slot 1 from startTime2:", slot);
						// Only add if this slot doesn't already exist (avoid duplicates)
						const exists = allSlots.some(
							(s) =>
								s.fromHour === slot.fromHour &&
								s.fromMin === slot.fromMin &&
								s.toHour === slot.toHour &&
								s.toMin === slot.toMin,
						);
						if (!exists) allSlots.push(slot);
					}
				}

				// If we found slots, break (we only need one day's slots as a template)
				if (allSlots.length > 0) {
					console.log("Found slots, breaking. Total slots:", allSlots.length);
					break;
				}
			}

			// Sort slots by start time
			allSlots.sort((a, b) => {
				const aStart = parseInt(a.fromHour) * 60 + parseInt(a.fromMin);
				const bStart = parseInt(b.fromHour) * 60 + parseInt(b.fromMin);
				return aStart - bStart;
			});

			// Build final slots array - SIMPLE LOGIC
			const finalSlots: TimeSlot[] = [];

			// If calendar has ANY slot 2 time (>= 13:00), ALWAYS show 2 slots
			if (hasAnySlot2Time) {
				console.log("Slot 2 time detected - will show 2 slots");

				// Find slot 1 data (00-12 range) from parsed slots
				const slot1Data = allSlots.find((slot) => parseInt(slot.fromHour) < 13);
				// Find slot 2 data (13-23 range) from parsed slots
				const slot2Data = allSlots.find(
					(slot) => parseInt(slot.fromHour) >= 13,
				);

				console.log("Slot 1 data:", slot1Data);
				console.log("Slot 2 data:", slot2Data);

				// ALWAYS add slot 1 (with data or default 00:00)
				finalSlots.push(
					slot1Data || {
						fromHour: "00",
						fromMin: "00",
						toHour: "00",
						toMin: "00",
						notAvailable: false,
					},
				);

				// ALWAYS add slot 2 (with data or default 13:00)
				finalSlots.push(
					slot2Data || {
						fromHour: "13",
						fromMin: "00",
						toHour: "14",
						toMin: "00",
						notAvailable: false,
					},
				);
			} else {
				// No slot 2 time - just show slot 1 or default
				if (allSlots.length > 0) {
					finalSlots.push(...allSlots);
				} else {
					finalSlots.push({
						fromHour: "00",
						fromMin: "00",
						toHour: "00",
						toMin: "00",
						notAvailable: false,
					});
				}
			}

			console.log("Initial prefill - Final slots to set:", finalSlots);
			console.log("Initial prefill - Final slots count:", finalSlots.length);

			// Always set the time slots (remove the condition)
			setTimeSlots(finalSlots);

			// Verify state was set
			console.log(
				"State set. Slots should now be:",
				finalSlots.length,
				"slots",
			);

			// Force re-render by logging after state update
			setTimeout(() => {
				console.log(
					"After state update - timeSlots.length should be:",
					finalSlots.length,
				);
			}, 100);

			// Prefill slot duration if available
			if (calendarData.slotDuration || calendarData.slotDurationMinutes) {
				const duration = (
					calendarData.slotDuration || calendarData.slotDurationMinutes
				).toString();
				setSlotDuration(duration);
			}
		}
	}, [open, calendarData]);

	const fetchSlotDates = async () => {
		if (!facility?.facilityId) return;

		setIsLoadingSlotDates(true);
		try {
			const response = await getSlotDates(
				{
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					deviceStat: "M",
					facilityId: facility.facilityId,
				},
				selectedDoctor,
			);

			if (response.status === "ok") {
				const available = response.available
					? response.available.split(",").map((date) => date.trim())
					: [];
				const notavailable = response.notavailable
					? response.notavailable.split(",").map((date) => date.trim())
					: [];
				const fullavailable = response.fullavailable
					? response.fullavailable.split(",").map((date) => date.trim())
					: [];

				setSlotDates({
					available,
					notavailable,
					fullavailable,
				});
			}
		} catch (error) {
			console.error("Error fetching slot dates:", error);
			setSnackbar({
				open: true,
				message: "Failed to fetch available dates",
				severity: "error",
			});
		} finally {
			setIsLoadingSlotDates(false);
		}
	};

	const handleAddSlot = () => {
		if (timeSlots.length < 2) {
			// Add slot 2 with afternoon hours (13-23 range)
			setTimeSlots([
				...timeSlots,
				{
					fromHour: "13",
					fromMin: "00",
					toHour: "14",
					toMin: "00",
					notAvailable: false,
				},
			]);
		}
	};

	const handleRemoveSlot = (index: number) => {
		if (timeSlots.length > 1) {
			setTimeSlots(timeSlots.filter((_, i) => i !== index));
		}
	};

	const handleSlotChange = (
		index: number,
		field: keyof TimeSlot,
		value: string | boolean,
	) => {
		const newSlots = [...timeSlots];
		newSlots[index] = { ...newSlots[index], [field]: value };
		setTimeSlots(newSlots);
	};

	const handleDateClick = async (date: Dayjs) => {
		setSelectedDate(date);

		// Fetch the selected day slots for prefilling
		if (facility?.facilityId) {
			setIsLoadingDaySlots(true);
			try {
				const formattedDate = date.format("DD/MM/YYYY");
				const response = await getSelectedDaySlots(
					{
						userName: localStorage.getItem("userName") || "",
						userPass: localStorage.getItem("userPwd") || "",
						deviceStat: "M",
						startDate: formattedDate,
						orgId: localStorage.getItem("orgId") || "2",
						facilityId: facility.facilityId,
					},
					selectedDoctor,
				);

				console.log("Selected day slots response:", response);

				// Determine which day of the week the selected date is
				const dayOfWeek = date.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
				const dayNames = [
					"sunday",
					"monday",
					"tuesday",
					"wednesday",
					"thursday",
					"friday",
					"saturday",
				];
				const dayName = dayNames[dayOfWeek];

				// Get the time fields for this day
				const startTime1Field = `${dayName}StartTime1` as keyof typeof response;
				const stopTime1Field = `${dayName}StopTime1` as keyof typeof response;
				const startTime2Field = `${dayName}StartTime2` as keyof typeof response;
				const stopTime2Field = `${dayName}StopTime2` as keyof typeof response;

				const startTime1 = response[startTime1Field] as string | null;
				const stopTime1 = response[stopTime1Field] as string | null;
				const startTime2 = response[startTime2Field] as string | null;
				const stopTime2 = response[stopTime2Field] as string | null;

				console.log(
					`Day: ${dayName}, Slot1: ${startTime1}-${stopTime1}, Slot2: ${startTime2}-${stopTime2}`,
				);

				// Helper function to determine if a time belongs to slot 2 (afternoon/evening slots 13-23)
				const isSlot2Time = (timeStr: string | null): boolean => {
					if (!timeStr || timeStr === "00:00") return false;
					const [hour] = timeStr.split(":").map(Number);
					return hour >= 13; // 13:00 to 23:59 is slot 2 range
				};

				// Helper function to parse time slot
				const parseTimeSlot = (
					start: string | null,
					stop: string | null,
				): TimeSlot | null => {
					if (!start || !stop || (start === "00:00" && stop === "00:00")) {
						return null;
					}

					const [startHour, startMin] = start.split(":");
					const [stopHour, stopMin] = stop.split(":");

					return {
						fromHour: startHour.padStart(2, "0"),
						fromMin: startMin.padStart(2, "0"),
						toHour: stopHour.padStart(2, "0"),
						toMin: stopMin.padStart(2, "0"),
						notAvailable: false,
					};
				};

				// Parse and set time slots based on time ranges
				const allSlots: TimeSlot[] = [];

				console.log("=== SLOT PARSING DEBUG ===");
				console.log(`StartTime1: ${startTime1}, StopTime1: ${stopTime1}`);
				console.log(`Is StartTime1 slot2? ${isSlot2Time(startTime1)}`);
				console.log(`StartTime2: ${startTime2}, StopTime2: ${stopTime2}`);
				console.log(`Is StartTime2 slot2? ${isSlot2Time(startTime2)}`);

				// Check if startTime1 is in slot 2 range (13-23)
				if (startTime1 && stopTime1 && isSlot2Time(startTime1)) {
					console.log(
						`Adding slot2 data from startTime1: ${startTime1} - ${stopTime1}`,
					);
					const slot = parseTimeSlot(startTime1, stopTime1);
					if (slot) allSlots.push(slot);
				}

				// Check if startTime1 is in slot 1 range (00-12)
				if (
					startTime1 &&
					stopTime1 &&
					!isSlot2Time(startTime1) &&
					!(startTime1 === "00:00" && stopTime1 === "00:00")
				) {
					console.log(
						`Adding slot1 data from startTime1: ${startTime1} - ${stopTime1}`,
					);
					const slot = parseTimeSlot(startTime1, stopTime1);
					if (slot) allSlots.push(slot);
				}

				// Check if startTime2 is in slot 2 range (13-23)
				if (startTime2 && stopTime2 && isSlot2Time(startTime2)) {
					console.log(
						`Adding slot2 data from startTime2: ${startTime2} - ${stopTime2}`,
					);
					const slot = parseTimeSlot(startTime2, stopTime2);
					if (slot) {
						// Only add if this slot doesn't already exist (avoid duplicates)
						const exists = allSlots.some(
							(s) =>
								s.fromHour === slot.fromHour &&
								s.fromMin === slot.fromMin &&
								s.toHour === slot.toHour &&
								s.toMin === slot.toMin,
						);
						if (!exists) allSlots.push(slot);
					}
				}

				// Check if startTime2 is in slot 1 range (00-12)
				if (
					startTime2 &&
					stopTime2 &&
					!isSlot2Time(startTime2) &&
					!(startTime2 === "00:00" && stopTime2 === "00:00")
				) {
					console.log(
						`Adding slot1 data from startTime2: ${startTime2} - ${stopTime2}`,
					);
					const slot = parseTimeSlot(startTime2, stopTime2);
					if (slot) {
						// Only add if this slot doesn't already exist (avoid duplicates)
						const exists = allSlots.some(
							(s) =>
								s.fromHour === slot.fromHour &&
								s.fromMin === slot.fromMin &&
								s.toHour === slot.toHour &&
								s.toMin === slot.toMin,
						);
						if (!exists) allSlots.push(slot);
					}
				}

				// Sort slots by start time
				allSlots.sort((a, b) => {
					const aStart = parseInt(a.fromHour) * 60 + parseInt(a.fromMin);
					const bStart = parseInt(b.fromHour) * 60 + parseInt(b.fromMin);
					return aStart - bStart;
				});

				console.log("All parsed slots:", allSlots);
				console.log("Number of slots parsed:", allSlots.length);
				console.log("=== END SLOT DEBUG ===");

				// Check if selected date has slot 2 time (>= 13:00)
				const hasSlot2TimeForDate = allSlots.some(
					(slot) => parseInt(slot.fromHour) >= 13,
				);

				console.log(
					"Date selection - Has slot 2 time (>= 13:00)?",
					hasSlot2TimeForDate,
				);

				// Build final slots array - SIMPLE LOGIC
				const finalSlots: TimeSlot[] = [];

				if (hasSlot2TimeForDate) {
					console.log("Slot 2 time detected for this date - will show 2 slots");

					// Find slot 1 data (00-12 range) from parsed slots
					const slot1Data = allSlots.find(
						(slot) => parseInt(slot.fromHour) < 13,
					);
					// Find slot 2 data (13-23 range) from parsed slots
					const slot2Data = allSlots.find(
						(slot) => parseInt(slot.fromHour) >= 13,
					);

					console.log("Date selection - Slot 1 data:", slot1Data);
					console.log("Date selection - Slot 2 data:", slot2Data);

					// ALWAYS add slot 1 (with data or default 00:00)
					finalSlots.push(
						slot1Data || {
							fromHour: "00",
							fromMin: "00",
							toHour: "00",
							toMin: "00",
							notAvailable: false,
						},
					);

					// ALWAYS add slot 2 (with data or default 13:00)
					finalSlots.push(
						slot2Data || {
							fromHour: "13",
							fromMin: "00",
							toHour: "14",
							toMin: "00",
							notAvailable: false,
						},
					);
				} else {
					// No slot 2 time - just show slot 1 or default
					if (allSlots.length > 0) {
						finalSlots.push(...allSlots);
					} else {
						finalSlots.push({
							fromHour: "00",
							fromMin: "00",
							toHour: "00",
							toMin: "00",
							notAvailable: false,
						});
					}
				}

				console.log("Date selection - Final slots to set:", finalSlots);
				console.log("Date selection - Final slots count:", finalSlots.length);
				setTimeSlots(finalSlots);

				// Verify state was set
				console.log(
					"State set. Slots should now be:",
					finalSlots.length,
					"slots",
				);

				// Force re-render by logging after state update
				setTimeout(() => {
					console.log(
						"After date selection - timeSlots.length should be:",
						finalSlots.length,
					);
				}, 100);

				// Prefill slot duration if available
				if (response.slotDuration) {
					setSlotDuration(response.slotDuration);
				}
			} catch (error) {
				console.error("Error fetching selected day slots:", error);
				setSnackbar({
					open: true,
					message: "Failed to fetch slot details for selected date",
					severity: "error",
				});
			} finally {
				setIsLoadingDaySlots(false);
			}
		}
	};

	const handleMonthChange = (direction: "prev" | "next") => {
		if (direction === "prev") {
			setCurrentMonth(currentMonth.subtract(1, "month"));
		} else {
			setCurrentMonth(currentMonth.add(1, "month"));
		}
	};

	const getCalendarDays = () => {
		const startOfMonth = currentMonth.startOf("month");
		const endOfMonth = currentMonth.endOf("month");
		const startOfWeek = startOfMonth.startOf("week");
		const endOfWeek = endOfMonth.endOf("week");

		const days = [];
		let day = startOfWeek;

		while (day.isBefore(endOfWeek) || day.isSame(endOfWeek, "day")) {
			days.push(day);
			day = day.add(1, "day");
		}

		return days;
	};

	const isCurrentMonth = (date: Dayjs) => {
		return date.month() === currentMonth.month();
	};

	const isSelected = (date: Dayjs) => {
		return selectedDate && date.isSame(selectedDate, "day");
	};

	const isDateAvailable = (date: Dayjs) => {
		const dateStr = date.format("DD/MM/YYYY");
		return slotDates.available.includes(dateStr);
	};

	const isDateFullAvailable = (date: Dayjs) => {
		const dateStr = date.format("DD/MM/YYYY");
		return slotDates.fullavailable.includes(dateStr);
	};

	const isDateNotAvailable = (date: Dayjs) => {
		const dateStr = date.format("DD/MM/YYYY");
		return slotDates.notavailable.includes(dateStr);
	};

	const handleSubmit = async () => {
		if (!selectedDate || !facility || !calendarData) {
			setSnackbar({
				open: true,
				message: "Please select a date and ensure facility data is available",
				severity: "warning",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			// Format the selected date to DD/MM/YYYY
			const formattedDate = selectedDate.format("DD/MM/YYYY");

			// Build dayTime string from ALL slots (including 00:00-00:00 and "Not Available" slots)
			// The notAvailable flags are sent separately
			// Only filter out completely empty/undefined slots
			const completeSlots = timeSlots.filter(
				(slot) =>
					slot.fromHour !== undefined &&
					slot.fromMin !== undefined &&
					slot.toHour !== undefined &&
					slot.toMin !== undefined &&
					slot.fromHour !== "" &&
					slot.fromMin !== "" &&
					slot.toHour !== "" &&
					slot.toMin !== "",
			);

			console.log("=== DAYTIME GENERATION DEBUG ===");
			console.log("All time slots:", timeSlots);
			console.log("Complete slots (including 00:00-00:00):", completeSlots);

			// Build dayTime from all slots (including 00:00-00:00 and "Not Available" ones)
			const dayTime = completeSlots
				.map((slot) => {
					const fromTime = `${slot.fromHour}-${slot.fromMin}`;
					const toTime = `${slot.toHour}-${slot.toMin}`;
					return `${fromTime}-${toTime}`;
				})
				.join("~");

			console.log("Generated dayTime:", dayTime);
			console.log("=== END DAYTIME DEBUG ===");

			// If no valid time slots, show warning
			if (!dayTime) {
				setSnackbar({
					open: true,
					message: "Please configure at least one time slot",
					severity: "warning",
				});
				setIsSubmitting(false);
				return;
			}

			// Determine notAvailable flags for each slot
			const notAvailableFirstSlot = timeSlots[0]?.notAvailable ? "Yes" : "";
			const notAvailableSecondSlot = timeSlots[1]?.notAvailable ? "Yes" : "";

			// Determine slotIndex based on time range
			// slotIndex=1 for 00-12 hours, slotIndex=2 for 13-23 hours
			// Find the first slot with valid time data (not 00:00-00:00) to determine slotIndex
			let slotIndex = 1; // Default to slot 1
			for (const slot of completeSlots) {
				// Skip slots that are 00:00-00:00
				if (
					slot.fromHour === "00" &&
					slot.fromMin === "00" &&
					slot.toHour === "00" &&
					slot.toMin === "00"
				) {
					continue;
				}
				// Check if start hour is >= 13 (afternoon/evening slot)
				const startHour = parseInt(slot.fromHour);
				if (startHour >= 13) {
					slotIndex = 2;
				} else {
					slotIndex = 1;
				}
				break; // Use the first valid slot to determine slotIndex
			}

			console.log("Determined slotIndex:", slotIndex);

			// Prepare API payload
			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				startDate: formattedDate,
				stopDate: "", // Empty as per API requirement
				orgId: localStorage.getItem("orgId") || undefined,
				facilityId: facility.facilityId || 0,
				dayTime: dayTime,
				slotDuration: slotDuration || "30",
				slotDuration2: "",
				bookAppType: calendarData.bookAppType || "timeslot",
				slotId: calendarData.slotId?.toString() || "",
				slotIndex: slotIndex,
				notAvailableFirstSlot: notAvailableFirstSlot,
				notAvailableSecondSlot: notAvailableSecondSlot,
			};

			console.log("Temporary adjustment payload:", payload);

			// Call the API
			const response = await temporaryAdjustCalendar(payload);

			if (response.status === "True") {
				setSnackbar({
					open: true,
					message:
						response.message || "Temporary adjustment applied successfully!",
					severity: "success",
				});

				// Call the success callback to refresh calendar list
				if (onSuccess) {
					onSuccess();
				}

				// Close modal after showing success message
				setTimeout(() => {
					onClose();
				}, 1500);
			} else {
				setSnackbar({
					open: true,
					message: response.message || "Failed to apply temporary adjustment",
					severity: "error",
				});
			}
		} catch (error) {
			console.error("Error submitting temp adjustment:", error);
			setSnackbar({
				open: true,
				message: "Error applying temporary adjustment. Please try again.",
				severity: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		// Reset form
		setCurrentMonth(dayjs());
		setSelectedDate(null);
		setTimeSlots([
			{
				fromHour: "00",
				fromMin: "00",
				toHour: "00",
				toMin: "00",
				notAvailable: false,
			},
		]);
		setSlotDuration("10");
		setSlotDates({ available: [], notavailable: [], fullavailable: [] });
		onClose();
	};

	const handleCloseSnackbar = (
		event?: React.SyntheticEvent | Event,
		reason?: string,
	) => {
		if (reason === "clickaway") return;
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	const calendarDays = getCalendarDays();
	const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

	// FORCE CHECK: Ensure 2 slots are shown if slot 2 data exists
	// This runs on every render to catch any state issues
	React.useEffect(() => {
		if (open && calendarData && timeSlots.length === 1) {
			// Check if calendar has slot 2 time
			const hasSlot2 = [
				calendarData.sundayStartTime1,
				calendarData.mondayStartTime1,
				calendarData.tuesdayStartTime1,
				calendarData.wednesdayStartTime1,
				calendarData.thursdayStartTime1,
				calendarData.fridayStartTime1,
				calendarData.saturdayStartTime1,
				calendarData.sundayStartTime2,
				calendarData.mondayStartTime2,
				calendarData.tuesdayStartTime2,
				calendarData.wednesdayStartTime2,
				calendarData.thursdayStartTime2,
				calendarData.fridayStartTime2,
				calendarData.saturdayStartTime2,
			].some((time) => {
				if (!time || time === "00:00") return false;
				const hour = parseInt(time.split(":")[0]);
				return hour >= 13;
			});

			if (hasSlot2) {
				console.log(
					"FORCE FIX: Detected slot 2 data but only 1 slot showing. Adding slot 2 now.",
				);
				setTimeSlots([
					timeSlots[0], // Keep slot 1
					{
						fromHour: "13",
						fromMin: "00",
						toHour: "14",
						toMin: "00",
						notAvailable: false,
					}, // Add slot 2
				]);
			}
		}
	}, [open, timeSlots.length, calendarData]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth='md'
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: "16px",
					minHeight: "600px",
				},
			}}>
			<DialogTitle
				sx={{
					position: "relative",
					p: 3,
					borderBottom: "1px solid #e0e0e0",
					bgcolor: "#f7f9fc",
				}}>
				<IconButton
					onClick={handleClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: "#666",
					}}>
					<CloseIcon />
				</IconButton>
				<Typography
					variant='h5'
					component='div'
					sx={{ fontWeight: 600, color: "#174a7c", pr: 4 }}>
					Temporary Calendar Adjustment
				</Typography>
				<Typography variant='body2' sx={{ color: "#666", mt: 1 }}>
					Select a date and adjust time slots for temporary changes
				</Typography>
			</DialogTitle>

			<DialogContent sx={{ p: 3 }}>
				<Box sx={{ mb: 3 }}>
					<Paper
						elevation={0}
						sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: "8px" }}>
						<Typography
							variant='subtitle2'
							sx={{ fontWeight: 600, color: "#34495e", mb: 1 }}>
							Current Calendar Details
						</Typography>
						<Box
							sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
							<Box>
								<Typography variant='body2' sx={{ color: "#666" }}>
									Facility
								</Typography>
								<Typography variant='body1' sx={{ fontWeight: 500 }}>
									{facility?.facilityName || "N/A"}
								</Typography>
							</Box>
							<Box>
								<Typography variant='body2' sx={{ color: "#666" }}>
									Schedule Period
								</Typography>
								<Typography variant='body1' sx={{ fontWeight: 500 }}>
									{calendarData?.scheduleStartDt || "N/A"} -{" "}
									{calendarData?.scheduleStopDt || "N/A"}
								</Typography>
							</Box>
						</Box>
					</Paper>
				</Box>

				<Divider sx={{ my: 3 }} />

				<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
					{/* Left Side - Calendar */}
					<Box>
						<Typography
							variant='subtitle1'
							sx={{ fontWeight: 600, mb: 2, color: "#34495e" }}>
							Select Date
						</Typography>

						{isLoadingSlotDates && (
							<Box
								sx={{
									mb: 2,
									p: 2,
									bgcolor: "#e3f2fd",
									borderRadius: "8px",
									border: "1px solid #2196f3",
								}}>
								<Typography
									variant='body2'
									sx={{ color: "#1976d2", textAlign: "center" }}>
									Loading available dates...
								</Typography>
							</Box>
						)}

						{/* Calendar Header */}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								mb: 2,
								p: 2,
								bgcolor: "#f5f5f5",
								borderRadius: "8px",
							}}>
							<IconButton
								onClick={() => handleMonthChange("prev")}
								size='small'
								sx={{ color: "#666" }}>
								<ChevronLeftIcon />
							</IconButton>

							<Typography
								variant='h6'
								sx={{ fontWeight: 600, color: "#34495e" }}>
								{currentMonth.format("MMMM YYYY")}
							</Typography>

							<IconButton
								onClick={() => handleMonthChange("next")}
								size='small'
								sx={{ color: "#666" }}>
								<ChevronRightIcon />
							</IconButton>
						</Box>

						{/* Calendar Grid */}
						<Paper elevation={1} sx={{ p: 2, bgcolor: "white" }}>
							{/* Week Days Header */}
							<Grid container sx={{ mb: 1 }}>
								{weekDays.map((day) => (
									<Grid item xs={12 / 7} key={day} sx={{ textAlign: "center" }}>
										<Typography
											variant='body2'
											sx={{ fontWeight: 600, color: "#666", py: 1 }}>
											{day}
										</Typography>
									</Grid>
								))}
							</Grid>

							{/* Calendar Days */}
							<Grid container>
								{calendarDays.map((date, index) => (
									<Grid item xs={12 / 7} key={index}>
										<Box
											onClick={() => handleDateClick(date)}
											sx={{
												height: "40px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												cursor: "pointer",
												borderRadius: "50%",
												mx: 0.5,
												my: 0.5,
												transition: "all 0.2s ease",
												position: "relative",
												...(isCurrentMonth(date) && {
													color: "#333",
													"&:hover": {
														bgcolor: "#e3f2fd",
														transform: "scale(1.1)",
													},
												}),
												...(!isCurrentMonth(date) && {
													color: "#ccc",
												}),
												...(isSelected(date) && {
													bgcolor: "#2196f3",
													color: "white",
													fontWeight: 600,
													transform: "scale(1.1)",
													boxShadow: "0 2px 8px rgba(33, 150, 243, 0.3)",
												}),
												...(isDateAvailable(date) &&
													!isSelected(date) && {
														bgcolor: "#4caf50",
														color: "white",
														fontWeight: 500,
														"&:hover": {
															bgcolor: "#45a049",
															transform: "scale(1.1)",
														},
													}),
												...(isDateFullAvailable(date) &&
													!isSelected(date) && {
														bgcolor: "#ff9800",
														color: "white",
														fontWeight: 500,
														"&:hover": {
															bgcolor: "#f57c00",
															transform: "scale(1.1)",
														},
													}),
												...(isDateNotAvailable(date) &&
													!isSelected(date) && {
														bgcolor: "#f44336",
														color: "white",
														fontWeight: 500,
														"&:hover": {
															bgcolor: "#d32f2f",
															transform: "scale(1.1)",
														},
													}),
											}}>
											<Typography
												variant='body2'
												sx={{ fontWeight: isSelected(date) ? 600 : 400 }}>
												{date.date()}
											</Typography>
										</Box>
									</Grid>
								))}
							</Grid>
						</Paper>

						{/* Calendar Legend */}
						<Box
							sx={{
								mt: 2,
								p: 2,
								bgcolor: "#f8f9fa",
								borderRadius: "8px",
								border: "1px solid #e0e0e0",
							}}>
							<Typography
								variant='body2'
								sx={{ fontWeight: 600, color: "#34495e", mb: 1 }}>
								Calendar Legend
							</Typography>
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Box
										sx={{
											width: 16,
											height: 16,
											borderRadius: "50%",
											bgcolor: "#4caf50",
										}}
									/>
									<Typography
										variant='body2'
										sx={{ fontSize: "0.75rem", color: "#666" }}>
										Available
									</Typography>
								</Box>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Box
										sx={{
											width: 16,
											height: 16,
											borderRadius: "50%",
											bgcolor: "#ff9800",
										}}
									/>
									<Typography
										variant='body2'
										sx={{ fontSize: "0.75rem", color: "#666" }}>
										Full Available
									</Typography>
								</Box>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Box
										sx={{
											width: 16,
											height: 16,
											borderRadius: "50%",
											bgcolor: "#f44336",
										}}
									/>
									<Typography
										variant='body2'
										sx={{ fontSize: "0.75rem", color: "#666" }}>
										Not Available
									</Typography>
								</Box>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Box
										sx={{
											width: 16,
											height: 16,
											borderRadius: "50%",
											bgcolor: "#2196f3",
										}}
									/>
									<Typography
										variant='body2'
										sx={{ fontSize: "0.75rem", color: "#666" }}>
										Selected
									</Typography>
								</Box>
							</Box>
						</Box>
					</Box>

					{/* Right Side - Time Configuration (only show when date is selected) */}
					{selectedDate ? (
						<Box>
							<Typography
								variant='subtitle1'
								sx={{ fontWeight: 600, mb: 2, color: "#34495e" }}>
								Time Configuration
							</Typography>

							{isLoadingDaySlots ? (
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										height: "200px",
										bgcolor: "#f8f9fa",
										borderRadius: "8px",
										border: "1px solid #e0e0e0",
									}}>
									<Typography variant='body1' sx={{ color: "#666" }}>
										Loading slot details...
									</Typography>
								</Box>
							) : (
								<>
									{console.log(
										"RENDERING - Current timeSlots array:",
										timeSlots,
										"Length:",
										timeSlots.length,
									)}
									{timeSlots.map((slot, index) => (
										<Box
											key={index}
											sx={{
												mb: 2,
												p: 2,
												border: "1px solid #e0e0e0",
												borderRadius: "8px",
											}}>
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
													mb: 1,
												}}>
												<Typography
													variant='body2'
													sx={{ fontWeight: 500, color: "#666" }}>
													Slot {index + 1}
												</Typography>
												{timeSlots.length > 1 && (
													<Button
														size='small'
														color='error'
														variant='outlined'
														onClick={() => handleRemoveSlot(index)}
														sx={{ minWidth: "auto", px: 1 }}>
														Remove
													</Button>
												)}
											</Box>

											<Box
												sx={{
													display: "grid",
													gridTemplateColumns: "1fr 1fr",
													gap: 2,
												}}>
												<Box>
													<Typography
														variant='body2'
														sx={{
															color: slot.notAvailable ? "#999" : "#666",
															mb: 0.5,
														}}>
														From Time *
													</Typography>
													<Box sx={{ display: "flex", gap: 1 }}>
														<FormControl
															size='small'
															fullWidth
															disabled={slot.notAvailable}>
															<InputLabel>Hours(24)</InputLabel>
															<Select
																value={slot.fromHour}
																label='Hours(24)'
																onChange={(e) =>
																	handleSlotChange(
																		index,
																		"fromHour",
																		e.target.value,
																	)
																}
																disabled={slot.notAvailable}>
																{(index === 0
																	? morningHours
																	: afternoonHours
																).map((hour) => (
																	<MenuItem key={hour} value={hour}>
																		{hour}
																	</MenuItem>
																))}
															</Select>
														</FormControl>
														<FormControl
															size='small'
															fullWidth
															disabled={slot.notAvailable}>
															<InputLabel>Mins</InputLabel>
															<Select
																value={slot.fromMin}
																label='Mins'
																onChange={(e) =>
																	handleSlotChange(
																		index,
																		"fromMin",
																		e.target.value,
																	)
																}
																disabled={slot.notAvailable}>
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
													<Typography
														variant='body2'
														sx={{
															color: slot.notAvailable ? "#999" : "#666",
															mb: 0.5,
														}}>
														To Time *
													</Typography>
													<Box sx={{ display: "flex", gap: 1 }}>
														<FormControl
															size='small'
															fullWidth
															disabled={slot.notAvailable}>
															<InputLabel>Hours(24)</InputLabel>
															<Select
																value={slot.toHour}
																label='Hours(24)'
																onChange={(e) =>
																	handleSlotChange(
																		index,
																		"toHour",
																		e.target.value,
																	)
																}
																disabled={slot.notAvailable}>
																{(index === 0
																	? morningHours
																	: afternoonHours
																).map((hour) => (
																	<MenuItem key={hour} value={hour}>
																		{hour}
																	</MenuItem>
																))}
															</Select>
														</FormControl>
														<FormControl
															size='small'
															fullWidth
															disabled={slot.notAvailable}>
															<InputLabel>Mins</InputLabel>
															<Select
																value={slot.toMin}
																label='Mins'
																onChange={(e) =>
																	handleSlotChange(
																		index,
																		"toMin",
																		e.target.value,
																	)
																}
																disabled={slot.notAvailable}>
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

											{slot.notAvailable && (
												<Box
													sx={{
														mt: 2,
														p: 2,
														textAlign: "center",
														bgcolor: "#fff3e0",
														borderRadius: "8px",
														border: "1px solid #ff9800",
													}}>
													<Typography
														variant='body2'
														sx={{ color: "#e65100", fontWeight: 500 }}>
														This slot is marked as "Not Available"
													</Typography>
												</Box>
											)}

											<Box sx={{ mt: 2 }}>
												<FormControlLabel
													control={
														<Checkbox
															checked={slot.notAvailable}
															onChange={(e) =>
																handleSlotChange(
																	index,
																	"notAvailable",
																	e.target.checked,
																)
															}
															sx={{
																color: "#e67e22",
																"&.Mui-checked": {
																	color: "#e67e22",
																},
															}}
														/>
													}
													label={
														<Typography
															variant='body2'
															sx={{ fontWeight: 500, color: "#e67e22" }}>
															Not Available
														</Typography>
													}
												/>
											</Box>
										</Box>
									))}

									{timeSlots.length < 2 && (
										<Button
											variant='outlined'
											onClick={handleAddSlot}
											sx={{
												color: "#174a7c",
												borderColor: "#174a7c",
												"&:hover": {
													borderColor: "#103a61",
													bgcolor: "rgba(23, 74, 124, 0.04)",
												},
											}}>
											+ Add Another Slot
										</Button>
									)}

									<Box sx={{ mt: 3 }}>
										<FormControl fullWidth>
											<InputLabel>Slot Duration (Mins)</InputLabel>
											<Select
												value={slotDuration}
												label='Slot Duration (Mins)'
												onChange={(e) => setSlotDuration(e.target.value)}>
												{slotDurations.map((duration) => (
													<MenuItem key={duration} value={duration}>
														{duration}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Box>
								</>
							)}
						</Box>
					) : (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								height: "400px",
								bgcolor: "#f8f9fa",
								borderRadius: "8px",
								border: "2px dashed #ddd",
							}}>
							<Typography
								variant='body1'
								sx={{ color: "#999", textAlign: "center" }}>
								Please select a date from the calendar
								<br />
								to configure time slots
							</Typography>
						</Box>
					)}
				</Box>
			</DialogContent>

			<DialogActions sx={{ p: 3, borderTop: "1px solid #e0e0e0", gap: 2 }}>
				<Button
					onClick={handleClose}
					variant='outlined'
					sx={{
						color: "#666",
						borderColor: "#ddd",
						"&:hover": {
							borderColor: "#999",
							bgcolor: "#f5f5f5",
						},
					}}>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					disabled={isSubmitting || !selectedDate}
					sx={{
						bgcolor: "#e67e22",
						"&:hover": {
							bgcolor: "#d35400",
						},
						"&:disabled": {
							bgcolor: "#ccc",
						},
					}}>
					{isSubmitting ? "Submitting..." : "Submit Adjustment"}
				</Button>
			</DialogActions>

			{/* Snackbar for notifications */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}>
				<Alert severity={snackbar.severity} sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Dialog>
	);
};

export default TempAdjustment;
