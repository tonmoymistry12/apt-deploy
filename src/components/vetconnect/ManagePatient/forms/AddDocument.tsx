import React, { useState, useImperativeHandle, forwardRef } from "react";
import {
	Grid,
	TextField,
	MenuItem,
	Box,
	Select,
	InputLabel,
	FormControl,
	Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CloudUpload } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";

export interface DocumentFormData {
	recordType: string;
	documentName: string;
	date: string;
	imageBase64: string | null;
}

export interface AddDocumentRef {
	submit: () => any;
}

const AddDocument = forwardRef<AddDocumentRef>((_, ref) => {
	const [recordType, setRecordType] = useState("");
	const [documentName, setDocumentName] = useState("");
	const [date, setDate] = useState<Dayjs | null>(dayjs());
	const [previewImage, setPreviewImage] = useState<any>(null);
	const [filename, setFileName] = useState("");

	useImperativeHandle(ref, () => ({
		submit: () => {
			if (!date) {
				alert("Please fill all required fields");
				return null;
			}

			return {
				recordType,
				documentName,
				date: date.format("DD/MM/YYYY"),
				imageBase64: base64ToFile(previewImage),
			};
		},
	}));

	const base64ToFile = (base64String: string): File => {
		const arr = base64String.split(",");
		const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
		console.log(mime);
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new File([u8arr], filename, { type: mime });
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setFileName(file.name);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<FormControl fullWidth required>
						<InputLabel>Record Type</InputLabel>
						<Select
							label='Record Type'
							value={recordType}
							onChange={(e) => setRecordType(e.target.value)}>
							<MenuItem value='prescription'>Prescription</MenuItem>
							<MenuItem value='pathalogyReport'>Pathology Report</MenuItem>
							<MenuItem value='radiologyReport'>Radiology Report</MenuItem>
							<MenuItem value='referrals'>Referrals</MenuItem>
							<MenuItem value='others'>Others</MenuItem>
						</Select>
					</FormControl>
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField
						required
						label='Name Of The Document'
						fullWidth
						value={documentName}
						onChange={(e) => setDocumentName(e.target.value)}
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label='Date'
							value={date}
							onChange={(newDate) => setDate(newDate)}
							slotProps={{ textField: { fullWidth: true } }}
						/>
					</LocalizationProvider>
				</Grid>

				<Grid item xs={12} sm={6}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<input
							accept='image/*'
							style={{ display: "none" }}
							id='facility-image-upload'
							type='file'
							onChange={handleImageChange}
						/>
						<label htmlFor='facility-image-upload'>
							<Box
								sx={{
									width: 80,
									height: 80,
									borderRadius: "4px",
									border: "1px solid #e0e0e0",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "pointer",
									overflow: "hidden",
									position: "relative",
									"&:hover": {
										backgroundColor: "rgba(26, 54, 93, 0.04)",
									},
								}}>
								{previewImage ? (
									<img
										src={previewImage}
										alt='Preview'
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
										}}
									/>
								) : (
									<CloudUpload sx={{ color: "#1a365d", fontSize: 24 }} />
								)}
							</Box>
						</label>
						<Box>
							<Typography variant='body2' sx={{ color: "#666", mb: 0.5 }}>
								Pet Document
							</Typography>
							<Typography variant='caption' sx={{ color: "#999" }}>
								Maximum size: 5mb
							</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
});

export default AddDocument;
