"use client";

import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import TableLinkButton from "@/components/common/buttons/TableLinkButton";
import CommonTable from "@/components/common/table/Table";
import PrivateRoute from "@/components/PrivateRoute";
import EditIcon from "@mui/icons-material/Edit";
import SellIcon from "@mui/icons-material/Sell";
import { useState, useEffect, useMemo } from "react";
import CreateRoleAdd from "@/components/CreateRoles/CreateRollAdd";
import CreateRoleEdit from "@/components/CreateRoles/CreateRoleEdit";
import CreateRoleAssign from "@/components/CreateRoles/CreateRollAssign";
import { getOrgRoles, getAllRoleGroupOfOrg } from "@/services/roleService";
import Message from "@/components/common/Message";
import {
	GetOrgRolesPayload,
	GetAllRoleGroupOfOrgPayload,
} from "@/interfaces/roleInterface";

interface RoleData {
	roleGroupName: string;
	roleName: string;
	status: string;
	facilities: string[];
	editAction: JSX.Element;
}

export default function DemoPage() {
	const colHeaders = [
		{ id: "roleGroupName", label: "Role Group Name" },
		{ id: "roleName", label: "Role Name" },
		{ id: "status", label: "Status" },
		{ id: "facilityName", label: "Facility" },
		{ id: "editAction", label: "Action" },
	];

	const facilitiesList = ["Facility A", "Facility B", "Facility C"];
	const [roleNamesOptions, setRoleNamesOptions] = useState<string[]>([]);
	const [roleGroupOptions, setRoleGroupOptions] = useState<string[]>([]);
	const [rowData, setRowData] = useState<RoleData[]>([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedRole, setSelectedRole] = useState<any | null>(null);
	const [dialogMode, setDialogMode] = useState<
		"add" | "edit" | "assign" | null
	>(null);
	const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);

	const [filters, setFilters] = useState([
		// { name: 'facilitys', options: [...facilitiesList ], value: 'All Facilities' },
		{ name: "roles", options: roleNamesOptions, value: "All Roles" },
		{ name: "status", options: ["Active", "Inactive"], value: "All Status" },
	]);

	const getRolePayload = (): GetOrgRolesPayload => ({
		callingFrom: "web",
		userName:
			typeof window !== "undefined"
				? localStorage.getItem("userName") || ""
				: "",
		userPass:
			typeof window !== "undefined"
				? localStorage.getItem("userPwd") || ""
				: "",
		orgId:
			typeof window !== "undefined" ? localStorage.getItem("orgId") || "" : "",
		facilityId: "0",
		loggedInFacilityId: "1",
		status: "",
		roleGrpId: "",
		searchRole: "",
	});

	const getRoleGroupPayload = (): GetAllRoleGroupOfOrgPayload => ({
		callingFrom: "web",
		userName:
			typeof window !== "undefined"
				? localStorage.getItem("userName") || ""
				: "",
		userPass:
			typeof window !== "undefined"
				? localStorage.getItem("userPwd") || ""
				: "",
		orgId:
			typeof window !== "undefined" ? localStorage.getItem("orgId") || "" : "",
	});

	const fetchRolesAndGroups = async () => {
		try {
			// Fetch roles
			const roleResponse = await getOrgRoles(getRolePayload());
			const mappedData: any[] = roleResponse.map((role) => ({
				roleGroupName: role.orgRoleGroup,
				roleName: role.roleName,
				status: role.activeInd === 1 ? "Active" : "Inactive",
				orgRoleId: role.orgRoleId,
				facilityName: role.facilityName,
				facilities: [],
				editAction: (
					<>
						<TableLinkButton
							text='Edit'
							icon={<EditIcon />}
							onClick={() =>
								handleEditClick({
									roleGroupName: role.orgRoleGroup,
									roleName: role.roleName,
									status: role.activeInd === 1 ? "Active" : "Inactive",
									orgRoleId: role.orgRoleId,
									facilities: [],
									editAction: <></>,
								})
							}
						/>
						<TableLinkButton
							text='Assign'
							icon={<SellIcon />}
							color='primary'
							onClick={() =>
								handleAssignClick({
									roleGroupName: role.orgRoleGroup,
									roleName: role.roleName,
									status: role.activeInd === 1 ? "Active" : "Inactive",
									orgRoleId: role.orgRoleId,
									facilities: [],
									editAction: <></>,
								})
							}
						/>
					</>
				),
			}));
			const newRoleOptions = roleResponse.map(
				(role) => `${role.orgRoleGroup} - ${role.roleName}`
			);
			// setRoleNamesOptions(newRoleOptions);

			setRowData(mappedData);

			// Fetch role groups
			const roleGroupResponse = await getAllRoleGroupOfOrg(
				getRoleGroupPayload()
			);
			console.log({ roleGroupResponse });
			const roleGroupNames = roleGroupResponse.map(
				(group) => group.roleGroupName
			);

			setRoleGroupOptions(roleGroupResponse); // Store full object
			setFilters((prevFilters) =>
				prevFilters.map((filter) =>
					filter.name === "roles"
						? { ...filter, options: [...roleGroupNames] }
						: filter
				)
			);
		} catch (error: any) {
			setSnackbarMessage(
				error?.response?.data?.message || "Failed to fetch data"
			);
			setOpenSnackbar(true);
		}
	};

	useEffect(() => {
		fetchRolesAndGroups();
	}, []);

	const handleFilterChange = (filterName: string, value: string) => {
		const updatedFilters = filters.map((filter) =>
			filter.name === filterName ? { ...filter, value } : filter
		);
		setFilters(updatedFilters);
	};

	const handleAddClick = () => {
		setDialogMode("add");
		setSelectedRole(null);
		setOpenDialog(true);
	};

	const handleEditClick = (role: any) => {
		setSelectedRole(role);
		setDialogMode("edit");
		setOpenDialog(true);
	};

	const handleAssignClick = (role: any) => {
		setSelectedRole(role);
		setSelectedFacilities(role.facilities);
		setDialogMode("assign");
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
		setSelectedRole(null);
		setDialogMode(null);
		setSelectedFacilities([]);
	};

	const refreshFacilities = async (action: string) => {
		console.log("on refresh");
		if (action === "error") {
			setSnackbarMessage("Server Error");
			setOpenSnackbar(true);
		} else {
			console.log("on refresh");
			handleClose();
			await fetchRolesAndGroups();
			if (action === "add") {
				setSnackbarMessage("Role Saved Successfully");
			} else if (action === "edit") {
				setSnackbarMessage("Role Updated Successfully");
			} else {
				setSnackbarMessage("Role Mapped Successfully");
			}
			setSnackbarSeverity("success");
			setOpenSnackbar(true);
		}
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const getDialogTitle = () => {
		switch (dialogMode) {
			case "add":
				return "Add New Role";
			case "edit":
				return "Edit Role";
			case "assign":
				return "Assign Facility";
			default:
				return "";
		}
	};

	const getDialogContent = () => {
		switch (dialogMode) {
			case "add":
				return (
					<CreateRoleAdd
						roleGroupOptions={roleGroupOptions}
						onAddSuccess={refreshFacilities}
						onCancel={handleClose}
					/>
				);
			case "edit":
				return selectedRole ? (
					<CreateRoleEdit
						role={selectedRole}
						onAddSuccess={refreshFacilities}
						roleGroupOptions={roleGroupOptions}
						onCancel={handleClose}
					/>
				) : null;
			case "assign":
				return selectedRole ? (
					<CreateRoleAssign
						role={selectedRole}
						onSubmit={refreshFacilities}
						onCancel={handleClose}
						onFacilitiesChange={setSelectedFacilities}
					/>
				) : null;
			default:
				return null;
		}
	};

	return (
		<PrivateRoute>
			<AuthenticatedLayout>
				<CommonTable
					heading='Create Roles & Assign Facilities'
					showSearch={true}
					showAddButton={true}
					addButtonLabel='Add New Role'
					showFilterButton={false}
					filterButtonLabel='Filter Roles'
					filters={filters}
					onFilterChange={handleFilterChange}
					colHeaders={colHeaders}
					rowData={rowData}
					openDialog={openDialog}
					handleClose={handleClose}
					title={getDialogTitle()}
					children={getDialogContent()}
					rowsPerPageOptions={[5, 10]}
					hideDefaultButtons={true}
					onAddButtonClick={handleAddClick}
					//onSave={checkDialog(dialogMode)}
				/>
				<Message
					openSnackbar={openSnackbar}
					handleCloseSnackbar={handleCloseSnackbar}
					snackbarSeverity={snackbarSeverity}
					snackbarMessage={snackbarMessage}
				/>
			</AuthenticatedLayout>
		</PrivateRoute>
	);
}
