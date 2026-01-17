import React, { useState, useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import dayjs from "dayjs";
import PatientSearchModal from "../Mvetconnect/PatientSearchModal";

interface CreateAppointmentDialogProps {
	open: boolean;
	onClose: () => void;
	selectedDate: Date | null;
	patientSlots?: any[];
	onBook: () => void;
	selectedFacility?: {
		facilityId: number;
		facilityName: string;
	} | null;
	onAppointmentSuccess?: () => void;
	selectedDoctor?: any;
}

const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
	open,
	onClose,
	selectedDate,
	patientSlots = [],
	onBook,
	selectedFacility,
	onAppointmentSuccess,
	selectedDoctor,
}) => {
	const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [showPatientSearch, setShowPatientSearch] = useState(false);

	// Debug log
	console.log(
		"CreateAppointmentDialog - onAppointmentSuccess exists:",
		!!onAppointmentSuccess
	);

	const handleToggleSlot = (timeSlot: string) => {
		setSelectedSlots((prev) =>
			prev.includes(timeSlot)
				? prev.filter((t) => t !== timeSlot)
				: [...prev, timeSlot]
		);
	};

	const formattedDate = useMemo(() => {
		return selectedDate ? dayjs(selectedDate).format("dddd, MMMM D, YYYY") : "";
	}, [selectedDate]);

	const availableSlots = (patientSlots || []).filter(
		(slot) => slot.startTime && slot.stopTime && !slot.patientName
	);
	const allSlots = (patientSlots || []).filter(
		(slot) => slot.startTime && slot.stopTime
	);
	const paginatedSlots = allSlots.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleBookSlot = () => {
		setShowPatientSearch(true);
	};

	const handlePatientSearchClose = () => {
		setShowPatientSearch(false);
	};

	const handlePatientSearch = (searchData: any) => {
		console.log("Searching for patient:", searchData);
		// Here you would typically make an API call to search for the patient
		// For now, we'll just close the search modal and proceed
		setShowPatientSearch(false);
		onBook(); // Call the original onBook function
	};

	return (
		<>
			<Dialog
				open={open}
				onClose={onClose}
				fullWidth
				maxWidth='md'
				PaperProps={{ sx: { borderRadius: "16px" } }}>
				<DialogTitle
					sx={{ p: 2, bgcolor: "#f7f9fc", borderBottom: "1px solid #e0e0e0" }}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<Box>
							<Typography
								variant='h6'
								sx={{ fontWeight: 600, color: "#174a7c" }}>
								Create Appointment
							</Typography>
							<Typography variant='body1' sx={{ color: "#555" }}>
								{formattedDate}
							</Typography>
						</Box>
						<IconButton onClick={onClose} sx={{ color: "#555" }}>
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>

				<DialogContent sx={{ p: 3 }}>
					{(patientSlots || []).length === 0 ? (
						<Box sx={{ textAlign: "center", py: 4 }}>
							<Typography sx={{ color: "#7f8c8d", fontStyle: "italic" }}>
								No slots available for this date
							</Typography>
						</Box>
					) : (
						<>
							<Typography
								variant='subtitle1'
								sx={{ fontWeight: 600, color: "#34495e", mb: 2 }}>
								Select Available Time Slots
							</Typography>

							<TableContainer
								component={Paper}
								sx={{ borderRadius: "12px", overflow: "hidden", mb: 2 }}>
								<Table sx={{ minWidth: 650 }}>
									<TableHead sx={{ bgcolor: "#f7f9fc" }}>
										<TableRow>
											<TableCell
												sx={{ fontWeight: 600, color: "#34495e", width: 60 }}>
												Select
											</TableCell>
											<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
												Time Slot
											</TableCell>
											<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
												Status
											</TableCell>
											<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
												Patient Info
											</TableCell>
											<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
												Actions
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{paginatedSlots.map((slot, index) => {
											const timeSlot = `${slot.startTime} - ${slot.stopTime}`;
											const isBooked =
												slot.patientName && slot.appointmentStatus;
											const isAvailable = !isBooked;

											return (
												<TableRow
													key={index}
													sx={{
														"&:hover": { bgcolor: "rgba(23, 74, 124, 0.04)" },
														opacity: isBooked ? 0.6 : 1,
													}}>
													<TableCell>
														{isAvailable && (
															<Checkbox
																checked={selectedSlots.includes(timeSlot)}
																onChange={() => handleToggleSlot(timeSlot)}
																sx={{
																	color: "#174a7c",
																	"&.Mui-checked": {
																		color: "#174a7c",
																	},
																}}
															/>
														)}
													</TableCell>
													<TableCell sx={{ fontWeight: 500, color: "#2c3e50" }}>
														{timeSlot}
													</TableCell>
													<TableCell>
														{isBooked ? (
															<Chip
																label='Booked'
																size='small'
																sx={{
																	bgcolor: "#ffebee",
																	color: "#c62828",
																	fontWeight: 500,
																}}
															/>
														) : (
															<Chip
																label='Available'
																size='small'
																sx={{
																	bgcolor: "#e8f5e8",
																	color: "#2e7d32",
																	fontWeight: 500,
																}}
															/>
														)}
													</TableCell>
													<TableCell>
														{isBooked ? (
															<Box>
																<Typography
																	sx={{
																		fontWeight: 500,
																		color: "#34495e",
																		fontSize: "0.9rem",
																	}}>
																	{slot.patientName}
																</Typography>
																<Typography
																	sx={{ color: "#7f8c8d", fontSize: "0.8rem" }}>
																	MRN: {slot.patientMrn || "N/A"} |{" "}
																	{slot.gender || "N/A"}
																</Typography>
															</Box>
														) : (
															<Typography
																sx={{ color: "#7f8c8d", fontStyle: "italic" }}>
																Ready for booking
															</Typography>
														)}
													</TableCell>
													<TableCell>
														{isBooked ? (
															<Button
																variant='outlined'
																size='small'
																disabled
																sx={{
																	color: "#7f8c8d",
																	borderColor: "#bdc3c7",
																	fontWeight: 600,
																	borderRadius: "8px",
																	textTransform: "none",
																	fontSize: "0.8rem",
																	px: 2,
																}}>
																Booked
															</Button>
														) : (
															<Button
																variant='contained'
																size='small'
																onClick={handleBookSlot}
																sx={{
																	bgcolor: "#174a7c",
																	color: "white",
																	fontWeight: 600,
																	borderRadius: "8px",
																	textTransform: "none",
																	fontSize: "0.8rem",
																	px: 2,
																	"&:hover": {
																		bgcolor: "#103a61",
																	},
																}}>
																Book Now
															</Button>
														)}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
								<TablePagination
									rowsPerPageOptions={[5, 10, 25, 50]}
									component='div'
									count={allSlots.length}
									rowsPerPage={rowsPerPage}
									page={page}
									onPageChange={handleChangePage}
									onRowsPerPageChange={handleChangeRowsPerPage}
									sx={{
										bgcolor: "#f7f9fc",
										borderTop: "1px solid #e0e0e0",
										"& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
											{
												color: "#34495e",
												fontWeight: 500,
											},
										"& .MuiTablePagination-select": {
											color: "#174a7c",
											fontWeight: 600,
										},
										"& .MuiIconButton-root": {
											color: "#174a7c",
											"&:hover": {
												bgcolor: "rgba(23, 74, 124, 0.04)",
											},
											"&.Mui-disabled": {
												color: "#bdc3c7",
											},
										},
									}}
								/>
							</TableContainer>

							<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
								<Chip
									label={`Total Slots: ${allSlots.length}`}
									size='small'
									sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}
								/>
								<Chip
									label={`Available: ${availableSlots.length}`}
									size='small'
									sx={{ bgcolor: "#e8f5e8", color: "#2e7d32" }}
								/>
								<Chip
									label={`Booked: ${allSlots.length - availableSlots.length}`}
									size='small'
									sx={{ bgcolor: "#ffebee", color: "#c62828" }}
								/>
								<Chip
									label={`Selected: ${selectedSlots.length}`}
									size='small'
									sx={{ bgcolor: "#fff3e0", color: "#f57c00" }}
								/>
								<Chip
									label={`Showing: ${page * rowsPerPage + 1}-${Math.min(
										(page + 1) * rowsPerPage,
										allSlots.length
									)} of ${allSlots.length}`}
									size='small'
									sx={{ bgcolor: "#f3e5f5", color: "#7b1fa2" }}
								/>
							</Box>
						</>
					)}
				</DialogContent>

				<DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
					<Button onClick={onClose} sx={{ color: "#555" }}>
						Cancel
					</Button>
					<Button
						variant='contained'
						onClick={handleBookSlot}
						disabled={selectedSlots.length === 0}
						sx={{
							bgcolor: selectedSlots.length === 0 ? "#bdc3c7" : "#174a7c",
							"&:hover": {
								bgcolor: selectedSlots.length === 0 ? "#bdc3c7" : "#103a61",
							},
							minWidth: 150,
						}}>
						Book ({selectedSlots.length}) Slot(s)
					</Button>
				</DialogActions>
			</Dialog>

			<PatientSearchModal
				open={showPatientSearch}
				onClose={handlePatientSearchClose}
				onSearch={handlePatientSearch}
				selectedTimeSlot={
					selectedSlots.length > 0
						? {
								startTime: selectedSlots[0].split(" - ")[0],
								stopTime: selectedSlots[0].split(" - ")[1],
								date: selectedDate
									? dayjs(selectedDate).format("DD/MM/YYYY")
									: "",
						  }
						: null
				}
				selectedFacility={selectedFacility}
				selectedDate={selectedDate}
				onAppointmentSuccess={onAppointmentSuccess}
				selectedDoctor={selectedDoctor}
			/>
		</>
	);
};

export default CreateAppointmentDialog;
