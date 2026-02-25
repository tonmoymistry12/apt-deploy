import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import PetsIcon from "@mui/icons-material/Pets";
import dynamic from "next/dynamic";
// import { sampleMedicalRecord } from "@/components/manageEncounter/sampleMedicalRecord";
import {
	uploadVoicePrescription,
	getVoicePrescriptions,
	getPetProfile,
	uploadDocument,
} from "@/services/manageCalendar";
// import { MedicalRecord } from "@/components/manageEncounter/types";

const BASE_URL = "https://www.happyfurandfeather.com";

// Dynamically import ManageEncounter with SSR disabled to avoid Quill SSR issues
const ManageEncounter = dynamic(
	() => import("@/components/manageEncounter/ManageEncounter"),
	{ ssr: false },
);

interface ConsultationItem {
	petName: string;
	ownerName: string;
	timeRange: string;
	imageUrl?: string;
	patientId?: number;
	appointmentId?: number;
	patientUid?: number;
	patientMrn?: number;
}

interface ConsultationPopupProps {
	consultation: ConsultationItem;
	onCompleteConsultation?: (consultation: ConsultationItem) => void;
	isCompleted?: boolean;
	consultationType?: "online" | "offline";
}

const ConsultationPopup: React.FC<ConsultationPopupProps> = ({
	consultation,
	onCompleteConsultation,
	isCompleted = false,
	consultationType = "online",
}) => {
	const currentDate = new Date();
	const formattedDate = currentDate.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}); // e.g., "29/08/2025"
	const [startTime, endTime] = consultation.timeRange.split(" - ");
	const petImage = consultation.imageUrl;

	// Refs for hidden file inputs
	const docUploadRef = useRef<HTMLInputElement>(null);
	const addDocRef = useRef<HTMLInputElement>(null);
	const chatFileRef = useRef<HTMLInputElement>(null);
	const recognitionRef = useRef<any>(null);

	// State for controlling popup visibility
	const [showPrescriptionSection, setShowPrescriptionSection] = useState(false);
	const [openManualPrescriptionModal, setOpenManualPrescriptionModal] =
		useState(false);
	const [prescriptionMode, setPrescriptionMode] = useState<
		"selection" | "textToSpeech" | "attachDocument"
	>("selection");

	// State for comments functionality
	const [comment, setComment] = useState("");
	const [isRecording, setIsRecording] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingComments, setIsLoadingComments] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success" as "success" | "error" | "warning" | "info",
	});
	const [comments, setComments] = useState<
		Array<{ id: number; text: string; date: string; time: string }>
	>([]);

	// State for pet profile data
	const [petProfile, setPetProfile] = useState<any>(null);
	const [isLoadingProfile, setIsLoadingProfile] = useState(false);

	const router = useRouter();

	// Initialize speech recognition
	useEffect(() => {
		if (typeof window !== "undefined") {
			const SpeechRecognition =
				(window as any).SpeechRecognition ||
				(window as any).webkitSpeechRecognition;
			if (SpeechRecognition) {
				recognitionRef.current = new SpeechRecognition();
				recognitionRef.current.continuous = true;
				recognitionRef.current.interimResults = true;
				recognitionRef.current.lang = "en-US";

				recognitionRef.current.onresult = (event: any) => {
					let interimTranscript = "";
					let finalTranscript = "";

					for (let i = event.resultIndex; i < event.results.length; i++) {
						const transcript = event.results[i][0].transcript;
						if (event.results[i].isFinal) {
							finalTranscript += transcript + " ";
						} else {
							interimTranscript += transcript;
						}
					}

					setComment((prev) => {
						const newText = finalTranscript || interimTranscript;
						return prev + newText;
					});
				};

				recognitionRef.current.onerror = (event: any) => {
					console.error("Speech recognition error:", event.error);
					setIsRecording(false);
				};

				recognitionRef.current.onend = () => {
					setIsRecording(false);
				};
			}
		}
	}, []);

	// Fetch consultation history when section expands
	useEffect(() => {
		const fetchConsultationHistory = async () => {
			if (showPrescriptionSection) {
				setIsLoadingComments(true);
				try {
					const payload = {
						userName: localStorage.getItem("userName") || "",
						userPass: localStorage.getItem("userPwd") || "",
						deviceStat: "M",
						appointmentId: consultation.appointmentId || 0,
					};

					const response = await getVoicePrescriptions(payload);

					if (Array.isArray(response)) {
						// Helper function to strip HTML tags
						const stripHtmlTags = (html: string) => {
							if (typeof window === "undefined") {
								// Server-side: use regex to strip HTML tags
								return html.replace(/<[^>]*>/g, "");
							}
							// Client-side: use DOM API
							const tmp = document.createElement("DIV");
							tmp.innerHTML = html;
							return tmp.textContent || tmp.innerText || "";
						};

						const formattedComments = response.map((item, index) => ({
							id: item.encounterPublicNoteId || index + 1,
							text: stripHtmlTags(item.publicNote),
							date: item.publicNoteDate,
							time: item.publicNoteTime,
						}));

						setComments(formattedComments);
					}
				} catch (error) {
					console.error("Error fetching consultation history:", error);
					setSnackbar({
						open: true,
						message: "Failed to load consultation history",
						severity: "error",
					});
				} finally {
					setIsLoadingComments(false);
				}
			}
		};

		fetchConsultationHistory();
	}, [showPrescriptionSection]);

	// Fetch pet profile on mount
	useEffect(() => {
		const fetchPetProfile = async () => {
			if (consultation.patientUid) {
				setIsLoadingProfile(true);
				try {
					const payload = {
						userName: localStorage.getItem("userName") || "",
						userPwd: localStorage.getItem("userPwd") || "",
						deviceStat: "D",
						patientUid: consultation.patientUid,
					};

					const response = await getPetProfile(payload);
					setPetProfile(response);
				} catch (error) {
					console.error("Error fetching pet profile:", error);
					setSnackbar({
						open: true,
						message: "Failed to load pet profile",
						severity: "error",
					});
				} finally {
					setIsLoadingProfile(false);
				}
			}
		};

		fetchPetProfile();
	}, [consultation.patientUid]);

	const handleFileUpload =
		(label: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				if (!consultation.patientUid || !consultation.appointmentId) {
					setSnackbar({
						open: true,
						message: "Missing patient or appointment information",
						severity: "error",
					});
					return;
				}

				try {
					const currentDate = new Date();
					const formattedDate = currentDate.toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
					});
					const docName =
						label === "Shared Documents Upload"
							? `Document on ${currentDate.toLocaleDateString("en-GB", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}`
							: `Prescription on ${currentDate.toLocaleDateString("en-GB", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}`;

					const payload = {
						userName: localStorage.getItem("userName") || "",
						userPass: localStorage.getItem("userPwd") || "",
						loggedInFacilityId:
							localStorage.getItem("loggedinFacilityId") || "",
						orgId: localStorage.getItem("orgId") || "",
						doctorUId: localStorage.getItem("doctorUid") || "",
						deviceStat: "M",
						docname: docName,
						docdate: formattedDate,
						select_doctype_list: "1",
						patientUid: consultation.patientUid?.toString() || "0",
						appointmentId: consultation.appointmentId?.toString() || "0",
						uploaded_file: file,
					};

					setSnackbar({
						open: true,
						message: "Uploading document...",
						severity: "info",
					});

					const response = await uploadDocument(payload);

					if (response.status === 200) {
						setSnackbar({
							open: true,
							message:
								response.data?.message || "Document uploaded successfully!",
							severity: "success",
						});

						// Refresh pet profile to show new documents
						if (consultation.patientUid) {
							const profilePayload = {
								userName: localStorage.getItem("userName") || "",
								userPwd: localStorage.getItem("userPwd") || "",
								deviceStat: "D",
								patientUid: consultation.patientUid,
							};

							const profileResponse = await getPetProfile(profilePayload);
							setPetProfile(profileResponse);
						}
					} else {
						setSnackbar({
							open: true,
							message: response.data?.message || "Failed to upload document",
							severity: "error",
						});
					}
				} catch (error) {
					console.error("Error uploading document:", error);
					setSnackbar({
						open: true,
						message: "Error uploading document. Please try again.",
						severity: "error",
					});
				}
			}
		};

	const handleTogglePrescriptionSection = () => {
		setShowPrescriptionSection(!showPrescriptionSection);
		if (!showPrescriptionSection) {
			setPrescriptionMode("selection");
		} else {
			setPrescriptionMode("selection");
			setComment("");
			if (isRecording && recognitionRef.current) {
				recognitionRef.current.stop();
				setIsRecording(false);
			}
		}
	};

	const handleOpenManualPrescription = () => {
		setOpenManualPrescriptionModal(true);
	};

	const handleCloseManualPrescription = () => {
		setOpenManualPrescriptionModal(false);
	};

	const handleModeSelect = (
		mode: "textToSpeech" | "attachDocument" | "addManually",
	) => {
		if (mode === "addManually") {
			setOpenManualPrescriptionModal(true);
		} else {
			setPrescriptionMode(mode);
		}
	};

	const handleBackToSelection = () => {
		setPrescriptionMode("selection");
		setComment("");
		if (isRecording && recognitionRef.current) {
			recognitionRef.current.stop();
			setIsRecording(false);
		}
	};

	const handleToggleRecording = () => {
		if (!recognitionRef.current) {
			alert("Speech recognition is not supported in this browser.");
			return;
		}

		if (isRecording) {
			recognitionRef.current.stop();
			setIsRecording(false);
		} else {
			setComment("");
			recognitionRef.current.start();
			setIsRecording(true);
		}
	};

	const handleAddComment = async () => {
		if (!comment.trim()) {
			setSnackbar({
				open: true,
				message: "Please enter a comment",
				severity: "warning",
			});
			return;
		}

		if (!consultation.patientMrn || !consultation.appointmentId) {
			setSnackbar({
				open: true,
				message: "Missing patient or appointment information",
				severity: "error",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				patientId: consultation.patientMrn,
				appointmentId: consultation.appointmentId,
				publicNote: comment.trim(),
			};

			const response = await uploadVoicePrescription(payload);

			if (
				response.status === "True" ||
				response.status === "success" ||
				response.status === "Success"
			) {
				setComment("");

				setSnackbar({
					open: true,
					message:
						response.message || "Voice prescription uploaded successfully",
					severity: "success",
				});

				// Refresh consultation history
				try {
					const historyPayload = {
						userName: localStorage.getItem("userName") || "",
						userPass: localStorage.getItem("userPwd") || "",
						deviceStat: "M",
						appointmentId: consultation.appointmentId || 0,
					};

					const historyResponse = await getVoicePrescriptions(historyPayload);

					if (Array.isArray(historyResponse)) {
						const stripHtmlTags = (html: string) => {
							if (typeof window === "undefined") {
								// Server-side: use regex to strip HTML tags
								return html.replace(/<[^>]*>/g, "");
							}
							// Client-side: use DOM API
							const tmp = document.createElement("DIV");
							tmp.innerHTML = html;
							return tmp.textContent || tmp.innerText || "";
						};

						const formattedComments = historyResponse.map((item, index) => ({
							id: item.encounterPublicNoteId || index + 1,
							text: stripHtmlTags(item.publicNote),
							date: item.publicNoteDate,
							time: item.publicNoteTime,
						}));

						setComments(formattedComments);
					}
				} catch (error) {
					console.error("Error refreshing consultation history:", error);
				}
			} else {
				setSnackbar({
					open: true,
					message: response.message || "Failed to add comment",
					severity: "error",
				});
			}
		} catch (error) {
			console.error("Error uploading voice prescription:", error);
			setSnackbar({
				open: true,
				message: "Error adding comment. Please try again.",
				severity: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const handleDocumentClick = (savedFileName: string) => {
		if (savedFileName) {
			const fullUrl = `${BASE_URL}/${savedFileName}`;
			window.open(fullUrl, "_blank");
		}
	};

	const handleChatFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			if (!consultation.patientUid || !consultation.appointmentId) {
				setSnackbar({
					open: true,
					message: "Missing patient or appointment information",
					severity: "error",
				});
				return;
			}

			try {
				const currentDate = new Date();
				const formattedDate = currentDate.toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				});
				const docName = `Prescription on ${currentDate.toLocaleDateString(
					"en-GB",
					{ day: "numeric", month: "short", year: "numeric" },
				)}`;

				const payload = {
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					deviceStat: "M",
					docname: docName,
					docdate: formattedDate,
					loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
					orgId: localStorage.getItem("orgId") || "",
					doctorUId: localStorage.getItem("doctorUid") || "",
					select_doctype_list: "1", // Default document type ID - can be made dynamic with a dropdown
					patientUid: consultation.patientUid?.toString() || "0",
					appointmentId: consultation.appointmentId?.toString() || "0",
					uploaded_file: file,
				};

				setSnackbar({
					open: true,
					message: "Uploading document...",
					severity: "info",
				});

				const response = await uploadDocument(payload);

				if (response.status === 200) {
					setSnackbar({
						open: true,
						message:
							response.data?.message || "Document uploaded successfully!",
						severity: "success",
					});
					console.log("uploaded");
					if (consultation.patientUid) {
						const profilePayload = {
							userName: localStorage.getItem("userName") || "",
							userPwd: localStorage.getItem("userPwd") || "",
							deviceStat: "D",
							patientUid: consultation.patientUid,
						};

						const profileResponse = await getPetProfile(profilePayload);
						setPetProfile(profileResponse);
					}
					console.log("upload end");
					// Refresh consultation history to show the new document
					const historyPayload = {
						userName: localStorage.getItem("userName") || "",
						userPass: localStorage.getItem("userPwd") || "",
						deviceStat: "M",
						appointmentId: consultation.appointmentId || 0,
					};

					const historyResponse = await getVoicePrescriptions(historyPayload);
					if (Array.isArray(historyResponse)) {
						const stripHtmlTags = (html: string) => {
							if (typeof window === "undefined") {
								return html.replace(/<[^>]*>/g, "");
							}
							const tmp = document.createElement("DIV");
							tmp.innerHTML = html;
							return tmp.textContent || tmp.innerText || "";
						};

						const formattedComments = historyResponse.map((item, index) => ({
							id: item.encounterPublicNoteId || index + 1,
							text: stripHtmlTags(item.publicNote),
							date: item.publicNoteDate,
							time: item.publicNoteTime,
						}));

						setComments(formattedComments);
					}

					// Back to selection mode after successful upload
					setPrescriptionMode("selection");
				} else {
					setSnackbar({
						open: true,
						message: response.data?.message || "Failed to upload document",
						severity: "error",
					});
				}
			} catch (error) {
				console.error("Error uploading document:", error);
				setSnackbar({
					open: true,
					message: "Error uploading document. Please try again.",
					severity: "error",
				});
			}
		}
	};

	return (
		<Box sx={{ p: 2, bgcolor: "#F9FBFF", borderRadius: 4 }}>
			{/* Profile Section */}
			<Box
				sx={{ mb: 3, p: 2, bgcolor: "#ffffff", borderRadius: 4, boxShadow: 1 }}>
				{/* Compact Pet Info Section */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 2,
						p: 2,
						bgcolor: "#f8fafc",
						borderRadius: 2,
						border: "1px solid #e5e7eb",
					}}>
					<Avatar
						sx={{
							width: 60,
							height: 60,
							bgcolor: "#174a7c",
							border: "2px solid #fff",
							boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
						}}>
						<PetsIcon sx={{ fontSize: 32, color: "#fff" }} />
					</Avatar>
					<Box sx={{ flex: 1 }}>
						<Typography
							variant='subtitle1'
							sx={{ fontWeight: 700, color: "#174a7c" }}>
							{consultation.petName}
						</Typography>
						<Typography
							variant='body2'
							sx={{ color: "#617d98", fontSize: "0.8rem" }}>
							Owner: {consultation.ownerName}
						</Typography>
					</Box>
				</Box>

				{/* Compact Consultation Info */}
				<Box sx={{ mt: 2 }}>
					<Box
						sx={{
							p: 1.5,
							bgcolor: "#e8f0f7",
							borderRadius: 2,
							border: "1px solid #b3d9ff",
						}}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mb: 1,
							}}>
							<Typography
								variant='caption'
								sx={{ color: "#617d98", fontWeight: 600, fontSize: "0.7rem" }}>
								CONSULTATION
							</Typography>
							<Typography
								variant='caption'
								sx={{
									fontWeight: 700,
									color: consultationType === "online" ? "#2196F3" : "#FF9800",
									bgcolor:
										consultationType === "online" ? "#e3f2fd" : "#fff3e0",
									px: 1.5,
									py: 0.5,
									borderRadius: 1,
									fontSize: "0.7rem",
								}}>
								{consultationType === "online" ? "ONLINE" : "OFFLINE"}
							</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<Typography
								variant='caption'
								sx={{ color: "#174a7c", fontWeight: 600, fontSize: "0.75rem" }}>
								{formattedDate}
							</Typography>
							<Typography
								variant='caption'
								sx={{ color: "#617d98", fontSize: "0.75rem" }}>
								{consultation.timeRange}
							</Typography>
						</Box>
					</Box>

					{/* Action Buttons - Single Row */}
					<Box sx={{ mt: 2, display: "flex", gap: 1.5, flexWrap: "nowrap" }}>
						<Button
							variant='contained'
							sx={{
								bgcolor: "#2196F3",
								color: "#fff",
								fontSize: "0.75rem",
								fontWeight: 600,
								py: 1,
								flex: 1,
								borderRadius: 1.5,
								textTransform: "none",
								"&:hover": {
									bgcolor: "#1976D2",
								},
							}}>
							CONSULT
						</Button>
						<Button
							variant='outlined'
							onClick={handleTogglePrescriptionSection}
							sx={{
								borderColor: "#174a7c",
								color: "#174a7c",
								fontSize: "0.75rem",
								fontWeight: 600,
								py: 1,
								flex: 1,
								borderRadius: 1.5,
								textTransform: "none",
								bgcolor: showPrescriptionSection ? "#e8f0f7" : "transparent",
								"&:hover": {
									borderColor: "#0d3a5f",
									bgcolor: "#e8f0f7",
								},
							}}>
							{showPrescriptionSection ? "HIDE PRESCRIPTION" : "PRESCRIPTION"}
						</Button>
						<Button
							variant='outlined'
							onClick={() => {
								const documentsSection = document.getElementById(
									"shared-documents-section",
								);
								if (documentsSection) {
									documentsSection.scrollIntoView({
										behavior: "smooth",
										block: "start",
									});
								}
							}}
							sx={{
								borderColor: "#FF9800",
								color: "#FF9800",
								fontSize: "0.75rem",
								fontWeight: 600,
								py: 1,
								flex: 1,
								borderRadius: 1.5,
								textTransform: "none",
								"&:hover": {
									borderColor: "#F57C00",
									bgcolor: "#fff3e0",
								},
							}}>
							DOCUMENTS
						</Button>
						<Button
							variant='contained'
							onClick={() => onCompleteConsultation?.(consultation)}
							disabled={isCompleted}
							sx={{
								bgcolor: "#4CAF50",
								color: "#fff",
								fontSize: "0.75rem",
								fontWeight: 600,
								py: 1,
								flex: 1,
								borderRadius: 1.5,
								textTransform: "none",
								"&:hover": {
									bgcolor: "#45a049",
								},
								"&:disabled": {
									bgcolor: "#ccc",
									color: "#999",
								},
							}}>
							COMPLETE
						</Button>
						<input
							type='file'
							hidden
							ref={addDocRef}
							onChange={handleFileUpload("Add Documents")}
						/>
					</Box>
				</Box>
			</Box>

			{/* Prescription Section - Expandable */}
			{showPrescriptionSection && (
				<Box
					sx={{
						mb: 2,
						p: 1.5,
						bgcolor: "#fff",
						borderRadius: 2,
						border: "1px solid #e5e7eb",
					}}>
					{/* Mode Selection Screen */}
					{prescriptionMode === "selection" && (
						<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
							<Typography
								variant='subtitle2'
								sx={{
									fontWeight: 700,
									color: "#174a7c",
									mb: 0.5,
									fontSize: "0.8rem",
								}}>
								PRESCRIPTION OPTIONS
							</Typography>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr 1fr",
									gap: 1,
								}}>
								<Button
									variant='contained'
									onClick={() => handleModeSelect("textToSpeech")}
									startIcon={<MicIcon />}
									sx={{
										bgcolor: "#2196F3",
										color: "white",
										py: 1.25,
										fontSize: "0.75rem",
										borderRadius: 1.5,
										textTransform: "none",
										fontWeight: 600,
										"&:hover": {
											bgcolor: "#1976D2",
										},
									}}>
									Voice Notes
								</Button>

								<Button
									variant='contained'
									onClick={() => handleModeSelect("attachDocument")}
									startIcon={<AttachFileIcon />}
									sx={{
										bgcolor: "#4CAF50",
										color: "white",
										py: 1.25,
										fontSize: "0.75rem",
										borderRadius: 1.5,
										textTransform: "none",
										fontWeight: 600,
										"&:hover": {
											bgcolor: "#45a049",
										},
									}}>
									Attach
								</Button>

								<Button
									variant='contained'
									onClick={() => handleModeSelect("addManually")}
									startIcon={<CloudUploadIcon />}
									sx={{
										bgcolor: "#FF9800",
										color: "white",
										py: 1.25,
										fontSize: "0.75rem",
										borderRadius: 1.5,
										textTransform: "none",
										fontWeight: 600,
										"&:hover": {
											bgcolor: "#F57C00",
										},
									}}>
									Manual
								</Button>
							</Box>
						</Box>
					)}

					{/* Voice Notes Mode */}
					{prescriptionMode === "textToSpeech" && (
						<Box>
							{/* Header with title on left, close button on right */}
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									mb: 2,
								}}>
								<Typography
									variant='subtitle2'
									sx={{ fontWeight: 600, color: "#174a7c" }}>
									Voice Notes
								</Typography>
								<IconButton
									onClick={handleBackToSelection}
									size='small'
									sx={{ color: "#617d98" }}>
									<CloseIcon fontSize='small' />
								</IconButton>
							</Box>

							{/* Comment Input Section */}
							<Box
								sx={{
									bgcolor: "#f8fafc",
									p: 1.5,
									borderRadius: 2,
									mb: 2,
									border: "1px solid #e5e7eb",
								}}>
								<Typography
									variant='caption'
									sx={{
										color: "#174a7c",
										fontWeight: 600,
										fontSize: "0.7rem",
										mb: 1,
										display: "block",
									}}>
									Add Comment
								</Typography>

								<Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
									<TextField
										fullWidth
										multiline
										rows={3}
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										placeholder='Type your prescription notes or use voice recording...'
										variant='outlined'
										size='small'
										sx={{
											"& .MuiOutlinedInput-root": {
												borderRadius: 1.5,
												bgcolor: "#ffffff",
												fontSize: "0.8rem",
											},
										}}
										InputProps={{
											endAdornment: (
												<InputAdornment position='end'>
													<IconButton
														onClick={handleToggleRecording}
														size='small'
														sx={{
															color: isRecording ? "#ff1744" : "#174a7c",
															bgcolor: isRecording ? "#ffebee" : "#e8f0f7",
															"&:hover": {
																bgcolor: isRecording ? "#ffcdd2" : "#d1e7f7",
															},
														}}>
														<MicIcon fontSize='small' />
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
									<Button
										variant='contained'
										onClick={handleAddComment}
										disabled={!comment.trim() || isSubmitting}
										sx={{
											bgcolor: "#174a7c",
											color: "white",
											px: 2.5,
											py: 1,
											borderRadius: 1.5,
											textTransform: "none",
											fontSize: "0.75rem",
											minWidth: "80px",
											"&:hover": {
												bgcolor: "#0d3a5f",
											},
											"&:disabled": {
												bgcolor: "#e0e0e0",
												color: "#9e9e9e",
											},
										}}>
										{isSubmitting ? (
											<CircularProgress size={16} color='inherit' />
										) : (
											"SEND"
										)}
									</Button>
								</Box>
							</Box>

							{/* Previous Comments List */}
							<Box sx={{ maxHeight: "300px", overflowY: "auto", mt: 2 }}>
								<Typography
									variant='subtitle2'
									sx={{
										color: "#174a7c",
										fontWeight: 600,
										fontSize: "0.75rem",
										mb: 1.5,
										display: "block",
									}}>
									Consultation History
								</Typography>

								{isLoadingComments ? (
									<Box
										sx={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											py: 2,
										}}>
										<CircularProgress size={24} sx={{ color: "#174a7c" }} />
									</Box>
								) : comments.length === 0 ? (
									<Typography
										variant='body2'
										sx={{
											color: "#999",
											fontStyle: "italic",
											fontSize: "0.75rem",
											textAlign: "center",
											py: 3,
										}}>
										No consultation history available.
									</Typography>
								) : (
									<Box
										sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
										{comments.map((commentItem) => (
											<Box
												key={commentItem.id}
												sx={{
													bgcolor: "#f8f9fa",
													p: 1.5,
													borderRadius: 1,
													border: "1px solid #e0e0e0",
													"&:hover": {
														bgcolor: "#f0f2f5",
														borderColor: "#174a7c",
													},
												}}>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 1,
														mb: 1,
													}}>
													<Typography
														variant='caption'
														sx={{
															color: "#174a7c",
															fontWeight: 600,
															fontSize: "0.7rem",
														}}>
														{commentItem.date}
													</Typography>
													<Typography
														variant='caption'
														sx={{ color: "#999", fontSize: "0.7rem" }}>
														{commentItem.time}
													</Typography>
												</Box>
												<Typography
													variant='body2'
													sx={{
														color: "#333",
														fontSize: "0.75rem",
														lineHeight: 1.6,
													}}>
													{commentItem.text}
												</Typography>
											</Box>
										))}
									</Box>
								)}
							</Box>
						</Box>
					)}

					{/* Attach Document Mode */}
					{prescriptionMode === "attachDocument" && (
						<Box>
							{/* Header with title on left, close button on right */}
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									mb: 2,
								}}>
								<Typography
									variant='subtitle2'
									sx={{ fontWeight: 600, color: "#174a7c" }}>
									Attach Document
								</Typography>
								<IconButton
									onClick={handleBackToSelection}
									size='small'
									sx={{ color: "#617d98" }}>
									<CloseIcon fontSize='small' />
								</IconButton>
							</Box>

							<Box
								sx={{
									bgcolor: "#f8fafc",
									p: 3,
									borderRadius: 2,
									border: "1px solid #e5e7eb",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 2,
								}}>
								<AttachFileIcon
									sx={{ fontSize: 48, color: "#174a7c", opacity: 0.6 }}
								/>
								<Typography
									variant='body2'
									sx={{ color: "#666", textAlign: "center" }}>
									Upload prescription documents
								</Typography>
								<Button
									variant='contained'
									startIcon={<AttachFileIcon />}
									onClick={() => chatFileRef.current?.click()}
									sx={{
										bgcolor: "#174a7c",
										color: "white",
										px: 3,
										py: 1,
										borderRadius: 1.5,
										textTransform: "none",
										fontSize: "0.875rem",
										"&:hover": {
											bgcolor: "#0d3a5f",
										},
									}}>
									Choose File
								</Button>
								<input
									type='file'
									hidden
									ref={chatFileRef}
									onChange={handleChatFileChange}
									accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
								/>
								<Typography
									variant='caption'
									sx={{ color: "#666", textAlign: "center" }}>
									Supported formats: PDF, DOC, DOCX, JPG, PNG
								</Typography>
							</Box>
						</Box>
					)}
				</Box>
			)}

			{/* About Rocky - Compact Section */}
			<Box
				sx={{
					mb: 2,
					p: 1.5,
					bgcolor: "#fff",
					borderRadius: 2,
					border: "1px solid #e5e7eb",
				}}>
				<Typography
					variant='subtitle2'
					sx={{
						fontWeight: 700,
						color: "#174a7c",
						mb: 1.5,
						fontSize: "0.85rem",
					}}>
					PET INFORMATION
				</Typography>

				{isLoadingProfile ? (
					<Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
						<CircularProgress size={24} sx={{ color: "#174a7c" }} />
					</Box>
				) : (
					<>
						{/* Grid Layout for Pet Info - All in 2x2 Grid */}
						<Box
							sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
							<Box>
								<Typography
									variant='caption'
									sx={{
										color: "#617d98",
										fontSize: "0.7rem",
										fontWeight: 600,
									}}>
									Date of Birth
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: "#174a7c",
										fontWeight: 600,
										fontSize: "0.75rem",
										mt: 0.5,
									}}>
									{petProfile?.birthDt || "N/A"}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant='caption'
									sx={{
										color: "#617d98",
										fontSize: "0.7rem",
										fontWeight: 600,
									}}>
									Gender
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: "#174a7c",
										fontWeight: 600,
										fontSize: "0.75rem",
										mt: 0.5,
									}}>
									{petProfile?.gender || "N/A"}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant='caption'
									sx={{
										color: "#617d98",
										fontSize: "0.7rem",
										fontWeight: 600,
									}}>
									Breed & Type
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: "#174a7c",
										fontWeight: 600,
										fontSize: "0.75rem",
										mt: 0.5,
									}}>
									{petProfile?.petBreed || "N/A"}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant='caption'
									sx={{
										color: "#617d98",
										fontSize: "0.7rem",
										fontWeight: 600,
									}}>
									Living Environment
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: "#174a7c",
										fontWeight: 600,
										fontSize: "0.75rem",
										mt: 0.5,
									}}>
									{petProfile?.livingEnvironment || "N/A"}
								</Typography>
							</Box>
						</Box>

						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mt: 1.5,
								pt: 1,
								borderTop: "1px solid #e5e7eb",
							}}>
							<Box>
								<Typography
									variant='caption'
									sx={{
										color: "#617d98",
										fontSize: "0.7rem",
										fontWeight: 600,
									}}>
									Category
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: "#174a7c",
										fontWeight: 600,
										fontSize: "0.75rem",
										mt: 0.5,
									}}>
									{petProfile?.petCategory || "N/A"}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant='caption'
									sx={{
										color: "#617d98",
										fontSize: "0.7rem",
										fontWeight: 600,
									}}>
									Pet Type
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: "#174a7c",
										fontWeight: 600,
										fontSize: "0.75rem",
										mt: 0.5,
									}}>
									{petProfile?.petType || "N/A"}
								</Typography>
							</Box>
						</Box>

						{/* Second Row - Training Status and Diet */}
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mt: 1.5,
								pt: 1,
								borderTop: "1px solid #e5e7eb",
							}}>
							<Box>
								<Typography
									variant='caption'
									sx={{
										color: "#617d98",
										fontSize: "0.7rem",
										fontWeight: 600,
									}}>
									Diet
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: "#4CAF50",
										fontWeight: 600,
										fontSize: "0.75rem",
										mt: 0.5,
									}}>
									{petProfile?.petsDiet || "N/A"}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant='caption'
									sx={{
										color: "#617d98",
										fontSize: "0.7rem",
										fontWeight: 600,
									}}>
									Training
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: "#4CAF50",
										fontWeight: 700,
										fontSize: "0.75rem",
										mt: 0.5,
									}}>
									{petProfile?.trainingDone === "true" ? "Yes ✓" : "No"}
								</Typography>
							</Box>
						</Box>

						{/* Special Notes Row */}
						{petProfile?.petDetails && (
							<Box sx={{ mt: 1.5, pt: 1, borderTop: "1px solid #e5e7eb" }}>
								<Typography
									variant='caption'
									sx={{
										color: "#617d98",
										fontSize: "0.7rem",
										fontWeight: 600,
									}}>
									Special Notes
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: "#174a7c",
										fontWeight: 600,
										fontSize: "0.75rem",
										mt: 0.5,
									}}>
									{petProfile.petDetails}
								</Typography>
							</Box>
						)}
					</>
				)}
			</Box>

			{/* Owner Information Section */}
			{petProfile && !isLoadingProfile && (
				<Box
					sx={{
						mb: 2,
						p: 1.5,
						bgcolor: "#fff",
						borderRadius: 2,
						border: "1px solid #e5e7eb",
					}}>
					<Typography
						variant='subtitle2'
						sx={{
							fontWeight: 700,
							color: "#174a7c",
							mb: 1.5,
							fontSize: "0.85rem",
						}}>
						OWNER INFORMATION
					</Typography>

					<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
						<Box>
							<Typography
								variant='caption'
								sx={{ color: "#617d98", fontSize: "0.7rem", fontWeight: 600 }}>
								Owner Name
							</Typography>
							<Typography
								variant='body2'
								sx={{
									color: "#174a7c",
									fontWeight: 600,
									fontSize: "0.75rem",
									mt: 0.5,
								}}>
								{petProfile.firstName && petProfile.lastName
									? `${petProfile.firstName} ${petProfile.lastName}`
									: "N/A"}
							</Typography>
						</Box>
						<Box>
							<Typography
								variant='caption'
								sx={{ color: "#617d98", fontSize: "0.7rem", fontWeight: 600 }}>
								Gender
							</Typography>
							<Typography
								variant='body2'
								sx={{
									color: "#174a7c",
									fontWeight: 600,
									fontSize: "0.75rem",
									mt: 0.5,
								}}>
								{petProfile.ownerGender || "N/A"}
							</Typography>
						</Box>
						<Box>
							<Typography
								variant='caption'
								sx={{ color: "#617d98", fontSize: "0.7rem", fontWeight: 600 }}>
								Contact Number
							</Typography>
							<Typography
								variant='body2'
								sx={{
									color: "#174a7c",
									fontWeight: 600,
									fontSize: "0.75rem",
									mt: 0.5,
								}}>
								{petProfile.cellNumber || "N/A"}
							</Typography>
						</Box>
						<Box>
							<Typography
								variant='caption'
								sx={{ color: "#617d98", fontSize: "0.7rem", fontWeight: 600 }}>
								Email
							</Typography>
							<Typography
								variant='body2'
								sx={{
									color: "#174a7c",
									fontWeight: 600,
									fontSize: "0.75rem",
									mt: 0.5,
								}}>
								{petProfile.email || "N/A"}
							</Typography>
						</Box>
					</Box>
				</Box>
			)}

			{/* Address and History - Compact Sections */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 1.5,
					mb: 2,
				}}>
				{/* Address */}
				<Box
					sx={{
						p: 1.5,
						bgcolor: "#f8fafc",
						borderRadius: 2,
						border: "1px solid #e5e7eb",
					}}>
					<Typography
						variant='subtitle2'
						sx={{
							fontWeight: 700,
							color: "#174a7c",
							mb: 1,
							fontSize: "0.85rem",
						}}>
						ADDRESS
					</Typography>
					{isLoadingProfile ? (
						<CircularProgress size={20} sx={{ color: "#174a7c" }} />
					) : petProfile ? (
						<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
							{(petProfile.address1 || petProfile.address2) && (
								<Typography
									variant='body2'
									sx={{
										fontSize: "0.75rem",
										lineHeight: 1.6,
										color: "#617d98",
									}}>
									{[petProfile.address1, petProfile.address2]
										.filter(Boolean)
										.join(", ")}
								</Typography>
							)}
							{(petProfile.areaName || petProfile.city) && (
								<Typography
									variant='body2'
									sx={{
										fontSize: "0.75rem",
										lineHeight: 1.6,
										color: "#617d98",
									}}>
									{[petProfile.areaName, petProfile.city]
										.filter(Boolean)
										.join(", ")}
								</Typography>
							)}
							{(petProfile.state || petProfile.pin) && (
								<Typography
									variant='body2'
									sx={{
										fontSize: "0.75rem",
										lineHeight: 1.6,
										color: "#617d98",
									}}>
									{[petProfile.state, petProfile.pin]
										.filter(Boolean)
										.join(", ")}
								</Typography>
							)}
							{petProfile.country && (
								<Typography
									variant='body2'
									sx={{
										fontSize: "0.75rem",
										lineHeight: 1.6,
										color: "#617d98",
									}}>
									{petProfile.country}
								</Typography>
							)}
						</Box>
					) : (
						<Typography
							variant='body2'
							sx={{ fontSize: "0.75rem", lineHeight: 1.6, color: "#617d98" }}>
							N/A
						</Typography>
					)}
				</Box>

				{/* History */}
				<Box
					sx={{
						p: 1.5,
						bgcolor: "#fff3e0",
						borderRadius: 2,
						border: "1px solid #ffe0b2",
					}}>
					<Typography
						variant='subtitle2'
						sx={{
							fontWeight: 700,
							color: "#FF9800",
							mb: 1,
							fontSize: "0.85rem",
						}}>
						MEDICAL HISTORY
					</Typography>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
						{petProfile?.petHistory ? (
							petProfile.petHistory
								.split(",")
								.filter(Boolean)
								.map((condition: string, idx: number) => (
									<Box
										key={idx}
										sx={{
											bgcolor: "#fff",
											color: "#FF9800",
											px: 1,
											py: 0.25,
											borderRadius: 1,
											fontSize: "0.65rem",
											fontWeight: 600,
											border: "1px solid #ffe0b2",
										}}>
										{condition.trim()}
									</Box>
								))
						) : isLoadingProfile ? (
							<CircularProgress size={20} sx={{ color: "#FF9800" }} />
						) : (
							<Typography
								variant='caption'
								sx={{ color: "#999", fontSize: "0.7rem" }}>
								No medical history available
							</Typography>
						)}
					</Box>
				</Box>
			</Box>

			{/* Shared Documents - Compact Section */}
			<Box id='shared-documents-section' sx={{ mt: 2 }}>
				<Typography
					variant='subtitle2'
					sx={{
						fontWeight: 700,
						color: "#174a7c",
						mb: 1.5,
						fontSize: "0.85rem",
					}}>
					UPLOAD DOCUMENTS
				</Typography>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
						gap: 1,
						p: 1.5,
						bgcolor: "#f8fafc",
						borderRadius: 2,
						border: "1px solid #e5e7eb",
					}}>
					{isLoadingProfile ? (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								gridColumn: "1 / -1",
								py: 2,
							}}>
							<CircularProgress size={24} sx={{ color: "#174a7c" }} />
						</Box>
					) : petProfile?.uploadedDocumentsList &&
					  petProfile.uploadedDocumentsList.length > 0 ? (
						petProfile.uploadedDocumentsList.map((doc: any, idx: number) => (
							<Tooltip
								key={idx}
								title={doc.documentName || doc.documentDate}
								arrow>
								<Button
									variant='outlined'
									onClick={() => handleDocumentClick(doc.savedFileName)}
									sx={{
										minWidth: 100,
										py: 0.75,
										fontSize: "0.7rem",
										borderRadius: 1.5,
										borderColor: "#174a7c",
										color: "#174a7c",
										"&:hover": {
											borderColor: "#0d3a5f",
											bgcolor: "#e8f0f7",
										},
									}}
									startIcon={<CloudDownloadIcon sx={{ fontSize: 14 }} />}>
									{doc.documentDate}
								</Button>
							</Tooltip>
						))
					) : null}
					<Button
						variant='contained'
						startIcon={<CloudUploadIcon sx={{ fontSize: 14 }} />}
						onClick={() => docUploadRef.current?.click()}
						sx={{
							bgcolor: "#174a7c",
							color: "white",
							minWidth: 100,
							py: 0.75,
							fontSize: "0.7rem",
							borderRadius: 1.5,
							"&:hover": {
								bgcolor: "#0d3a5f",
							},
						}}>
						Upload
					</Button>
					<input
						type='file'
						hidden
						ref={docUploadRef}
						onChange={handleFileUpload("Shared Documents Upload")}
					/>
				</Box>

				{/* My Prescriptions - Compact Section */}
				<Typography
					variant='subtitle2'
					sx={{
						fontWeight: 700,
						color: "#174a7c",
						mt: 2,
						mb: 1.5,
						fontSize: "0.85rem",
					}}>
					UPLOADED DOCUMENTS
				</Typography>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
						gap: 1,
						p: 1.5,
						bgcolor: "#fff3e0",
						borderRadius: 2,
						border: "1px solid #ffe0b2",
					}}>
					{isLoadingProfile ? (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								gridColumn: "1 / -1",
								py: 2,
							}}>
							<CircularProgress size={24} sx={{ color: "#FF9800" }} />
						</Box>
					) : petProfile?.uploadedPrescriptionsList &&
					  petProfile.uploadedPrescriptionsList.length > 0 ? (
						petProfile.uploadedPrescriptionsList.map(
							(prescription: any, idx: number) => (
								<Tooltip
									key={idx}
									title={prescription.documentName || prescription.documentDate}
									arrow>
									<Button
										variant='outlined'
										onClick={() =>
											handleDocumentClick(prescription.savedFileName)
										}
										sx={{
											minWidth: 100,
											py: 0.75,
											fontSize: "0.7rem",
											borderRadius: 1.5,
											borderColor: "#FF9800",
											color: "#FF9800",
											bgcolor: "#fff",
											"&:hover": {
												borderColor: "#F57C00",
												bgcolor: "#fff9e6",
											},
										}}
										startIcon={<CloudDownloadIcon sx={{ fontSize: 14 }} />}>
										{prescription.documentDate}
									</Button>
								</Tooltip>
							),
						)
					) : null}
					<Button
						variant='contained'
						startIcon={<CloudUploadIcon sx={{ fontSize: 14 }} />}
						onClick={() => docUploadRef.current?.click()}
						sx={{
							bgcolor: "#FF9800",
							color: "white",
							minWidth: 100,
							py: 0.75,
							fontSize: "0.7rem",
							borderRadius: 1.5,
							"&:hover": {
								bgcolor: "#F57C00",
							},
						}}>
						Upload
					</Button>
					<input
						type='file'
						hidden
						ref={docUploadRef}
						onChange={handleFileUpload("Prescription Upload")}
					/>
				</Box>
			</Box>

			{/* Manual Prescription Modal - ManageEncounter */}
			<Dialog
				open={openManualPrescriptionModal}
				onClose={handleCloseManualPrescription}
				maxWidth={false}
				fullWidth
				sx={{
					"& .MuiDialog-paper": {
						width: "95vw",
						maxWidth: "1400px",
						height: "90vh",
						maxHeight: "1000px",
						borderRadius: 2,
						display: "flex",
						flexDirection: "column",
						position: "relative",
					},
				}}>
				<DialogTitle sx={{ backgroundColor: "#174a7c", color: "white" }}>
					Add Prescription Manually
				</DialogTitle>
				<DialogContent
					sx={{
						p: 0,
						flexGrow: 1,
						display: "flex",
						overflow: "hidden",
						position: "relative",
					}}>
					<ManageEncounter
						record={{
							patientInfo: {
								patientName: `${consultation.petName} of ${consultation.ownerName}`,
								doctorName: "Doctor",
								userName: "Doctor",
								date: formattedDate,
								time: startTime,
							},
							vitals: [],
							allergies: [],
							complaints: [],
							diagnoses: [],
							medicines: [],
							labOrders: [],
							procedureAdvices: [],
						}}
					/>
				</DialogContent>
				<DialogActions
					sx={{
						background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
					}}>
					<Button
						variant='contained'
						onClick={handleCloseManualPrescription}
						sx={{ bgcolor: "#174a7c", "&:hover": { bgcolor: "#0d3a5f" } }}>
						Close
					</Button>
				</DialogActions>
			</Dialog>

			{/* Old Prescription Modal - REMOVED, Now using inline expandable section above */}

			{/* Snackbar for notifications */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default ConsultationPopup;
