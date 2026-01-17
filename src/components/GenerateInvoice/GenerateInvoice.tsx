import React, { useEffect, useState } from "react";
import CommonTable from "../common/table/Table";
import TableLinkButton from "../common/buttons/TableLinkButton";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
	Box,
	Table,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	TableBody,
	TextField,
} from "@mui/material";
import CummonDialog from "../common/CummonDialog";
import {
	getPatientlistWithdueCharges,
	getPatientPendingCharges,
	getRevisedDiscount,
	addInvoice,
} from "@/services/generateInvoiceService";
import { format, isValid } from "date-fns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Message from "../common/Message";

// Define interface for invoice data
interface Invoice {
	id: number;
	ownerFirstName: string;
	ownerLastName: string;
	petName: string;
	mrn: string;
	encounterDate: string;
	totalDueAmount: number;
}

interface GenerateInvoiceProps {
	onDataUpdate?: (invoices: Invoice[]) => void;
}

const GenerateInvoice: React.FC<GenerateInvoiceProps> = ({ onDataUpdate }) => {
	const [invoices, setInvoices] = useState<any>([]);
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [viewData, setViewData] = useState<any>(null);
	const [rowData, setRowData] = useState<any>(null);
	const [invoiceDate, setInvoiceDate] = useState<Date | null>(new Date());
	const [doctorName, setDoctorName] = useState("");
	const [encounterDate, setEncounterDate] = useState("");

	// --- Per-row states ---
	const [quantities, setQuantities] = useState<any>({});
	const [revisedValues, setRevisedValues] = useState<any>({});
	const [taxValues, setTaxValues] = useState<any>({});
	const [gstValues, setGstValues] = useState<any>({});
	const [showGstValues, setShowGstValues] = useState<any>(0);
	const [totalValues, setTotalValues] = useState<any>({});
	const [showTotalValues, setShowTotalValues] = useState<any>(0);
	const [discountValues, setDiscountValues] = useState<any>({});
	const [showDiscountValues, setShowDiscountValues] = useState<any>(0);

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const formattedDate =
		invoiceDate && isValid(invoiceDate)
			? format(invoiceDate, "dd/MM/yyyy")
			: "";

	const formatDate = (dateString: any) => {
		const date = new Date(dateString);

		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	};

	const handleDateChange = (newValue: Date | null) => {
		setInvoiceDate(newValue);
	};

	const basePayload = {
		callingFrom: "web",
		userName: localStorage.getItem("userName") || "",
		userPass: localStorage.getItem("userPwd") || "",
		orgId: localStorage.getItem("orgId") || "",
		loggedInFacilityId: localStorage.getItem("loggedinFacilityId"),
		//loggedInFacilityId: 1,
	};

	const fetchWithdrawCharges = async () => {
		try {
			const response = await getPatientlistWithdueCharges(basePayload);
			setInvoices(await response);
		} catch (error: any) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchWithdrawCharges();
	}, []);

	const colHeaders = [
		{ id: "firstName", label: "Owner First Name" },
		{ id: "lastName", label: "Owner Last Name" },
		{ id: "petName", label: "Pet Name" },
		{ id: "mrn", label: "MRN" },
		{ id: "transactionDate", label: "Encounter Date" },
		{ id: "chargeAmount", label: "Total Due Amount" },
		{ id: "action", label: "Action" },
	];

	const handleGenerateClick = async (invoice: any) => {
		setRowData(invoice);
		setInvoiceDate(new Date());
		const payload = {
			...basePayload,
			mrn: invoice.mrn,
			appointmentId: invoice.appointmentId,
		};
		const response = await getPatientPendingCharges(payload);
		setViewData(response);

		response.forEach((item) => {
			if (item.doctorName) setDoctorName(item.doctorName);
			if (item.encounterDate) setEncounterDate(item.encounterDate);
		});

		// Initialize per-row states
		const rowId = response[0].apOrgChargeItemId;
		setQuantities({ [rowId]: response[0].quantity });
		setRevisedValues({ [rowId]: response[0].chargeItemRate });
		setTaxValues({ [rowId]: response[0].taxPercentage });
		const totalCharge = response.reduce(
			(acc: any, item: any) => acc + (item.chargeAmount || 0),
			0
		);

		const totalTax = response.reduce(
			(acc: any, item: any) => acc + (item.taxAmount || 0),
			0
		);
		setShowGstValues(totalTax);
		console.log(totalCharge);
		setShowTotalValues(totalCharge);

		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
		setViewData(null);
	};

	/* const handleGenerate = () => {
		window.print();
		handleClose();
	}; */

	const handleGenerate = async () => {
		//window.print();
		const invoiceDetails = viewData.map((row: any) => {
			return {
				chargeId: row.chargeId,
				revisedRate: revisedValues[row.apOrgChargeItemId] ?? row.chargeItemRate,
				quantity: quantities[row.apOrgChargeItemId] ?? row.quantity,
				taxPercentage: taxValues[row.apOrgChargeItemId] ?? row.taxPercentage,
			};
		});
		console.log(invoiceDetails);
		const payloadObj = {
			...basePayload,
			mrn: rowData.mrn,
			appointmentId: rowData.appointmentId,
			invDate: formatDate(invoiceDate),
			totalCharge: showTotalValues,
			totalDiscount: showDiscountValues,
			totalTax: showGstValues,
			netAmountPayble: showTotalValues + showGstValues - showDiscountValues,
			invoiceDetails: invoiceDetails,
		};
		try {
			const response = await addInvoice(payloadObj);

			setSnackbarMessage(
				response?.status ? response?.status : "Invoice generated successfully!"
			);
			setSnackbarSeverity("success");
			setOpenSnackbar(true);
			fetchWithdrawCharges();
		} catch (error) {
			setSnackbarMessage("Some error is there");
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
		}

		handleClose();
	};
	// --- Update functions for each input ---
	const updateQuantity = (id: number, value: number) => {
		setQuantities((prev: any) => ({ ...prev, [id]: value }));
	};

	const updateRevisedValue = (id: number, value: number) => {
		setRevisedValues((prev: any) => ({ ...prev, [id]: value }));
	};

	const updateTaxes = (id: number, value: number) => {
		setTaxValues((prev: any) => ({ ...prev, [id]: value }));
	};

	// --- setData function per row ---
	const setData = async (row: any) => {
		const rowId = row.apOrgChargeItemId;
		const quantity = quantities[rowId] ?? 1;
		const revisedRate = revisedValues[rowId] ?? row.chargeItemRate;
		const taxPercent = taxValues[rowId] ?? row.taxPercentage;

		const gstAmount = (revisedRate * quantity * taxPercent) / 100;
		const totalAmount = revisedRate * quantity + gstAmount;
		console.log(gstAmount);
		const totalCharge = viewData.reduce((acc: number, item: any) => {
			const rowId = item.apOrgChargeItemId;
			const quantity = quantities[rowId] ?? item.quantity;
			const revisedRate = revisedValues[rowId] ?? item.chargeItemRate;
			const taxPercent = taxValues[rowId] ?? item.taxPercentage;

			//const gstAmount = (revisedRate * quantity * taxPercent) / 100;
			const totalAmount = revisedRate * quantity;

			return acc + totalAmount;
		}, 0);

		const totalTax = viewData.reduce((acc: number, item: any) => {
			const rowId = item.apOrgChargeItemId;
			const quantity = quantities[rowId] ?? item.quantity;
			const revisedRate = revisedValues[rowId] ?? item.chargeItemRate;
			const taxPercent = taxValues[rowId] ?? item.taxPercentage;

			const gstAmount = (revisedRate * quantity * taxPercent) / 100;

			return acc + gstAmount;
		}, 0);

		setShowGstValues(totalTax);
		setShowTotalValues(totalCharge);
		setGstValues((prev: any) => ({ ...prev, [rowId]: gstAmount }));
		setTotalValues((prev: any) => ({ ...prev, [rowId]: totalAmount }));

		// Call discount API
		try {
			const payload = {
				...basePayload,
				revisedRate: revisedRate,
				quantity: quantity,
				refWith: "Consultation",
				chargeId: row.chargeId,
			};
			const response = await getRevisedDiscount(payload);
			const discountAmount = response?.discountAmount ?? 0;
			setShowDiscountValues(discountAmount);
			setDiscountValues((prev: any) => ({ ...prev, [rowId]: discountAmount }));
		} catch (err) {
			console.error("Error fetching discount:", err);
		}
	};

	const renderInvoiceDetails = (invoice: any) => {
		const rowId = invoice[0].apOrgChargeItemId;

		return (
			<Box sx={{ p: 3 }}>
				<Typography
					variant='h6'
					align='center'
					gutterBottom
					sx={{ fontWeight: "bold" }}>
					INVOICE DETAILS
				</Typography>

				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
					<Typography sx={{ flex: 1, fontWeight: "bold" }}>
						Patient Name:{" "}
						<span style={{ fontWeight: "normal" }}>{rowData.patientName}</span>
					</Typography>
					<Typography sx={{ flex: 1, fontWeight: "bold", textAlign: "center" }}>
						Physician Name:{" "}
						<span style={{ fontWeight: "normal" }}>{doctorName}</span>
					</Typography>
					<Typography sx={{ flex: 1, fontWeight: "bold", textAlign: "right" }}>
						Encounter Date:{" "}
						<span style={{ fontWeight: "normal" }}>{encounterDate}</span>
					</Typography>
				</Box>

				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-start",
						mb: 2,
						width: 250,
					}}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label='Invoice Date'
							value={invoiceDate}
							onChange={handleDateChange}
							format='dd/MM/yyyy'
							slotProps={{
								textField: { fullWidth: true, size: "small" },
							}}
						/>
					</LocalizationProvider>
				</Box>

				<Table sx={{ mb: 2, borderCollapse: "collapse" }}>
					<TableHead>
						<TableRow sx={{ backgroundColor: "#e0e0e0" }}>
							{[
								"ITEM",
								"QUANTITY",
								"VALUE PER UNIT",
								"CURRENT PAYMENT %",
								"PAYMENT DUE",
								"REVISED VALUE PER UNIT",
								"GST or Other Tax %",
								"GST or Other Tax Amount",
								"TOTAL VALUE",
							].map((col) => (
								<TableCell
									key={col}
									sx={{
										fontWeight: "bold",
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{col}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{invoice.map((row: any) => (
							<TableRow key={row.apOrgChargeItemId}>
								<TableCell sx={{ border: "1px solid #ccc", padding: "8px" }}>
									{row.chargeItemName} {row.doctorName && `(${row.doctorName})`}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									<TextField
										type='number'
										value={quantities[row.apOrgChargeItemId] ?? row.quantity}
										onChange={(e) =>
											updateQuantity(
												row.apOrgChargeItemId,
												Number(e.target.value)
											)
										}
										onBlur={() => setData(row)}
										size='small'
										sx={{ width: 80 }}
										inputProps={{ min: 1 }}
									/>
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{row.basePricePerUnit}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{row.paymentPerentage}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{row.chargeItemRate}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									<TextField
										type='number'
										value={
											revisedValues[row.apOrgChargeItemId] ?? row.chargeItemRate
										}
										onChange={(e) =>
											updateRevisedValue(
												row.apOrgChargeItemId,
												Number(e.target.value)
											)
										}
										onBlur={() => setData(row)}
										size='small'
										sx={{ width: 80 }}
										inputProps={{ min: 0 }}
									/>
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									<TextField
										type='number'
										value={
											taxValues[row.apOrgChargeItemId] ?? row.taxPercentage
										}
										onChange={(e) =>
											updateTaxes(row.apOrgChargeItemId, Number(e.target.value))
										}
										onBlur={() => setData(row)}
										size='small'
										sx={{ width: 80 }}
										inputProps={{ min: 0 }}
									/>
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{gstValues[row.apOrgChargeItemId] ?? row.taxAmount}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{totalValues[row.apOrgChargeItemId] ?? row.chargeAmount}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				{/* Gross / Discount / Net */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						flexDirection: "column",
						alignItems: "flex-end",
						mt: 2,
					}}>
					<Typography sx={{ fontWeight: "bold" }}>
						Gross Amount:{" "}
						<span style={{ fontWeight: "normal" }}>
							{/* 							{totalValues[rowId] ?? invoice[0].chargeAmount} */}
							{showTotalValues}
						</span>
					</Typography>
					<Typography sx={{ fontWeight: "bold" }}>
						Discount:{" "}
						<span style={{ fontWeight: "normal" }}>
							{discountValues[rowId] ?? 0}
						</span>
					</Typography>
					<Typography sx={{ fontWeight: "bold" }}>
						GST Or Other Tax Amount :{" "}
						<span style={{ fontWeight: "normal" }}>{showGstValues ?? 0}</span>
					</Typography>
					<Typography sx={{ fontWeight: "bold" }}>
						Net Amount:{" "}
						<span style={{ fontWeight: "normal" }}>
							{showTotalValues + showGstValues - (discountValues[rowId] ?? 0)}
						</span>
					</Typography>
				</Box>
			</Box>
		);
	};

	return (
		<>
			<CommonTable
				heading='Generate Invoice'
				showSearch={true}
				showAddButton={false}
				showFilterButton={false}
				colHeaders={colHeaders}
				rowData={invoices.map((invoice: any) => ({
					...invoice,
					action: (
						<TableLinkButton
							text='Generate Invoice'
							icon={<ReceiptLongIcon />}
							color='primary'
							onClick={() => handleGenerateClick(invoice)}
						/>
					),
				}))}
				rowsPerPageOptions={[10, 25, 50]}
			/>

			{openDialog && viewData && (
				<CummonDialog
					open={openDialog}
					title='Invoice Details'
					onClose={handleClose}
					onSubmit={handleGenerate}
					maxWidth='lg'
					submitLabel='SUBMIT'
					cancelLabel='CANCEL'
					showActions={true}
					hideDefaultButtons={false}
					aria-label='generate-invoice-details-dialog'>
					{renderInvoiceDetails(viewData)}
				</CummonDialog>
			)}

			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</>
	);
};

export default GenerateInvoice;
