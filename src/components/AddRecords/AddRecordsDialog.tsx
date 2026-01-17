import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
	getDocumentTypeList,
	DocumentTypeResponse,
	uploadDocument,
} from "@/services/manageCalendar";

interface AddRecordsDialogProps {
	open: boolean;
	onClose: () => void;
	selectedPet?: {
		petName: string;
		patientUid: number;
		mrn: number;
	} | null;
	onUploadSuccess?: () => void;
}

const documentTypes = [
	{ label: "Image", value: "image" },
	{ label: "Documents", value: "documents" },
	{ label: "Audio", value: "audio" },
	{ label: "Video", value: "video" },
];

const PRIMARY_COLOR = "#174a7c";

const AddRecordsDialog: React.FC<AddRecordsDialogProps> = ({
	open,
	onClose,
	selectedPet,
	onUploadSuccess,
}) => {
	const [documentType, setDocumentType] = useState("");
	const [recordType, setRecordType] = useState("");
	const [docName, setDocName] = useState("");
	const [docDate, setDocDate] = useState<Dayjs | null>(dayjs());
	const [pet, setPet] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [documentTypes, setDocumentTypes] = useState<DocumentTypeResponse[]>(
		[]
	);
	const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [snackbar, setSnackbar] = useState<{
		open: boolean;
		message: string;
		severity: "success" | "error" | "warning" | "info";
	}>({ open: false, message: "", severity: "success" });

	// Fetch document types when dialog opens
	useEffect(() => {
		if (open) {
			fetchDocumentTypes();
		}
	}, [open]);

	const fetchDocumentTypes = async () => {
		setLoadingDocumentTypes(true);
		try {
			const userName = localStorage.getItem("userName");
			const userPass = localStorage.getItem("userPwd");

			if (!userName || !userPass) {
				console.error("Username or password not found in localStorage");
				setDocumentTypes([]);
				return;
			}

			const payload = {
				userName,
				userPass,
				deviceStat: "M",
			};
			const response = await getDocumentTypeList(payload);
			setDocumentTypes(response);
		} catch (error) {
			console.error("Error fetching document types:", error);
			setDocumentTypes([]);
		} finally {
			setLoadingDocumentTypes(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleConfirm = async () => {
		// Validate required fields
		if (!recordType || !docName || !docDate || !file || !selectedPet) {
			setSnackbar({
				open: true,
				message: "Please fill in all required fields and select a file",
				severity: "warning",
			});
			return;
		}

		const userName = localStorage.getItem("userName");
		const userPass = localStorage.getItem("userPwd");

		if (!userName || !userPass) {
			setSnackbar({
				open: true,
				message: "User credentials not found. Please login again.",
				severity: "error",
			});
			return;
		}

		setIsUploading(true);
		try {
			// Format date to DD/MM/YYYY
			const formattedDate = docDate.format("DD/MM/YYYY");

			// Get the selected document type
			const selectedDocType = documentTypes.find(
				(type) => type.docTypeId.toString() === recordType
			);

			const payload = {
				userName,
				userPass,
				deviceStat: "M",
				docname: docName,
				docdate: formattedDate,
				select_doctype_list: recordType, // docTypeId as string
				patientUid: selectedPet.patientUid.toString(),
				loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
				orgId: localStorage.getItem("orgId") || "",
				doctorUId: localStorage.getItem("doctorUid") || "",
				appointmentId: "0", // Default to "0" as per requirement
				uploaded_file: file,
			};

			console.log("Uploading document with payload:", {
				...payload,
				uploaded_file: file.name, // Log file name instead of File object
			});

			const response = await uploadDocument(payload);

			// Check HTTP status code
			if (response.status === 200) {
				setSnackbar({
					open: true,
					message: "Document uploaded successfully!",
					severity: "success",
				});
				// Reset form
				setRecordType("");
				setDocName("");
				setDocDate(dayjs());
				setFile(null);
				// Close modal and refresh list
				onClose();
				// Call callback to refresh documents list
				onUploadSuccess?.();
			} else {
				setSnackbar({
					open: true,
					message: `Failed to upload document: ${
						response.data?.message || "Unknown error"
					}`,
					severity: "error",
				});
			}
		} catch (error: any) {
			console.error("Error uploading document:", error);
			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				"Error uploading document. Please try again.";
			setSnackbar({
				open: true,
				message: errorMessage,
				severity: "error",
			});
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
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
						bgcolor: PRIMARY_COLOR,
						color: "white",
						p: 3,
						display: "flex",
						alignItems: "center",
						borderTopLeftRadius: "12px",
						borderTopRightRadius: "12px",
					}}>
					<AddCircleOutlineIcon sx={{ fontSize: 28, mr: 2 }} />
					<Typography variant='h5' fontWeight={700}>
						Add New Record
					</Typography>
				</Box>

				{/* Content */}
				<Box sx={{ p: 4, bgcolor: "#f8f9fa", minHeight: "400px" }}>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
							gap: 3,
							maxWidth: "800px",
							mx: "auto",
						}}>
						{/* Left Column */}
						<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
							{/* Document Type */}
							<TextField
								select
								label='Document Type'
								value={recordType}
								onChange={(e) => setRecordType(e.target.value)}
								disabled={loadingDocumentTypes}
								size='small'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<UploadFileIcon
												sx={{ color: PRIMARY_COLOR, fontSize: 20 }}
											/>
										</InputAdornment>
									),
									endAdornment: loadingDocumentTypes ? (
										<InputAdornment position='end'>
											<CircularProgress
												size={16}
												sx={{ color: PRIMARY_COLOR }}
											/>
										</InputAdornment>
									) : null,
								}}
								sx={{
									"& .MuiOutlinedInput-root": {
										bgcolor: "white",
										borderRadius: 2,
										"& fieldset": {
											borderColor: "#dde2e7",
										},
										"&:hover fieldset": {
											borderColor: PRIMARY_COLOR,
										},
										"&.Mui-focused fieldset": {
											borderColor: PRIMARY_COLOR,
										},
									},
								}}
								fullWidth>
								{documentTypes.map((type) => (
									<MenuItem key={type.docTypeId} value={type.docTypeId}>
										{type.docTypeDetailName}
									</MenuItem>
								))}
							</TextField>

							{/* Document Name */}
							<TextField
								label='Document Name'
								value={docName}
								onChange={(e) => setDocName(e.target.value)}
								size='small'
								placeholder='Enter document name'
								sx={{
									"& .MuiOutlinedInput-root": {
										bgcolor: "white",
										borderRadius: 2,
										"& fieldset": {
											borderColor: "#dde2e7",
										},
										"&:hover fieldset": {
											borderColor: PRIMARY_COLOR,
										},
										"&.Mui-focused fieldset": {
											borderColor: PRIMARY_COLOR,
										},
									},
								}}
								fullWidth
							/>

							{/* Document Date */}
							<DatePicker
								label='Document Date'
								value={docDate}
								onChange={setDocDate}
								slotProps={{
									textField: {
										fullWidth: true,
										size: "small",
										InputProps: {
											startAdornment: (
												<InputAdornment position='start'>
													<CalendarTodayIcon
														sx={{ color: PRIMARY_COLOR, fontSize: 20 }}
													/>
												</InputAdornment>
											),
										},
										sx: {
											"& .MuiOutlinedInput-root": {
												bgcolor: "white",
												borderRadius: 2,
												"& fieldset": {
													borderColor: "#dde2e7",
												},
												"&:hover fieldset": {
													borderColor: PRIMARY_COLOR,
												},
												"&.Mui-focused fieldset": {
													borderColor: PRIMARY_COLOR,
												},
											},
										},
									},
								}}
							/>
						</Box>

						{/* Right Column */}
						<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
							{/* Selected Pet */}
							<TextField
								select
								label='Selected Pet'
								value={selectedPet?.petName || ""}
								disabled={true}
								size='small'
								helperText={
									selectedPet
										? `Pet: ${selectedPet.petName}`
										: "No pet selected"
								}
								sx={{
									"& .MuiOutlinedInput-root": {
										bgcolor: "#f5f5f5",
										borderRadius: 2,
										"& fieldset": {
											borderColor: "#dde2e7",
										},
									},
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: PRIMARY_COLOR,
										fontWeight: 600,
									},
									"& .MuiFormLabel-root.Mui-disabled": {
										color: PRIMARY_COLOR,
									},
								}}
								fullWidth>
								{selectedPet && (
									<MenuItem value={selectedPet.petName}>
										{selectedPet.petName}
									</MenuItem>
								)}
							</TextField>

							{/* File Upload */}
							<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
								<Button
									variant='outlined'
									component='label'
									startIcon={<UploadFileIcon />}
									sx={{
										borderRadius: 2,
										py: 1.5,
										borderColor: PRIMARY_COLOR,
										color: PRIMARY_COLOR,
										"&:hover": {
											borderColor: "#103a61",
											bgcolor: "rgba(23, 74, 124, 0.04)",
										},
									}}
									fullWidth>
									Choose File
									<input type='file' hidden onChange={handleFileChange} />
								</Button>
								{file && (
									<Box
										sx={{
											p: 2,
											bgcolor: "white",
											borderRadius: 2,
											border: "1px solid #e0e0e0",
											display: "flex",
											alignItems: "center",
											gap: 1,
										}}>
										<UploadFileIcon sx={{ color: "#4caf50", fontSize: 20 }} />
										<Typography
											variant='body2'
											sx={{ color: "#2c3e50", fontWeight: 500 }}>
											{file.name}
										</Typography>
										<Typography
											variant='caption'
											sx={{ color: "#666", ml: "auto" }}>
											{(file.size / 1024 / 1024).toFixed(2)} MB
										</Typography>
									</Box>
								)}
							</Box>
						</Box>
					</Box>

					{/* Action Buttons */}
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							gap: 2,
							mt: 4,
							pt: 3,
							borderTop: "1px solid #e0e0e0",
						}}>
						<Button
							variant='outlined'
							onClick={onClose}
							sx={{
								borderRadius: 2,
								px: 4,
								py: 1.2,
								fontWeight: 600,
								borderColor: "#dde2e7",
								color: "#666",
								"&:hover": {
									borderColor: "#999",
									bgcolor: "#f5f5f5",
								},
							}}>
							Cancel
						</Button>
						<Button
							variant='contained'
							sx={{
								borderRadius: 2,
								px: 4,
								py: 1.2,
								fontWeight: 600,
								bgcolor: PRIMARY_COLOR,
								color: "#fff",
								minWidth: 140,
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
							onClick={handleConfirm}
							disabled={
								isUploading ||
								!recordType ||
								!docName ||
								!docDate ||
								!file ||
								!selectedPet
							}
							startIcon={
								isUploading ? (
									<CircularProgress size={20} color='inherit' />
								) : (
									<AddCircleOutlineIcon sx={{ color: "#fff" }} />
								)
							}>
							{isUploading ? "Uploading..." : "Upload Document"}
						</Button>
					</Box>
				</Box>
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
		</LocalizationProvider>
	);
};

export default AddRecordsDialog;
