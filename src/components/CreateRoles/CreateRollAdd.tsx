import { useState } from "react";
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
import { CreateRoleAddProps } from "@/interfaces/roleComponentInterface";
import { checkDuplicateRoleName, saveRole } from "@/services/roleService";
import Message from "../common/Message";

const CreateRoleAdd: React.FC<CreateRoleAddProps> = ({
	roleGroupOptions,
	onAddSuccess,
	onCancel,
}) => {
	const [roleName, setRoleName] = useState("");
	const [roleGroupName, setRoleGroupName] = useState("");
	const [status, setStatus] = useState("1");
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);

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
				roleId: "0",
				roleGrpId: roleGroupName.toString(),
				roleName: roleName,
				activeInd: status,
			};
			await saveRole(payload);
			onAddSuccess("add");
		} catch (e) {
			onAddSuccess("error");
		}
		//onSubmit();
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
				roleId: "0",
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
			console.error("Error checking role name:", error);
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

export default CreateRoleAdd;
