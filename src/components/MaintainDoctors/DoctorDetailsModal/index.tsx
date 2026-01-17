import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.scss";

const councils = [
	"Andhra Pradesh Medical Council",
	"Arunachal Pradesh Medical Council",
	"Assam Council of Medical Registration",
	"Bihar Medical Council",
	"Chattisgarh Medical Council",
	"Delhi Medical Council",
	"Goa Medical Council",
	"Gujarat Medical Council",
	"Haryana Medical Council",
	"Himanchal Pradesh Medical Council",
	"Jammu & Kashmir Medical Council",
	"Jharkhand Medical Council",
	"Karnataka Medical Council",
	"Madhya Pradesh Medical Council",
	"Maharashtra Medical Council",
	"Manipur Medical Council",
	"Mizoram Medical Council",
	"Nagaland Medical Council",
	// ... add more as needed
];

const specialties = ["Select", "General Medicine", "Pediatrics", "Surgery"];

type Mode = "short" | "full";

interface Props {
	open: boolean;
	onClose: () => void;
	mode?: Mode;
	initialData?: any;
	onProceed?: (data: { council: string; year: string; regNo: string }) => void;
	onSubmit?: (data: any) => void;
}

const DoctorDetailsModal: React.FC<Props> = ({
	open,
	onClose,
	mode = "short",
	initialData,
	onProceed,
	onSubmit,
}) => {
	// Shared fields
	const [council, setCouncil] = useState("");
	const [year, setYear] = useState("");
	const [regNo, setRegNo] = useState("");
	const [error, setError] = useState(false);
	const [councilError, setCouncilError] = useState("");
	const [yearError, setYearError] = useState("");
	const [regNoError, setRegNoError] = useState("");

	// Full form fields
	const [title, setTitle] = useState("Dr.");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [speciality, setSpeciality] = useState("Select");
	const [qualification, setQualification] = useState("");
	const [address1, setAddress1] = useState("");
	const [address2, setAddress2] = useState("");
	const [city, setCity] = useState("");
	const [area, setArea] = useState("");
	const [country, setCountry] = useState("");
	const [state, setState] = useState("");
	const [pin, setPin] = useState("");
	const [cellNo, setCellNo] = useState("");
	const [userName, setUserName] = useState("");
	const [profileDetails, setProfileDetails] = useState("");
	const [image, setImage] = useState<string | undefined>(undefined);
	const [status, setStatus] = useState("Active");

	useEffect(() => {
		if (initialData) {
			setCouncil(initialData.council || "");
			setYear(initialData.year || "");
			setRegNo(initialData.regNo || "");
			if (mode === "full") {
				setTitle(initialData.title || "Dr.");
				setFirstName(initialData.firstName || "");
				setLastName(initialData.lastName || "");
				setEmail(initialData.email || "");
				setSpeciality(initialData.speciality || "Select");
				setQualification(initialData.qualification || "");
				setAddress1(initialData.address1 || "");
				setAddress2(initialData.address2 || "");
				setCity(initialData.city || "");
				setArea(initialData.area || "");
				setCountry(initialData.country || "");
				setState(initialData.state || "");
				setPin(initialData.pin || "");
				setCellNo(initialData.cellNo || "");
				setUserName(initialData.userName || "");
				setProfileDetails(initialData.profileDetails || "");
				setImage(initialData.image);
				setStatus(initialData.status || "Active");
			}
		}
	}, [initialData, mode]);

	const handleProceed = () => {
		let valid = true;
		if (!council) {
			setCouncilError("Medical Council is required");
			valid = false;
		} else {
			setCouncilError("");
		}
		if (!year) {
			setYearError("Year of Registration is required");
			valid = false;
		} else {
			setYearError("");
		}
		if (!regNo) {
			setRegNoError("Reg. No. is required");
			valid = false;
		} else {
			setRegNoError("");
		}
		if (!valid) return;
		setError(false);
		if (mode === "short" && onProceed) {
			onProceed({ council, year, regNo });
		} else if (mode === "full" && onSubmit) {
			onSubmit({
				council,
				year,
				regNo,
				title,
				firstName,
				lastName,
				email,
				speciality,
				qualification,
				address1,
				address2,
				city,
				area,
				country,
				state,
				pin,
				cellNo,
				userName,
				profileDetails,
				image,
				status,
			});
		} else {
			onClose();
		}
	};

	const handleCancel = () => {
		setError(false);
		onClose();
	};

	return (
		<Dialog
			open={open}
			maxWidth='md'
			fullWidth
			classes={{ paper: styles.modalPaper }}>
			<DialogTitle className={styles.title}>DOCTOR DETAILS1</DialogTitle>
			<DialogContent>
				{error && (
					<Typography color='error' sx={{ fontWeight: "bold", mb: 2 }}>
						Please provide the following details!
					</Typography>
				)}
				<Box sx={{ display: "flex", gap: 2, mb: 3, mt: 3 }}>
					<FormControl fullWidth required error={!!councilError}>
						<InputLabel>Medical Council</InputLabel>
						<Select
							value={council}
							label='Medical Council'
							onChange={(e) => setCouncil(e.target.value)}>
							<MenuItem value=''>Select</MenuItem>
							{councils.map((c) => (
								<MenuItem key={c} value={c}>
									{c}
								</MenuItem>
							))}
						</Select>
						{councilError && (
							<Typography color='error' variant='caption'>
								{councilError}
							</Typography>
						)}
					</FormControl>
					<TextField
						label='Year of Registration'
						value={year}
						onChange={(e) => setYear(e.target.value)}
						fullWidth
						required
						type='number'
						error={!!yearError}
						helperText={yearError}
					/>
					<TextField
						label='Reg. No.'
						value={regNo}
						onChange={(e) => setRegNo(e.target.value)}
						fullWidth
						required
						error={!!regNoError}
						helperText={regNoError}
					/>
				</Box>
				{mode === "full" && (
					<Box
						sx={{
							display: { xs: "block", md: "flex" },
							gap: 4,
							alignItems: "flex-start",
							mb: 2,
						}}>
						{/* Left: Form fields */}
						<Box sx={{ flex: 2 }}>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='Name'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									sx={{ width: 80 }}
									required
								/>
								<TextField
									label='First'
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									required
									sx={{ flex: 1 }}
								/>
								<TextField
									label='Last'
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									sx={{ flex: 1 }}
								/>
								<TextField
									label='Email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									sx={{ flex: 2 }}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<FormControl fullWidth required>
									<InputLabel>Speciality</InputLabel>
									<Select
										value={speciality}
										label='Speciality'
										onChange={(e) => setSpeciality(e.target.value)}>
										{specialties.map((s) => (
											<MenuItem key={s} value={s}>
												{s}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<TextField
									label='Qualification'
									value={qualification}
									onChange={(e) => setQualification(e.target.value)}
									required
									fullWidth
								/>
							</Box>
							<TextField
								label='Address Line1'
								value={address1}
								onChange={(e) => setAddress1(e.target.value)}
								fullWidth
								required
								sx={{ mb: 2 }}
							/>
							<TextField
								label='Address Line2'
								value={address2}
								onChange={(e) => setAddress2(e.target.value)}
								fullWidth
								sx={{ mb: 2 }}
							/>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='City'
									value={city}
									onChange={(e) => setCity(e.target.value)}
									required
									sx={{ flex: 1 }}
									InputProps={{
										endAdornment: (
											<IconButton size='small'>
												<SearchIcon />
											</IconButton>
										),
									}}
								/>
								<TextField
									label='Area'
									value={area}
									onChange={(e) => setArea(e.target.value)}
									required
									sx={{ flex: 1 }}
									InputProps={{
										endAdornment: (
											<IconButton size='small'>
												<SearchIcon />
											</IconButton>
										),
									}}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='Country'
									value={country}
									onChange={(e) => setCountry(e.target.value)}
									required
									sx={{ flex: 1 }}
								/>
								<TextField
									label='State'
									value={state}
									onChange={(e) => setState(e.target.value)}
									required
									sx={{ flex: 1 }}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='PIN'
									value={pin}
									onChange={(e) => setPin(e.target.value)}
									required
									sx={{ flex: 1 }}
								/>
								<TextField
									label='Cell No.'
									value={cellNo}
									onChange={(e) => setCellNo(e.target.value)}
									required
									sx={{ flex: 1 }}
								/>
							</Box>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<TextField
									label='User Name'
									value={userName}
									onChange={(e) => setUserName(e.target.value)}
									required
									sx={{ flex: 1 }}
								/>
							</Box>
						</Box>
						{/* Right: Image upload, Status, Profile Details */}
						<Box
							sx={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "flex-start",
								mt: { xs: 2, md: 0 },
							}}>
							<Box
								sx={{
									width: 150,
									height: 150,
									border: "2px dashed #bfc5cc",
									borderRadius: 2,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									position: "relative",
									bgcolor: "#f5f5f5",
									transition: "border-color 0.2s",
									"&:hover": { borderColor: "#0288d1" },
									mb: 2,
								}}>
								<Avatar
									src={image}
									alt='Doctor'
									sx={{
										width: 134,
										height: 134,
										bgcolor: "#e0e0e0",
										fontSize: 40,
										borderRadius: 2,
									}}>
									{!image && title?.[0]}
								</Avatar>
								{image && (
									<IconButton
										size='small'
										sx={{
											position: "absolute",
											top: 4,
											right: 4,
											bgcolor: "white",
											p: 0.5,
										}}
										onClick={() => setImage(undefined)}>
										<CloseIcon fontSize='small' />
									</IconButton>
								)}
								<Tooltip title='Attach Image'>
									<IconButton
										component='label'
										sx={{
											position: "absolute",
											bottom: 4,
											right: 4,
											bgcolor: "#174a7c",
											color: "white",
											"&:hover": { bgcolor: "#0288d1" },
											boxShadow: 2,
										}}>
										<CameraAltIcon />
										<input
											type='file'
											accept='image/*'
											hidden
											onChange={(e) => {
												if (e.target.files && e.target.files[0]) {
													setImage(URL.createObjectURL(e.target.files[0]));
												}
											}}
										/>
									</IconButton>
								</Tooltip>
							</Box>
							<FormControl fullWidth required sx={{ mb: 2 }}>
								<InputLabel>Status</InputLabel>
								<Select
									value={status}
									label='Status'
									onChange={(e) => setStatus(e.target.value)}>
									<MenuItem value='Active'>Active</MenuItem>
									<MenuItem value='Inactive'>Inactive</MenuItem>
								</Select>
							</FormControl>
							<TextField
								label='Profile Details'
								value={profileDetails}
								onChange={(e) => setProfileDetails(e.target.value)}
								fullWidth
								sx={{ mb: 2 }}
							/>
						</Box>
					</Box>
				)}
			</DialogContent>
			<DialogActions sx={{ justifyContent: "center", mb: 2 }}>
				<Button
					onClick={handleProceed}
					variant='contained'
					className={styles.proceedButton}
					sx={{ mr: 2 }}>
					{mode === "short" ? "Proceed" : "Submit"}
				</Button>
				<Button
					onClick={handleCancel}
					variant='contained'
					className={styles.cancelButton}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DoctorDetailsModal;
