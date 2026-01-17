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

interface FacilityDropdownProps {
	onFacilitySelect: (facility: FaclityServiceResponse | null) => void;
	selectedFacility: FaclityServiceResponse | null;
	showHelper: boolean;
	disabled?: boolean;
}

const FacilityDropdown: React.FC<FacilityDropdownProps> = ({
	onFacilitySelect,
	selectedFacility,
	showHelper,
	disabled,
}) => {
	const [facilities, setFacilities] = useState<FaclityServiceResponse[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchFacilities = async () => {
			setLoading(true);
			try {
				const payload: FaclityServicePayload = {
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					deviceStat: "M",
					callingFrom: "web",
					orgId: localStorage.getItem("orgId")?.toString(),
					searchFacility: "",
					status: "All",
				};
				const data = await getOwnFacilites(payload);
				setFacilities(data);
			} catch (error) {
				setFacilities([]);
			} finally {
				setLoading(false);
			}
		};
		fetchFacilities();
	}, []);

	const handleChange = (event: SelectChangeEvent<string>) => {
		const facilityId = event.target.value;
		const facility =
			facilities.find((f) => f.facilityId.toString() === facilityId) || null;
		onFacilitySelect(facility);
	};

	return (
		<FormControl
			fullWidth
			variant='outlined'
			error={showHelper}
			disabled={loading}>
			<InputLabel>Select Facility</InputLabel>
			<Select
				disabled={disabled}
				value={selectedFacility?.facilityId?.toString() || ""}
				onChange={handleChange}
				label='Select Facility'
				startAdornment={
					loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null
				}>
				{facilities.map((facility) => (
					<MenuItem
						key={facility.facilityId}
						value={facility.facilityId.toString()}>
						{facility.facilityName}
					</MenuItem>
				))}
			</Select>
			{showHelper && (
				<FormHelperText>Please select a facility first.</FormHelperText>
			)}
		</FormControl>
	);
};

export default FacilityDropdown;
