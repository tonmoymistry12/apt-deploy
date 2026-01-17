import React, { useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import PrivateRoute from "@/components/PrivateRoute";
import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Avatar,
	Typography,
	TablePagination,
	Grid,
	TextField,
	Select,
	MenuItem,
} from "@mui/material";
import DoctorSelfConfirmModal from "@/components/MaintainDoctors/DoctorSelfConfirmModal";
import DoctorDetailsModal from "@/components/MaintainDoctors/DoctorDetailsModal";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AssignUserPrivilegeModal from "@/components/MaintainOtherUsers/AssignUserPrivilegeModal";

const dummyDoctors = [
	{
		id: 1,
		image: "",
		name: "Dr. John Doe",
		phone: "123-456-7890",
		email: "john@example.com",
		status: "Active",
	},
	{
		id: 2,
		image: "",
		name: "Dr. Jane Smith",
		phone: "987-654-3210",
		email: "jane@example.com",
		status: "Inactive",
	},
];

const DoctorsTable: React.FC = () => {
	const getLocalStorageItem = (key: string) => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(key);
	};

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [selfConfirmOpen, setSelfConfirmOpen] = useState(false);
	const [firstNameFilter, setFirstNameFilter] = useState("");
	const [lastNameFilter, setLastNameFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [pendingDoctor, setPendingDoctor] = useState<any>(null);
	const [showFullDoctorForm, setShowFullDoctorForm] = useState(false);
	const [fullDoctorData, setFullDoctorData] = useState<any>(null);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editDoctorData, setEditDoctorData] = useState<any>(null);
	const [privilegeModalOpen, setPrivilegeModalOpen] = useState(false);
	const [privilegeDoctor, setPrivilegeDoctor] = useState<any>(null);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const paginatedDoctors = dummyDoctors.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<PrivateRoute>
			<AuthenticatedLayout>
				<Box sx={{ mb: 3 }}>
					<Typography variant='h5' fontWeight='bold' sx={{ mb: 2 }}>
						Maintain Doctors
					</Typography>
				</Box>
				<Grid container spacing={2} alignItems='center' mb={2}>
					<Grid item xs={12} md={9}>
						<Box display='flex' gap={2}>
							<TextField
								variant='outlined'
								label='First Name'
								value={firstNameFilter}
								onChange={(e) => setFirstNameFilter(e.target.value)}
								size='small'
							/>
							<TextField
								variant='outlined'
								label='Last Name'
								value={lastNameFilter}
								onChange={(e) => setLastNameFilter(e.target.value)}
								size='small'
							/>
							<Select
								displayEmpty
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								variant='outlined'
								size='small'
								sx={{ minWidth: 120 }}>
								<MenuItem value=''>All Status</MenuItem>
								<MenuItem value='Active'>Active</MenuItem>
								<MenuItem value='Inactive'>Inactive</MenuItem>
							</Select>
						</Box>
					</Grid>

					<Grid item xs={12} md={3} display='flex' justifyContent='flex-end'>
						{getLocalStorageItem("clinicType") !== "SoloPractice" && (
							<Button
								variant='contained'
								sx={{ bgcolor: "#174a7c" }}
								onClick={() => {
									setDetailsOpen(true);
									setSelfConfirmOpen(true);
								}}>
								Add New Doctor
							</Button>
						)}
					</Grid>
				</Grid>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow sx={{ bgcolor: "#0a3761" }}>
								<TableCell sx={{ color: "white" }}>
									<b>Image</b>
								</TableCell>
								<TableCell sx={{ color: "white" }}>
									<b>Name</b>
								</TableCell>
								<TableCell sx={{ color: "white" }}>
									<b>Phone</b>
								</TableCell>
								<TableCell sx={{ color: "white" }}>
									<b>Email</b>
								</TableCell>
								<TableCell sx={{ color: "white" }}>
									<b>Status</b>
								</TableCell>
								<TableCell sx={{ color: "white" }}>
									<b>Action</b>
								</TableCell>
								<TableCell sx={{ color: "white" }}>
									<b>Action</b>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedDoctors.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} align='center'>
										No records to view
									</TableCell>
								</TableRow>
							) : (
								paginatedDoctors.map((doc) => (
									<TableRow key={doc.id}>
										<TableCell>
											<Avatar alt={doc.name} src={doc.image} />
										</TableCell>
										<TableCell>{doc.name}</TableCell>
										<TableCell>{doc.phone}</TableCell>
										<TableCell>{doc.email}</TableCell>
										<TableCell>{doc.status}</TableCell>
										<TableCell>
											<Button
												size='small'
												variant='outlined'
												color='secondary'
												startIcon={<EditIcon />}
												onClick={() => {
													setEditDoctorData(doc);
													setEditModalOpen(true);
												}}>
												Edit
											</Button>
										</TableCell>
										<TableCell>
											<Button
												size='small'
												variant='outlined'
												onClick={() => {
													setPrivilegeDoctor(doc);
													setPrivilegeModalOpen(true);
												}}>
												Assign User Privilege
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
					<TablePagination
						component='div'
						count={dummyDoctors.length}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						rowsPerPageOptions={[5, 10, 25]}
					/>
				</TableContainer>
				<DoctorDetailsModal
					open={detailsOpen}
					onClose={() => setDetailsOpen(false)}
					onProceed={(doctorData) => {
						// Simulate not found logic
						setPendingDoctor(doctorData);
						setShowConfirmDialog(true);
						setDetailsOpen(false);
					}}
				/>
				<DoctorSelfConfirmModal
					open={selfConfirmOpen}
					onYes={() => setSelfConfirmOpen(false)}
					onNo={() => {
						setSelfConfirmOpen(false);
						setDetailsOpen(false);
					}}
				/>
				<Dialog
					open={showConfirmDialog}
					onClose={() => setShowConfirmDialog(false)}>
					<DialogTitle
						sx={{ bgcolor: "#174a7c", color: "white", fontWeight: "bold" }}>
						Doctor Details
					</DialogTitle>
					<DialogContent sx={{ minWidth: 400, textAlign: "center", py: 4 }}>
						<div>
							Hi! your entered medical details are not found in our database. Do
							you want to change or proceed with it ?
						</div>
					</DialogContent>
					<DialogActions sx={{ justifyContent: "center", pb: 3 }}>
						<Button
							variant='contained'
							sx={{ bgcolor: "#174a7c", mr: 2 }}
							onClick={() => setShowConfirmDialog(false)}>
							Yes, Change
						</Button>
						<Button
							variant='contained'
							sx={{ bgcolor: "#174a7c" }}
							onClick={() => {
								setShowConfirmDialog(false);
								setFullDoctorData(pendingDoctor);
								setShowFullDoctorForm(true);
							}}>
							Proceed anyway
						</Button>
					</DialogActions>
				</Dialog>
				{showFullDoctorForm && (
					<DoctorDetailsModal
						open={showFullDoctorForm}
						onClose={() => setShowFullDoctorForm(false)}
						mode='full'
						initialData={fullDoctorData}
						onSubmit={(data) => {
							setShowFullDoctorForm(false);
							// TODO: handle save
						}}
					/>
				)}
				{editModalOpen && (
					<DoctorDetailsModal
						open={editModalOpen}
						onClose={() => setEditModalOpen(false)}
						mode='full'
						initialData={editDoctorData}
						onSubmit={(data) => {
							setEditModalOpen(false);
							// TODO: handle update logic
						}}
					/>
				)}
				{privilegeModalOpen && privilegeDoctor && (
					<AssignUserPrivilegeModal
						open={privilegeModalOpen}
						onClose={() => setPrivilegeModalOpen(false)}
						user={{
							id: privilegeDoctor.id,
							firstName: privilegeDoctor.name.split(" ")[0] || "",
							lastName:
								privilegeDoctor.name.split(" ").slice(1).join(" ") || "",
							image: privilegeDoctor.image,
						}}
						onSubmit={(data) => {
							setPrivilegeModalOpen(false);
							// TODO: handle privilege assignment
						}}
					/>
				)}
			</AuthenticatedLayout>
		</PrivateRoute>
	);
};

export default DoctorsTable;
