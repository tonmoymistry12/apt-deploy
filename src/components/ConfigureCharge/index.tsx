"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Button,
	Grid,
	Paper,
	Tab,
	Tabs,
	TextField,
	Typography,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	FormLabel,
	Alert,
} from "@mui/material";
import {
	getOrgPaymentConfigInfo,
	saveOrganizationConfig,
} from "@/services/configureChargesService";
import Message from "../common/Message";

export default function ChargeEvent() {
	const [paymentInfo, setPaymentInfo] = useState(null);
	const [tabIndex, setTabIndex] = useState(0);
	const [errorMessage, setErrorMessage] = useState("");
	const [registrationOption, setRegistrationOption] = useState("");
	const [registrationFee, setRegistrationFee] = useState("");
	const [consultationFees, setConsultationFees] = useState({
		booking: "0.0",
		arrival: "0.0",
		completion: "0.0",
	});

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);

	const basePayload = {
		callingFrom: "web",
		userName: localStorage.getItem("userName") || "",
		userPass: localStorage.getItem("userPwd") || "",
		orgId: localStorage.getItem("orgId") || "",
		loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
		deviceStat: "M",
	};

	const fetchPaymentOrgInfo = async () => {
		const response = await getOrgPaymentConfigInfo(basePayload);
		setPaymentInfo(response);
		setRegistrationFee(response.registrationFee);
		const findRegistrationOption =
			response.registrationFeePostEvent == "regcomplete" ? "mrn" : "bill";
		setRegistrationOption(findRegistrationOption);
		setConsultationFees({
			booking: response.consultationFeeOnBookingPerc,
			arrival: response.consultationFeeOnArrivalPerc,
			completion: response.consultationFeeOnCompletionPerc,
		});
	};

	useEffect(() => {
		fetchPaymentOrgInfo();
	}, []);

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	/*   "consultationFeeOnBookingPerc": 0.0,
  "consultationFeeOnArrivalPerc": 0.0,
  "consultationFeeOnCompletionPerc": 100.0,

 "registrationFee": 350.0, 
 registrationFeePostEvent to select MRN or select
 "configSection": "Registration", or Consultation
    "regcollect": "firstbill", if MRN then it regcomplete
 */

	const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
		setTabIndex(newValue);
	};

	const updateRegistration = async () => {
		let registrationPayload;
		if (tabIndex == 0) {
			registrationPayload = {
				...basePayload,
				configSection: tabIndex == 0 ? "Registration" : "Consultation",
				regcollect: registrationOption == "mrn" ? "regcomplete" : "firstbill",
				regCharge: registrationFee,
			};
		} else {
			registrationPayload = {
				...basePayload,
				configSection: tabIndex == 0 ? "Registration" : "Consultation",
				regcollect: "",
				regCharge: "",
				onBookingPerc: consultationFees.booking,
				onArrivalPerc: consultationFees.arrival,
				onCompletionPerc: consultationFees.completion,
			};
		}
		try {
			const response = await saveOrganizationConfig(registrationPayload);
			setSnackbarSeverity("success");
			setOpenSnackbar(true);
			setSnackbarMessage(response.message);
		} catch (error) {
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
			setSnackbarMessage("Some error occured");
		}
	};

	const handleConsultUpdate = () => {
		console.log(consultationFees);
		if (
			Number(consultationFees?.arrival ? consultationFees?.arrival : 0) > 0 &&
			Number(consultationFees?.booking ? consultationFees?.booking : 0) > 0 &&
			Number(consultationFees?.completion ? consultationFees?.completion : 0) >
				0
		) {
			setErrorMessage("You can't select more than two field");
			return;
		}
		if (
			Number(consultationFees?.arrival ? consultationFees?.arrival : 0) +
				Number(consultationFees?.booking ? consultationFees?.booking : 0) +
				Number(
					consultationFees?.completion ? consultationFees?.completion : 0
				) !=
			100
		) {
			setErrorMessage("Your total selection is not equal to 100");
			return;
		}
		if (
			Number(consultationFees?.arrival ? consultationFees?.arrival : 0) +
				Number(consultationFees?.booking ? consultationFees?.booking : 0) +
				Number(
					consultationFees?.completion ? consultationFees?.completion : 0
				) ==
			100
		) {
			setErrorMessage("");
			updateRegistration();
		}
	};

	return (
		<Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: "auto", mt: 0 }}>
			<Typography variant='h5' gutterBottom>
				Charge Event
			</Typography>

			<Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3 }}>
				<Tab label='Registration' />
				<Tab label='Consultation' />
			</Tabs>

			{tabIndex === 0 && (
				<Box>
					<FormControl component='fieldset' fullWidth>
						<FormLabel component='legend' sx={{ mb: 1 }}>
							Registration will be collected at
						</FormLabel>
						<RadioGroup
							value={registrationOption}
							onChange={(e) => setRegistrationOption(e.target.value)}>
							<FormControlLabel
								value='mrn'
								control={<Radio />}
								label='MRN creation (i.e. at registration completion)'
							/>
							<FormControlLabel
								value='bill'
								control={<Radio />}
								label='Together with first bill'
							/>
						</RadioGroup>
					</FormControl>

					<Grid container spacing={2} alignItems='center' sx={{ mt: 2 }}>
						<Grid item xs={12} sm={4}>
							<Typography>Registration Fees:</Typography>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								size='small'
								value={registrationFee}
								onChange={(e) => setRegistrationFee(e.target.value)}
							/>
						</Grid>
					</Grid>

					<Box textAlign='right' mt={4}>
						<Button
							variant='contained'
							onClick={updateRegistration}
							color='primary'>
							Update
						</Button>
					</Box>
				</Box>
			)}

			{tabIndex === 1 && (
				<Box>
					<Alert
						variant='standard'
						severity='info'
						sx={{
							backgroundColor: "transparent",
							padding: 0,
						}}>
						The total collection should be 100 and you can choose maximum two
						field
					</Alert>
					{errorMessage && (
						<Alert
							variant='standard'
							severity='error'
							sx={{
								backgroundColor: "transparent",
								padding: 0,
							}}>
							{errorMessage}
						</Alert>
					)}

					<Grid container spacing={2} alignItems='center'>
						<Grid item xs={8}>
							<Typography fontWeight='bold'>
								Consultation fees will be collected at
							</Typography>
						</Grid>
						<Grid item xs={4}>
							<Typography fontWeight='bold'>Collection (%)</Typography>
						</Grid>

						<Grid item xs={8}>
							<Typography>At the time of Appointment booking</Typography>
						</Grid>
						<Grid item xs={4}>
							<TextField
								fullWidth
								size='small'
								value={consultationFees.booking}
								onChange={(e) =>
									setConsultationFees({
										...consultationFees,
										booking: e.target.value,
									})
								}
							/>
						</Grid>

						<Grid item xs={8}>
							<Typography>At the time of arrival</Typography>
						</Grid>
						<Grid item xs={4}>
							<TextField
								fullWidth
								size='small'
								value={consultationFees.arrival}
								onChange={(e) =>
									setConsultationFees({
										...consultationFees,
										arrival: e.target.value,
									})
								}
							/>
						</Grid>

						<Grid item xs={8}>
							<Typography>At the time of Encounter completion</Typography>
						</Grid>
						<Grid item xs={4}>
							<TextField
								fullWidth
								size='small'
								value={consultationFees.completion}
								onChange={(e) =>
									setConsultationFees({
										...consultationFees,
										completion: e.target.value,
									})
								}
							/>
						</Grid>
					</Grid>

					<Box textAlign='right' mt={4}>
						<Button
							variant='contained'
							onClick={handleConsultUpdate}
							color='primary'>
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
		</Paper>
	);
}
