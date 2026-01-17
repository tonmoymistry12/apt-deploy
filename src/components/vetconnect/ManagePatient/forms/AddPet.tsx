import React, { useImperativeHandle, useState, forwardRef } from "react";
import {
	Grid,
	TextField,
	MenuItem,
	Box,
	Select,
	InputLabel,
	FormControl,
	FormControlLabel,
	Switch,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface PetFormData {
	petName: string;
	dob: Dayjs | null;
	petCategory: string;
	petType: string;
	gender: string;
	petsDiet: string;
	livingEnvironment: string;
	trainingSchool: string;
	petDetails: string;
	trainer: string;
	trainingDetails: string;
	trainingDone: boolean;
}

export interface AddPetRef {
	submit: () => PetFormData | null; // null if invalid, or data
}

const AddPet = forwardRef<AddPetRef, {}>((_props, ref) => {
	const [checked, setChecked] = useState(true);
	const [formData, setFormData] = useState<PetFormData>({
		petName: "",
		dob: dayjs("2022-04-17"),
		petCategory: "",
		gender: "",
		petType: "",
		petsDiet: "",
		livingEnvironment: "",
		trainingSchool: "",
		petDetails: "",
		trainer: "",
		trainingDetails: "",
		trainingDone: true,
	});

	useImperativeHandle(ref, () => ({
		submit: () => {
			// Optional: Add basic validation here

			return formData;
		},
	}));

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSelectChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleDateChange = (date: Dayjs | null) => {
		setFormData({ ...formData, dob: date });
	};

	const handleIsTrained = (_event: React.SyntheticEvent, value: boolean) => {
		setChecked(value);
		setFormData({ ...formData, trainingDone: value });
	};

	return (
		<Box sx={{ p: 3 }}>
			<Grid container spacing={2}>
				{/* Render form as before, with name attributes and values */}
				<Grid item xs={12} sm={6}>
					<TextField
						label='Pet Name'
						fullWidth
						name='petName'
						value={formData.petName}
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							disableFuture
							label='DOB'
							value={formData.dob}
							onChange={handleDateChange}
							slotProps={{ textField: { fullWidth: true } }}
						/>
					</LocalizationProvider>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						name='petType'
						value={formData.petType}
						onChange={handleChange}
						label='Type Of Animal'
						fullWidth
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<FormControl fullWidth>
						<InputLabel>Gender</InputLabel>
						<Select
							label='Gender'
							name='gender'
							value={formData.gender}
							onChange={handleSelectChange}>
							<MenuItem value='male'>Male</MenuItem>
							<MenuItem value='female'>Female</MenuItem>
						</Select>
					</FormControl>
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField
						label='Living Enviorment'
						name='livingEnvironment'
						value={formData.livingEnvironment}
						onChange={handleChange}
						fullWidth
					/>
				</Grid>

				<Grid item xs={12} sm={6}>
					<TextField
						label='Diet'
						name='petsDiet'
						value={formData.petsDiet}
						onChange={handleChange}
						fullWidth
					/>
				</Grid>

				<Grid item xs={12} sm={12}>
					<TextField
						rows={4}
						multiline
						label='About'
						name='petDetails'
						value={formData.petDetails}
						onChange={handleChange}
						fullWidth
					/>
				</Grid>
				{/* ... Rest of the form remains unchanged */}
				<Grid item xs={12}>
					<FormControlLabel
						control={
							<Switch
								color='primary'
								checked={checked}
								onChange={handleIsTrained}
							/>
						}
						label='Training Done'
						labelPlacement='start'
					/>
				</Grid>
				{checked && (
					<>
						<Grid item xs={12} sm={6}>
							<TextField
								label='Training School'
								fullWidth
								name='trainingSchool'
								value={formData.trainingSchool}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label='Trainer Name'
								fullWidth
								name='trainer'
								value={formData.trainer}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label='Training Details'
								multiline
								rows={4}
								fullWidth
								name='trainingDetails'
								value={formData.trainingDetails}
								onChange={handleChange}
							/>
						</Grid>
					</>
				)}
			</Grid>
		</Box>
	);
});

export default AddPet;
