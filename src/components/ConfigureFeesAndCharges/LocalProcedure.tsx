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
	checkDuplicate,
	deleteProcedure,
	getCounsultationFees,
	getProcedureList,
	saveProcedureList,
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

const LocalProcedure: React.FC = () => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [source, setSource] = useState("ICD10");
	const [procedureName, setProcedureName] = useState("");
	const [price, setPrice] = useState("0.0");
	const [errors, setErrors] = useState<{
		procedureName?: string;
		price?: string;
	}>({});
	const [page, setPage] = useState(0);
	const [newFee, setNewFee] = useState("");
	const [rowData, setRowData] = useState<any[]>([]);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [modalTitle, setModalTitle] = useState("Add Procedure");
	const [selectedFees, setSelectedFees] = useState<any>(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);
	const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");

	const [procedureOptions, setProcudureOptions] = useState<any[]>([]);
	const [procudureLoading, setProcedureLoading] = useState(false);
	const [selectedProcedure, setSelectedProcedure] = useState<any>(null);
	const [selectedNewProcedure, setSelectedNewProcedure] = useState<any>(null);

	const counsltationPayload = {
		callingFrom: "web",
		userName: localStorage.getItem("userName") || "",
		userPass: localStorage.getItem("userPwd") || "",
		orgId: localStorage.getItem("orgId") || "",
		loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
	};

	const fetchProcedure = debounce(async (searchText: string) => {
		setProcedureLoading(true);
		try {
			const payload = {
				...counsltationPayload,
				procedureName: searchText,
			};
			const data = await getProcedureList(payload);
			setProcudureOptions(data || []);
		} finally {
			setProcedureLoading(false);
		}
	}, 400);

	const fetchLocalProcedure = async () => {
		try {
			const response = await getCounsultationFees(counsltationPayload);
			const data: any = await response;
			setRowData(data.procedureList);
		} catch (error: any) {
			setSnackbarMessage(error?.response?.data?.message || "Server Error");
			setOpenSnackbar(true);
		}
	};

	useEffect(() => {
		fetchLocalProcedure();
	}, []);

	const filteredProcudure = useMemo(() => {
		console.log(rowData);
		return rowData.filter((data: any) => {
			const matchesSearch = data.procedureName
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
		return filteredProcudure.slice(start, start + rowsPerPage);
	}, [filteredProcudure, page, rowsPerPage]);

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
		setModalTitle("Edit Procedure");
	};

	const handleDeleteClick = async (row: any) => {
		setSelectedFees(row);
		setDialogOpen(true);
		setModalMode("delete");
		setModalTitle("Delete Procedure");
	};

	const handleChangePage = (_: unknown, newPage: number) => {
		setPage(newPage);
	};

	const checkIsDuplicate = async (name: string) => {
		const checkDulicateObj = {
			...counsltationPayload,
			procedureId: 0,
			procedureName: name,
		};
		const result = await checkDuplicate(checkDulicateObj);
		if (result === "Procedure Found") {
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
		if (!procedureName.trim())
			newErrors.procedureName = "Procedure name is required";
		if (!price || isNaN(+price) || +price <= 0)
			newErrors.price = "Valid price required";

		setErrors(newErrors);
		if (Object.keys(newErrors).length === 0) {
			console.log({ source, procedureName, price });
			handleCloseDialog();
		}
		try {
			if (modalMode === "delete") {
				console.log(selectedFees);
				const deletePayloadObj = {
					...counsltationPayload,
					procedureId: selectedFees.referenceId,
				};
				await deleteProcedure(deletePayloadObj);

				setOpenSnackbar(true);
				setSnackbarSeverity("success");
				setSnackbarMessage("Procudure deleted successfully");
			}
			if (modalMode === "add") {
				console.log(selectedProcedure);
				console.log(price);
				const isDuplicate = await checkIsDuplicate(
					//selectedProcedure ? selectedProcedure.procedureName : procedureName
					selectedNewProcedure ? selectedNewProcedure : procedureName
				);
				if (isDuplicate) {
					const addProcudureObj = {
						...counsltationPayload,
						procedureId: 0,
						/* procedureName: selectedProcedure
							? selectedProcedure.procedureName
							: procedureName, */
						procedureName: selectedNewProcedure
							? selectedNewProcedure
							: procedureName,
						charge: price,
					};
					await saveProcedureList(addProcudureObj);

					setOpenSnackbar(true);
					setSnackbarSeverity("success");
					setSnackbarMessage("Procudure added successfully");
				}
			}

			if (modalMode === "edit") {
				const updateProcudureObj = {
					...counsltationPayload,
					procedureId: selectedFees.referenceId,
					procedureName: selectedFees.procedureName,
					charge: price,
				};
				await saveProcedureList(updateProcudureObj);
				setOpenSnackbar(true);
				setSnackbarSeverity("success");
				setSnackbarMessage("Procudure edited successfully");
			}
			fetchLocalProcedure();
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
		setProcedureName("");
		setPrice("0.0");
		setErrors({});
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const openAddModal = () => {
		setDialogOpen(true);
		setModalMode("add");
		setModalTitle("Add Procedure");
		setSelectedProcedure(null);
		setSelectedNewProcedure("");
		setPrice("0.0");
	};

	return (
		<Container>
			<Typography
				variant='caption'
				color='textSecondary'
				mb={2}
				display='block'>
				*Local Procedure fees will be collected at confirmation of encounter
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
					Add New Procedure
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
								<TableCell>{row.procedureName}</TableCell>
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
					count={filteredProcudure.length}
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
						<h4>Do you want to delete this procedure ?</h4>
					)}
					{modalMode === "add" && (
						<FormControl fullWidth>
							<InputLabel>Procedure Item</InputLabel>
							<Select
								value={source}
								onChange={(e) => setSource(e.target.value)}>
								<MenuItem value='ICD10'>
									International/National Database
								</MenuItem>
								<MenuItem value='Other'>Other</MenuItem>
							</Select>
						</FormControl>
					)}

					{source == "ICD10" && modalMode == "add" && (
						<>
							<Autocomplete
								freeSolo
								loading={procudureLoading}
								options={procedureOptions}
								getOptionLabel={(option: any) =>
									typeof option === "string"
										? option
										: `${option.procedureName}`
								}
								value={selectedProcedure || null}
								onInputChange={(_, value) => {
									fetchProcedure(value);
								}}
								onChange={(_, value) => {
									setSelectedProcedure(value);
								}}
								renderInput={(params: any) => (
									<TextField
										{...params}
										label='Search for existing Procedure'
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
								label='Enter new procedure'
								type='text'
								value={selectedNewProcedure}
								onChange={(e) => setSelectedNewProcedure(e.target.value)}
								fullWidth
								error={!!errors.price}
								helperText={errors.price}
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
								label='Enter Procedure'
								value={procedureName}
								onChange={(e) => setProcedureName(e.target.value)}
								fullWidth
								//error={!!errors.procedureName}
								//helperText={errors.procedureName}
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
								label='Enter Procedure'
								value={selectedFees.procedureName}
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

export default LocalProcedure;
