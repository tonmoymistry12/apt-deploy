import React, { useState, useEffect, useCallback } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import AddRecordsDialog from "@/components/AddRecords/AddRecordsDialog";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
	getPetOwnerList,
	getPetList,
	getUploadedDocuments,
	PetOwnerResponse,
	PetResponse,
	UploadedDocument,
	removeDocument,
	shareWithDoc,
} from "@/services/manageCalendar";
import { getDoctorList, DoctorListItem } from "@/services/userService";

const recordTypes = [
	{ label: "All Records" },
	{ label: "Pathology" },
	{ label: "Prescription" },
	{ label: "Radiology" },
	{ label: "Referrals" },
];

const documentTypes = [
	{ label: "Image", value: "image" },
	{ label: "Documents", value: "documents" },
	{ label: "Audio", value: "audio" },
	{ label: "Video", value: "video" },
];

const uploadTimes = [
	"Recent",
	"Last Visit",
	"Today",
	"Yesterday",
	"Last Week",
	"Last Month",
	"Year",
	"Others",
];
const fileTypes = [
	"JPG",
	"PNG",
	"DOCX",
	"PDF",
	"PPT",
	"MP3",
	"MP4",
	"MOV",
	"XYZ",
	"TXT",
	"SVG",
	"TIFF",
];
const docTypes = [
	"PATHOLOGY",
	"XRAY",
	"RADIOLOGY",
	"PRESCRIPTION",
	"REFERRALS",
	"OTHERS",
];
const uploadedBy = ["MY VET", "PET (ME)"];

function PillButton({
	selected,
	onClick,
	children,
}: {
	selected: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<Button
			variant={selected ? "contained" : "outlined"}
			onClick={onClick}
			sx={{
				borderRadius: 4,
				minWidth: 90,
				m: 0.5,
				bgcolor: selected ? "#e0e0e0" : undefined,
				color: "#222",
				fontWeight: 600,
				boxShadow: "none",
				borderColor: "#bbb",
				"&.Mui-selected, &.MuiButton-contained": {
					bgcolor: "#bbb",
					color: "#222",
				},
			}}>
			{children}
		</Button>
	);
}

const FilterDialog = ({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) => {
	const [selectedUploadTimes, setSelectedUploadTimes] = useState<string[]>([]);
	const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
	const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);
	const [selectedUploadedBy, setSelectedUploadedBy] = useState<string[]>([]);

	const toggle = (
		arr: string[],
		setArr: React.Dispatch<React.SetStateAction<string[]>>,
		value: string,
	) => {
		setArr(
			arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
		);
	};
	const resetAll = () => {
		setSelectedUploadTimes([]);
		setSelectedFileTypes([]);
		setSelectedDocTypes([]);
		setSelectedUploadedBy([]);
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
			<Box
				sx={{
					bgcolor: "#fff",
					borderRadius: 2,
					minHeight: 500,
					position: "relative",
				}}>
				{/* Sticky Header */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						p: 2,
						borderBottom: "1px solid #eee",
						position: "sticky",
						top: 0,
						bgcolor: "#fff",
						zIndex: 2,
					}}>
					<IconButton onClick={onClose}>
						<ArrowBackIcon />
					</IconButton>
					<Typography variant='h6' sx={{ flex: 1, fontWeight: 700, ml: 1 }}>
						Filter
					</Typography>
					<Button
						onClick={resetAll}
						sx={{ color: "#555", textTransform: "none", fontWeight: 600 }}>
						Reset
					</Button>
					<Button
						variant='contained'
						sx={{
							bgcolor: "#174a7c",
							color: "#fff",
							borderRadius: 2,
							ml: 2,
							px: 3,
							fontWeight: 700,
							textTransform: "none",
							boxShadow: "none",
							"&:hover": { bgcolor: "#103a61" },
						}}
						onClick={onClose}>
						Save
					</Button>
				</Box>
				{/* Content */}
				<Box sx={{ p: 3, pt: 2 }}>
					{/* Upload Time */}
					<Typography fontWeight={700} sx={{ mb: 1 }}>
						Upload Time
					</Typography>
					<Grid container spacing={1} sx={{ mb: 2 }}>
						{uploadTimes.map((opt) => (
							<Grid item xs={6} sm={4} key={opt}>
								<Chip
									label={opt}
									clickable
									color={
										selectedUploadTimes.includes(opt) ? "primary" : "default"
									}
									onClick={() =>
										toggle(selectedUploadTimes, setSelectedUploadTimes, opt)
									}
									sx={{ width: "100%", fontWeight: 600, borderRadius: 2 }}
								/>
							</Grid>
						))}
					</Grid>
					<Divider sx={{ my: 2 }} />
					{/* Type Of File */}
					<Typography fontWeight={700} sx={{ mb: 1 }}>
						Type Of File
					</Typography>
					<Grid container spacing={1} sx={{ mb: 2 }}>
						{fileTypes.map((opt) => (
							<Grid item xs={4} sm={3} key={opt}>
								<Chip
									label={opt}
									clickable
									color={
										selectedFileTypes.includes(opt) ? "primary" : "default"
									}
									onClick={() =>
										toggle(selectedFileTypes, setSelectedFileTypes, opt)
									}
									sx={{ width: "100%", fontWeight: 600, borderRadius: 2 }}
								/>
							</Grid>
						))}
					</Grid>
					<Divider sx={{ my: 2 }} />
					{/* Type Of Documents */}
					<Typography fontWeight={700} sx={{ mb: 1 }}>
						Type Of Documents
					</Typography>
					<Grid container spacing={1} sx={{ mb: 2 }}>
						{docTypes.map((opt) => (
							<Grid item xs={6} sm={4} key={opt}>
								<Chip
									label={opt}
									clickable
									color={selectedDocTypes.includes(opt) ? "primary" : "default"}
									onClick={() =>
										toggle(selectedDocTypes, setSelectedDocTypes, opt)
									}
									sx={{ width: "100%", fontWeight: 600, borderRadius: 2 }}
								/>
							</Grid>
						))}
					</Grid>
					<Divider sx={{ my: 2 }} />
					{/* Uploaded By */}
					<Typography fontWeight={700} sx={{ mb: 1 }}>
						Uploaded By
					</Typography>
					<Grid container spacing={1} sx={{ mb: 2 }}>
						{uploadedBy.map((opt) => (
							<Grid item xs={6} key={opt}>
								<Chip
									label={opt}
									clickable
									color={
										selectedUploadedBy.includes(opt) ? "primary" : "default"
									}
									onClick={() =>
										toggle(selectedUploadedBy, setSelectedUploadedBy, opt)
									}
									sx={{ width: "100%", fontWeight: 600, borderRadius: 2 }}
								/>
							</Grid>
						))}
					</Grid>
				</Box>
			</Box>
		</Dialog>
	);
};

// ShareDialog component
function ShareDialog({
	open,
	onClose,
	fileName,
	petName,
	documentId,
}: {
	open: boolean;
	onClose: () => void;
	fileName: string;
	petName: string;
	documentId: string;
}) {
	const [searchName, setSearchName] = React.useState("");
	const [searchMobile, setSearchMobile] = React.useState("");
	const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
	const [isSharing, setIsSharing] = React.useState(false);
	const [doctors, setDoctors] = React.useState<DoctorListItem[]>([]);
	const [loadingDoctors, setLoadingDoctors] = React.useState(false);
	const [snackbar, setSnackbar] = React.useState<{
		open: boolean;
		message: string;
		severity: "success" | "error";
	}>({
		open: false,
		message: "",
		severity: "success",
	});

	// Fetch doctors when modal opens
	React.useEffect(() => {
		if (open) {
			const fetchDoctors = async () => {
				setLoadingDoctors(true);
				try {
					const payload = {
						callingFrom: "app",
						userName: localStorage.getItem("userName") || "",
						userPass: localStorage.getItem("userPwd") || "",
						deviceStat: "M",
						orgId: localStorage.getItem("orgId") || "2",
					};
					const response = await getDoctorList(payload);
					setDoctors(response);
				} catch (error) {
					console.error("Error fetching doctors:", error);
				} finally {
					setLoadingDoctors(false);
				}
			};
			fetchDoctors();
		}
	}, [open]);
	const handleUserToggle = (userId: string) => {
		setSelectedUsers(
			selectedUsers.includes(userId)
				? selectedUsers.filter((u) => u !== userId)
				: [...selectedUsers, userId],
		);
	};
	const handleShareDocuments = async () => {
		if (selectedUsers.length === 0) {
			setSnackbar({
				open: true,
				message: "Please select at least one doctor to share with",
				severity: "error",
			});
			return;
		}

		setIsSharing(true);
		try {
			const payload = {
				userName: localStorage.getItem("userName") || "",
				password: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				sharefileId: documentId,
				docList: selectedUsers,
			};

			console.log("Sharing document with payload:", payload);
			const response = await shareWithDoc(payload);

			if (response.status === "Success") {
				setSnackbar({
					open: true,
					message: response.message || "Your records have been shared",
					severity: "success",
				});
				// Reset selection and close after a short delay
				setTimeout(() => {
					setSelectedUsers([]);
					onClose();
				}, 1500);
			} else {
				setSnackbar({
					open: true,
					message: response.message || "Failed to share document",
					severity: "error",
				});
			}
		} catch (error) {
			console.error("Error sharing document:", error);
			setSnackbar({
				open: true,
				message: "Error sharing document. Please try again.",
				severity: "error",
			});
		} finally {
			setIsSharing(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='md'
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 3,
					boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
					maxHeight: "90vh",
					overflow: "hidden",
				},
			}}>
			{/* Header */}
			<Box
				sx={{
					bgcolor: "#174a7c",
					p: 3,
					borderTopLeftRadius: 12,
					borderTopRightRadius: 12,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}>
				<Box>
					<Typography
						variant='h5'
						fontWeight={700}
						sx={{ color: "#fff", mb: 0.5 }}>
						{fileName}
					</Typography>
					<Typography
						sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem" }}>
						Pet: {petName}
					</Typography>
				</Box>
				<IconButton
					onClick={onClose}
					sx={{
						color: "#fff",
						bgcolor: "rgba(255,255,255,0.1)",
						"&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
					}}>
					<ArrowBackIcon />
				</IconButton>
			</Box>

			{/* Share Form */}
			<Box sx={{ display: "flex", flexDirection: "column", height: "75vh" }}>
				{/* Search Section */}
				<Box
					sx={{ p: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "#f8f9fa" }}>
					<Typography
						variant='subtitle2'
						fontWeight={600}
						sx={{ mb: 1, color: "#2c3e50", fontSize: "0.9rem" }}>
						Search Recipients
					</Typography>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
							gap: 1.5,
							mb: 1.5,
						}}>
						<TextField
							label='Search by Name'
							value={searchName}
							onChange={(e) => setSearchName(e.target.value)}
							placeholder='Enter recipient name'
							size='small'
							sx={{
								"& .MuiOutlinedInput-root": {
									bgcolor: "white",
									borderRadius: 1,
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
							}}
							fullWidth
						/>
						<TextField
							label='Search by Mobile Number'
							value={searchMobile}
							onChange={(e) => setSearchMobile(e.target.value)}
							placeholder='Enter mobile number'
							size='small'
							sx={{
								"& .MuiOutlinedInput-root": {
									bgcolor: "white",
									borderRadius: 1,
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
							}}
							fullWidth
						/>
					</Box>
					<Button
						variant='contained'
						size='small'
						sx={{
							bgcolor: "#174a7c",
							color: "#fff",
							fontWeight: 600,
							fontSize: "0.85rem",
							borderRadius: 1,
							px: 2.5,
							py: 0.8,
							"&:hover": {
								bgcolor: "#103a61",
								boxShadow: "0 4px 12px rgba(23, 74, 124, 0.3)",
							},
						}}>
						Search Recipients
					</Button>
				</Box>

				{/* Recipients List */}
				<Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
					<Typography
						variant='subtitle2'
						fontWeight={600}
						sx={{ mb: 1, color: "#2c3e50", fontSize: "0.9rem" }}>
						Select Recipients ({selectedUsers.length} selected)
					</Typography>
					{loadingDoctors ? (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								py: 4,
							}}>
							<CircularProgress sx={{ color: "#174a7c" }} />
						</Box>
					) : (
						<TableContainer
							sx={{
								border: "1px solid #e0e0e0",
								borderRadius: 1,
								bgcolor: "white",
								boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
							}}>
							<Table size='small'>
								<TableHead sx={{ bgcolor: "#f7f9fc" }}>
									<TableRow>
										<TableCell
											sx={{
												fontWeight: 600,
												color: "#2c3e50",
												fontSize: "0.85rem",
												py: 1,
											}}>
											Name
										</TableCell>
										<TableCell
											sx={{
												fontWeight: 600,
												color: "#2c3e50",
												fontSize: "0.85rem",
												py: 1,
											}}>
											Specialty
										</TableCell>
										<TableCell
											align='center'
											sx={{
												fontWeight: 600,
												color: "#2c3e50",
												fontSize: "0.85rem",
												py: 1,
											}}>
											Select
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{doctors
										.filter((doctor) => {
											const nameMatch =
												!searchName ||
												doctor.userName
													?.toLowerCase()
													.includes(searchName.toLowerCase());
											const mobileMatch =
												!searchMobile ||
												doctor.cellNumber?.includes(searchMobile);
											return nameMatch && mobileMatch;
										})
										.map((doctor) => (
											<TableRow
												key={doctor.userUid}
												sx={{
													"&:hover": { bgcolor: "rgba(23, 74, 124, 0.04)" },
													"&:last-child td": { borderBottom: 0 },
												}}>
												<TableCell
													sx={{
														fontWeight: 500,
														color: "#2c3e50",
														fontSize: "0.85rem",
														py: 0.5,
													}}>
													{doctor.userName}
												</TableCell>
												<TableCell
													sx={{ color: "#666", fontSize: "0.8rem", py: 0.5 }}>
													{doctor.specialty}
												</TableCell>
												<TableCell align='center' sx={{ py: 0.5 }}>
													<Checkbox
														checked={selectedUsers.includes(
															doctor.userUid.toString(),
														)}
														onChange={() =>
															handleUserToggle(doctor.userUid.toString())
														}
														size='small'
														sx={{
															color: "#174a7c",
															"&.Mui-checked": {
																color: "#174a7c",
															},
														}}
													/>
												</TableCell>
											</TableRow>
										))}
									{doctors.length === 0 && !loadingDoctors && (
										<TableRow>
											<TableCell
												colSpan={3}
												align='center'
												sx={{ py: 3, color: "#999" }}>
												No doctors found
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Box>

				{/* Action Buttons */}
				<Box
					sx={{
						p: 4,
						borderTop: "1px solid #e0e0e0",
						bgcolor: "#f8f9fa",
						display: "flex",
						gap: 2,
						justifyContent: "flex-end",
					}}>
					<Button
						variant='outlined'
						onClick={onClose}
						sx={{
							borderColor: "#dde2e7",
							color: "#666",
							fontWeight: 600,
							px: 4,
							py: 1.2,
							borderRadius: 2,
							"&:hover": {
								borderColor: "#999",
								bgcolor: "#f5f5f5",
							},
						}}>
						Cancel
					</Button>
					<Button
						variant='contained'
						disabled={selectedUsers.length === 0 || isSharing}
						startIcon={
							isSharing ? <CircularProgress size={16} color='inherit' /> : null
						}
						sx={{
							bgcolor: "#174a7c",
							color: "#fff",
							fontWeight: 600,
							fontSize: "1rem",
							borderRadius: 2,
							px: 4,
							py: 1.2,
							minWidth: 160,
							boxShadow: "none",
							"&:hover": {
								bgcolor: "#103a61",
								boxShadow: "0 4px 12px rgba(23, 74, 124, 0.3)",
							},
							"&:disabled": {
								bgcolor: "#bdc3c7",
								color: "#7f8c8d",
								boxShadow: "none",
							},
						}}
						onClick={handleShareDocuments}>
						{isSharing
							? "Sharing..."
							: `Share Document${selectedUsers.length > 1 ? "s" : ""}`}
					</Button>
				</Box>
			</Box>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Dialog>
	);
}

const RecordsPage: React.FC = () => {
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openFilterDialog, setOpenFilterDialog] = useState(false);
	const [documentType, setDocumentType] = useState(documentTypes[0].value);
	const [selectedCategory, setSelectedCategory] = useState(
		recordTypes[0].label,
	);
	const [openShareDialog, setOpenShareDialog] = useState(false);
	const [shareDocument, setShareDocument] = useState<UploadedDocument | null>(
		null,
	);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Pet Owner and Pet states
	const [petOwners, setPetOwners] = useState<PetOwnerResponse[]>([]);
	const [selectedPetOwner, setSelectedPetOwner] = useState<number | null>(null);
	const [pets, setPets] = useState<PetResponse[]>([]);
	const [selectedPet, setSelectedPet] = useState<PetResponse | null>(null);
	const [loadingPetOwners, setLoadingPetOwners] = useState(false);
	const [loadingPets, setLoadingPets] = useState(false);

	// Documents state
	const [documents, setDocuments] = useState<UploadedDocument[]>([]);
	const [loadingDocuments, setLoadingDocuments] = useState(false);
	const [filteredDocuments, setFilteredDocuments] = useState<
		UploadedDocument[]
	>([]);

	// Snackbar state
	const [snackbar, setSnackbar] = useState<{
		open: boolean;
		message: string;
		severity: "success" | "error";
	}>({
		open: false,
		message: "",
		severity: "success",
	});

	// Fetch pet owners on component mount
	useEffect(() => {
		const fetchPetOwners = async () => {
			setLoadingPetOwners(true);
			try {
				const payload = {
					callingFrom: "app",
					userName: localStorage.getItem("userName") || "",
					userPwd: localStorage.getItem("userPwd") || "",
					deviceStat: "M",
					orgId: parseInt(localStorage.getItem("orgId") || "2"),
				};
				const response = await getPetOwnerList(payload);
				setPetOwners(response);
			} catch (error) {
				console.error("Error fetching pet owners:", error);
			} finally {
				setLoadingPetOwners(false);
			}
		};

		fetchPetOwners();
	}, []);

	// Fetch pets when pet owner is selected
	useEffect(() => {
		if (selectedPetOwner) {
			const fetchPets = async () => {
				setLoadingPets(true);
				try {
					const payload = {
						callingFrom: "app",
						userName: localStorage.getItem("userName") || "",
						userPwd: localStorage.getItem("userPwd") || "",
						deviceStat: "M",
						orgId: parseInt(localStorage.getItem("orgId") || "2"),
						petOwnerUid: selectedPetOwner,
					};
					const response = await getPetList(payload);
					setPets(response);
				} catch (error) {
					console.error("Error fetching pets:", error);
				} finally {
					setLoadingPets(false);
				}
			};

			fetchPets();
		} else {
			setPets([]);
			setSelectedPet(null);
		}
	}, [selectedPetOwner]);

	// Function to fetch documents
	const fetchDocuments = useCallback(async () => {
		if (!selectedPet) {
			setDocuments([]);
			return;
		}

		setLoadingDocuments(true);
		try {
			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				patientUid: selectedPet.patientUid.toString(),
			};
			const response = await getUploadedDocuments(payload);

			// Handle different response formats
			if (Array.isArray(response)) {
				setDocuments(response);
			} else if (response && response.status === "notfound") {
				// Handle "notfound" status response
				console.log("No documents found:", response.message);
				setDocuments([]);
			} else {
				// Fallback for unexpected response format
				console.log("Unexpected response format:", response);
				setDocuments([]);
			}
		} catch (error) {
			console.error("Error fetching documents:", error);
			setDocuments([]);
		} finally {
			setLoadingDocuments(false);
		}
	}, [selectedPet]);

	// Fetch documents when pet is selected
	useEffect(() => {
		fetchDocuments();
	}, [fetchDocuments]);

	// Filter documents based on selected category
	useEffect(() => {
		if (documents.length === 0) {
			setFilteredDocuments([]);
			return;
		}

		if (selectedCategory === "All Records") {
			// Show all documents
			setFilteredDocuments(documents);
		} else if (selectedCategory === "Pathology") {
			const filtered = documents.filter(
				(doc) =>
					doc.documentType.toLowerCase().includes("pathology") ||
					doc.documentType.toLowerCase().includes("patho"),
			);
			setFilteredDocuments(filtered);
		} else if (selectedCategory === "Prescription") {
			const filtered = documents.filter(
				(doc) =>
					doc.documentType.toLowerCase().includes("prescription") ||
					doc.documentType.toLowerCase().includes("presc"),
			);
			setFilteredDocuments(filtered);
		} else if (selectedCategory === "Radiology") {
			const filtered = documents.filter(
				(doc) =>
					doc.documentType.toLowerCase().includes("radiology") ||
					doc.documentType.toLowerCase().includes("radio") ||
					doc.documentType.toLowerCase().includes("xray"),
			);
			setFilteredDocuments(filtered);
		} else if (selectedCategory === "Referrals") {
			const filtered = documents.filter(
				(doc) =>
					doc.documentType.toLowerCase().includes("referral") ||
					doc.documentType.toLowerCase().includes("refer"),
			);
			setFilteredDocuments(filtered);
		} else {
			// Show all documents for any other category
			setFilteredDocuments(documents);
		}
	}, [documents, selectedCategory]);

	const handlePetOwnerChange = (petOwnerUid: number) => {
		setSelectedPetOwner(petOwnerUid);
		setSelectedPet(null); // Reset pet selection when owner changes
	};

	const handlePetChange = (petName: string) => {
		const pet = pets.find((p) => p.petName === petName);
		setSelectedPet(pet || null);
	};

	const handleDeleteClick = (recordId: string) => {
		setRecordToDelete(recordId);
		setOpenDeleteDialog(true);
	};
	const handleConfirmDelete = async () => {
		if (!recordToDelete || !selectedPet) {
			setSnackbar({
				open: true,
				message: "Missing required information for deletion",
				severity: "error",
			});
			return;
		}

		setIsDeleting(true);
		try {
			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				documentId: recordToDelete,
				patientUid: selectedPet.patientUid.toString(),
			};

			console.log("Deleting document with payload:", payload);
			const response = await removeDocument(payload);

			if (response.status === "Success" || response.statusCode === "200") {
				setSnackbar({
					open: true,
					message: "Document removed successfully!",
					severity: "success",
				});
				// Refresh the documents list
				fetchDocuments();
			} else {
				setSnackbar({
					open: true,
					message: `Failed to remove document: ${response.message || "Unknown error"}`,
					severity: "error",
				});
			}
		} catch (error: any) {
			console.error("Error removing document:", error);
			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				"Error removing document. Please try again.";
			setSnackbar({
				open: true,
				message: errorMessage,
				severity: "error",
			});
		} finally {
			setIsDeleting(false);
			setOpenDeleteDialog(false);
			setRecordToDelete(null);
		}
	};
	const handleCancelDelete = () => {
		setOpenDeleteDialog(false);
		setRecordToDelete(null);
	};

	return (
		<PrivateRoute>
			<AuthenticatedLayout>
				<Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
					<Box sx={{ mb: 3, px: 2, textAlign: "center" }}>
						<Typography
							variant='h5'
							component='h1'
							sx={{ fontWeight: 700, color: "#2c3e50" }}>
							Records
						</Typography>
						<Typography variant='body1' sx={{ color: "#555", mt: 1 }}>
							Look at your records from doctors
						</Typography>
					</Box>

					<Paper
						elevation={0}
						sx={{ border: "1px solid #e0e0e0", borderRadius: "16px" }}>
						<Box sx={{ p: { xs: 2, sm: 3 } }}>
							{/* Top Action Buttons - Right Aligned */}
							<Box
								sx={{
									display: "flex",
									justifyContent: "flex-end",
									alignItems: "center",
									mb: 2,
									gap: 2,
								}}>
								{/* Filter Section */}
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Typography
										sx={{
											fontSize: "0.8rem",
											fontWeight: 500,
											color: "#555",
											whiteSpace: "nowrap",
										}}>
										Filter:
									</Typography>
									<IconButton
										sx={{
											bgcolor: "#f5f5f5",
											borderRadius: 2,
											width: 36,
											height: 36,
											"&:hover": {
												bgcolor: "#e0e0e0",
											},
										}}
										onClick={() => setOpenFilterDialog(true)}
										aria-label='Filter'>
										<FilterListIcon sx={{ fontSize: 18 }} />
									</IconButton>
								</Box>

								{/* Add Record Button */}
								<Button
									variant='contained'
									sx={{
										bgcolor: "#174a7c",
										color: "#fff",
										fontWeight: 600,
										fontSize: "0.8rem",
										borderRadius: 1.5,
										px: 2,
										py: 1,
										textTransform: "none",
										boxShadow: "none",
										minWidth: "fit-content",
										whiteSpace: "nowrap",
										"&:hover": {
											bgcolor: "#103a61",
											boxShadow: "0 2px 8px rgba(23, 74, 124, 0.3)",
										},
									}}
									onClick={() => setOpenAddDialog(true)}>
									Add New Record
								</Button>
							</Box>

							{/* Pet Selection - One Line */}
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 3,
									flexWrap: "wrap",
									p: 2,
									bgcolor: "#f8f9fa",
									borderRadius: 2,
									border: "1px solid #e0e0e0",
									mb: 3,
								}}>
								{/* Pet Owner Selection */}
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Typography
										variant='body2'
										sx={{
											fontWeight: 600,
											color: "#174a7c",
											minWidth: "fit-content",
											fontSize: "0.875rem",
										}}>
										Select Pet Owner:
									</Typography>
									<TextField
										select
										value={selectedPetOwner || ""}
										onChange={(e) =>
											handlePetOwnerChange(Number(e.target.value))
										}
										sx={{
											minWidth: 220,
											"& .MuiOutlinedInput-root": {
												bgcolor: "white",
												borderRadius: 2,
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
										}}
										size='small'
										disabled={loadingPetOwners}>
										{petOwners.map((owner) => (
											<MenuItem
												key={owner.petOwnerUid}
												value={owner.petOwnerUid}>
												{owner.firstName} {owner.lastName} ({owner.cellNumber})
											</MenuItem>
										))}
									</TextField>
									{loadingPetOwners && (
										<CircularProgress size={20} sx={{ color: "#174a7c" }} />
									)}
								</Box>

								{/* Pet Selection */}
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Typography
										variant='body2'
										sx={{
											fontWeight: 600,
											color: "#174a7c",
											minWidth: "fit-content",
											fontSize: "0.875rem",
										}}>
										Select Your Pet:
									</Typography>
									<TextField
										select
										value={selectedPet?.petName || ""}
										onChange={(e) => handlePetChange(e.target.value)}
										sx={{
											minWidth: 160,
											"& .MuiOutlinedInput-root": {
												bgcolor: "white",
												borderRadius: 2,
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
										}}
										size='small'
										disabled={!selectedPetOwner || loadingPets}>
										{pets.map((pet) => (
											<MenuItem key={pet.patientUid} value={pet.petName}>
												{pet.petName}
											</MenuItem>
										))}
									</TextField>
									{loadingPets && (
										<CircularProgress size={20} sx={{ color: "#174a7c" }} />
									)}
								</Box>
							</Box>
							<Divider sx={{ mb: 3 }} />
							{/* Document Type Dropdown */}
							<TextField
								select
								label='Document Type'
								value={documentType}
								onChange={(e) => setDocumentType(e.target.value)}
								sx={{ mb: 3, minWidth: 220 }}>
								{documentTypes.map((type) => (
									<MenuItem key={type.value} value={type.value}>
										{type.label}
									</MenuItem>
								))}
							</TextField>
							<Typography
								variant='subtitle1'
								sx={{ fontWeight: 600, mb: 2, color: "#34495e" }}>
								Category
							</Typography>
							<ToggleButtonGroup
								value={selectedCategory}
								exclusive
								onChange={(_, newValue) => {
									if (newValue !== null) setSelectedCategory(newValue);
								}}
								sx={{ mb: 4, display: "flex", gap: 2 }}
								fullWidth>
								{recordTypes.map((type) => {
									// Calculate count for each category
									const getCategoryCount = (category: string) => {
										if (documents.length === 0) return 0;

										switch (category) {
											case "All Records":
												return documents.length;
											case "Pathology":
												return documents.filter(
													(doc) =>
														doc.documentType
															.toLowerCase()
															.includes("pathology") ||
														doc.documentType.toLowerCase().includes("patho"),
												).length;
											case "Prescription":
												return documents.filter(
													(doc) =>
														doc.documentType
															.toLowerCase()
															.includes("prescription") ||
														doc.documentType.toLowerCase().includes("presc"),
												).length;
											case "Radiology":
												return documents.filter(
													(doc) =>
														doc.documentType
															.toLowerCase()
															.includes("radiology") ||
														doc.documentType.toLowerCase().includes("radio") ||
														doc.documentType.toLowerCase().includes("xray"),
												).length;
											case "Referrals":
												return documents.filter(
													(doc) =>
														doc.documentType
															.toLowerCase()
															.includes("referral") ||
														doc.documentType.toLowerCase().includes("refer"),
												).length;
											default:
												return documents.length;
										}
									};

									const count = getCategoryCount(type.label);

									return (
										<ToggleButton
											key={type.label}
											value={type.label}
											sx={{
												borderRadius: 1.5,
												fontWeight: 600,
												fontSize: "0.8rem",
												px: 1.5,
												py: 0.5,
												border: "1px solid #e0e0e0",
												color:
													selectedCategory === type.label ? "#fff" : "#174a7c",
												bgcolor:
													selectedCategory === type.label
														? "#174a7c"
														: "#f5f5f5",
												boxShadow:
													selectedCategory === type.label
														? "0 2px 8px 0 rgba(23,74,124,0.15)"
														: "none",
												outline:
													selectedCategory === type.label
														? "2px solid #174a7c"
														: "none",
												"&:hover": {
													bgcolor:
														selectedCategory === type.label
															? "#103a61"
															: "#e0e0e0",
												},
												transition: "all 0.2s",
												flex: 1,
												minWidth: 100,
												position: "relative",
											}}>
											<Box
												sx={{ display: "flex", alignItems: "center", gap: 1 }}>
												<span>{type.label}</span>
												{count > 0 && (
													<Box
														sx={{
															bgcolor:
																selectedCategory === type.label
																	? "rgba(255,255,255,0.2)"
																	: "#174a7c",
															color:
																selectedCategory === type.label
																	? "#fff"
																	: "#fff",
															borderRadius: "50%",
															minWidth: 16,
															height: 16,
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															fontSize: "0.7rem",
															fontWeight: 700,
														}}>
														{count}
													</Box>
												)}
											</Box>
										</ToggleButton>
									);
								})}
							</ToggleButtonGroup>
							<Typography
								variant='subtitle1'
								fontWeight={600}
								sx={{ mb: 2, color: "#34495e", fontSize: "1rem" }}>
								All Records
							</Typography>

							{/* Records List */}
							{loadingDocuments ? (
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										py: 4,
									}}>
									<CircularProgress size={40} sx={{ color: "#174a7c" }} />
									<Typography variant='body2' sx={{ ml: 2, color: "#666" }}>
										Loading records...
									</Typography>
								</Box>
							) : filteredDocuments.length === 0 ? (
								<Box
									sx={{
										textAlign: "center",
										py: 6,
										bgcolor: "#f8f9fa",
										borderRadius: 2,
										border: "1px solid #e0e0e0",
									}}>
									<Typography variant='h6' sx={{ color: "#666", mb: 1 }}>
										No Records Found
									</Typography>
									<Typography variant='body2' sx={{ color: "#999" }}>
										{selectedPet
											? selectedCategory === "All Records"
												? `No records found for ${selectedPet.petName}`
												: `No ${selectedCategory.toLowerCase()} records found for ${selectedPet.petName}`
											: "Please select a pet to view records"}
									</Typography>
								</Box>
							) : (
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										gap: 1.5,
										mb: 4,
									}}>
									{filteredDocuments.map((doc) => (
										<Paper
											key={doc.documentId}
											sx={{
												p: 1.5,
												border: "1px solid #e0e0e0",
												borderRadius: 1.5,
												display: "flex",
												alignItems: "center",
												gap: 2,
												transition: "all 0.2s ease",
												"&:hover": {
													boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
													borderColor: "#174a7c",
												},
											}}>
											<Typography
												sx={{
													minWidth: 160,
													fontWeight: 600,
													fontSize: "0.875rem",
													color: "#2c3e50",
												}}>
												{doc.documentName}
											</Typography>
											<Typography
												sx={{
													minWidth: 100,
													fontSize: "0.8rem",
													color: "#666",
												}}>
												{doc.documentDate}
											</Typography>
											<Typography
												sx={{
													minWidth: 120,
													fontSize: "0.8rem",
													color: "#666",
												}}>
												{doc.documentType}
											</Typography>
											<Typography
												sx={{
													minWidth: 80,
													fontSize: "0.8rem",
													color: "#666",
												}}>
												My Vet
											</Typography>
											<Box sx={{ flex: 1 }} />
											<IconButton
												aria-label='download'
												size='small'
												sx={{
													color: "#174a7c",
													mr: 0.5,
													"&:hover": {
														bgcolor: "rgba(23, 74, 124, 0.1)",
													},
												}}
												onClick={() => {
													if (doc.savedFileName) {
														const downloadUrl = `https://www.happyfurandfeather.com/provider/cuploaded/${encodeURIComponent(doc.savedFileName)}`;
														window.open(downloadUrl, "_blank");
													} else {
														console.error(
															"savedFileName not available for document:",
															doc.documentId,
														);
													}
												}}>
												<DownloadIcon sx={{ fontSize: "1rem" }} />
											</IconButton>
											<IconButton
												aria-label='share'
												size='small'
												sx={{
													color: "#174a7c",
													mr: 0.5,
													"&:hover": {
														bgcolor: "rgba(23, 74, 124, 0.1)",
													},
												}}
												onClick={() => {
													setShareDocument(doc);
													setOpenShareDialog(true);
												}}>
												<ShareOutlinedIcon sx={{ fontSize: "1rem" }} />
											</IconButton>
											<IconButton
												aria-label='delete'
												size='small'
												sx={{
													color: "#d32f2f",
													"&:hover": {
														bgcolor: "rgba(211, 47, 47, 0.1)",
													},
												}}
												onClick={() =>
													handleDeleteClick(doc.documentId.toString())
												}>
												<DeleteOutlineIcon sx={{ fontSize: "1rem" }} />
											</IconButton>
										</Paper>
									))}
								</Box>
							)}
						</Box>
					</Paper>
					<AddRecordsDialog
						open={openAddDialog}
						onClose={() => setOpenAddDialog(false)}
						selectedPet={selectedPet}
						onUploadSuccess={fetchDocuments}
					/>
					<FilterDialog
						open={openFilterDialog}
						onClose={() => setOpenFilterDialog(false)}
					/>
					<ShareDialog
						open={openShareDialog}
						onClose={() => {
							setOpenShareDialog(false);
							setShareDocument(null);
						}}
						fileName={shareDocument?.documentName || ""}
						petName={selectedPet?.petName || ""}
						documentId={shareDocument?.documentId?.toString() || ""}
					/>
					<Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
						<DialogTitle>
							Are you sure you want to delete this document?
						</DialogTitle>
						<DialogContent>
							<Typography variant='body2' color='text.secondary'>
								This action cannot be undone. The document will be permanently
								removed.
							</Typography>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={handleCancelDelete}
								color='primary'
								disabled={isDeleting}>
								Cancel
							</Button>
							<Button
								onClick={handleConfirmDelete}
								color='error'
								variant='contained'
								disabled={isDeleting}
								startIcon={
									isDeleting ? (
										<CircularProgress size={16} color='inherit' />
									) : null
								}>
								{isDeleting ? "Deleting..." : "Delete"}
							</Button>
						</DialogActions>
					</Dialog>

					{/* Snackbar for notifications */}
					<Snackbar
						open={snackbar.open}
						autoHideDuration={6000}
						onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
						anchorOrigin={{ vertical: "top", horizontal: "center" }}>
						<Alert
							onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
							severity={snackbar.severity}
							sx={{ width: "100%" }}>
							{snackbar.message}
						</Alert>
					</Snackbar>
				</Box>
			</AuthenticatedLayout>
		</PrivateRoute>
	);
};

export default RecordsPage;
