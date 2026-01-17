import {
	Box,
	TextField,
	MenuItem,
	FormControlLabel,
	Switch,
	Button,
	Typography,
	FormControl,
	InputLabel,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { getOwnFacilites } from "@/services/faclilityService";
import {
	FaclityServicePayload,
	FaclityServiceResponse,
} from "@/interfaces/facilityInterface";
import Message from "@/components/common/Message";
import {
	getFacilityDetails,
	editFacilityDetails,
} from "@/services/faclilityService";

interface SelectYourFacilityProps {
	selectedFacility: string;
	facilityType: string;
	setSelectedFacility: (value: string) => void;
	generateBills: boolean;
	onLoad: number;
	setGenerateBills: (value: boolean) => void;
}

const SelectYourFacility = ({
	selectedFacility,
	setSelectedFacility,
	generateBills,
	setGenerateBills,
	onLoad,
	facilityType = "",
}: SelectYourFacilityProps) => {
	const [fees, setFees] = useState("");
	const [displayFees, setDisplayFees] = useState(false);
	const [loading, setLoading] = useState(false);
	const [facilities, setFacilities] = useState<FaclityServiceResponse[]>([]);
	const [facilityDetails, setFacilityDetails] = useState<any>(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);

	const handleFeesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFees(event.target.value);
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const handleFacilityChange = async (event: SelectChangeEvent<string>) => {
		const selectedId = event.target.value;
		setSelectedFacility(selectedId);

		try {
			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				callingFrom: "app",
				orgId: localStorage.getItem("orgId") || "",
				loggedInFacilityId: localStorage.getItem("loggedinFacilityId"),
				facilityId: selectedId,
			};

			const details = await getFacilityDetails(payload);
			setFacilityDetails(details);
			console.log(details?.fees);
			setFees(details?.fees);
			setGenerateBills(details?.internBilling == 1 ? true : false);
			setDisplayFees(details?.patientsToView == 1 ? true : false);
			// Optional: If you want to update UI state based on details
			// setFees(details?.fees || '');
			// setGenerateBills(details?.generateBills || false);
			// setDisplayFees(details?.displayFees || false);
		} catch (error) {
			console.error("Error fetching facility details:", error);
			setFacilityDetails(null);
		}
	};
	if (facilityType != "telemedicine") {
		useEffect(() => {
			const fetchFacilities = async () => {
				setLoading(true);
				try {
					const payload: any = {
						userName: localStorage.getItem("userName") || "",
						userPass: localStorage.getItem("userPwd") || "",
						deviceStat: "M",
						callingFrom: "app",
						orgId: localStorage.getItem("orgId") || "",
						loggedInFacilityId:
							localStorage.getItem("loggedinFacilityId") || "",
						searchFacility: "",
						status: "All",
					};
					const data = await getOwnFacilites(payload);
					const telemedicinePresent = data.filter(
						(x) => x.facilityType == "telemedicine"
					);
					const isTelemedicine = telemedicinePresent.length ? true : false;
					console.log(telemedicinePresent);
					setFacilities(data);
				} catch (error) {
					setFacilities([]);
				} finally {
					setLoading(false);
				}
			};
			fetchFacilities();
		}, [onLoad]);
	}
	if (facilityType == "telemedicine") {
		console.log("enter");
		setSelectedFacility("");
		useEffect(() => {
			const fetchTeleMedicineData = async () => {
				setLoading(true);
				try {
					const payload = {
						userName: localStorage.getItem("userName") || "",
						userPass: localStorage.getItem("userPwd") || "",
						deviceStat: "M",
						callingFrom: "app",
						orgId: localStorage.getItem("orgId") || "",
						loggedInFacilityId: localStorage.getItem("loggedinFacilityId"),
						facilityId: "",
						facilityType: "telemedicine",
					};

					const details = await getFacilityDetails(payload);
					setFacilityDetails(details);
					console.log(details?.fees);
					setFees(details?.fees);
					setGenerateBills(details?.internBilling == 1 ? true : false);
					setDisplayFees(details?.patientsToView == 1 ? true : false);
					// Optional: If you want to update UI state based on details
					// setFees(details?.fees || '');
					// setGenerateBills(details?.generateBills || false);
					// setDisplayFees(details?.displayFees || false);
				} catch (error) {
					console.error("Error fetching facility details:", error);
					setFacilityDetails(null);
				}
			};
			fetchTeleMedicineData();
		}, [facilityType]);
	}

	const handleUpdateFacilityDetails = async () => {
		if (!facilityDetails) {
			console.error("No facility details available.");
			return;
		}

		// Build payload by merging fetched + UI values
		/*  const payload = {
      ...facilityDetails,
      internBilling: generateBills ? '1' : '0',
      patientsToView: displayFees ? '1' : '0',
      fees: fees || '0',
    }; */

		const payload = {
			callingFrom: "app",
			userName: localStorage.getItem("userName") || "",
			userPass: localStorage.getItem("userPwd") || "",
			orgId: localStorage.getItem("orgId") || "",
			deviceStat: "M",
			facilityType: facilityDetails.facilityType,
			facilityId: facilityDetails.facilityId,
			loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
			city: facilityDetails.city,
			state: facilityDetails.state,
			country: facilityDetails.country,
			pin: facilityDetails.pin,
			areaName: facilityDetails.areaName,
			facilityName: facilityDetails.facilityName,
			address1: facilityDetails.address1,
			address2: facilityDetails.address2,
			fees: fees || "0",
			patientsToView: displayFees ? "1" : "0",
			internBilling: generateBills ? "1" : "0",
			facilityColor: facilityDetails.facilityColor,
		};

		try {
			const response = await editFacilityDetails(payload);
			//console.log('Facility updated successfully:', response);
			setSnackbarMessage("Facility updated successfully");
			setSnackbarSeverity("success");
			setOpenSnackbar(true);
			// ✅ You can show a success message/snackbar here
		} catch (error) {
			// console.error('Failed to update facility:', error);
			setSnackbarMessage("Failed to update facility");
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
			// ❌ You can show error UI here
		}
	};

	return (
		<Box>
			{facilityType != "telemedicine" && (
				<FormControl fullWidth variant='outlined'>
					<InputLabel id='facility-label'>Select Facility</InputLabel>
					<Select
						labelId='facility-label'
						id='facility-select'
						value={selectedFacility}
						onChange={handleFacilityChange}
						label='Select Facility'>
						{loading ? (
							<MenuItem disabled>Loading...</MenuItem>
						) : facilities.length === 0 ? (
							<MenuItem disabled>No facilities found</MenuItem>
						) : (
							facilities.map((facility) => (
								<MenuItem
									key={facility.facilityId} // or facility.id or similar, depending on your response
									value={facility.facilityId} // or facility.facilityName if you prefer
								>
									{facility.facilityName}
								</MenuItem>
							))
						)}
					</Select>
				</FormControl>
			)}
			{(selectedFacility || facilityType === "telemedicine") && (
				<Box sx={{ mt: 3, p: 3, bgcolor: "#f5fbff", borderRadius: 3 }}>
					{/* Question 1 */}
					<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 1 }}>
						Would you also like to use it to generate and track bills?
					</Typography>
					<Box display='flex' alignItems='center' mb={3}>
						<Typography>No</Typography>
						<Switch
							checked={generateBills}
							onChange={(e) => setGenerateBills(e.target.checked)}
							color='error'
							sx={{
								mx: 1,
								"& .MuiSwitch-switchBase.Mui-checked": {
									color: "#e50914",
								},
								"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
									backgroundColor: "#e50914",
								},
							}}
						/>
						<Typography>Yes</Typography>
					</Box>

					{/* Fees + Question 2 */}
					{generateBills && (
						<Box>
							<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 1 }}>
								Fees
							</Typography>
							<TextField
								value={fees}
								onChange={handleFeesChange}
								variant='outlined'
								fullWidth
								type='number'
								InputProps={{
									sx: {
										borderRadius: 5,
										px: 2,
										py: 1,
										fontSize: "1.1rem",
									},
								}}
								sx={{
									mb: 3,
									"& .MuiOutlinedInput-root": {
										borderRadius: 5,
									},
								}}
							/>

							{/* Question 2 */}
							<Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 1 }}>
								This Fees will be displayed to be viewed by patients
							</Typography>
							<Box display='flex' alignItems='center'>
								<Typography>No</Typography>
								<Switch
									checked={displayFees}
									onChange={(e) => setDisplayFees(e.target.checked)}
									color='error'
									sx={{
										mx: 1,
										"& .MuiSwitch-switchBase.Mui-checked": {
											color: "#e50914",
										},
										"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
											backgroundColor: "#e50914",
										},
									}}
								/>
								<Typography>Yes</Typography>
							</Box>
						</Box>
					)}

					{/* Buttons */}
					<Box display='flex' justifyContent='space-between' mt={4}>
						<Button
							onClick={() => setSelectedFacility("")}
							sx={{
								color: "#e50914",
								fontWeight: "bold",
								textTransform: "none",
								fontSize: "1rem",
							}}>
							Cancel
						</Button>
						<Button
							variant='contained'
							onClick={handleUpdateFacilityDetails}
							sx={{
								bgcolor: "#0c3c69",
								color: "white",
								px: 4,
								py: 1,
								borderRadius: 5,
								textTransform: "none",
								fontWeight: "bold",
								fontSize: "1rem",
								"&:hover": {
									bgcolor: "#0a2f52",
								},
							}}
							endIcon={<AddIcon />}>
							Update
						</Button>
					</Box>
				</Box>
			)}
			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</Box>
	);
};

export default SelectYourFacility;
