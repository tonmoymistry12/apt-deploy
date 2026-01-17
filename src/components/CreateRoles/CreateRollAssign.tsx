import React, { useEffect, useState } from "react";
import {
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Grid,
	Typography,
	Button,
	OutlinedInput,
	DialogContent,
	DialogActions,
} from "@mui/material";
import {
	fetchFacilites,
	getfacilityidsforrolemapping,
	saverolefacilitymapping,
} from "@/services/roleService";

interface CreateRoleAssignProps {
	role: {
		roleName: string;
		roleGroupName: string;
		status: string;
		orgRoleId: string;
	};
	onSubmit: (arg: string) => void | Promise<void>;
	onCancel: () => void;
	onFacilitiesChange: (facilities: string[]) => void;
}

const CreateRoleAssign: React.FC<CreateRoleAssignProps> = ({
	role,
	onSubmit,
	onCancel,
	onFacilitiesChange,
}) => {
	const [formValues, setFormValues] = useState<{ facilities: string[] }>({
		facilities: [],
	});

	const [facilities, setFacilities] = useState<any[]>([]);

	const [errors, setErrors] = useState<{ facilities: string }>({
		facilities: "",
	});

	//const facilities: string[] = ['Administrator', 'Doctor', 'Admin Staff'];

	const validationRules = {
		facilities: (value: string[]) =>
			value.length > 0 ? "" : "At least one facility is required",
	};

	const validateForm = (): boolean => {
		const newErrors = {
			facilities: validationRules.facilities(formValues.facilities),
		};
		setErrors(newErrors);
		return !Object.values(newErrors).some((error) => error !== "");
	};

	useEffect(() => {
		const loadFacilities = async () => {
			try {
				const payload = {
					callingFrom: "web",
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					orgId: localStorage.getItem("orgId") || "",
					loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "", // You can also get this dynamically from context or props
					roleId: role.orgRoleId,
				};

				const response = await fetchFacilites(payload);

				// Assume response is an array of facility objects, map to their names
				const formatted = response.map((f: any) => ({
					id: f.facilityId,
					name: f.facilityName,
				})); // Adjust field as per your API

				setFacilities(formatted);

				// Call API to get assigned facility IDs
				const assignedIdsResponse = await getfacilityidsforrolemapping(payload);
				console.log(assignedIdsResponse);
				// Assume response is an array of IDs like [1, 2, 3]
				if (assignedIdsResponse.length > 0) {
					const assignedIds = assignedIdsResponse?.map(
						(f: any) => f.facilityId
					);
					setFormValues({ facilities: assignedIds });
				}
			} catch (error) {
				console.error("Failed to fetch facilities:", error);
				// Optionally show an error snackbar here
			}
		};

		loadFacilities();
	}, [role.orgRoleId]);

	const handleChange = (event: any) => {
		const value = event.target.value as string[];
		setFormValues({ facilities: value });

		const errorMsg = validationRules.facilities(value);
		setErrors({ facilities: errorMsg });
		onFacilitiesChange(value);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			try {
				const payload = {
					callingFrom: "web",
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					orgId: localStorage.getItem("orgId") || "",
					loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
					roleId: role.orgRoleId,
					facilityIds: formValues.facilities.toString(),
				};
				await saverolefacilitymapping(payload);
				onSubmit("assign");
			} catch (e) {
				onSubmit("error");
				console.log("e");
			}
		}
	};

	return (
		<>
			<DialogContent>
				<Box
					sx={{
						p: { xs: 2, sm: 4 },
						maxWidth: 600,
						mx: "auto",
						bgcolor: "#f5f5f5",
						borderRadius: 2,
						border: "1px solid #ddd",
					}}>
					<form onSubmit={handleSubmit}>
						<Typography variant='h6' sx={{ mb: 2, color: "#0288d1" }}>
							Facility management for {role.roleName} (Role Group:{" "}
							{role.roleGroupName})
						</Typography>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<FormControl fullWidth required error={!!errors.facilities}>
									<InputLabel sx={{ color: "#0288d1" }}>
										Choose One Facilities
									</InputLabel>
									<Select
										multiple
										displayEmpty
										value={formValues.facilities}
										onChange={handleChange}
										input={<OutlinedInput label='Facilities' />}
										renderValue={(selected) => {
											const selectedFacilities = selected
												.map((id) => facilities.find((f) => f.id === id))
												.filter((f): f is { id: number; name: string } => !!f);

											// Type narrowing

											return (
												<Box
													sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
													{selectedFacilities.map((facility) => (
														<Chip
															key={facility.id}
															label={`${facility.name}`}
															sx={{ bgcolor: "#0288d1", color: "white" }}
														/>
													))}
												</Box>
											);
										}}
										sx={{
											bgcolor: "white",
											borderRadius: 2,
											"& .MuiOutlinedInput-notchedOutline": {
												borderColor: "#0288d1",
											},
											"&:hover .MuiOutlinedInput-notchedOutline": {
												borderColor: "#01579b",
											},
											"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
												borderColor: "#01579b",
												boxShadow: "0 0 8px rgba(2, 136, 209, 0.3)",
											},
										}}>
										{facilities.map((facility) => (
											<MenuItem key={facility.id} value={facility.id}>
												{facility.name}
											</MenuItem>
										))}
									</Select>

									{errors.facilities && (
										<Typography variant='caption' color='error' sx={{ mt: 1 }}>
											{errors.facilities}
										</Typography>
									)}
								</FormControl>
							</Grid>
						</Grid>
					</form>
				</Box>
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
		</>
	);
};

export default CreateRoleAssign;
