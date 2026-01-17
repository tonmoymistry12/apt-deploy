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
	checkDuplicatePhermecyName,
	deleteProcedure,
	getCounsultationFees,
	getMedicineList,
	getPharmacyitemDetails,
	getProcedureList,
	removeMedicineList,
	saveMedicineList,
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
	const [packageSize, setPackage] = useState("0.0");
	const [selectedGenericName, setSelectedGenericName] = useState("");
	const [errors, setErrors] = useState<{
		procedureName?: string;
		price?: string;
		brandName?: string;
	}>({});
	const [page, setPage] = useState(0);
	const [newFee, setNewFee] = useState("");
	const [rowData, setRowData] = useState<any[]>([]);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [modalTitle, setModalTitle] = useState("Add Pharmecy");
	const [selectedFees, setSelectedFees] = useState<any>(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);
	const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add");

	const [procedureOptions, setProcudureOptions] = useState<any[]>([]);
	const [procudureLoading, setProcedureLoading] = useState(false);
	const [selectedProcedure, setSelectedProcedure] = useState<any>(null);

	const [brandOptions, setBrandOptions] = useState<any[]>([]);
	const [brandLoading, setBrandLoading] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState<any>(null);

	const [selectedNewProcedure, setSelectedNewProcedure] = useState<any>(null);
	const [selectedNewBrand, setSelectedNewBrand] = useState<any>(null);

	const [brandName, setBrandName] = useState("");

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
				medicineName: searchText,
				medicineType: "generic",
				selectedMedicine: "",
				medicineReference: "self",
			};
			const data = await getMedicineList(payload);
			setProcudureOptions(data || []);
		} finally {
			setProcedureLoading(false);
		}
	}, 400);

	const fetchBrand = debounce(async (searchText: string) => {
		setBrandLoading(true);
		try {
			const payload = {
				...counsltationPayload,
				medicineName: searchText,
				medicineType: "brand",
				//selectedMedicine: selectedProcedure.medicineGenericName,
				selectedMedicine: selectedNewProcedure,
				medicineReference: "byGenerice",
			};
			const data = await getMedicineList(payload);
			setBrandOptions(data || []);
		} finally {
			setBrandLoading(false);
		}
	}, 400);

	useEffect(() => {
		if (selectedProcedure) {
			setBrandOptions([]);
		}
	}, [selectedProcedure]);

	const fetchLocalProcedure = async () => {
		try {
			const response = await getCounsultationFees(counsltationPayload);
			const data: any = await response;
			setRowData(data.pharmacyList);
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
			const matchesSearch = data.medicineName
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

		const fectDetailsPayload = {
			...counsltationPayload,
			medicineId: row.referenceId,
		};
		const response = await getPharmacyitemDetails(fectDetailsPayload);
		setPrice(response.charge);
		setPackage(response.packageSize);
		setSelectedGenericName(response.medicineGenericName);
		setNewFee("");
		setDialogOpen(true);
		setModalMode("edit");
		setModalTitle("Edit Pharmecy");
	};

	const handleDeleteClick = async (row: any) => {
		setSelectedFees(row);
		setDialogOpen(true);
		setModalMode("delete");
		setModalTitle("Delete Pharmecy");
	};

	const handleChangePage = (_: unknown, newPage: number) => {
		setPage(newPage);
	};

	const checkDuplicate = async (checkDulicateObj: any) => {
		const result = await checkDuplicatePhermecyName(checkDulicateObj);
		if (result !== "Pharmacy Item Not Found") {
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
			newErrors.procedureName = "Medicine name is required";
		if (!price || isNaN(+price) || +price <= 0)
			newErrors.price = "Valid rate required";

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
					medicineId: selectedFees.referenceId,
				};
				await removeMedicineList(deletePayloadObj);

				setOpenSnackbar(true);
				setSnackbarSeverity("success");
				setSnackbarMessage("Pharmecy deleted successfully");
			}
			if (modalMode === "add") {
				const checkDuplicateObj = {
					...counsltationPayload,
					/* medicineName: selectedBrand?.medicineBrandName
						? selectedBrand.medicineBrandName
						: brandName, */
					medicineName: selectedNewBrand ? selectedNewBrand : brandName,
					medicineUnit: packageSize,
					medicineId: 0,
				};
				const isDuplicate = await checkDuplicate(checkDuplicateObj);
				if (isDuplicate) {
					if (source == "Other") {
						const addProcudureObj = {
							...counsltationPayload,
							medicineId: 0,
							genericName: "",
							brandName: brandName,
							charge: price,
							medicineUnit: packageSize,
						};
						await saveMedicineList(addProcudureObj);

						setOpenSnackbar(true);
						setSnackbarSeverity("success");
						setSnackbarMessage("Pharmecy added successfully");
					} else {
						const addProcudureObj = {
							...counsltationPayload,
							medicineId: 0,
							//genericName: selectedProcedure.medicineGenericName,
							genericName: selectedNewProcedure,
							//brandName: selectedBrand.medicineBrandName,
							brandName: selectedNewBrand,
							charge: price,
							medicineUnit: packageSize,
						};
						await saveMedicineList(addProcudureObj);

						setOpenSnackbar(true);
						setSnackbarSeverity("success");
						setSnackbarMessage("Pharmecy added successfully");
					}
				}
			}

			if (modalMode === "edit") {
				const updateProcudureObj = {
					...counsltationPayload,
					medicineId: selectedFees.referenceId,
					brandName: selectedFees.medicineName,
					genericName: selectedGenericName,
					charge: price,
					medicineUnit: packageSize,
				};
				await saveMedicineList(updateProcudureObj);
				setOpenSnackbar(true);
				setSnackbarSeverity("success");
				setSnackbarMessage("Pharmecy edited successfully");
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
		setPackage("0.0");
		setErrors({});
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const openAddModal = () => {
		setDialogOpen(true);
		setModalMode("add");
		setModalTitle("Add Pharmecy");
		setSelectedProcedure(null);
		setSelectedBrand(null);
		setSelectedNewProcedure("");
		setSelectedNewBrand("");
		setPrice("0.0");
		setPackage("0.0");
	};

	return (
		<Container>
			<Typography
				variant='caption'
				color='textSecondary'
				mb={2}
				display='block'>
				*Local Pharmecy fees will be collected at confirmation of encounter
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
					Add pharmacy item
				</Button>
			</Box>
			<TableContainer component={Paper} className={styles.tableWrapper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Charge</TableCell>
							<TableCell>Unit</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedRowData.map((row, index) => (
							<TableRow key={index}>
								<TableCell>{row.medicineName}</TableCell>
								<TableCell>{row?.charge}</TableCell>
								<TableCell>{row?.packageSize}</TableCell>
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
						<h4>Do you want to delete this pharmecy ?</h4>
					)}
					{modalMode === "add" && (
						<FormControl fullWidth>
							<InputLabel>Pharmecy Item</InputLabel>
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
								id='genericName'
								freeSolo
								loading={procudureLoading}
								options={procedureOptions}
								getOptionLabel={(option: any) =>
									typeof option === "string"
										? option
										: `${option.medicineGenericName}`
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
										label='Search for Generic Name'
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

							<Autocomplete
								id='brandName'
								key={selectedProcedure?.medicineGenericName || "no-procedure"}
								freeSolo
								loading={brandLoading}
								options={brandOptions}
								getOptionLabel={(option: any) =>
									typeof option === "string"
										? option
										: `${option.medicineBrandName}`
								}
								value={selectedBrand || null}
								onInputChange={(_, value) => {
									fetchBrand(value);
								}}
								onChange={(_, value) => {
									setSelectedBrand(value);
								}}
								renderInput={(params: any) => (
									<TextField
										{...params}
										label='Search for Brand Name'
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
								disabled={!selectedProcedure?.medicineGenericName}
							/>

							<TextField
								label='New Genereic Name'
								type='text'
								value={selectedNewProcedure}
								onChange={(e) => setSelectedNewProcedure(e.target.value)}
								fullWidth
							/>

							<TextField
								label='New Brand Name'
								type='text'
								value={selectedNewBrand}
								onChange={(e) => setSelectedNewBrand(e.target.value)}
								fullWidth
							/>

							<TextField
								label='Rate'
								type='number'
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								fullWidth
								error={!!errors.price}
								helperText={errors.price}
							/>

							<TextField
								label='Unit'
								type='number'
								value={packageSize}
								onChange={(e) => setPackage(e.target.value)}
								fullWidth
								error={!!errors.price}
								helperText={errors.price}
							/>
						</>
					)}

					{source == "Other" && modalMode === "add" && (
						<>
							<TextField
								label='Enter Brnad Name'
								value={brandName}
								onChange={(e) => setBrandName(e.target.value)}
								fullWidth
								error={!!errors.brandName}
								helperText={errors.brandName}
							/>

							<TextField
								label='Price'
								type='number'
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								fullWidth
								error={!!errors.price}
								helperText={errors.price}
							/>

							<TextField
								label='Unit'
								type='number'
								value={packageSize}
								onChange={(e) => setPackage(e.target.value)}
								fullWidth
								error={!!errors.price}
								helperText={errors.price}
							/>
						</>
					)}

					{modalMode === "edit" && (
						<>
							<TextField
								label='Enter Brand Name'
								value={selectedFees.medicineName}
								fullWidth
								disabled={true}
							/>

							<TextField
								label='Enter Generic Name'
								value={selectedGenericName}
								fullWidth
								disabled={true}
							/>

							<TextField
								label='Rate'
								type='number'
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								fullWidth
								error={!!errors.price}
								helperText={errors.price}
							/>

							<TextField
								label='Unit'
								type='number'
								value={packageSize}
								onChange={(e) => setPackage(e.target.value)}
								fullWidth
								error={!!errors.price}
								helperText={errors.price}
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
