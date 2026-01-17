"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";

import {
	Box,
	Button,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	TextField,
	Select,
	MenuItem,
	Grid,
} from "@mui/material";

import styles from "./style.module.scss";

import EditIcon from "@mui/icons-material/Edit";

import EditFacility from "../../Mvetconnect/EditFacility";
import { FaclityServiceResponse } from "@/interfaces/facilityInterface";
import CummonDialog from "@/components/common/CummonDialog";
import {
	addNewFacility,
	getFacilityDetails,
} from "@/services/faclilityService";
import Message from "@/components/common/Message";

type FacilityTableProps = {
	facilities: FaclityServiceResponse[];
	onEdit?: (facility: FaclityServiceResponse) => void;
	onAddSuccess?: () => void;
};

function FacilityList({ facilities, onAddSuccess }: FacilityTableProps) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("");

	const [openDialog, setOpenDialog] = useState(false);
	const [modalMode, setModalMode] = useState<"add" | "edit">("add");
	const [selectedFacility, setSelectedFacility] =
		useState<FaclityServiceResponse | null>(null);

	const editFacilityRef = useRef<any>(null);

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);

	// Fully type-safe empty facility object
	const emptyFacility: any = {
		facilityColor: "",
		patientsToView: 1,
		internBilling: 1,
		facilityId: 0,
		facilityTypeId: 1,
		orgId: localStorage.getItem("orgId"),
		loggedInFacilityId: localStorage.getItem("loggedinFacilityId"),
		orgUserId: localStorage.getItem("orgUserId"),
		cityPincodeMappingId: 39551,
		cityId: 2763,
		facilityName: "",
		contactPersonName: "",
		address1: "",
		address2: "",
		pin: "",
		state: "",
		country: "",
		firstContactNo: "",
		firstContactEmail: "",
		secondContactNo: "",
		secondContactEmail: "",
		city: "",
		userName: "",
		userPass: "",
		deviceStat: "",
		areaName: "",
		status: "",
		facilityType: "",
		callingFrom: "",
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

	const filteredFacilities = useMemo(() => {
		return facilities.filter((facility: any) => {
			const matchesSearch = facility.facilityName
				?.toLowerCase()
				.includes(searchTerm.toLowerCase());

			const matchesStatus =
				!statusFilter ||
				facility.status?.toLowerCase() === statusFilter.toLowerCase();

			return matchesSearch && matchesStatus;
		});
	}, [facilities, searchTerm, statusFilter]);

	useEffect(() => {
		setPage(0);
	}, [searchTerm, statusFilter]);

	const paginatedFacilities = useMemo(() => {
		const start = page * rowsPerPage;
		return filteredFacilities.slice(start, start + rowsPerPage);
	}, [filteredFacilities, page, rowsPerPage]);

	const handleEditClick = async (facility: FaclityServiceResponse) => {
		try {
			const payload = {
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				deviceStat: "M",
				callingFrom: "web",
				orgId: localStorage.getItem("orgId") || "",
				facilityId: String(facility.facilityId),
				loggedInFacilityId: localStorage.getItem("loggedinFacilityId"),
			};
			const details = await getFacilityDetails(payload);
			console.log("RAW API details:", details);
			const apiData = Array.isArray(details) ? details[0] : details;
			console.log("apiData:", apiData);
			// Only use getfacilitydetails response for form
			const mappedFacility = {
				...apiData,
				secondContactNo:
					apiData.secondContactNo != null
						? String(apiData.secondContactNo)
						: "",
				secondContactEmail:
					apiData.secondContactEmail != null
						? String(apiData.secondContactEmail)
						: "",
				contactPersonName:
					apiData.contactPersonName != null
						? String(apiData.contactPersonName)
						: "",
				status: apiData.status ?? (apiData.activeInd === 1 ? "1" : "2"),
				city: apiData.city != null ? String(apiData.city) : "",
				areaName: apiData.areaName != null ? String(apiData.areaName) : "",
				facilityColor: apiData.facilityColor ?? "#1a365d",
				facilityName: apiData.facilityName ?? "",
				address1: apiData.address1 ?? "",
				address2: apiData.address2 ?? "",
				pin: apiData.pin ?? "",
				state: apiData.state ?? "",
				country: apiData.country ?? "",
				firstContactNo: apiData.firstContactNo ?? "",
				firstContactEmail: apiData.firstContactEmail ?? "",
			};
			console.log("mappedFacility:", mappedFacility);
			setSelectedFacility(mappedFacility);
			setModalMode("edit");
			setOpenDialog(true);
		} catch (error) {
			setSnackbarMessage("Failed to fetch facility details.");
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
		}
	};

	// Close modal
	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedFacility(null);
		setModalMode("add");
	};

	// Add/Edit Facility submit handler
	const handleFacilitySubmit = async () => {
		if (editFacilityRef.current && editFacilityRef.current.submitForm) {
			const result = await editFacilityRef.current.submitForm({
				onSuccess: () => {
					setSnackbarMessage("Facility added successfully!");
					setSnackbarSeverity("success");
					setOpenSnackbar(true);
				},
				onError: () => {
					setSnackbarMessage("Failed to add facility.");
					setSnackbarSeverity("error");
					setOpenSnackbar(true);
				},
			});
			// If add was successful, close dialog and refresh list
			if (result && onAddSuccess) {
				setOpenDialog(false);
				setSelectedFacility(null);
				setModalMode("add");
				onAddSuccess();
			}
		}
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	return (
		<Box p={2}>
			<Typography variant='h6' mb={2}>
				Maintain Facilities
			</Typography>

			{/* Search and Filter */}
			<Grid container spacing={2} alignItems='center' mb={2}>
				<Grid item xs={12} sm={6} md={4} mx='auto'>
					<TextField
						fullWidth
						variant='outlined'
						label='Search by Name'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Select
						fullWidth
						displayEmpty
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						variant='outlined'>
						<MenuItem value=''>All Status</MenuItem>
						<MenuItem value='Active'>Active</MenuItem>
						<MenuItem value='Inactive'>Inactive</MenuItem>
					</Select>
				</Grid>
				<Grid
					item
					xs={12}
					md={5}
					display='flex'
					justifyContent='flex-end'
					gap={1}>
					<Button
						variant='contained'
						color='primary'
						sx={{ background: "#174a7c" }}
						onClick={() => {
							setModalMode("add");
							setSelectedFacility(null);
							setOpenDialog(true);
						}}>
						Add New Facility
					</Button>
				</Grid>
			</Grid>

			{/* Table */}
			<TableContainer component={Paper} className={styles.tableWrapper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Color</TableCell>
							<TableCell>Address</TableCell>
							<TableCell>Contact Person</TableCell>
							<TableCell>Pin No.</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Phone</TableCell>
							<TableCell>Current Plan</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedFacilities.map((facility, index) => (
							<TableRow key={index}>
								<TableCell>{facility.facilityName}</TableCell>
								<TableCell>{facility?.facilityColor}</TableCell>
								<TableCell>{facility.address1}</TableCell>
								<TableCell>{facility.contactPersonName}</TableCell>
								<TableCell>{facility.pin}</TableCell>
								<TableCell>{facility.firstContactEmail}</TableCell>
								<TableCell>{facility.firstContactNo}</TableCell>
								<TableCell>{facility.facilityType}</TableCell>
								<TableCell>{facility.status}</TableCell>
								<TableCell>
									<Button
										variant='outlined'
										color='secondary'
										size='small'
										startIcon={<EditIcon />}
										onClick={() => handleEditClick(facility)}>
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
					count={filteredFacilities.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</TableContainer>

			{/* EditFacility Dialog */}
			<CummonDialog
				open={openDialog}
				onClose={handleCloseDialog}
				title={modalMode === "add" ? "Add Facility" : "Edit Facility"}
				maxWidth='md'
				onSubmit={handleFacilitySubmit}>
				<EditFacility
					ref={editFacilityRef}
					facility={
						modalMode === "edit" && selectedFacility
							? selectedFacility
							: emptyFacility
					}
					isEdit={modalMode === "edit"}
				/>
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

export default FacilityList;
