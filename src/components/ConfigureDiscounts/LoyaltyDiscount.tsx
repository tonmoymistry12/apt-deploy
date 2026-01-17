import React, { useEffect, useState } from "react";
import {
	Box,
	TextField,
	FormControlLabel,
	Checkbox,
	Radio,
	RadioGroup,
	Button,
	Typography,
	Grid,
} from "@mui/material";
import {
	getLoyalityDiscount,
	postLoyalityDiscount,
} from "@/services/discountService";
import Message from "../common/Message";

export default function LoyaltyDiscount() {
	//const [discountType, setDiscountType] = useState('value');
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);
	const [discountData, setDiscountData] = useState({
		cuttOffAge: 0,
		discountValue: 0,
		discountPercentage: 0,
		applyOnRegistration: 0,
		applyOnConsultation: 0,
		applyOnPharmacy: 0,
		applyOnProcedure: 0,
		applyOnOrder: 0,
		discountType: "byval",
		discountId: 1,
	});
	const [discountType, setDiscountType] = useState<"byval" | "bypercent">(
		"byval"
	);
	const updateField = (field: string, value: any) => {
		setDiscountData((prev) => ({
			...prev,
			[field]: value,
		}));
	};
	const basePayload: GetAllDiscountDetailsPayload = {
		callingFrom: "web",
		userName: localStorage.getItem("userName") || "",
		userPass: localStorage.getItem("userPwd") || "",
		orgId: localStorage.getItem("orgId") || "",
		loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
	};

	useEffect(() => {
		const fetchLoyalityDiscountData = async () => {
			try {
				const data = await getLoyalityDiscount(basePayload);
				setDiscountData(data);
				setDiscountType(data.discountValue > 0 ? "byval" : "bypercent");
			} catch (error) {
				console.log(error);
				setSnackbarSeverity("error");
				setSnackbarMessage("Face Some issue");
			}
		};
		fetchLoyalityDiscountData();
	}, []);

	const handleSave = async () => {
		if (!discountData) return;

		try {
			console.log(discountType);
			const payload = {
				...basePayload,
				//discountId: discountType == "byval" ? 0 : 1,
				discountId: discountData.discountId ? discountData.discountId : 0,
				cuttOffAge: discountData.cuttOffAge.toString(),
				discountByValue:
					discountType == "byval" ? discountData.discountValue.toFixed(2) : 0.0,
				discountByPercentage:
					discountType == "bypercent"
						? discountData.discountPercentage.toFixed(2)
						: 0.0,
				registrationFee: discountData.applyOnRegistration.toString(),
				consultationFee: discountData.applyOnConsultation.toString(),
				pharmacyFee: discountData.applyOnPharmacy.toString(),
				procedureFee: discountData.applyOnProcedure.toString(),
				orderFee: discountData.applyOnOrder.toString(),
			};
			console.log(payload);
			await postLoyalityDiscount(payload);
			setOpenSnackbar(true);
			setSnackbarSeverity("success");
			setSnackbarMessage("Discount Saved Successfully");
		} catch (error) {
			console.error("Save error:", error);
			setOpenSnackbar(true);
			setSnackbarSeverity("error");
			setSnackbarMessage("Face Some issue");
		}
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};
	return (
		<>
			<Box component='form' sx={{ mt: 2 }}>
				<Grid container spacing={1}>
					{/* Left Column: Cut-off Age and Discount */}
					<Grid item xs={12} md={6}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							{/* Cut-off Age */}
							<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
								<Typography variant='subtitle1' fontWeight='medium'>
									Cut-off Age
								</Typography>
								<Box display='flex' alignItems='center' gap={1}>
									<TextField
										type='number'
										size='small'
										value={discountData.cuttOffAge || ""}
										onChange={(e) =>
											updateField("cuttOffAge", Number(e.target.value))
										}
										inputProps={{ min: 0 }}
										sx={{ maxWidth: 150 }}
									/>
									<Typography variant='body2'>years</Typography>
								</Box>
							</Box>

							{/* Discount Type */}
							<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
								<Typography variant='subtitle1' fontWeight='medium'>
									Discount
								</Typography>
								<Box
									sx={{
										display: "flex",
										flexDirection: "row",
										gap: 3,
										alignItems: "center",
									}}>
									{/* By Value */}
									<Box display='flex' alignItems='center' gap={1}>
										<FormControlLabel
											value='byval'
											control={
												<Radio
													checked={discountType === "byval"}
													onChange={() => setDiscountType("byval")}
												/>
											}
											label='By Value'
										/>
										<TextField
											type='number'
											size='small'
											value={discountData?.discountValue}
											onChange={(e) =>
												updateField("discountValue", Number(e.target.value))
											}
											inputProps={{ min: 0, step: 0.01 }}
											sx={{ maxWidth: 120 }}
											disabled={discountType !== "byval"}
										/>
									</Box>

									{/* By Percentage */}
									<Box display='flex' alignItems='center' gap={1}>
										<FormControlLabel
											value='bypercent'
											control={
												<Radio
													checked={discountType === "bypercent"}
													onChange={() => setDiscountType("bypercent")}
												/>
											}
											label='By Percentage'
										/>
										<TextField
											type='number'
											size='small'
											value={discountData?.discountPercentage}
											onChange={(e) =>
												updateField(
													"discountPercentage",
													Number(e.target.value)
												)
											}
											inputProps={{ min: 0, max: 100, step: 0.1 }}
											sx={{ maxWidth: 120 }}
											disabled={discountType !== "bypercent"}
										/>
									</Box>
								</Box>
							</Box>
						</Box>
					</Grid>

					{/* Right Column: Discount Applicable On */}
					<Grid item xs={12} md={6}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
							<Typography variant='subtitle1' fontWeight='medium'>
								Discount Applicable On
							</Typography>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
								{[
									["applyOnRegistration", "Registration Fee"],
									["applyOnConsultation", "Consultation Fee"],
									["applyOnPharmacy", "Pharmacy"],
									["applyOnProcedure", "Procedure"],
									["applyOnOrder", "Order"],
								].map(([key, label]) => (
									<FormControlLabel
										key={key}
										control={
											<Checkbox
												checked={(discountData as any)[key] === 1}
												onChange={(e) =>
													updateField(key, e.target.checked ? 1 : 0)
												}
											/>
										}
										label={label}
									/>
								))}
							</Box>
						</Box>
					</Grid>

					{/* Save Button */}
					<Grid item xs={12}>
						<Box textAlign='right' mt={3}>
							<Button onClick={handleSave} variant='contained' color='primary'>
								Save
							</Button>
						</Box>
					</Grid>
				</Grid>
			</Box>

			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</>
	);
}
