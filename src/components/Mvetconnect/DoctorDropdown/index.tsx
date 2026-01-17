import React, { useEffect, useState } from "react";
import {
	FaclityServiceResponse,
	FaclityServicePayload,
} from "@/interfaces/facilityInterface";
import { getOwnFacilites } from "@/services/faclilityService";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import { getDoctorList } from "@/services/userService";

interface FacilityDropdownProps {
	onDoctorSelect: (doctor: any | null) => void;
	selectedDoctor: any | null;
	showHelper: boolean;
}

const DoctorDropdown: React.FC<FacilityDropdownProps> = ({
	onDoctorSelect,
	selectedDoctor,
	showHelper,
}) => {
	const [doctors, setDoctors] = useState<any[]>([]);
	const [loading, setLoadingDoctors] = useState(false);

	useEffect(() => {
		const fetchDoctors = async () => {
			setLoadingDoctors(true);
			try {
				const payload = {
					callingFrom: "app",
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					deviceStat: "M",
					orgId: localStorage.getItem("orgId") || "2",
				};
				const response = await getDoctorList(payload);
				setDoctors(response);
			} catch (error) {
				console.error("Error fetching doctors:", error);
			} finally {
				setLoadingDoctors(false);
			}
		};
		fetchDoctors();
	}, []);

	const handleChange = (event: SelectChangeEvent<string>) => {
		const doctorId = event.target.value;
		const doctor =
			doctors.find((f) => f.userUid.toString() === doctorId) || null;
		//	onFacilitySelect(facility);
		/* const facility =
			facilities.find((f) => f.facilityId.toString() === facilityId) || null; */
		onDoctorSelect(doctor);
	};

	return (
		<FormControl
			fullWidth
			variant='outlined'
			error={showHelper}
			disabled={loading}>
			<InputLabel>Select Doctor</InputLabel>
			<Select
				value={selectedDoctor?.userUid?.toString() || ""}
				onChange={handleChange}
				label='Select Doctor'
				startAdornment={
					loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null
				}>
				{doctors.map((doctor) => (
					<MenuItem key={doctor.userUid} value={doctor.userUid.toString()}>
						{doctor.userName}
					</MenuItem>
				))}
			</Select>
			{showHelper && (
				<FormHelperText>Please select a doctor first.</FormHelperText>
			)}
		</FormControl>
	);
};

export default DoctorDropdown;
