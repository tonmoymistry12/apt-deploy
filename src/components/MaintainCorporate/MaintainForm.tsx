import React, { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import {
	TextField,
	Grid,
	FormHelperText,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";

interface MaintainFormData {
	corporateName: string;
	address: string;
	city: string;
	state: string;
	pin: string;
	country: string;
	phone: string;
	email: string;
	corporateStatus: string;
}

interface MaintainFormProps {
	initialData?: MaintainFormData;
	onSubmit: (data: MaintainFormData) => void;
}

export interface MaintainFormRef {
	submit: () => void; // method that parent can call
}

const MaintainForm = forwardRef<MaintainFormRef, MaintainFormProps>(
	({ initialData, onSubmit }, ref) => {
		const {
			control,
			handleSubmit,
			formState: { errors },
		} = useForm<MaintainFormData>({
			defaultValues: initialData || {
				corporateName: "",
				address: "",
				city: "",
				state: "",
				pin: "",
				country: "",
				phone: "",
				email: "",
				corporateStatus: "",
			},
		});

		const handleFormSubmit = (data: MaintainFormData) => {
			console.log("Form submitted:", data);
			// you can call API or handle logic here
		};

		useImperativeHandle(ref, () => ({
			submit: () => handleSubmit(onSubmit)(),
		}));

		return (
			<>
				<Grid container spacing={2}>
					{/* Row 1: Name, Contact Number, Email, Status */}
					<Grid item xs={12} sm={3}>
						<Controller
							name='corporateName'
							control={control}
							rules={{ required: "Name is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='Name *'
									fullWidth
									variant='outlined'
									error={!!errors.corporateName}
									helperText={errors.corporateName?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<Controller
							name='phone'
							control={control}
							rules={{
								required: "Contact number is required",
								pattern: {
									value: /^\d{10}$/,
									message: "Contact number must be 10 digits",
								},
							}}
							render={({ field }) => (
								<TextField
									{...field}
									label='Contact No. *'
									fullWidth
									variant='outlined'
									error={!!errors.phone}
									helperText={errors.phone?.message || "Format: 10 digits"}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<Controller
							name='email'
							control={control}
							rules={{
								required: "Email is required",
								pattern: {
									value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
									message: "Invalid email address",
								},
							}}
							render={({ field }) => (
								<TextField
									{...field}
									label='Email *'
									fullWidth
									variant='outlined'
									error={!!errors.email}
									helperText={errors.email?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<Controller
							name='corporateStatus'
							control={control}
							rules={{ required: "Status is required" }}
							render={({ field }) => (
								<FormControl fullWidth error={!!errors.corporateStatus}>
									<InputLabel>Status *</InputLabel>
									<Select
										{...field}
										label='Status *'
										value={field.value || ""} // ensure controlled input
									>
										<MenuItem value=''>Select Status</MenuItem>
										<MenuItem value='Active'>Active</MenuItem>
										<MenuItem value='Inactive'>Inactive</MenuItem>
									</Select>
									<FormHelperText>
										{errors.corporateStatus?.message}
									</FormHelperText>
								</FormControl>
							)}
						/>
					</Grid>

					{/* Row 2: City, State, PIN, Country */}
					<Grid item xs={12} sm={3}>
						<Controller
							name='city'
							control={control}
							rules={{ required: "City is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='City *'
									fullWidth
									variant='outlined'
									error={!!errors.city}
									helperText={errors.city?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<Controller
							name='state'
							control={control}
							rules={{ required: "State is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='State *'
									fullWidth
									variant='outlined'
									error={!!errors.state}
									helperText={errors.state?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<Controller
							name='pin'
							control={control}
							rules={{ required: "PIN is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='PIN *'
									fullWidth
									variant='outlined'
									error={!!errors.pin}
									helperText={errors.pin?.message}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<Controller
							name='country'
							control={control}
							rules={{ required: "Country is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='Country *'
									fullWidth
									variant='outlined'
									error={!!errors.country}
									helperText={errors.country?.message}
								/>
							)}
						/>
					</Grid>

					{/* Row 3: Address (Full width) */}
					<Grid item xs={12}>
						<Controller
							name='address'
							control={control}
							rules={{ required: "Address is required" }}
							render={({ field }) => (
								<TextField
									{...field}
									label='Address *'
									fullWidth
									variant='outlined'
									error={!!errors.address}
									helperText={errors.address?.message}
								/>
							)}
						/>
					</Grid>
				</Grid>
			</>
		);
	}
);

export default MaintainForm;
