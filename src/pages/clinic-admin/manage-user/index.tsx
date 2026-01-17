"use client";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import TableLinkButton from "@/components/common/buttons/TableLinkButton";
import PrivateRoute from "@/components/PrivateRoute";
import React, { useState, useMemo, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SellIcon from "@mui/icons-material/Sell";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import UserDetailsForm from "@/components/UserDetailsForm/UserDetails";
import ManageUsersEdit from "@/components/UserDetailsForm/ManageUsersEdit";
import AssignUserPrivilegeModal from "@/components/MaintainOtherUsers/AssignUserPrivilegeModal";
import DoctorDetailsModal from "@/components/UserDetailsForm/DoctorDetailsModals";
import DoctorSelfConfirmModal from "@/components/MaintainDoctors/DoctorSelfConfirmModal";
import {
	Box,
	Button,
	Grid,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	TextField,
	Select,
	MenuItem,
} from "@mui/material";
import styles from "./style.module.scss";
import {
	getOrgUsers,
	getUserDetails,
	getCouncilList,
	getAllRoleGroupOfOrg,
} from "@/services/userService";
import { User } from "@/interfaces/user";
import Message from "@/components/common/Message";

const ManageUsersPage = () => {
	const getLocalStorageItem = (key: string) => {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(key);
	};
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogMode, setDialogMode] = useState<
		"add" | "edit" | "assign" | null
	>(null);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [privilegeModalOpen, setPrivilegeModalOpen] = useState(false);
	const [privilegeUser, setPrivilegeUser] = useState<{
		id: number;
		firstName: string;
		lastName: string;
		image: string;
		isDoctor?: number;
	} | null>(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success",
	);

	// Doctor modal states
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [selfConfirmOpen, setSelfConfirmOpen] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [pendingDoctor, setPendingDoctor] = useState<User | null>(null);
	const [showFullDoctorForm, setShowFullDoctorForm] = useState(false);
	const [fullDoctorData, setFullDoctorData] = useState<User | null>(null);

	// Doctor edit modal states
	const [editDoctorModalOpen, setEditDoctorModalOpen] = useState(false);
	const [editDoctorData, setEditDoctorData] = useState<User | null>(null);

	// Table state for search, filter, and pagination
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [loggedInUserIsDoctor, setLoggedInUserIsDoctor] =
		useState<boolean>(false);
	const [doctorUserDetails, setDoctorUserDetails] = useState<User | null>(null);

	// Dropdown data states
	const [councilList, setCouncilList] = useState<
		{ councilId: string; councilName: string }[]
	>([]);
	const [roleGroupList, setRoleGroupList] = useState<
		{ roleGroupId: number; roleGroupName: string }[]
	>([]);

	const colHeaders = [
		{ id: "image", label: "Image" },
		{ id: "name", label: "Name" },
		{ id: "phone", label: "Phone" },
		{ id: "email", label: "Email" },
		{ id: "status", label: "Status" },
		{ id: "editAction", label: "Action" },
	];

	// Fetch users from getorgusers API
	const fetchUsers = async (statusId: number) => {
		setLoading(true);
		try {
			const usersData = await getOrgUsers(statusId);
			setUsers(usersData);

			// Check if any user in the response has isDoctor: 1
			if (usersData.length > 0) {
				const hasDoctor = usersData.some((user) => user.isDoctor === 1);
				setLoggedInUserIsDoctor(hasDoctor);

				// If doctor exists, fetch doctor user details for logged-in user
				if (hasDoctor) {
					const orgUserId = localStorage.getItem("orgUserId");
					if (orgUserId) {
						try {
							const doctorDetails = await fetchUserDetails(
								parseInt(orgUserId, 10),
							);
							if (doctorDetails) {
								setDoctorUserDetails(doctorDetails);
							}
						} catch (error) {
							console.error("Error fetching doctor user details:", error);
						}
					}
				} else {
					// Clear doctor details if no doctor exists
					setDoctorUserDetails(null);
				}
			} else {
				setLoggedInUserIsDoctor(false);
			}
		} catch (error) {
			setUsers([]);
		} finally {
			setLoading(false);
		}
	};

	// Fetch user details from getuserdetails API
	const fetchUserDetails = async (orgUserId: number) => {
		// setLoading(true);
		try {
			const userDetails = await getUserDetails(String(orgUserId));
			setLoading(false);
			return userDetails;
		} catch (error) {
			setLoading(false);
			return null;
		}
	};

	// Fetch council list
	const fetchCouncilList = async () => {
		try {
			const councils = await getCouncilList();
			setCouncilList(councils);
		} catch (error) {
			setCouncilList([]);
		}
	};

	// Fetch role group list
	const fetchRoleGroupList = async () => {
		try {
			const roleGroups = await getAllRoleGroupOfOrg("2");
			setRoleGroupList(roleGroups);
		} catch (error) {
			setRoleGroupList([]);
		}
	};

	// Map API data to table row format
	const rowData = useMemo(() => {
		return users.map((user) => ({
			image:
				"https://www.aptcarepet.com/cimages/" + user.imageFileName ||
				"https://via.placeholder.com/50",
			name:
				user.userNameWithTitle ||
				`${user.firstName || ""} ${user.lastName || ""}`.trim(),
			phone: user.cellNumber || "",
			email: user.email || "",
			status: user.activeInd === 1 ? "Active" : "Inactive",
			editAction: (
				<>
					<TableLinkButton
						text='Edit'
						icon={<EditIcon />}
						onClick={() => handleEditClick(user.orgUserId)}
					/>
					<TableLinkButton
						text='Assign User Privilege'
						icon={<SellIcon />}
						color='primary'
						customColor='#174a7c'
						onClick={() =>
							handleAssignClick({
								id: user.orgUserId,
								firstName:
									user.firstName || user.userNameWithTitle?.split(" ")[1] || "",
								lastName:
									user.lastName ||
									user.userNameWithTitle?.split(" ").slice(2).join(" ") ||
									"",
								image: user.imageFilePath || "https://via.placeholder.com/50",
								isDoctor: user.isDoctor,
							})
						}
					/>
				</>
			),
		}));
	}, [users]);

	const filters = [
		{ name: "status", options: ["Active", "Inactive"], value: "" },
	];

	// Handle edit click with API call
	const handleEditClick = async (orgUserId: number) => {
		const userDetails: any = await fetchUserDetails(orgUserId);
		//const userDetails:any = {}
		if (userDetails) {
			console.log({ userDetails });
			const user: User = {
				orgUserId: userDetails.orgUserId,
				userNameWithTitle: userDetails.userNameWithTitle || "",
				firstName: userDetails.firstName || "",
				lastName: userDetails.lastName || "",
				email: userDetails.email || "",
				cellNumber: userDetails.cellNumber || "",
				imageFilePath:
					"https://www.aptcarepet.com/cimages/" + userDetails.imageFileName ||
					"https://via.placeholder.com/50",
				activeInd: userDetails.activeInd,
				isDoctor: userDetails.isDoctor,
				userTitle: userDetails.userTitle || "Mr.",
				addressLine1: userDetails.addressLine1 || "",
				addressLine2: userDetails.addressLine2 || "",
				city: userDetails.city || "",
				areaName: userDetails.areaName || "",
				country: userDetails.country || "",
				state: userDetails.state || "",
				pin: userDetails.pin || "",
				userName: userDetails.userName || "",
				userUid: userDetails.userUid,
				cityId: userDetails.cityId,
				specialty: userDetails.specialty || "",
				glbSpltyId: userDetails.glbSpltyId || "",
				orgUserQlfn: userDetails.orgUserQlfn || "",
				councilId: userDetails.councilId || "",
				yearOfReg: userDetails.yearOfReg || 0,
				registrationNumber: userDetails.registrationNumber || "",
				roleName: userDetails.isDoctor ? "Doctor" : userDetails.roleName || "",
				profileDetails: userDetails.profileDetails || "",
				cityMappingId: userDetails.cityPincodeMappingId || "",
			};

			if (userDetails.isDoctor) {
				setEditDoctorData(user);
				setEditDoctorModalOpen(true);
			} else {
				setSelectedUser(user);
				setDialogMode("edit");
				setOpenDialog(true);
			}
		}
	};

	const handleAssignClick = (user: {
		id: number;
		firstName: string;
		lastName: string;
		image: string;
		isDoctor?: number;
	}) => {
		setPrivilegeUser(user);
		setPrivilegeModalOpen(true);
	};

	const handleAddClick = () => {
		setSelectedUser(null);
		setDialogMode("add");
		setOpenDialog(true);
	};

	const handleAddDoctorClick = () => {
		// Clear any previous pending doctor data
		setPendingDoctor(null);
		setDetailsOpen(true);

		// Get values from localStorage
		const clinicType = localStorage.getItem("clinicType");
		const orgUserId = localStorage.getItem("orgUserId");

		// Show "Are you yourself a doctor" modal when ALL 3 conditions are met:
		// 1. clinicType is "Clinic"
		// 2. orgUserId is "1"
		// 3. No user has isDoctor: 1 (i.e., !loggedInUserIsDoctor)
		if (clinicType === "Clinic" && orgUserId === "1" && !loggedInUserIsDoctor) {
			setSelfConfirmOpen(true);
		} else {
			// Default: admin is NOT adding themselves as a doctor
			localStorage.setItem("adminIsADoctorConf", "No");
		}
	};

	const handleClose = () => {
		setOpenDialog(false);
		setDialogMode(null);
		setSelectedUser(null);
	};

	const handleAddSubmit = (data: any) => {
		if (data === "success") {
			setOpenSnackbar(true);
			setSnackbarMessage("User added successfully");
			setSnackbarSeverity("success");
			fetchUsers(-1);
		} else {
			setOpenSnackbar(true);
			setSnackbarMessage(data);
			setSnackbarSeverity("error");
		}
		handleClose();
	};

	const handleEditSubmit = (data: any) => {
		console.log("Updating user:", data);
		if (data === "success") {
			setOpenSnackbar(true);
			setSnackbarMessage("User edited successfully");
			setSnackbarSeverity("success");
			fetchUsers(-1);
		} else if (data == "addsuccess") {
			setOpenSnackbar(true);
			setSnackbarMessage("User added successfully");
			setSnackbarSeverity("success");
			fetchUsers(-1);
		} else {
			setOpenSnackbar(true);
			setSnackbarMessage(data);
			setSnackbarSeverity("error");
		}
		handleClose();
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const handleAssignSubmit = (data: any) => {
		console.log(
			`Assigning privileges to ${privilegeUser?.firstName} ${privilegeUser?.lastName}:`,
			data,
		);
		setPrivilegeModalOpen(false);
	};

	const getDialogTitle = () => {
		switch (dialogMode) {
			case "add":
				return "Add New User";
			case "edit":
				return "Edit User";
			default:
				return "";
		}
	};

	const renderDialogContent = () => {
		switch (dialogMode) {
			case "add":
				return (
					<UserDetailsForm
						open={openDialog}
						onSubmit={handleAddSubmit}
						onCancel={handleClose}
						roleGroupList={roleGroupList}
					/>
				);
			case "edit":
				return selectedUser ? (
					<ManageUsersEdit
						user={selectedUser}
						onSubmit={handleEditSubmit}
						onCancel={handleClose}
						roleGroupList={roleGroupList}
					/>
				) : null;
			default:
				return null;
		}
	};

	// Fetch dropdown data on component mount
	useEffect(() => {
		fetchCouncilList();
		fetchRoleGroupList();
	}, []);

	// Fetch users when status filter or component mounts
	useEffect(() => {
		fetchUsers(getStatusId());
	}, [statusFilter]);

	useEffect(() => {
		setPage(0);
	}, [searchTerm, statusFilter]);

	// Table filter and pagination logic
	const filteredRows = useMemo(() => {
		return rowData.filter((row) => {
			const matchesSearch = row.name
				?.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesStatus =
				!statusFilter ||
				row.status?.toLowerCase() === statusFilter.toLowerCase();
			return matchesSearch && matchesStatus;
		});
	}, [rowData, searchTerm, statusFilter]);

	// Map status filter to statusId for API
	const getStatusId = () => {
		switch (statusFilter) {
			case "Active":
				return 1;
			case "Inactive":
				return 0;
			default:
				return -1; // All users
		}
	};

	const paginatedRows = useMemo(() => {
		const start = page * rowsPerPage;
		return filteredRows.slice(start, start + rowsPerPage);
	}, [filteredRows, page, rowsPerPage]);

	const handleChangePage = (_: unknown, newPage: number) => {
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
				<Box sx={{ mb: 3 }}>
					<Typography
						variant='h5'
						sx={{ mb: 1, fontWeight: 600, color: "#174a7c" }}>
						Manage User Accounts & Permission
					</Typography>
				</Box>

				{/* Action Buttons and Filters in a single row */}
				<Grid container spacing={2} alignItems='center' mb={2}>
					<Grid item xs={12} sm={4}>
						<TextField
							fullWidth
							variant='outlined'
							label='Search by Name'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Select
							fullWidth
							displayEmpty
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							variant='outlined'>
							<MenuItem value=''>All Status</MenuItem>
							<MenuItem value='Active'>Active</MenuItem>
							<MenuItem value='Inactive'>Inactive</MenuItem>
						</Select>
					</Grid>
					<Grid
						item
						xs={12}
						sm={4}
						display='flex'
						justifyContent='flex-end'
						gap={1}>
						{getLocalStorageItem("clinicType") !== "SoloPractice" && (
							<Button
								variant='contained'
								sx={{
									bgcolor: "#174a7c",
									minWidth: "150px",
									px: 2,
									py: 1,
									borderRadius: 2,
									boxShadow: "0 4px 12px rgba(23, 74, 124, 0.3)",
									transition: "all 0.3s ease",
									fontSize: "0.75rem",
									"&:hover": {
										bgcolor: "#0a3761",
										transform: "translateY(-2px)",
										boxShadow: "0 6px 20px rgba(23, 74, 124, 0.4)",
									},
								}}
								startIcon={<LocalHospitalIcon />}
								onClick={handleAddDoctorClick}>
								Add New Doctor
							</Button>
						)}
						<Button
							variant='contained'
							sx={{
								bgcolor: "#174a7c",
								minWidth: "150px",
								px: 2,
								py: 1,
								borderRadius: 2,
								boxShadow: "0 4px 12px rgba(23, 74, 124, 0.3)",
								transition: "all 0.3s ease",
								fontSize: "0.75rem",
								"&:hover": {
									bgcolor: "#0a3761",
									transform: "translateY(-2px)",
									boxShadow: "0 6px 20px rgba(23, 74, 124, 0.4)",
								},
							}}
							startIcon={<PersonAddIcon />}
							onClick={handleAddClick}>
							Add New User
						</Button>
					</Grid>
				</Grid>

				{/* Table Container */}
				<Box
					sx={{
						bgcolor: "white",
						borderRadius: 3,
						boxShadow: "0 8px 32px rgba(23, 74, 124, 0.1)",
						border: "1px solid rgba(23, 74, 124, 0.08)",
						overflow: "hidden",
					}}>
					<TableContainer component={Paper} className={styles.tableWrapper}>
						<Table size='small'>
							<TableHead>
								<TableRow>
									{colHeaders.map((header) => (
										<TableCell key={header.id}>{header.label}</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell colSpan={6} align='center'>
											Loading...
										</TableCell>
									</TableRow>
								) : paginatedRows.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} align='center'>
											No users found
										</TableCell>
									</TableRow>
								) : (
									paginatedRows.map((row, index) => (
										<TableRow key={index}>
											<TableCell>
												<img
													src={row.image}
													alt='User'
													style={{ width: 50, height: 50 }}
												/>
											</TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell>{row.phone}</TableCell>
											<TableCell>{row.email}</TableCell>
											<TableCell>{row.status}</TableCell>
											<TableCell>{row.editAction}</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
						<TablePagination
							rowsPerPageOptions={[5, 10]}
							component='div'
							count={filteredRows.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableContainer>
				</Box>

				{/* Assign User Privilege Modal */}
				{privilegeModalOpen && privilegeUser && (
					<AssignUserPrivilegeModal
						open={privilegeModalOpen}
						onClose={() => setPrivilegeModalOpen(false)}
						user={privilegeUser}
						onSubmit={handleAssignSubmit}
					/>
				)}

				{/* Doctor Edit Modal */}
				{editDoctorModalOpen && editDoctorData && (
					<DoctorDetailsModal
						open={editDoctorModalOpen}
						onClose={() => setEditDoctorModalOpen(false)}
						mode='full'
						type='edit'
						initialData={editDoctorData}
						councilList={councilList}
						onSubmit={handleEditSubmit}
					/>
				)}

				{/* Doctor Modals */}
				<DoctorDetailsModal
					open={detailsOpen}
					onClose={() => {
						setDetailsOpen(false);
						// Clear pending doctor data when closing
						setPendingDoctor(null);
					}}
					councilList={councilList}
					initialData={pendingDoctor || doctorUserDetails || undefined}
					onSubmit={handleEditSubmit}
					onProceed={(doctorData, registrationResponse) => {
						// Merge doctor details from API with form data
						const mergedData = {
							orgUserId: doctorUserDetails?.orgUserId || 0,
							activeInd: doctorUserDetails?.activeInd || 1,
							isDoctor: 1,
							councilId:
								doctorData.councilId || doctorUserDetails?.councilId || "",
							yearOfReg:
								parseInt(doctorData.yearOfReg, 10) ||
								doctorUserDetails?.yearOfReg ||
								0,
							regNo:
								doctorData.regNo || doctorUserDetails?.registrationNumber || "",
							registrationNumber:
								doctorData.regNo || doctorUserDetails?.registrationNumber || "",
							// Add userUid if doctor exists in platform (from registrationdetails API)
							userUid: registrationResponse?.userUid || undefined,
							// Prefill all fields from doctor details or registration response
							firstName:
								registrationResponse?.firstName ||
								doctorUserDetails?.firstName ||
								"",
							lastName:
								registrationResponse?.lastName ||
								doctorUserDetails?.lastName ||
								"",
							email:
								registrationResponse?.email || doctorUserDetails?.email || "",
							cellNumber:
								registrationResponse?.cellNumber ||
								doctorUserDetails?.cellNumber ||
								"",
							addressLine1: doctorUserDetails?.addressLine1 || "",
							addressLine2: doctorUserDetails?.addressLine2 || "",
							city: doctorUserDetails?.city || "",
							areaName: doctorUserDetails?.areaName || "",
							state: doctorUserDetails?.state || "",
							country: doctorUserDetails?.country || "",
							pin: doctorUserDetails?.pin || "",
							userTitle: doctorUserDetails?.userTitle || "Dr.",
							userName:
								registrationResponse?.userName ||
								doctorUserDetails?.userName ||
								"",
							orgUserQlfn:
								registrationResponse?.orgUserQlfn ||
								doctorUserDetails?.orgUserQlfn ||
								"",
							glbSpltyId:
								registrationResponse?.gblSpltyId ||
								doctorUserDetails?.glbSpltyId ||
								"",
							profileDetails: doctorUserDetails?.profileDetails || "",
							cityId: doctorUserDetails?.cityId || "",
							cityMappingId:
								(doctorUserDetails as any)?.cityPincodeMappingId ||
								doctorUserDetails?.cityMappingId ||
								"",
							imageFilePath: doctorUserDetails?.imageFilePath || undefined,
						};
						setPendingDoctor(mergedData);
						setShowConfirmDialog(true);
						setDetailsOpen(false);
					}}
				/>
				<DoctorSelfConfirmModal
					open={selfConfirmOpen}
					onYes={() => {
						// User confirmed they are a doctor themselves
						localStorage.setItem("adminIsADoctorConf", "Yes");
						setSelfConfirmOpen(false);
					}}
					onNo={() => {
						// User is NOT adding themselves as a doctor
						localStorage.setItem("adminIsADoctorConf", "No");
						setSelfConfirmOpen(false);
					}}
				/>
				<Dialog
					open={showConfirmDialog}
					onClose={() => {
						setShowConfirmDialog(false);
						// If user closes without choosing, reopen the initial modal so they can change
						setDetailsOpen(true);
					}}>
					<DialogTitle
						sx={{ bgcolor: "#174a7c", color: "white", fontWeight: "bold" }}>
						Doctor Details
					</DialogTitle>
					<DialogContent sx={{ minWidth: 400, textAlign: "center", py: 4 }}>
						<div>
							Hi! Your entered medical details are not found in our database. Do
							you want to change or proceed with it?
						</div>
					</DialogContent>
					<DialogActions sx={{ justifyContent: "center", pb: 3 }}>
						<Button
							variant='contained'
							sx={{ bgcolor: "#174a7c", mr: 2 }}
							onClick={() => {
								// Close confirmation dialog and reopen the initial Doctor Details modal
								// Keep the pendingDoctor data so user can edit the values they entered
								setShowConfirmDialog(false);
								setDetailsOpen(true); // Reopen the initial modal with council/year/regNo fields
							}}>
							Yes, Change
						</Button>
						<Button
							variant='contained'
							sx={{ bgcolor: "#174a7c" }}
							onClick={() => {
								setShowConfirmDialog(false);
								// Only prefill medical council, year of registration, registration number, and title
								// All other fields should be empty
								const fullData: User | null = pendingDoctor
									? {
											// Required fields
											orgUserId: pendingDoctor.orgUserId || 0,
											activeInd: pendingDoctor.activeInd || 1,
											isDoctor: 1,
											// Prefilled fields
											councilId: pendingDoctor.councilId || "",
											yearOfReg: pendingDoctor.yearOfReg || 0,
											regNo:
												pendingDoctor.regNo ||
												pendingDoctor.registrationNumber ||
												"",
											registrationNumber:
												pendingDoctor.registrationNumber ||
												pendingDoctor.regNo ||
												"",
											userTitle: pendingDoctor.userTitle || "Dr.",
											// All other fields should be empty/default
											firstName: "",
											lastName: "",
											email: "",
											cellNumber: "",
											addressLine1: "",
											addressLine2: "",
											city: "",
											areaName: "",
											state: "",
											country: "",
											pin: "",
											userName: "",
											orgUserQlfn: "",
											glbSpltyId: "",
											profileDetails: "",
											cityId: "",
											cityMappingId: "",
											imageFilePath: undefined,
										}
									: null;
								setFullDoctorData(fullData);
								setShowFullDoctorForm(true);
							}}>
							Proceed anyway
						</Button>
					</DialogActions>
				</Dialog>
				{showFullDoctorForm && fullDoctorData && (
					<DoctorDetailsModal
						open={showFullDoctorForm}
						onClose={() => {
							setShowFullDoctorForm(false);
							// Clear pending doctor data when closing
							setPendingDoctor(null);
							setFullDoctorData(null);
						}}
						mode='full'
						initialData={fullDoctorData}
						councilList={councilList}
						onSubmit={handleEditSubmit}
					/>
				)}

				{/* User Add/Edit Dialog */}
				<Dialog open={openDialog} onClose={handleClose} maxWidth='md' fullWidth>
					<DialogTitle>{getDialogTitle()}</DialogTitle>
					<DialogContent>{renderDialogContent()}</DialogContent>
				</Dialog>
				<Message
					openSnackbar={openSnackbar}
					handleCloseSnackbar={handleCloseSnackbar}
					snackbarSeverity={snackbarSeverity}
					snackbarMessage={snackbarMessage}
				/>
			</AuthenticatedLayout>
		</PrivateRoute>
	);
};

export default ManageUsersPage;
