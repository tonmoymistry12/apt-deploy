import React, { useEffect, useState } from "react";
import CommonTable from "../common/table/Table";
import TableLinkButton from "../common/buttons/TableLinkButton";
import PaymentIcon from "@mui/icons-material/Payment";
import {
	Box,
	Table,
	TableCell,
	TableHead,
	TableRow,
	TableBody,
	Typography,
} from "@mui/material";
import CummonDialog from "../common/CummonDialog";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Collect from "./collect";
import {
	addCollection,
	getInvoiceDueCharges,
	getInvoicelistForCollection,
} from "@/services/paymentCollectionService";
import Message from "../common/Message";

// Define interface for payment data
interface Payment {
	id: number;
	patient: string;
	mrn: string;
	encounterDate: string;
	invoiceNumber: string;
	invoiceDate: string;
	invoiceAmount: number;
	dueAmount: number;
	paymentStatus: string;
}

interface PaymentCollectionProps {
	onDataUpdate?: (payments: Payment[]) => void;
}

const PaymentCollection: React.FC<PaymentCollectionProps> = ({
	onDataUpdate,
}) => {
	const [invoiceId, setInvoiceId] = useState<any>("");
	const [payments, setPayments] = useState<any>([]);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success",
	);
	/* const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      patient: "John Smith",
      mrn: "MRN12345",
      encounterDate: "2025-05-01",
      invoiceNumber: "APT/01/002",
      invoiceDate: "2025-06-09",
      invoiceAmount: 500.0,
      dueAmount: 500.0,
      paymentStatus: "Pending",
    },
    {
      id: 2,
      patient: "Emma Johnson",
      mrn: "MRN67890",
      encounterDate: "2025-05-10",
      invoiceNumber: "INV002",
      invoiceDate: "2025-05-11",
      invoiceAmount: 200.0,
      dueAmount: 75.0,
      paymentStatus: "Pending",
    },
  ]); */
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [viewData, setViewData] = useState<any | null>(null);
	const [openCollectDialog, setOpenCollectDialog] = useState<boolean>(false);
	const [collectData, setCollectData] = useState<Payment | null>(null);

	/* React.useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate(payments);
    }
  }, [payments, onDataUpdate]); */
	const basePayload = {
		callingFrom: "web",
		userName: localStorage.getItem("userName") || "",
		userPass: localStorage.getItem("userPwd") || "",
		orgId: localStorage.getItem("orgId") || "",
		loggedInFacilityId: localStorage.getItem("loggedinFacilityId"),
		//loggedInFacilityId: "1",
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const fetchPaymentCollection = async () => {
		try {
			const response = await getInvoicelistForCollection(basePayload);
			const data: any = await response;
			setPayments(data);
		} catch (error: any) {
			console.log(error);
			/*  setSnackbarMessage(error?.response?.data?.message || "Server Error");
          setOpenSnackbar(true); */
		}
	};

	const fetchInvoiceDueCharges = async (obj: any) => {
		try {
			console.log(obj);
			const response = await getInvoiceDueCharges(obj);
			const data: any = await response;
			console.log(data);
			setInvoiceId(obj.invoiceId);
			setViewData(data);
			setCollectData(data);
			setOpenCollectDialog(true);
			//	setOpenDialog(true);
		} catch (error: any) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchPaymentCollection();
	}, []);

	const colHeaders = [
		{ id: "patientName", label: "Patient Name" },
		{ id: "mrn", label: "MRN" },
		{ id: "encounterDate", label: "Encounter Date" },
		{ id: "invoiceNumber", label: "Invoice Number" },
		{ id: "invoiceDate", label: "Invoice Date" },
		{ id: "invoiceAmount", label: "Invoice Amount" },
		{ id: "dueAmount", label: "Due Amount" },
		{ id: "isPaymentReceived", label: "Payment Status" },
		{ id: "action", label: "Action" },
	];

	const handleViewClick = (filePath: any) => {
		const BASE_URL = "https://www.happyfurandfeather.com/provider";
		if (filePath) {
			const fullUrl = `${BASE_URL}/${filePath}`;
			window.open(fullUrl, "_blank");
		}
	};

	const handleCollectClick = (payment: any) => {
		const payload = {
			...basePayload,
			invoiceId: payment.invoiceId,
		};
		//	setInvoiceId(payment.invoiceId);
		fetchInvoiceDueCharges(payload);
		setOpenCollectDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
		setViewData(null);
		setOpenCollectDialog(false);
		setCollectData(null);
	};

	const handleCollectSubmit = async (submittedData: any) => {
		console.log(submittedData);
		try {
			const response: any = await addCollection(submittedData);
			console.log(response.Status);
			setSnackbarMessage(response.Status);
			setSnackbarSeverity("success");
			setOpenSnackbar(true);
			fetchPaymentCollection();
		} catch (error) {
			setSnackbarMessage("Some Error Occured");
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
		}
		handleClose();
	};

	const renderPaymentDetails = (payment: any) => (
		<Box sx={{ p: 3 }}>
			<Typography
				variant='h6'
				align='center'
				gutterBottom
				sx={{ fontWeight: "bold" }}>
				INVOICE DETAILS
			</Typography>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					mb: 2,
					alignItems: "center",
				}}>
				<Typography sx={{ flex: 1, fontWeight: "bold" }}>
					Patient Name:{" "}
					<span style={{ fontWeight: "normal" }}>{payment.patientName}</span>
				</Typography>
				<Typography sx={{ flex: 1, fontWeight: "bold", textAlign: "center" }}>
					Physician Name:{" "}
					<span style={{ fontWeight: "normal" }}>{payment.physicianName}</span>
				</Typography>
				<Typography sx={{ flex: 1, fontWeight: "bold", textAlign: "right" }}>
					Encounter Date:{" "}
					<span style={{ fontWeight: "normal" }}>{payment.encounterDate}</span>
				</Typography>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					mb: 2,
					alignItems: "center",
				}}>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Typography sx={{ mr: 1, fontWeight: "bold" }}>
						Invoice Number:
					</Typography>
					<Typography>{payment.invoiceNumber}</Typography>
				</Box>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Typography sx={{ mr: 1, fontWeight: "bold" }}>
						Invoice Date:
					</Typography>
					<Typography>{payment.invoiceDate}</Typography>
				</Box>
			</Box>
			<Table sx={{ mb: 2, borderCollapse: "collapse" }}>
				<TableHead>
					<TableRow sx={{ backgroundColor: "#e0e0e0" }}>
						<TableCell
							sx={{
								fontWeight: "bold",
								border: "1px solid #ccc",
								padding: "8px",
							}}>
							ITEM
						</TableCell>
						<TableCell
							sx={{
								fontWeight: "bold",
								border: "1px solid #ccc",
								padding: "8px",
								textAlign: "center",
							}}>
							QUANTITY
						</TableCell>
						<TableCell
							sx={{
								fontWeight: "bold",
								border: "1px solid #ccc",
								padding: "8px",
								textAlign: "center",
							}}>
							VALUE PER UNIT
						</TableCell>
						<TableCell
							sx={{
								fontWeight: "bold",
								border: "1px solid #ccc",
								padding: "8px",
								textAlign: "center",
							}}>
							PAYMENT %
						</TableCell>
						<TableCell
							sx={{
								fontWeight: "bold",
								border: "1px solid #ccc",
								padding: "8px",
								textAlign: "center",
							}}>
							PAYMENT DUE
						</TableCell>
						<TableCell
							sx={{
								fontWeight: "bold",
								border: "1px solid #ccc",
								padding: "8px",
								textAlign: "center",
							}}>
							GST Or Other Tax%
						</TableCell>
						<TableCell
							sx={{
								fontWeight: "bold",
								border: "1px solid #ccc",
								padding: "8px",
								textAlign: "center",
							}}>
							GST Or Other Tax Amount
						</TableCell>
						<TableCell
							sx={{
								fontWeight: "bold",
								border: "1px solid #ccc",
								padding: "8px",
								textAlign: "center",
							}}>
							TOTAL VALUE
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{payment?.invoicedChargesList &&
						payment.invoicedChargesList.map((row: any, index: any) => (
							<TableRow key={index}>
								<TableCell sx={{ border: "1px solid #ccc", padding: "8px" }}>
									{row.chargeItemName}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{row.quantity}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{row.unitPrice}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{row.paymentPercentage}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{row.dueAmount}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{row.taxPercentage}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{row.taxAmount}
								</TableCell>
								<TableCell
									sx={{
										border: "1px solid #ccc",
										padding: "8px",
										textAlign: "center",
									}}>
									{row.charge}
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
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
					<span style={{ fontWeight: "normal" }}>{payment.grossAmount}</span>
				</Typography>
				<Typography sx={{ fontWeight: "bold" }}>
					Discount:{" "}
					<span style={{ fontWeight: "normal" }}>{payment.discountAmount}</span>
				</Typography>
				<Typography sx={{ fontWeight: "bold" }}>
					GST Or Other Tax Amount:{" "}
					<span style={{ fontWeight: "normal" }}>{payment.taxAmount}</span>
				</Typography>
				<Typography sx={{ fontWeight: "bold" }}>
					Net Amount:{" "}
					<span style={{ fontWeight: "normal" }}>{payment.netAmount}</span>
				</Typography>
				<Typography sx={{ fontWeight: "bold" }}>
					Collected Amount:{" "}
					<span style={{ fontWeight: "normal" }}>
						{payment.collectedAmount}
					</span>
				</Typography>
				<Typography sx={{ fontWeight: "bold" }}>
					Due Amount:{" "}
					<span style={{ fontWeight: "normal" }}>{payment.dueAmount}</span>
				</Typography>
			</Box>
		</Box>
	);

	return (
		<>
			<CommonTable
				heading='Payment Collection'
				showSearch={true}
				showAddButton={false}
				showFilterButton={false}
				colHeaders={colHeaders}
				rowData={payments.map((payment: any) => ({
					...payment,
					action: (
						<Box sx={{ display: "flex", gap: 1 }}>
							<TableLinkButton
								text='Print Invoice'
								icon={<ReceiptLongIcon />}
								color='primary'
								onClick={() => handleViewClick(payment.pdfFileName)}
							/>
							<TableLinkButton
								text='Collect Payment'
								icon={<PaymentIcon />}
								color='secondary'
								onClick={() => handleCollectClick(payment)}
							/>
						</Box>
					),
				}))}
				rowsPerPageOptions={[10, 25, 50]}
			/>

			{/* Print Invoice Dialog */}
			{openDialog && viewData && (
				<CummonDialog
					open={openDialog}
					title='Payment Details'
					onClose={handleClose}
					onSubmit={() => window.print()}
					maxWidth='lg'
					submitLabel='Print'
					cancelLabel='Cancel'
					showActions={true}
					hideDefaultButtons={false}
					aria-label='payment-details-dialog'>
					{renderPaymentDetails(viewData)}
				</CummonDialog>
			)}

			{/* Collect Payment Dialog */}
			{openCollectDialog && collectData && (
				<CummonDialog
					open={openCollectDialog}
					title='Collect Payment'
					onClose={handleClose}
					isSubmitButton={false}
					//onSubmit={handleCollectSubmit}
					maxWidth='lg'
					submitLabel='Submit'
					cancelLabel='Close'
					showActions={true}
					hideDefaultButtons={false}
					aria-label='collect-payment-dialog'>
					<Collect
						payment={collectData}
						invoiceId={invoiceId}
						basePayload={basePayload}
						onSubmit={handleCollectSubmit}
					/>
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

export default PaymentCollection;
