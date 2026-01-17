import React, { useEffect, useRef, useState } from "react";
import CommonTable from "../common/table/Table";
import MaintainForm, { MaintainFormRef } from "./MaintainForm";
import EditIcon from "@mui/icons-material/Edit";
import TableLinkButton from "../common/buttons/TableLinkButton";
import rawMaintainData from "../../data/data.json";
import {
	getOrgCorporates,
	saveCorporate,
} from "@/services/maintainCorporatesService";
import Message from "../common/Message";

interface Maintain {
	id: number;
	name: string;
	address: string;
	city: string;
	state: string;
	pin: string;
	country: string;
	contactNumber: string;
	email: string;
	status: string;
}

const initialMaintain: Maintain[] = rawMaintainData.map((maintain, index) => ({
	...maintain,
	id: index + 1,
}));

const MaintainTable: React.FC = () => {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [editData, setEditData] = useState<any | null>(null);
	const [maintains, setMaintains] = useState<any[]>([]);

	const formRef = useRef<MaintainFormRef>(null);

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);

	const basePayload = {
		callingFrom: "web",
		userName: localStorage.getItem("userName") || "",
		userPass: localStorage.getItem("userPwd") || "",
		orgId: localStorage.getItem("orgId") || "",
		loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
		srchCorp: "",
		status: "",
	};
	const fetchList = async () => {
		try {
			const response: any = await getOrgCorporates(basePayload);

			if (Array.isArray(response)) {
				setMaintains(response);
			} else {
				setMaintains([]);
			}
		} catch (exception) {
			console.log(exception);
		}
	};
	useEffect(() => {
		fetchList();
	}, []);

	const colHeaders = [
		{ id: "corporateName", label: "Name" },
		{ id: "corporateStatus", label: "Status" },
		{ id: "action", label: "Action" },
	];

	const filters = [
		{
			name: "status",
			options: ["Active", "Inactive"],
			value: "",
		},
	];

	const handleAddClick = () => {
		setEditData(null);
		setOpenDialog(true);
	};

	const handleEditClick = (maintain: Maintain) => {
		setEditData(maintain);
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
		setEditData(null);
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const handleFormSubmit = async (data: any) => {
		console.log("Hittttt");
		console.log(data);
		if (editData) {
			/* setMaintains(
				maintains.map((maintain) =>
					maintain.id === editData.id
						? { ...maintain, ...data, id: editData.id }
						: maintain
				)
			); */
			try {
				const sendObj = {
					callingFrom: "web",
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					orgId: localStorage.getItem("orgId") || "",
					loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
					corporateId: data.corporateId,
					activeInd: data.activeInd,
					corporateName: data.corporateName,
					address: data.address,
					country: data.country,
					state: data.state,
					city: data.city,
					pin: data.pin,
					phone: data.phone,
					email: data.email,
				};
				const editedData = await saveCorporate(sendObj);
				fetchList();
				setOpenSnackbar(true);
				setSnackbarMessage("Saved successfully");
				setSnackbarSeverity("success");
			} catch (error) {
				console.log(error);
				setOpenSnackbar(true);
				setSnackbarMessage("Some Error occured");
				setSnackbarSeverity("error");
			}
		} else {
			try {
				const sendObj = {
					callingFrom: "web",
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					orgId: localStorage.getItem("orgId") || "",
					loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
					corporateId: 0,
					activeInd: data.activeInd,
					corporateName: data.corporateName,
					address: data.address,
					country: data.country,
					state: data.state,
					city: data.city,
					pin: data.pin,
					phone: data.phone,
					email: data.email,
				};
				const editedData = await saveCorporate(sendObj);
				fetchList();
				setOpenSnackbar(true);
				setSnackbarMessage("Saved successfully");
				setSnackbarSeverity("success");
			} catch (error) {
				console.log(error);
				setOpenSnackbar(true);
				setSnackbarMessage("Some Error occured");
				setSnackbarSeverity("error");
			}
		}
		handleClose();
	};

	return (
		<>
			<CommonTable
				heading='Maintain Corporate'
				showSearch={true}
				showAddButton={true}
				showFilterButton={false}
				addButtonLabel='Add New Corporate'
				filterButtonLabel='Filter'
				//filters={filters}
				colHeaders={colHeaders}
				rowData={maintains?.map((maintain) => ({
					...maintain,
					action: (
						<TableLinkButton
							text='Edit'
							icon={<EditIcon />}
							color='primary'
							onClick={() => handleEditClick(maintain)}
						/>
					),
				}))}
				rowsPerPageOptions={[10, 25, 50]}
				openDialog={openDialog}
				handleClose={handleClose}
				onAddButtonClick={handleAddClick}
				dialogWidth='md'
				onSave={() => formRef.current?.submit()}
				title={editData ? "Edit Corporate" : "Add Corporate"}>
				<MaintainForm
					ref={formRef}
					initialData={editData ?? undefined}
					onSubmit={handleFormSubmit}
				/>
			</CommonTable>

			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</>
	);
};

export default MaintainTable;
