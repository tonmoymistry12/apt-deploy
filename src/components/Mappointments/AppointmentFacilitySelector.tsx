import React, { useEffect, useState } from "react";
import {
	FaclityServiceResponse,
	FaclityServicePayload,
} from "@/interfaces/facilityInterface";
import { getOwnFacilites } from "@/services/faclilityService";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import FormHelperText from "@mui/material/FormHelperText";

interface AppointmentFacilitySelectorProps {
	onFacilitySelect: (facility: FaclityServiceResponse | null) => void;
	selectedFacility: FaclityServiceResponse | null;
	showHelper: boolean;
	setShowHelper: (show: boolean) => void;
	disabled?: boolean;
}

const AppointmentFacilitySelector: React.FC<
	AppointmentFacilitySelectorProps
> = ({
	onFacilitySelect,
	selectedFacility,
	showHelper,
	setShowHelper,
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
					orgId: localStorage.getItem("orgId") || "",
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

	const handleChange = (event: any) => {
		const facility =
			facilities.find((f) => f.facilityId === event.target.value) || null;
		onFacilitySelect(facility);
		if (facility) {
			setShowHelper(false);
		}
	};

	return (
		<FormControl
			fullWidth
			disabled={loading}
			variant='outlined'
			sx={{ maxWidth: 400, width: "100%" }}
			error={showHelper}>
			<InputLabel
				id='facility-select-label'
				sx={{ fontWeight: 500, color: "#555" }}>
				Facility
			</InputLabel>
			<Select
				labelId='facility-select-label'
				disabled={disabled}
				value={selectedFacility?.facilityId || ""}
				onChange={handleChange}
				label='Facility'
				sx={{
					borderRadius: "12px",
					fontWeight: 500,
					background: "#ffffff",
					boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: "#dde2e7",
					},
					"&:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: "#174a7c",
					},
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: "#103a61",
						borderWidth: "2px",
						boxShadow: "0 0 0 3px rgba(23, 74, 124, 0.1)",
					},
					".MuiSelect-select": {
						display: "flex",
						alignItems: "center",
						height: "56px",
						boxSizing: "border-box",
					},
				}}
				MenuProps={{
					PaperProps: {
						sx: {
							borderRadius: "12px",
							boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
							marginTop: "8px",
							border: "1px solid #e0e0e0",
						},
					},
				}}>
				{loading ? (
					<Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
						<CircularProgress size={24} />
					</Box>
				) : (
					facilities.map((facility) => (
						<MenuItem
							key={facility.facilityId}
							value={facility.facilityId}
							sx={{ fontWeight: 500, p: 1.5 }}>
							{facility.facilityName}
						</MenuItem>
					))
				)}
			</Select>
			{showHelper && (
				<FormHelperText sx={{ color: "#c0392b", fontWeight: 500, ml: 1 }}>
					Please select a facility to continue.
				</FormHelperText>
			)}
		</FormControl>
	);
};

export default AppointmentFacilitySelector;
