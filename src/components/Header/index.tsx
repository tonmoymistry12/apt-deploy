"use client";

import React, { useState, useEffect } from "react";
import {
	AppBar,
	Toolbar,
	IconButton,
	Badge,
	Avatar,
	Box,
	Menu,
	MenuItem,
	Typography,
	FormControl,
	InputLabel,
	Select,
	FormControlLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getOwnFacilites } from "@/services/faclilityService";

interface HeaderProps {
	notificationCount: number;
}

const Header: React.FC<HeaderProps> = ({ notificationCount }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [userData, setUserData] = useState<any>(null);
	const [facilities, setFacilities] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [selectedFacility, setSelectedFacility] = useState<any>(
		localStorage.getItem("loggedinFacilityId")
	);
	const router = useRouter();

	useEffect(() => {
		const storedUserData = sessionStorage.getItem("userData");
		if (storedUserData) {
			setUserData(JSON.parse(storedUserData));
		}

		const fetchFacilities = async () => {
			setLoading(true);
			try {
				const payload: any = {
					userName: localStorage.getItem("userName") || "",
					userPass: localStorage.getItem("userPwd") || "",
					deviceStat: "M",
					callingFrom: "app",
					orgId: localStorage.getItem("orgId") || "",
					loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
					searchFacility: "",
					status: "All",
				};
				const data = await getOwnFacilites(payload);
				setFacilities(data);
			} catch (error) {
				setFacilities([]);
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchFacilities();
	}, []);

	const handleFacilityChange = async (event: SelectChangeEvent<string>) => {
		const selectedId = event.target.value;
		console.log(selectedId);
		localStorage.setItem("loggedinFacilityId", selectedId);
		location.reload();
	};
	/* useEffect(() => {
      const fetchFacilities = async () => {
        try {
          const payload: any = {
            userName: localStorage.getItem("userName") || "",
            userPass: localStorage.getItem("userPwd") || "",
            deviceStat: "M",
            callingFrom: "app",
            orgId: localStorage.getItem("orgId") || "",
            loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
            searchFacility: "",
            status: "All",
          };
          const data = await getOwnFacilites(payload);
          const telemedicinePresent = data.filter(
            (x) => x.facilityType == "telemedicine"
          );
          const isTelemedicine = telemedicinePresent.length ? true : false;
          setIsTelemedecine(isTelemedicine);
          console.log(telemedicinePresent);
        } catch (error) {
          console.log(error);
        }
      };
      fetchFacilities();
    }, []); */

	const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		sessionStorage.removeItem("userData");
		sessionStorage.removeItem("isAuthenticated");
		router.push("/signin");
		handleClose();
	};

	return (
		<AppBar position='fixed' className={styles.appBar}>
			<Toolbar>
				<Box display='flex' alignItems='center'>
					<Image
						src='/images/logo/apple-icon-57x57.png'
						alt='Aptcare Logo'
						width={40}
						height={40}
						style={{ marginRight: "10px" }}
					/>
					<Typography
						variant='h6'
						component='div'
						sx={{
							fontWeight: 600,
							color: "black",
							display: "flex",
							alignItems: "center",
						}}>
						Aptcare Pet
					</Typography>
				</Box>

				<Box sx={{ flexGrow: 1 }} />

				<FormControl
					sx={{
						width: "300px",
						pr: "20px",
					}}
					variant='outlined'>
					<InputLabel id='facility-label'>Select Facility</InputLabel>
					<Select
						labelId='facility-label'
						id='facility-select'
						value={selectedFacility}
						onChange={handleFacilityChange}
						label='Select Facility'>
						{loading ? (
							<MenuItem disabled>Loading...</MenuItem>
						) : facilities.length === 0 ? (
							<MenuItem disabled>No facilities found</MenuItem>
						) : (
							facilities.map((facility) => (
								<MenuItem
									key={facility.facilityId} // or facility.id or similar, depending on your response
									value={facility.facilityId} // or facility.facilityName if you prefer
								>
									{facility.facilityName}
								</MenuItem>
							))
						)}
					</Select>
				</FormControl>

				{localStorage.getItem("clinicType") !== "SoloPractice" && (
					<Typography
						variant='subtitle2'
						component='div'
						sx={{
							fontWeight: 600,
							fontSize: "0.875rem", // crisp & compact
							lineHeight: 1.3,
							letterSpacing: "0.02em",
							color: "#111",
							display: "flex",
							alignItems: "center",
						}}>
						Organisation :{" "}
						<span style={{ color: "#007aff" }}>
							{localStorage.getItem("clinicName")}{" "}
						</span>
					</Typography>
				)}
				{localStorage.getItem("clinicType") == "SoloPractice" && (
					<Typography
						variant='subtitle2'
						component='div'
						sx={{
							fontWeight: 600,
							fontSize: "0.875rem", // crisp & compact
							lineHeight: 1.3,
							letterSpacing: "0.02em",
							color: "#111",
							display: "flex",
							alignItems: "center",
						}}>
						Doctor Name :{" "}
						<span style={{ color: "#007aff" }}>
							{localStorage.getItem("firstName")}{" "}
							{localStorage.getItem("lastName")}{" "}
						</span>
					</Typography>
				)}

				<IconButton color='inherit'>
					<Badge badgeContent={notificationCount} color='error'>
						<NotificationsIcon sx={{ color: "grey.500" }} />
					</Badge>
				</IconButton>

				<IconButton onClick={handleProfileClick}>
					<Avatar
						alt={userData?.firstName || "User"}
						src='/images/avatar.png'
					/>
				</IconButton>

				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handleClose}
					onClick={handleClose}>
					<MenuItem>
						<Typography>
							{userData?.firstName} {userData?.lastName}
						</Typography>
					</MenuItem>
					<MenuItem onClick={handleLogout}>Logout</MenuItem>
				</Menu>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
