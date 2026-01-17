import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import TablePagination from "@mui/material/TablePagination";
import PatientSearchModal from "../Mvetconnect/PatientSearchModal";
import dayjs from "dayjs";

interface AppointmentDetailsProps {
	selectedDate: Date | null;
	patientSlots?: any[];
	selectedFacility?: {
		facilityId: number;
		facilityName: string;
	} | null;
	onAppointmentSuccess?: () => void;
	selectedDoctor?: any;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
	selectedDate,
	patientSlots = [],
	selectedFacility,
	onAppointmentSuccess,
	selectedDoctor,
}) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [showPatientSearch, setShowPatientSearch] = useState(false);

	if (!selectedDate) {
		return null;
	}

	// Filter slots that have patient appointments
	const bookedSlots = (patientSlots || []).filter(
		(slot) => slot.patientName && slot.appointmentStatus
	);
	const allSlots = (patientSlots || []).filter(
		(slot) => slot.startTime && slot.stopTime
	);

	if (allSlots.length === 0) {
		return (
			<Box
				sx={{
					p: { xs: 1, sm: 0 },
					display: "flex",
					flexDirection: "column",
					gap: 2,
					width: "100%",
				}}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						bgcolor: "#f7f9fc",
						borderRadius: "10px",
						p: 3,
						border: "1px solid #eaf2f8",
					}}>
					<Typography sx={{ color: "#7f8c8d", fontStyle: "italic" }}>
						No slots available for this date.
					</Typography>
				</Box>
			</Box>
		);
	}

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const [selectedSlot, setSelectedSlot] = useState<any>(null);

	const handleBookSlot = (slot: any) => {
		setSelectedSlot(slot);
		setShowPatientSearch(true);
	};

	const handlePatientSearchClose = () => {
		setShowPatientSearch(false);
	};

	const handlePatientSearch = (searchData: any) => {
		console.log("Searching for patient:", searchData);
		// Here you would typically make an API call to search for the patient
		// For now, we'll just close the search modal
		setShowPatientSearch(false);
	};

	const paginatedSlots = allSlots.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<>
			<Box
				sx={{
					p: { xs: 1, sm: 0 },
					display: "flex",
					flexDirection: "column",
					gap: 2,
					width: "100%",
				}}>
				<Typography
					variant='h6'
					sx={{ fontWeight: 600, color: "#34495e", mb: 2 }}>
					Time Slots for {selectedDate.toLocaleDateString()}
				</Typography>

				<TableContainer
					component={Paper}
					sx={{ borderRadius: "12px", overflow: "hidden" }}>
					<Table sx={{ minWidth: 650 }}>
						<TableHead sx={{ bgcolor: "#f7f9fc" }}>
							<TableRow>
								<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
									Time Slot
								</TableCell>
								<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
									Patient Name
								</TableCell>
								<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
									MRN
								</TableCell>
								<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
									Gender
								</TableCell>
								<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
									Status
								</TableCell>
								<TableCell sx={{ fontWeight: 600, color: "#34495e" }}>
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedSlots.map((slot, index) => {
								const isBooked = slot.patientName && slot.appointmentStatus;

								return (
									<TableRow
										key={index}
										sx={{
											"&:hover": { bgcolor: "rgba(23, 74, 124, 0.04)" },
											opacity: isBooked ? 1 : 0.7,
										}}>
										<TableCell sx={{ fontWeight: 500, color: "#2c3e50" }}>
											{slot.startTime} - {slot.stopTime}
										</TableCell>
										<TableCell>
											{isBooked ? (
												<Typography sx={{ fontWeight: 500, color: "#34495e" }}>
													{slot.patientName}
												</Typography>
											) : (
												<Typography
													sx={{ color: "#7f8c8d", fontStyle: "italic" }}>
													Available
												</Typography>
											)}
										</TableCell>
										<TableCell>
											{isBooked ? (
												<Typography sx={{ color: "#7f8c8d" }}>
													{slot.patientMrn || "N/A"}
												</Typography>
											) : (
												<Typography
													sx={{ color: "#7f8c8d", fontStyle: "italic" }}>
													-
												</Typography>
											)}
										</TableCell>
										<TableCell>
											{isBooked ? (
												<Typography sx={{ color: "#7f8c8d" }}>
													{slot.gender || "N/A"}
												</Typography>
											) : (
												<Typography
													sx={{ color: "#7f8c8d", fontStyle: "italic" }}>
													-
												</Typography>
											)}
										</TableCell>
										<TableCell>
											{isBooked ? (
												<Chip
													label={slot.appointmentStatus || "Scheduled"}
													size='small'
													sx={{
														bgcolor: "#e8f5e8",
														color: "#2e7d32",
														fontWeight: 500,
													}}
												/>
											) : (
												<Chip
													label='Available'
													size='small'
													sx={{
														bgcolor: "#fff3e0",
														color: "#f57c00",
														fontWeight: 500,
													}}
												/>
											)}
										</TableCell>
										<TableCell>
											{isBooked ? (
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 1,
													}}>
													<Typography
														sx={{
															color: "#2e7d32",
															fontWeight: 600,
															fontSize: "0.875rem",
															display: "flex",
															alignItems: "center",
															gap: 0.5,
														}}>
														<Box
															component='span'
															sx={{
																width: 8,
																height: 8,
																borderRadius: "50%",
																bgcolor: "#2e7d32",
																display: "inline-block",
															}}
														/>
														Booked
													</Typography>
												</Box>
											) : (
												<Button
													variant='contained'
													size='small'
													onClick={() => handleBookSlot(slot)}
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

				<Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
					<Chip
						label={`Total Slots: ${allSlots.length}`}
						size='small'
						sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}
					/>
					<Chip
						label={`Booked: ${bookedSlots.length}`}
						size='small'
						sx={{ bgcolor: "#e8f5e8", color: "#2e7d32" }}
					/>
					<Chip
						label={`Available: ${allSlots.length - bookedSlots.length}`}
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
			</Box>

			<PatientSearchModal
				open={showPatientSearch}
				onClose={handlePatientSearchClose}
				onSearch={handlePatientSearch}
				selectedTimeSlot={
					selectedSlot
						? {
								startTime: selectedSlot.startTime,
								stopTime: selectedSlot.stopTime,
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

export default AppointmentDetails;
