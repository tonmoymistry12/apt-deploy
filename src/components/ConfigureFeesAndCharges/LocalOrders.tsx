import React, { useEffect, useMemo, useState } from "react";
import {
	Box,
	Typography,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
	InputAdornment,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	Paper,
	TableBody,
	Button,
	TablePagination,
	Autocomplete,
	debounce,
} from "@mui/material";

import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./styles.module.css";
import CummonDialog from "../common/CummonDialog";
import {
	checkDuplicateOrderName,
	deleteOrder,
	getCounsultationFees,
	getOrderList,
	saveOrderName,
} from "@/services/feesAndCharges";
import Message from "../common/Message";
import EditIcon from "@mui/icons-material/Edit";
import { Delete, Search } from "@mui/icons-material";

const Container = styled(Box)(({ theme }) => ({
	padding: theme?.spacing?.(2),
	[theme?.breakpoints?.down("sm")]: {
		padding: theme?.spacing?.(1),
	},
}));

const LocalOrder: React.FC = () => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [source, setSource] = useState("ICD10");
	const [orderName, setOrderName] = useState("");
	const [price, setPrice] = useState("0.0");
	const [errors, setErrors] = useState<{ orderName?: string; price?: string }>(
		{}
	);
	const [page, setPage] = useState(0);
	const [newFee, setNewFee] = useState("");
	const [rowData, setRowData] = useState<any[]>([]);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [modalTitle, setModalTitle] = useState("Add Order");
	const [selectedFees, setSelectedFees] = useState<any>(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);
	const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");

	const [orderOptions, setOrderOptions] = useState<any[]>([]);
	const [orderLoading, setOrderLoading] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<any>(null);
	const [selectedNewOrder, setSelectedNewOrder] = useState<any>(null);

	const counsltationPayload = {
		callingFrom: "web",
		userName: localStorage.getItem("userName") || "",
		userPass: localStorage.getItem("userPwd") || "",
		orgId: localStorage.getItem("orgId") || "",
		loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
	};

	const fetchOrder = debounce(async (searchText: string) => {
		setOrderLoading(true);
		try {
			const payload = {
				...counsltationPayload,
				orderName: searchText,
			};
			const data = await getOrderList(payload);
			setOrderOptions(data || []);
		} finally {
			setOrderLoading(false);
		}
	}, 400);

	const fetchLocalOrder = async () => {
		try {
			const response = await getCounsultationFees(counsltationPayload);
			const data: any = await response;
			setRowData(data.labTestList);
		} catch (error: any) {
			setSnackbarMessage(error?.response?.data?.message || "Server Error");
			setOpenSnackbar(true);
		}
	};

	useEffect(() => {
		fetchLocalOrder();
	}, []);

	const filteredOrder = useMemo(() => {
		console.log(rowData);
		return rowData.filter((data: any) => {
			const matchesSearch = data.orderTestName
				?.toLowerCase()
				.includes(searchTerm.toLowerCase());
			return matchesSearch;
		});
	}, [rowData, searchTerm]);

	useEffect(() => {
		setPage(0);
	}, [searchTerm]);

	const paginatedRowData = useMemo(() => {
		const start = page * rowsPerPage;
		return filteredOrder.slice(start, start + rowsPerPage);
	}, [filteredOrder, page, rowsPerPage]);

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleEditClick = async (row: any) => {
		setSelectedFees(row);
		setPrice(row.charge);
		setNewFee("");
		setDialogOpen(true);
		setModalMode("edit");
		setModalTitle("Edit Order");
	};

	const handleDeleteClick = async (row: any) => {
		setSelectedFees(row);
		setDialogOpen(true);
		setModalMode("delete");
		setModalTitle("Delete Order");
	};

	const handleChangePage = (_: unknown, newPage: number) => {
		setPage(newPage);
	};

	const checkIsDuplicate = async (name: string) => {
		const checkDulicateObj = {
			...counsltationPayload,
			orderId: 0,
			orderName: name,
		};
		const result = await checkDuplicateOrderName(checkDulicateObj);
		if (result === "Order Found") {
			setOpenSnackbar(true);
			setSnackbarSeverity("error");
			setSnackbarMessage(
				"This name already exists please try with other name."
			);
			return false;
		} else {
			return true;
		}
	};

	const handleSubmit = async () => {
		const newErrors: typeof errors = {};
		if (!orderName.trim()) newErrors.orderName = "Order name is required";
		if (!price || isNaN(+price) || +price <= 0)
			newErrors.price = "Valid price required";

		setErrors(newErrors);
		if (Object.keys(newErrors).length === 0) {
			console.log({ source, orderName, price });
			handleCloseDialog();
		}
		try {
			if (modalMode === "delete") {
				console.log(selectedFees);
				const deletePayloadObj = {
					...counsltationPayload,
					orderId: selectedFees.referenceId,
				};
				await deleteOrder(deletePayloadObj);

				setOpenSnackbar(true);
				setSnackbarSeverity("success");
				setSnackbarMessage("Order deleted successfully");
			}
			if (modalMode === "add") {
				const isDuplicate = await checkIsDuplicate(
					//selectedOrder ? selectedOrder.orderTestName : orderName;
					selectedNewOrder ? selectedNewOrder : orderName
				);
				if (isDuplicate) {
					const addOrderObj = {
						...counsltationPayload,
						orderId: 0,
						//orderName: selectedOrder ? selectedOrder.orderTestName : orderName,
						orderName: selectedNewOrder ? selectedNewOrder : orderName,
						charge: price,
					};
					await saveOrderName(addOrderObj);

					setOpenSnackbar(true);
					setSnackbarSeverity("success");
					setSnackbarMessage("Order added successfully");
				}
			}

			if (modalMode === "edit") {
				const updateOrderObj = {
					...counsltationPayload,
					orderId: selectedFees.referenceId,
					orderName: selectedFees.orderName,
					charge: price,
				};
				await saveOrderName(updateOrderObj);
				setOpenSnackbar(true);
				setSnackbarSeverity("success");
				setSnackbarMessage("Order edited successfully");
			}
			fetchLocalOrder();
		} catch (error) {
			setOpenSnackbar(true);
			setSnackbarSeverity("error");
			setSnackbarMessage("Face Some issue");
		} finally {
			handleCloseDialog();
		}
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setSource("ICD10");
		setOrderName("");
		setPrice("0.0");
		setErrors({});
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const openAddModal = () => {
		setDialogOpen(true);
		setModalMode("add");
		setModalTitle("Add Order");
		setSelectedOrder(null);
		setSelectedNewOrder("");
		setPrice("0.0");
	};

	return (
		<Container>
			<Typography
				variant='caption'
				color='textSecondary'
				mb={2}
				display='block'>
				*Local Orders will be collected at confirmation of encounter
				consultation data {paginatedRowData.length}
			</Typography>

			<Box
				sx={{
					p: 1,
					mb: 3,
					bgcolor: "rgba(23, 74, 124, 0.02)",
					border: "1px solid rgba(23, 74, 124, 0.08)",
					display: "flex",
					gap: 3,
					flexWrap: "wrap",
					alignItems: "center",
					pl: 4,
				}}>
				<TextField
					fullWidth
					variant='outlined'
					size='small'
					label='Search by Name'
					sx={{
						maxWidth: 280,
						"& .MuiOutlinedInput-root": {
							bgcolor: "white",
							borderRadius: 2,
							"& fieldset": {
								borderColor: "rgba(23, 74, 124, 0.2)",
							},
							"&:hover fieldset": {
								borderColor: "#174a7c",
							},
							"&.Mui-focused fieldset": {
								borderColor: "#174a7c",
							},
						},
						"& .MuiInputLabel-root": {
							color: "#174a7c",
							fontWeight: 500,
						},
					}}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>

				<Button
					onClick={openAddModal}
					variant='contained'
					color='primary'
					sx={{ ml: "auto" }}>
					Add New Order
				</Button>
			</Box>
			<TableContainer component={Paper} className={styles.tableWrapper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Charge</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedRowData.map((row, index) => (
							<TableRow key={index}>
								<TableCell>{row.orderTestName}</TableCell>
								<TableCell>{row?.charge}</TableCell>
								<TableCell>
									<Button
										variant='outlined'
										color='secondary'
										size='small'
										startIcon={<EditIcon />}
										onClick={() => handleEditClick(row)}
										sx={{
											mr: 1,
										}}>
										Edit
									</Button>
									{row.canBeRemoved && (
										<Button
											variant='outlined'
											color='error'
											size='small'
											startIcon={<Delete />}
											onClick={() => handleDeleteClick(row)}>
											Delete
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component='div'
					count={filteredOrder.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</TableContainer>
			<CummonDialog
				open={dialogOpen}
				title={modalTitle}
				onClose={handleCloseDialog}
				onSubmit={handleSubmit}
				submitLabel={modalMode === "delete" ? "Delete" : "Submit"}>
				<Box display='flex' flexDirection='column' gap={2}>
					{modalMode === "delete" && (
						<h4>Do you want to delete this order ?</h4>
					)}
					{modalMode === "add" && (
						<FormControl fullWidth>
							<InputLabel>Order Item</InputLabel>
							<Select
								value={source}
								onChange={(e) => setSource(e.target.value)}>
								<MenuItem value='ICD10'>
									International/National Databases
								</MenuItem>
								<MenuItem value='Other'>Other</MenuItem>
							</Select>
						</FormControl>
					)}

					{source == "ICD10" && modalMode == "add" && (
						<>
							<Autocomplete
								freeSolo
								loading={orderLoading}
								options={orderOptions}
								getOptionLabel={(option: any) =>
									typeof option === "string"
										? option
										: `${option.orderTestName}`
								}
								value={selectedOrder || null}
								onInputChange={(_, value) => {
									fetchOrder(value);
								}}
								onChange={(_, value) => {
									setSelectedOrder(value);
								}}
								renderInput={(params: any) => (
									<TextField
										{...params}
										label='Search for existing order'
										fullWidth
										// error={!!errors.procedureName}
										// helperText={errors.procedureName}
										InputProps={{
											...params.InputProps,
											endAdornment: (
												<>
													{params.InputProps.endAdornment}
													<Search
														sx={{ color: "action.active", mr: 1, my: 0.5 }}
													/>
												</>
											),
										}}
									/>
								)}
							/>

							<TextField
								label='Enter new order'
								type='text'
								value={selectedNewOrder}
								onChange={(e) => setSelectedNewOrder(e.target.value)}
								fullWidth
								//error={!!errors.price}
								//helperText={errors.price}
							/>

							<TextField
								label='Price'
								type='number'
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								fullWidth
								//error={!!errors.price}
								//helperText={errors.price}
							/>
						</>
					)}

					{source == "Other" && modalMode === "add" && (
						<>
							<TextField
								label='Enter Order'
								value={orderName}
								onChange={(e) => setOrderName(e.target.value)}
								fullWidth
								//error={!!errors.orderName}
								//helperText={errors.orderName}
							/>

							<TextField
								label='Price'
								type='number'
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								fullWidth
								//error={!!errors.price}
								//helperText={errors.price}
							/>
						</>
					)}

					{modalMode === "edit" && (
						<>
							<TextField
								label='Enter Order Name'
								value={selectedFees.orderTestName}
								fullWidth
								disabled={true}
							/>

							<TextField
								label='Price'
								type='number'
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								fullWidth
								//error={!!errors.price}
								//helperText={errors.price}
							/>
						</>
					)}
				</Box>
			</CummonDialog>

			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</Container>
	);
};

export default LocalOrder;
