import React, { useEffect, useMemo, useState } from "react";
import {
	Box,
	TextField,
	Grid,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	Paper,
	TableBody,
	Button,
	TablePagination,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import {
	getCounsultationFees,
	saveCounsultationFees,
} from "@/services/feesAndCharges";
import styles from "./styles.module.css";
import CummonDialog from "../common/CummonDialog";
import Message from "../common/Message";

const Container = styled(Box)(({ theme }) => ({
	padding: theme?.spacing?.(2) || "16px",
	[theme?.breakpoints?.down("sm") || "600px"]: {
		padding: theme?.spacing?.(1) || "8px",
	},
}));

const ConsultationFees: React.FC = () => {
	const [page, setPage] = useState(0);
	const [newFee, setNewFee] = useState("");
	const [rowData, setRowData] = useState<any[]>([]);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedFees, setSelectedFees] = useState<any>(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);
	const [openDialog, setOpenDialog] = useState(false);
	const [modalMode, setModalMode] = useState<"add" | "edit">("add");

	const fetchConsultaionFees = async () => {
		try {
			const response = await getCounsultationFees(counsltationPayload);
			const data: any = await response;
			setRowData(data.doctorList);
		} catch (error: any) {
			setSnackbarMessage(error?.response?.data?.message || "Server Error");
			setOpenSnackbar(true);
		}
	};

	useEffect(() => {
		fetchConsultaionFees();
	}, []);

	const filteredCunsultation = useMemo(() => {
		return rowData.filter((data: any) => {
			const matchesSearch = data.userNameWithTitle
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
		return filteredCunsultation.slice(start, start + rowsPerPage);
	}, [filteredCunsultation, page, rowsPerPage]);

	const counsltationPayload = {
		callingFrom: "web",
		userName: localStorage.getItem("userName") || "",
		userPass: localStorage.getItem("userPwd") || "",
		orgId: localStorage.getItem("orgId") || "",
		loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
	};

	const handleCloseDialog = () => {
		setSelectedFees(null);
		setNewFee("");
		setOpenDialog(false);
	};

	const handleChangePage = (_: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleFeesSubmit = async () => {
		/* const updatedData = rowData.map((data: any) => {
			if (data.orgUserId === selectedFees.orgUserId) {
				return { ...data, charge: newFee };
			}
			return data;
		});

		console.log(updatedData);
		const payload = {
			...counsltationPayload,
			orgUserIds: updatedData.map((d: any) => d.orgUserId).join(","),
			docCharges: updatedData.map((d: any) => d.charge).join(","),
			docUserNames: updatedData.map((d: any) => d.userName).join(","),
		}; */

		const payload = {
			...counsltationPayload,
			orgUserIds: selectedFees.orgUserId,
			docCharges: newFee,
			docUserNames: selectedFees.userName,
		};

		console.log("hittt");
		try {
			const response: any = saveCounsultationFees(payload);
			setSnackbarMessage(
				response?.data?.message || "Fees updated successfully"
			);
			setSnackbarSeverity("success");
			setOpenSnackbar(true);
			fetchConsultaionFees();
			setOpenDialog(false);
		} catch (error: any) {
			setSnackbarMessage(error?.data?.message || "Some error occured");
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
		}
	};

	const handleEditClick = async (row: any) => {
		console.log("hit");
		setSelectedFees(row);
		setNewFee("");
		setOpenDialog(true);
		setModalMode("edit");
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	return (
		<Container>
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
			</Box>
			<TableContainer component={Paper} className={styles.tableWrapper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Fees</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedRowData.map((row, index) => (
							<TableRow key={index}>
								<TableCell>{row.userNameWithTitle}</TableCell>
								<TableCell>{row?.charge}</TableCell>
								<TableCell>
									<Button
										variant='outlined'
										color='secondary'
										size='small'
										startIcon={<EditIcon />}
										onClick={() => handleEditClick(row)}>
										Edit
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component='div'
					count={filteredCunsultation.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</TableContainer>

			<CummonDialog
				open={openDialog}
				onClose={handleCloseDialog}
				title={modalMode === "add" ? "Add Fees" : "Edit Fees"}
				maxWidth='md'
				onSubmit={handleFeesSubmit}>
				<Box p={2}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								label='Current Fee'
								value={selectedFees?.charge}
								fullWidth
								InputProps={{
									readOnly: true,
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label='New Fee'
								value={newFee}
								onChange={(e) => setNewFee(e.target.value)}
								fullWidth
								type='number'
								inputProps={{ min: 0, step: 1 }}
								placeholder='Enter new fee'
							/>
						</Grid>
					</Grid>
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

export default ConsultationFees;
