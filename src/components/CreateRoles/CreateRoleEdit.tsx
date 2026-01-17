import { useEffect, useState } from "react";
import {
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { CreateRoleEditProps } from "@/interfaces/roleComponentInterface";
import {
	checkDuplicateRoleName,
	fetchRoleDetails,
	saveRole,
} from "@/services/roleService";
import Message from "../common/Message";

const CreateRoleEdit: React.FC<CreateRoleEditProps> = ({
	role,
	roleGroupOptions,
	onCancel,
	onAddSuccess,
}) => {
	const [roleName, setRoleName] = useState("");
	const [roleGroupName, setRoleGroupName] = useState("");
	const [roleId, setRoleId] = useState("");
	const [status, setStatus] = useState("");
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);

	useEffect(() => {
		const getRoleDetails = async () => {
			try {
				const payload = {
					callingFrom: "web",
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					orgId: localStorage.getItem("orgId") || "",
					roleId: role.orgRoleId,
				};
				const data: any = await fetchRoleDetails(payload); // or another `roleId` prop
				setRoleName(data.roleName);
				setRoleGroupName(data.globalRoleGroupId);
				setStatus(data.activeInd);
				setRoleId(data.orgRoleId);
			} catch (error) {
				console.error("Error fetching role details:", error);
				// Handle error (e.g., show notification or fallback)
			}
		};

		getRoleDetails();
	}, [role.orgRoleId]);

	const handleSubmit = async () => {
		if (!roleName || !roleGroupName) {
			return; // Add validation feedback if needed
		}
		try {
			const payload = {
				callingFrom: "web",
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				orgId: localStorage.getItem("orgId") || "",
				loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
				roleId: roleId,
				roleGrpId: roleGroupName.toString(),
				roleName: roleName,
				activeInd: status,
			};
			await saveRole(payload);
			onAddSuccess("edit");
		} catch (e) {
			onAddSuccess("error");
		}
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const handleRoleNameBlur = async () => {
		if (!roleName.trim()) return;

		try {
			const payload = {
				callingFrom: "web",
				userName: localStorage.getItem("userName") || "",
				userPass: localStorage.getItem("userPwd") || "",
				orgId: localStorage.getItem("orgId") || "",
				loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
				roleId: role.orgRoleId,
				roleName: roleName, // example — use actual orgId if available dynamically
			};

			// Replace this with your actual API function
			const response: any = await checkDuplicateRoleName(payload);

			if (response === "Role Not Exists") {
				setOpenSnackbar(true);
				setSnackbarSeverity("success");
				setSnackbarMessage("Role name avialavble.");
			} else {
				setOpenSnackbar(true);
				setSnackbarSeverity("error");
				setSnackbarMessage("Role name already taken.");
			}
		} catch (error) {
			setOpenSnackbar(true);
			setSnackbarSeverity("error");
			setSnackbarMessage("Error checking role name.");
		}
	};

	return (
		<>
			<DialogContent>
				<FormControl fullWidth margin='dense'>
					<InputLabel>Role Group</InputLabel>
					<Select
						value={roleGroupName}
						onChange={(e) => setRoleGroupName(e.target.value as string)}
						label='Role Group'>
						{roleGroupOptions.map((option) => (
							<MenuItem key={option.roleGroupId} value={option.roleGroupId}>
								{option.roleGroupName}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					fullWidth
					margin='dense'
					label='Role Name'
					value={roleName}
					onChange={(e) => setRoleName(e.target.value)}
					onBlur={handleRoleNameBlur}
				/>
				<FormControl fullWidth margin='dense'>
					<InputLabel>Status</InputLabel>
					<Select
						value={status}
						onChange={(e) => setStatus(e.target.value as string)}
						label='Status'>
						<MenuItem value='1'>Active</MenuItem>
						<MenuItem value='0'>Inactive</MenuItem>
					</Select>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel} variant='outlined'>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					type='submit'
					variant='contained'
					sx={{
						bgcolor: "#174a7c",
						color: "#fff",
						fontWeight: 700,
						"&:hover": { bgcolor: "#103a61" },
					}}>
					Submit
				</Button>
			</DialogActions>
			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</>
	);
};

export default CreateRoleEdit;
