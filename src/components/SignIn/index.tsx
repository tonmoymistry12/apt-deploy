"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Person, Lock, CloudUpload } from "@mui/icons-material";
import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Checkbox,
	FormControlLabel,
	Grid,
	InputAdornment,
	Divider,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { HexColorPicker } from "react-colorful";
import {
	login,
	getOrganizationList,
	getLocationsDropdown,
} from "@/services/loginService";
import Message from "@/components/common/Message";
import styles from "./styles.module.scss";
import debounce from "lodash/debounce";

interface SignInFormInputs {
	userName: string;
	userPwd: string;
	rememberMe: boolean;
	orgId: number;
	orgFacilityId: number;
	profileImage: File | null;
	themeColor: string;
}

const SignIn: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm<SignInFormInputs>({
		defaultValues: {
			userName: "",
			userPwd: "",
			rememberMe: false,
			orgId: 0,
			orgFacilityId: 0,
			profileImage: null,
			themeColor: "#1a365d",
		},
	});

	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
	const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
		"success"
	);
	const [organizations, setOrganizations] = useState<
		Array<{ id: number; name: string }>
	>([]);
	const [facilities, setFacilities] = useState<
		Array<{ id: number; name: string }>
	>([]);
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const router = useRouter();

	const username = watch("userName");
	const selectedOrgId = watch("orgId");
	const themeColor = watch("themeColor");

	const fetchFacilities = useCallback(
		async (userName: string, orgId: number) => {
			if (!userName || !orgId) {
				setFacilities([]);
				setValue("orgFacilityId", 0);
				return;
			}

			setIsLoadingFacilities(true);
			try {
				const facilities = await getLocationsDropdown(
					userName,
					orgId.toString()
				);
				const mappedFacilities = facilities.map((facility) => ({
					id: facility.facilityId,
					name: facility.facilityName,
				}));
				setFacilities(mappedFacilities);

				// Set the first facility as default if available
				if (mappedFacilities.length > 0) {
					setValue("orgFacilityId", mappedFacilities[0].id, {
						shouldValidate: true,
					});
				}
			} catch (error: any) {
				setSnackbarMessage(
					error?.response?.data?.message || "Failed to load facilities"
				);
				setSnackbarSeverity("error");
				setOpenSnackbar(true);
				setFacilities([]);
				setValue("orgFacilityId", 0);
			} finally {
				setIsLoadingFacilities(false);
			}
		},
		[setValue]
	);

	const fetchOrganizations = useCallback(
		async (userName: string) => {
			if (!userName || userName.length < 3) {
				setOrganizations([]);
				setValue("orgId", 0);
				return;
			}

			setIsLoadingOrgs(true);
			try {
				const orgs = await getOrganizationList(userName);
				const mappedOrgs = orgs.map((org) => ({
					id: org.orgId,
					name: org.orgName,
				}));
				setOrganizations(mappedOrgs);

				// Set the first organization as default if available
				if (mappedOrgs.length > 0) {
					const firstOrgId = mappedOrgs[0].id;
					setValue("orgId", firstOrgId, { shouldValidate: true });
					// Fetch facilities for the selected organization
					fetchFacilities(userName, firstOrgId);
				} else {
					setValue("orgId", 0);
					setFacilities([]);
					setValue("orgFacilityId", 0);
				}
			} catch (error: any) {
				setSnackbarMessage(
					error?.response?.data?.message || "Failed to load organizations"
				);
				setSnackbarSeverity("error");
				setOpenSnackbar(true);
				setOrganizations([]);
				setValue("orgId", 0);
				setFacilities([]);
				setValue("orgFacilityId", 0);
			} finally {
				setIsLoadingOrgs(false);
			}
		},
		[setValue, fetchFacilities]
	);

	const debouncedFetchOrgs = useCallback(
		debounce((userName: string) => {
			fetchOrganizations(userName);
		}, 500),
		[fetchOrganizations]
	);

	useEffect(() => {
		debouncedFetchOrgs(username);
		return () => {
			debouncedFetchOrgs.cancel();
		};
	}, [username, debouncedFetchOrgs]);

	const onSubmit = async (data: SignInFormInputs) => {
		setIsLoading(true);
		try {
			const response: any = await login({
				userName: data.userName,
				userPwd: data.userPwd,
				orgId: data.orgId,
				orgFacilityId: data.orgFacilityId,
			});

			if (response.messages === "authenticated") {
				// Store essential user data in session storage
				const userData = {
					firstName: response.firstName,
					lastName: response.lastName,
					email: response.email,
					userLoggedInAs: response.userLoggedInAs,
					orgId: response.orgId,
					orgUserId: response.orgUserId,
					loggedinFacilityId: response.loggedinFacilityId,
					isAuthenticated: true,
					facilities: response.facilities,
					privilegeList: response.privilegeList,
					privileges: {
						level1: response.lstPrivilegeLevel1,
						level2: response.lstPrivilegeLevel2,
						level3: response.lstPrivilegeLevel3,
						level4: response.lstPrivilegeLevel4,
					},
				};
				localStorage.setItem("userData", JSON.stringify(userData));
				sessionStorage.setItem("userData", JSON.stringify(userData));
				sessionStorage.setItem("isAuthenticated", "true");

				setSnackbarMessage("Login successful!");
				setSnackbarSeverity("success");
				setOpenSnackbar(true);

				// Redirect after a short delay
				setTimeout(() => {
					router.push("/dashboard");
				}, 1000);
			} else {
				throw new Error("Authentication failed");
			}
		} catch (error: any) {
			setSnackbarMessage(
				error?.response?.data?.message ||
					"Invalid credentials. Please try again."
			);
			setSnackbarSeverity("error");
			setOpenSnackbar(true);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setValue("profileImage", file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleColorChange = (color: string) => {
		setValue("themeColor", color);
	};

	return (
		<Container className={styles.formContainer}>
			<Box sx={{ textAlign: "center", mb: 3 }}>
				<Typography variant='h4' className={styles.formTitle}>
					Sign in to AptCarePet
				</Typography>
				<Typography variant='body2' className={styles.formSubtitle}>
					Please sign in to continue
				</Typography>
			</Box>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label='Username'
							{...register("userName", {
								required: "Username is required",
								minLength: {
									value: 3,
									message: "Username must be at least 3 characters",
								},
							})}
							error={!!errors.userName}
							helperText={errors.userName?.message || " "}
							placeholder='Enter your username'
							variant='outlined'
							className={styles.formField}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<Person sx={{ color: "#1a365d" }} />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							type='password'
							label='Password'
							{...register("userPwd", {
								required: "Password is required",
								minLength: {
									value: 6,
									message: "Password must be at least 6 characters",
								},
							})}
							error={!!errors.userPwd}
							helperText={errors.userPwd?.message || " "}
							placeholder='Enter your password'
							variant='outlined'
							className={styles.formField}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<Lock sx={{ color: "#1a365d" }} />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl
							fullWidth
							error={!!errors.orgId}
							sx={{
								"& .MuiFormHelperText-root": {
									marginTop: 0,
									minHeight: "20px",
								},
							}}>
							<InputLabel>Organization</InputLabel>
							<Select
								{...register("orgId", { required: "Organization is required" })}
								label='Organization'
								value={selectedOrgId}
								onChange={(e) =>
									setValue("orgId", Number(e.target.value), {
										shouldValidate: true,
									})
								}
								className={styles.formField}
								disabled={isLoadingOrgs || !username || username.length < 3}>
								{isLoadingOrgs ? (
									<MenuItem disabled>
										<CircularProgress size={20} />
									</MenuItem>
								) : organizations.length === 0 ? (
									<MenuItem disabled>
										{!username || username.length < 3
											? "Enter username to see organizations"
											: "No organizations found"}
									</MenuItem>
								) : (
									organizations.map((org) => (
										<MenuItem key={org.id} value={org.id}>
											{org.name}
										</MenuItem>
									))
								)}
							</Select>
							<FormHelperText>{errors.orgId?.message || " "}</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormControl
							fullWidth
							error={!!errors.orgFacilityId}
							sx={{
								"& .MuiFormHelperText-root": {
									marginTop: 0,
									minHeight: "20px",
								},
							}}>
							<InputLabel>Facility</InputLabel>
							<Select
								{...register("orgFacilityId", {
									required: "Facility is required",
								})}
								label='Facility'
								value={watch("orgFacilityId")}
								onChange={(e) =>
									setValue("orgFacilityId", Number(e.target.value), {
										shouldValidate: true,
									})
								}
								className={styles.formField}
								disabled={isLoadingFacilities || !selectedOrgId}>
								{isLoadingFacilities ? (
									<MenuItem disabled>
										<CircularProgress size={20} />
									</MenuItem>
								) : facilities.length === 0 ? (
									<MenuItem disabled>
										{!selectedOrgId
											? "Select an organization first"
											: "No facilities found"}
									</MenuItem>
								) : (
									facilities.map((facility) => (
										<MenuItem key={facility.id} value={facility.id}>
											{facility.name}
										</MenuItem>
									))
								)}
							</Select>
							<FormHelperText>
								{errors.orgFacilityId?.message || " "}
							</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<FormControlLabel
								control={
									<Checkbox
										{...register("rememberMe")}
										className={styles.checkbox}
									/>
								}
								label={
									<Typography variant='body2' className={styles.checkboxLabel}>
										Remember me
									</Typography>
								}
							/>
							<Button
								onClick={() => router.push("/forgot-password")}
								className={styles.textButton}
								size='small'>
								I Forgot My Password?
							</Button>
						</Box>
						<Box display='flex' justifyContent='flex-end' width='100%'>
							<Button
								onClick={() => router.push("/registration")}
								size='small'
								color='primary'>
								If you don't have an account, Sign Up!
							</Button>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							size='large'
							className={styles.submitButton}
							disabled={isLoading}
							sx={{
								height: "48px",
								position: "relative",
							}}>
							{isLoading ? (
								<CircularProgress
									size={24}
									sx={{
										color: "white",
										position: "absolute",
										top: "50%",
										left: "50%",
										marginTop: "-12px",
										marginLeft: "-12px",
									}}
								/>
							) : (
								"Sign In"
							)}
						</Button>
					</Grid>
				</Grid>
			</form>

			<Message
				openSnackbar={openSnackbar}
				handleCloseSnackbar={handleCloseSnackbar}
				snackbarSeverity={snackbarSeverity}
				snackbarMessage={snackbarMessage}
			/>
		</Container>
	);
};

export default SignIn;
