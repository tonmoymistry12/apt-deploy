import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	Select,
	MenuItem,
	Button,
	Typography,
	TablePagination,
	Box,
} from "@mui/material";
import CummonDialog from "../CummonDialog";
import styles from "./styles.module.scss";

interface Filter {
	name: string;
	options: string[];
	value: string;
}

interface TableColumn {
	id: string;
	label: string;
}

interface TableRowData {
	[key: string]: any;
}

interface CommonTableProps {
	heading: string;
	showSearch?: boolean;
	showAddButton?: boolean;
	showFilterButton?: boolean;
	showEditButton?: boolean;
	addButtonLabel?: string;
	filterButtonLabel?: string;
	editButtonLabel?: string;
	filters?: Filter[];
	colHeaders: TableColumn[];
	rowData: TableRowData[];
	rowsPerPageOptions?: number[];
	openDialog?: boolean;
	handleClose?: () => void;
	onAddButtonClick?: () => void;
	dialogWidth?: any;
	title?: string;
	children?: any;
	hideDefaultButtons?: boolean;
	onFilterChange?: (filterName: string, value: string) => void;
	onSave?: (_: any) => any;
}

const CommonTable: React.FC<CommonTableProps> = ({
	heading,
	showSearch = true,
	showAddButton = true,
	showFilterButton = true,
	addButtonLabel = "Add New",
	filterButtonLabel = "Filter",
	filters = [],
	colHeaders,
	rowData,
	rowsPerPageOptions = [5, 10, 25],
	openDialog = false,
	dialogWidth = "sm",
	title = "",
	handleClose,
	onAddButtonClick,
	children,
	hideDefaultButtons = false,
	onFilterChange,
	onSave,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentFilters, setCurrentFilters] = useState<{
		[key: string]: string;
	}>({});
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

	const handleFilterChange = (filterName: string, value: string) => {
		setCurrentFilters((prev) => ({ ...prev, [filterName]: value }));
		if (onFilterChange) {
			onFilterChange(filterName, value);
		}
	};
	console.log({ rowData });
	const filteredRows = rowData.filter((row) => {
		const searchMatch = Object.values(row).some((val) =>
			String(val).toLowerCase().includes(searchTerm.toLowerCase())
		);

		const filterMatch = filters.every((filter) => {
			const val = filter.value;
			if (!val || val.startsWith("All")) return true; // no filtering

			if (filter.name === "facilities") {
				return row.facilities.includes(val);
			} else if (filter.name === "roles") {
				console.log({ val });
				console.log(`${row.roleName}`);
				const combined = `${row.roleName}`;
				console.log(combined === val);
				return combined === val;
			} else {
				// Use direct field matching
				console.log("role2");
				console.log(val);
				console.log(row);
				const rowVal = (row as any)[filter.name];
				console.log(rowVal);
				console.log("rowval");
				console.log(rowVal === val);
				console.log("rowval1");
				return rowVal === val;
			}
		});

		return searchMatch && filterMatch;
	});

	const paginatedRows = filteredRows.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<>
			<Typography variant='h6' sx={{ mb: 2 }}>
				{heading}
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
				{showSearch && (
					<TextField
						label='Search by Name'
						variant='outlined'
						size='small'
						onChange={(e) => setSearchTerm(e.target.value)}
						sx={{
							minWidth: 280,
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
					/>
				)}

				{filters.map((filter) => (
					<Select
						key={filter.name}
						value={currentFilters[filter.name] || ""}
						onChange={(e) => handleFilterChange(filter.name, e.target.value)}
						displayEmpty
						size='small'
						sx={{
							minWidth: 200,
							bgcolor: "white",
							borderRadius: 2,
							"& .MuiOutlinedInput-notchedOutline": {
								borderColor: "rgba(23, 74, 124, 0.2)",
							},
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: "#174a7c",
							},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderColor: "#174a7c",
							},
						}}>
						<MenuItem value=''>All {filter.name}</MenuItem>
						{filter.options.map((opt) => (
							<MenuItem key={opt} value={opt}>
								{opt}
							</MenuItem>
						))}
					</Select>
				))}

				{showFilterButton && (
					<Button variant='contained' color='primary' sx={{ ml: "auto" }}>
						{filterButtonLabel}
					</Button>
				)}

				{showAddButton && (
					<Button
						variant='contained'
						color='primary'
						sx={{ ml: "auto" }}
						onClick={onAddButtonClick}>
						{addButtonLabel}
					</Button>
				)}
			</Box>

			<TableContainer component={Paper} className={styles.tableWrapper}>
				<Table>
					<TableHead>
						<TableRow>
							{colHeaders.map((col) => (
								<TableCell key={col.id}>{col.label}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedRows.length > 0 ? (
							paginatedRows.map((row, idx) => (
								<TableRow key={idx}>
									{colHeaders.map((col) => (
										<TableCell
											sx={{
												maxWidth: 200, // adjust as needed
												whiteSpace: "normal",
												wordBreak: "break-word",
												overflowWrap: "break-word",
											}}
											key={col.id}>
											{col.id === "image" ? (
												<img src={row[col.id]} alt='row-img' width='50' />
											) : (
												row[col.id]
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={colHeaders.length} align='center'>
									No records found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				<TablePagination
					rowsPerPageOptions={rowsPerPageOptions}
					component='div'
					count={filteredRows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={(e, newPage) => setPage(newPage)}
					onRowsPerPageChange={(e) => {
						setRowsPerPage(parseInt(e.target.value, 10));
						setPage(0);
					}}
				/>
			</TableContainer>

			<CummonDialog
				open={openDialog}
				onClose={handleClose || (() => {})}
				onSubmit={onSave}
				maxWidth={dialogWidth}
				title={title}
				hideDefaultButtons={hideDefaultButtons}>
				{children}
			</CummonDialog>
		</>
	);
};

export default CommonTable;
