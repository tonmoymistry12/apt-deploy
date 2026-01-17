import React, { useEffect, useState } from "react";
import {
	Box,
	TextField,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Typography,
	Radio,
	RadioGroup,
	FormControl,
	FormLabel,
} from "@mui/material";
import CommonTable from "../common/table/Table";
import TableLinkButton from "../common/buttons/TableLinkButton";
import SettingsIcon from "@mui/icons-material/Settings";
import CummonDialog from "../common/CummonDialog";
import {
	getCorporateDiscount,
	getLoyalityDiscount,
	saveCorporateDiscount,
} from "@/services/discountService";
import Message from "../common/Message";

interface DiscountDetail {
	type: "value" | "percentage";
	amount: string;
}

interface CorporateDiscountData {
	name: string;
	discountCategory?: string;
	applicableOn: string[];
	discountDetails: any;
	action: JSX.Element;
}

interface FormState {
	name: string;
	discountCategory: string;
	applicableOn: string[];
	discountDetails: any;
}

export default function CorporateDiscount() {
	const [open, setOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [discountId, setDiscountID] = useState(0);
	const [editIndex, setEditIndex] = useState<any>();
	const [formData, setFormData] = useState<FormState>({
		name: "abc",
		discountCategory: "",
		applicableOn: [],
		discountDetails: {},
	});

	const [corporateData, setCorporateData] = useState<CorporateDiscountData[]>(
		[]
	);

	const [corporateName, setCorporateName] = useState("");

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const basePayload: GetAllDiscountDetailsPayload = {
		callingFrom: "web",
		userName: localStorage.getItem("userName") || "",
		userPass: localStorage.getItem("userPwd") || "",
		orgId: localStorage.getItem("orgId") || "",
		loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
	};

	const getDiscountList = async () => {
		const data: any = await getLoyalityDiscount(basePayload);
		setCorporateData(data.corporateList);
		console.log(data.corporateList);
	};

	const getDiscountDetailsById = async (id: any) => {
		setEditIndex(id);
		const details = await getCorporateDiscount({
			...basePayload,
			corporateId: id,
		});
		console.log(details);
		handleOpenDialog(details);
	};

	useEffect(() => {
		getDiscountList();
	}, []);

	const handleOpenDialog = (data: any) => {
		if (data) {
			console.log(data);
			console.log(data.discountId);
			setCorporateName(data.corporateName);
			setDiscountID(data.discountId);
			//	const data = corporateData[index];
			const applicableList = [];
			if (data.applyOnRegistration == 1) {
				applicableList.push("Registration");
			}
			if (data.applyOnConsultation == 1) {
				applicableList.push("Consultation");
			}
			if (data.applyOnPharmacy == 1) {
				applicableList.push("Pharmacy");
			}
			if (data.applyOnProcedure == 1) {
				applicableList.push("Procedure");
			}
			if (data.applyOnOrder == 1) {
				applicableList.push("Order");
			}
			const discountDetails = {
				Registration: {
					type: data?.percentageRegistration > 0 ? "percentage" : "value",
					amount:
						data?.percentageRegistration > 0
							? data?.percentageRegistration
							: data?.valueRegistration,
				},
				Consultation: {
					type: data?.percentageConsultation > 0 ? "percentage" : "value",
					amount:
						data?.percentageConsultation > 0
							? data?.percentageConsultation
							: data?.valueConsultation,
				},
				Pharmacy: {
					type: data?.percentagePharmacy > 0 ? "percentage" : "value",
					amount:
						data?.percentagePharmacy > 0
							? data?.percentagePharmacy
							: data?.valuePharmacy,
				},
				Procedure: {
					type: data?.percentageProcedure > 0 ? "percentage" : "value",
					amount:
						data?.percentageProcedure > 0
							? data?.percentageProcedure
							: data?.valueProcedure,
				},
				Order: {
					type: data?.percentageOrder > 0 ? "percentage" : "value",
					amount:
						data?.percentageOrder > 0
							? data?.percentageOrder
							: data?.valueOrder,
				},
			};
			setFormData({
				name: data.discountName,
				discountCategory: data.discountName || "",
				applicableOn: applicableList || [],
				discountDetails: discountDetails || {},
			});
			setIsEditing(true);
			//	setEditIndex(index);
		} else {
			setFormData({
				name: "abc",
				discountCategory: "",
				applicableOn: [],
				discountDetails: {},
			});
			setIsEditing(false);
			setEditIndex(null);
		}
		setOpen(true);
	};

	const handleCloseDialog = () => {
		setOpen(false);
		setFormData({
			name: "abc",
			discountCategory: "",
			applicableOn: [],
			discountDetails: {},
		});
		setIsEditing(false);
		setEditIndex(null);
	};

	const handleSubmit = async () => {
		const updatedData = [...corporateData];
		console.log(formData);
		console.log(editIndex);
		console.log(discountId);
		const saveObj = {
			...basePayload,
			discountId: discountId ? discountId : 0,
			corporateId: editIndex,
			discountName: formData.discountCategory,
			checkedRegistration: formData.applicableOn.includes("Registration")
				? "1"
				: 0,
			valueRegistration:
				formData?.discountDetails?.Registration?.type == "value"
					? formData?.discountDetails?.Registration?.amount
					: 0,
			percentageRegistration:
				formData?.discountDetails?.Registration?.type == "percentage"
					? formData?.discountDetails?.Registration?.amount
					: 0,
			checkedConsultation: formData?.applicableOn?.includes("Consultation")
				? "1"
				: 0,
			valueConsultation:
				formData?.discountDetails?.Consultation?.type == "value"
					? formData.discountDetails.Consultation.amount
					: 0,
			percentageConsultation:
				formData.discountDetails?.Consultation?.type == "percentage"
					? formData?.discountDetails?.Consultation?.amount
					: 0,
			checkedPharmacy: formData?.applicableOn?.includes("Pharmacy") ? "1" : 0,
			valuePharmacy:
				formData?.discountDetails?.Pharmacy?.type == "value"
					? formData?.discountDetails?.Pharmacy?.amount
					: 0,
			percentagePharmacy:
				formData?.discountDetails?.Pharmacy?.type == "percentage"
					? formData?.discountDetails?.Pharmacy?.amount
					: 0,
			checkedProcedure: formData?.applicableOn?.includes("Procedure") ? "1" : 0,
			valueProcedure:
				formData?.discountDetails?.Procedure?.type == "value"
					? formData?.discountDetails?.Procedure?.amount
					: 0,
			percentageProcedure:
				formData?.discountDetails?.Procedure?.type == "percentage"
					? formData?.discountDetails?.Procedure?.amount
					: 0,
			checkedOrder: formData?.applicableOn?.includes("Order") ? "1" : 0,
			valueOrder:
				formData?.discountDetails?.Order?.type == "value"
					? formData?.discountDetails?.Order?.amount
					: 0,
			percentageOrder:
				formData?.discountDetails?.Order?.type == "percentage"
					? formData?.discountDetails?.Order?.amount
					: 0,
		};
		try {
			const response = await saveCorporateDiscount(saveObj);
			setOpenSnackbar(true);
			setSnackbarSeverity("success");
			setSnackbarMessage("Data saved Successfully");
		} catch (error) {
			setOpenSnackbar(true);
			setSnackbarSeverity("error");
			setSnackbarMessage("Some Error Occured");
		}

		/* const newEntry = {
			name: formData.name,
			discountCategory: formData.discountCategory,
			applicableOn: formData.applicableOn,
			discountDetails: formData.discountDetails,
			action: <></>,
		};

		if (isEditing && editIndex !== null) {
			updatedData[editIndex] = newEntry;
		} else {
			updatedData.push(newEntry);
		} */

		setCorporateData(updatedData);
		handleCloseDialog();
	};

	const corporateColumns = [
		{ id: "corporateName", label: "Name" },
		{ id: "action", label: "Action" },
	];

	const tableData = corporateData.map((data: any, index) => ({
		...data,
		action: (
			<TableLinkButton
				text='Configure'
				icon={<SettingsIcon />}
				onClick={() => getDiscountDetailsById(data.corporateId)}
			/>
		),
	}));

	const applicableOnOptions = [
		"Registration",
		"Consultation",
		"Pharmacy",
		"Procedure",
		"Order",
	];

	const handleCheckboxChange = (option: string) => {
		let updatedApplicableOn: string[];
		let updatedDiscountDetails = { ...formData.discountDetails };

		if (formData.applicableOn.includes(option)) {
			updatedApplicableOn = formData.applicableOn.filter(
				(item) => item !== option
			);
			delete updatedDiscountDetails[option];
		} else {
			updatedApplicableOn = [...formData.applicableOn, option];
			updatedDiscountDetails[option] = { type: "percentage", amount: "" };
		}

		setFormData({
			...formData,
			applicableOn: updatedApplicableOn,
			discountDetails: updatedDiscountDetails,
		});
	};

	const handleDiscountTypeChange = (
		option: string,
		type: "value" | "percentage"
	) => {
		setFormData({
			...formData,
			discountDetails: {
				...formData.discountDetails,
				[option]: { ...formData.discountDetails[option], type, amount: "" },
			},
		});
	};

	// Handle discount amount change
	const handleDiscountAmountChange = (option: string, amount: string) => {
		setFormData({
			...formData,
			discountDetails: {
				...formData.discountDetails,
				[option]: { ...formData.discountDetails[option], amount },
			},
		});
	};

	return (
		<Box mt={3}>
			<CommonTable
				heading='Corporate Discount'
				showSearch={true}
				showAddButton={false}
				showFilterButton={false}
				colHeaders={corporateColumns}
				rowData={tableData}
				// onAdd={() => handleOpenDialog()}
			/>

			<CummonDialog
				open={open}
				title='Corporate Discount Details'
				onClose={handleCloseDialog}
				onSubmit={handleSubmit}
				submitLabel={isEditing ? "Save" : "Submit"}
				cancelLabel='Cancel'
				maxWidth='sm'>
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 }}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Typography variant='body1'>Corporate Name :</Typography>
						<Typography variant='body1' sx={{ fontWeight: "bold" }}>
							{corporateName}
						</Typography>
					</Box>
					<TextField
						label='Discount Category Name'
						value={formData.discountCategory}
						onChange={(e) =>
							setFormData({ ...formData, discountCategory: e.target.value })
						}
						fullWidth
						required
						InputLabelProps={{ required: true }}
					/>
					<Typography variant='body1'>Discount applicable on :</Typography>
					<FormGroup>
						{applicableOnOptions.map((option) => (
							<Box key={option} sx={{ mb: 2 }}>
								<FormControlLabel
									control={
										<Checkbox
											checked={formData.applicableOn.includes(option)}
											onChange={() => handleCheckboxChange(option)}
										/>
									}
									label={option}
								/>
								{formData.applicableOn.includes(option) && (
									<Box sx={{ ml: 4, mt: 1 }}>
										<FormControl component='fieldset'>
											<FormLabel component='legend'>Discount :</FormLabel>
											<RadioGroup
												row
												value={
													formData.discountDetails[option]?.type || "percentage"
												}
												onChange={(e) =>
													handleDiscountTypeChange(
														option,
														e.target.value as "value" | "percentage"
													)
												}>
												<FormControlLabel
													value='value'
													control={<Radio />}
													label='By value'
												/>
												<FormControlLabel
													value='percentage'
													control={<Radio />}
													label='By percentage'
												/>
											</RadioGroup>
											<TextField
												sx={{ mt: 1 }}
												value={formData.discountDetails[option]?.amount || ""}
												onChange={(e) =>
													handleDiscountAmountChange(option, e.target.value)
												}
												placeholder={
													formData.discountDetails[option]?.type === "value"
														? "Enter amount"
														: "Enter percentage"
												}
												type='number'
												size='small'
												InputProps={{ inputProps: { min: 0 } }}
											/>
										</FormControl>
									</Box>
								)}
							</Box>
						))}
					</FormGroup>
				</Box>
			</CummonDialog>
			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</Box>
	);
}
