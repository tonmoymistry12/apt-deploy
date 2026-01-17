import React, { useEffect, useState } from "react";
import CommonTable from "../common/table/Table";
import TableLinkButton from "../common/buttons/TableLinkButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import CummonDialog from "../common/CummonDialog";
import {
	getinvoicehistorylist,
	viewInvoicecumcollection,
} from "@/services/invoiceService";

// Define interface for invoice items
interface InvoiceItem {
	item: string;
	quantity: number;
	valuePerUnit: number;
	currentPayment: number;
	paymentDue: number;
	totalValue: number;
}

// Define interface for invoice data
interface Invoice {
	id: number;
	patient: string;
	mrn: string;
	encounterDate: string;
	invoiceNumber: string;
	invoiceDate: string;
	invoiceAmount: number;
	physician: string;
	items: InvoiceItem[];
	grossAmount: number;
	netAmount: number;
	collectedAmount: number;
	dueAmount: number;
}

// Sample data for the table
const initialInvoices: Invoice[] = [
	{
		id: 1,
		patient: "Test of Test",
		mrn: "MRN12345",
		encounterDate: "2025-05-30",
		invoiceNumber: "APT/01/001",
		invoiceDate: "2025-05-30",
		invoiceAmount: 700.0,
		physician: "Dr. Jagdeep Chowdhury",
		items: [
			{
				item: "Registration",
				quantity: 1,
				valuePerUnit: 100.0,
				currentPayment: 100.0,
				paymentDue: 100.0,
				totalValue: 100.0,
			},
			{
				item: "Consultation (Dr. Jagdeep Chowdhury)",
				quantity: 1,
				valuePerUnit: 500.0,
				currentPayment: 100.0,
				paymentDue: 600.0,
				totalValue: 600.0,
			},
		],
		grossAmount: 700.0,
		netAmount: 700.0,
		collectedAmount: 700.0,
		dueAmount: 0.0,
	},
	{
		id: 2,
		patient: "Emma Johnson",
		mrn: "MRN67890",
		encounterDate: "2025-05-10",
		invoiceNumber: "INV002",
		invoiceDate: "2025-05-11",
		invoiceAmount: 200.0,
		physician: "Dr. Smith",
		items: [
			{
				item: "Consultation (Dr. Smith)",
				quantity: 1,
				valuePerUnit: 200.0,
				currentPayment: 200.0,
				paymentDue: 200.0,
				totalValue: 200.0,
			},
		],
		grossAmount: 200.0,
		netAmount: 200.0,
		collectedAmount: 200.0,
		dueAmount: 0.0,
	},
];

// Props for the InvoiceHistory component
interface InvoiceHistoryProps {
	onDataUpdate?: (invoices: Invoice[]) => void;
}

const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ onDataUpdate }) => {
	const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
	const [openPrintDialog, setOpenPrintDialog] = useState<boolean>(false);
	const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);
	const [viewData, setViewData] = useState<Invoice | null>(null);
	const [viewInvoiceData, setViewInvoiceData] = useState<any | null>(null);

	const basePayload = {
		callingFrom: "web",
		userName: localStorage.getItem("userName") || "",
		userPass: localStorage.getItem("userPwd") || "",
		orgId: localStorage.getItem("orgId") || "",
		//loggedInFacilityId: localStorage.getItem("loggedinFacilityId"),
		loggedInFacilityId: "1",
	};

	const fetchPaymentHistory = async () => {
		try {
			const response = await getinvoicehistorylist(basePayload);
			const data: any = await response;
			setInvoices(data);
			// setPayments(data);
		} catch (error: any) {
			console.log(error);
			/*  setSnackbarMessage(error?.response?.data?.message || "Server Error");
            setOpenSnackbar(true); */
		}
	};

	// Notify parent of data changes
	useEffect(() => {
		fetchPaymentHistory();
	}, []);

	const colHeaders = [
		{ id: "patientName", label: "Patient" },
		{ id: "mrn", label: "MRN" },
		{ id: "encounterDate", label: "Encounter Date" },
		{ id: "invoiceNumber", label: "Invoice Number" },
		{ id: "invoiceDate", label: "Invoice Date" },
		{ id: "totalCharge", label: "Invoice Amount" },
		{ id: "action", label: "Action" },
	];

	const handlePrintClick = (filePath: any) => {
		const BASE_URL = "https://www.aptcarepet.com/provider";
		if (filePath) {
			const fullUrl = `${BASE_URL}/${filePath}`;
			window.open(fullUrl, "_blank");
		}
	};

	/* const handleViewClick = (invoice: Invoice) => {
		setViewInvoiceData(invoice);
		setOpenViewDialog(true);
	};
 */

	const fetchInvoiceCumCollection = async (obj: any) => {
		try {
			console.log(obj);
			const response = await viewInvoicecumcollection(obj);
			const data: any = await response;
			console.log(data);
			// setInvoiceId(obj.invoiceId);
			//setViewData(data);
			// setCollectData(data);
			setViewInvoiceData(data);
			setOpenViewDialog(true);
			//	setOpenDialog(true);
		} catch (error: any) {
			console.log(error);
		}
	};

	const handleViewClick = (payment: any) => {
		const payload = {
			...basePayload,
			invoiceId: payment.invoiceId,
		};
		//	setInvoiceId(payment.invoiceId);
		fetchInvoiceCumCollection(payload);
		//setViewData(payment);
		//setOpenViewDialog(true);
	};

	const handleClosePrint = () => {
		setOpenPrintDialog(false);
		setViewData(null);
	};

	const handleCloseView = () => {
		setOpenViewDialog(false);
		setViewInvoiceData(null);
	};

	const renderInvoiceDetails = (invoice: any) => (
		<Box sx={{ p: 2 }}>
			<Typography variant='h6' align='center' gutterBottom>
				INVOICE DETAILS
			</Typography>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
				<Typography>Patient Name: {invoice.petName}</Typography>
				<Typography>Physician Name: {invoice.doctor}</Typography>
				<Typography>Encounter Date: {invoice.encounterDate}</Typography>
			</Box>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
				<Typography>Invoice Number: {invoice.invNumber}</Typography>
				<Typography>Invoice Date: {invoice.invDate}</Typography>
			</Box>
			<Table sx={{ mb: 2 }}>
				<TableHead>
					<TableRow sx={{ backgroundColor: "#e0e0e0" }}>
						<TableCell>ITEM</TableCell>
						<TableCell align='right'>QUANTITY</TableCell>
						<TableCell align='right'>VALUE PER UNIT</TableCell>
						<TableCell align='right'> PAYMENT%</TableCell>
						<TableCell align='right'>PAYMENT DUE</TableCell>
						<TableCell align='right'>GST OR Other Tax %</TableCell>
						<TableCell align='right'>GST OR Other Tax Amount</TableCell>
						<TableCell align='right'>TOTAL VALUE</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{invoice.invoiceChargeDetails.map((item: any, index: any) => (
						<TableRow key={index}>
							<TableCell>{item.chargeItemName}</TableCell>
							<TableCell align='right'>{item.quantity}</TableCell>
							<TableCell align='right'>{item.unitPrice}</TableCell>
							<TableCell align='right'>{item.paymentPercentage}</TableCell>
							<TableCell align='right'>{item.dueAmount}</TableCell>
							<TableCell align='right'>{item.taxPercentage}</TableCell>
							<TableCell align='right'>{item.taxAmount}</TableCell>
							<TableCell align='right'>{item.netAmountPayable}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
				<Box>
					<Typography>Gross Amount: {invoice.grossAmount}</Typography>
					<Typography>Discount: {invoice.discountAmount}</Typography>
					<Typography>GST Or Other Tax Amount: {invoice.taxAmount}</Typography>
					<Typography>Net Amount: {invoice.netAmount}</Typography>
					<Typography>Collected Amount: {invoice.collectedAmount}</Typography>
					<Typography>Due Amount: {invoice.dueAmount}</Typography>
				</Box>
			</Box>
		</Box>
	);

	return (
		<>
			<CommonTable
				heading='Invoice History'
				showSearch={true}
				showAddButton={false}
				showFilterButton={false}
				colHeaders={colHeaders}
				rowData={invoices.map((invoice: any) => ({
					...invoice,
					action: (
						<Box sx={{ display: "flex", gap: 1 }}>
							<TableLinkButton
								text='Print Invoice'
								icon={<ReceiptLongIcon />}
								color='primary'
								onClick={() => handlePrintClick(invoice.pdfFileName)}
							/>
							<TableLinkButton
								text='View Invoice'
								icon={<VisibilityIcon />}
								color='secondary'
								onClick={() => handleViewClick(invoice)}
							/>
						</Box>
					),
				}))}
				rowsPerPageOptions={[10, 25, 50]}
			/>

			{/* Print Invoice Dialog */}
			{openPrintDialog && viewData && (
				<CummonDialog
					open={openPrintDialog}
					title='Invoice Details'
					onClose={handleClosePrint}
					onSubmit={() => {
						window.print();
					}}
					maxWidth='lg'
					submitLabel='Print'
					cancelLabel='Cancel'
					showActions={true}
					hideDefaultButtons={false}
					aria-label='invoice-details-dialog'>
					{renderInvoiceDetails(viewData)}
				</CummonDialog>
			)}

			{/* View Invoice Dialog */}
			{openViewDialog && viewInvoiceData && (
				<CummonDialog
					open={openViewDialog}
					title='View Invoice Details'
					onClose={handleCloseView}
					onSubmit={handleCloseView}
					isSubmitButton={false}
					maxWidth='lg'
					submitLabel='Submit'
					cancelLabel='Cancel'
					showActions={true}
					hideDefaultButtons={false}
					aria-label='view-invoice-details-dialog'>
					{renderInvoiceDetails(viewInvoiceData)}
				</CummonDialog>
			)}
		</>
	);
};

export default InvoiceHistory;
