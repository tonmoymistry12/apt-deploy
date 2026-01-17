"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
	Box,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Collapse,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from "@mui/material";
import {
	ExpandLess,
	ExpandMore,
	Dashboard as DashboardIcon,
	Assignment as AssignmentIcon,
	Settings as SettingsIcon,
	Payment as PaymentIcon,
	EventNote as EventNoteIcon,
	LocalHospital as LocalHospitalIcon,
	Assessment as AssessmentIcon,
	Business as BusinessIcon,
	AccountBalance as AccountBalanceIcon,
	Discount as DiscountIcon,
	AttachMoney as AttachMoneyIcon,
	Receipt as ReceiptIcon,
	CalendarMonth as CalendarMonthIcon,
	People as PeopleIcon,
	Event as EventIcon,
	Home as HomeIcon,
	Description as DescriptionIcon,
	BarChart as BarChartIcon,
	Analytics as AnalyticsIcon,
	Person as PersonIcon,
	Group as GroupIcon,
	MedicalServices as MedicalServicesIcon,
	BusinessCenter as BusinessCenterIcon,
	HealthAndSafety as HealthAndSafetyIcon,
	LocalPharmacy as LocalPharmacyIcon,
	Store as StoreIcon,
	AccountCircle as AccountCircleIcon,
	ExitToApp as LogoutIcon,
	MeetingRoomSharp,
	OpenInBrowserRounded,
} from "@mui/icons-material";
import styles from "./style.module.scss"; // Import the styles

interface SubMenuItem {
	text: string;
	icon: React.ReactElement;
	url: string;
}

interface MenuItem {
	text: string;
	icon: React.ReactElement;
	url: string;
	subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
	{ text: "Dashboard", icon: <DashboardIcon />, url: "/dashboard" },
	{
		text: "Owner Dashboard",
		icon: <OpenInBrowserRounded />,
		url: "/owner_dashboard",
	},
	{
		text: "Appointment Dashboard",
		icon: <MeetingRoomSharp />,
		url: "/appointment_dashboard",
	},
	{
		text: "Clinic Administration",
		icon: <AssignmentIcon />,
		url: "/clinic-admin",
		subItems: [
			{
				text: "Manage Facilities",
				icon: <BusinessIcon />,
				url: "/clinic-admin/facilities",
			},
			{
				text: "Create Roles & assign facilities",
				icon: <GroupIcon />,
				url: "/clinic-admin/create-roles",
			},
			{
				text: "Manage User accounts & permission",
				icon: <PersonIcon />,
				url: "/clinic-admin/manage-user",
			},
			/* { text: 'Maintain Doctors', icon: <MedicalServicesIcon />, url: '/policy_config/maintain-doctors' },
            { text: 'Other Users', icon: <PeopleIcon />, url: '/clinic-admin/maintain-other-users' }, */
			{
				text: "Upgrade/Renew Subscriptions",
				icon: <StoreIcon />,
				url: "/clinic-admin/renew-subscription",
			},
		],
	},
	{
		text: "Policy Configuration",
		icon: <SettingsIcon />,
		url: "/policy-config",
		subItems: [
			{
				text: "Maintain Corporates",
				icon: <BusinessCenterIcon />,
				url: "/policy_config/maintain-corporates",
			},
			{
				text: "Maintain Insurers",
				icon: <HealthAndSafetyIcon />,
				url: "/policy_config/insurers",
			},
			{
				text: "Configure Discounts",
				icon: <DiscountIcon />,
				url: "/policy_config/discounts",
			},
			{
				text: "Configure Fees & Charges",
				icon: <AttachMoneyIcon />,
				url: "/policy_config/configure-fees-and-charges",
			},
			{
				text: "Configure Charge Events & Collection",
				icon: <AccountBalanceIcon />,
				url: "/policy_config/configure-charge",
			},
		],
	},
	{
		text: "Billing Desk",
		icon: <PaymentIcon />,
		url: "/billing",
		subItems: [
			{
				text: "Generate Invoice",
				icon: <ReceiptIcon />,
				url: "/billing/invoice",
			},
			{
				text: "Payment Collection",
				icon: <AttachMoneyIcon />,
				url: "/billing/collection",
			},
			{
				text: "Invoice History",
				icon: <DescriptionIcon />,
				url: "/billing/history",
			},
		],
	},
	{
		text: "Front Desk",
		icon: <EventNoteIcon />,
		url: "/front-desk",
		subItems: [
			{
				text: "Manage calendar Of Doctors",
				icon: <CalendarMonthIcon />,
				url: "/front-desk/calendar",
			},
			{
				text: "Manage Patients",
				icon: <PeopleIcon />,
				url: "/front-desk/manage-patients",
			},
			{
				text: "Manage Appointments",
				icon: <EventIcon />,
				url: "/front-desk/appointments",
			},
		],
	},
	{
		text: "VetConnect",
		icon: <LocalHospitalIcon />,
		url: "/vetconnect",
		subItems: [
			{
				text: "Maintain Facilities",
				icon: <BusinessIcon />,
				url: "/vetconnect/facility",
			},
			{
				text: "Manage Calendar",
				icon: <CalendarMonthIcon />,
				url: "/vetconnect/calendar",
			},
			{
				text: "Manage Patients",
				icon: <PeopleIcon />,
				url: "/vetconnect/manage-patients",
			},
			{
				text: "Manage Appointments",
				icon: <EventIcon />,
				url: "/vetconnect/appointments",
			},
			{
				text: "Consult",
				icon: <MedicalServicesIcon />,
				url: "/vetconnect/consultation",
			},
			{
				text: "Manage Home Visit",
				icon: <HomeIcon />,
				url: "/vetconnect/home-visit",
			},
			{
				text: "Manage Patients Records",
				icon: <DescriptionIcon />,
				url: "/vetconnect/records",
			},
			{
				text: "Generate Reports",
				icon: <AssessmentIcon />,
				url: "/vetconnect/reports",
			},
			{
				text: "Manage Profile",
				icon: <AccountCircleIcon />,
				url: "/vetconnect/manage-profile",
			},
		],
	},
	{
		text: "Reporting & Analytics",
		icon: <AnalyticsIcon />,
		url: "/reports",
		subItems: [
			{
				text: "Revenue Analysis",
				icon: <BarChartIcon />,
				url: "/reports/revenue",
			},
			{
				text: "Visit Reports",
				icon: <AssessmentIcon />,
				url: "/reports/visits",
			},
			{ text: "Others", icon: <DescriptionIcon />, url: "/reports/others" },
		],
	},
];

const SideMenu: React.FC = () => {
	const [expanded, setExpanded] = useState(false);
	const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
	const [selectedItem, setSelectedItem] = useState<string>("");
	const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const userData: any = localStorage.getItem("userData");
	const userObj = JSON.parse(userData);
	console.log(userObj);
	const privilageList = userObj?.privilegeList;

	console.log(privilageList);
	const getAllowedMenus = (privilegeList: any[]) => {
		const filtered = privilegeList.filter(
			(menu) => menu.menuName !== "Un-Mapped"
		);

		const allowed: Record<string, Set<string>> = {};

		filtered.forEach((menu) => {
			allowed[menu.menuName] = new Set(
				(menu.privilegeList || []).map((sub: any) => sub.menuName)
			);
		});

		return allowed;
	};

	const [allowedMenus, setAllowedMenus] = useState<Record<string, Set<string>>>(
		{}
	);

	useEffect(() => {
		const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
		if (userData.privilegeList) {
			setAllowedMenus(getAllowedMenus(userData.privilegeList));
		}
	}, []);

	useEffect(() => {
		if (!pathname) return;

		for (const item of menuItems) {
			if (item.subItems) {
				const activeSubItem = item.subItems.find((subItem) =>
					pathname.startsWith(subItem.url)
				);
				if (activeSubItem) {
					setSelectedItem(activeSubItem.text);
					setExpandedMenu(item.text);
					return;
				}
			}
			if (pathname.startsWith(item.url)) {
				setSelectedItem(item.text);
				return;
			}
		}
	}, [pathname]);

	const handleMouseEnter = () => {
		setExpanded(true);
	};

	const handleMouseLeave = () => {
		setExpanded(false);
		// Don't reset expandedMenu here to keep submenu open when active
	};

	const handleMenuClick = (item: MenuItem) => {
		setSelectedItem(item.text);
		if (item.subItems) {
			setExpandedMenu(expandedMenu === item.text ? null : item.text);
		} else {
			router.push(item.url);
		}
	};

	const handleSubItemClick = (subItem: SubMenuItem) => {
		setSelectedItem(subItem.text);
		router.push(subItem.url);
	};

	const handleLogoutClick = () => {
		setOpenLogoutDialog(true);
	};

	const handleLogoutConfirm = () => {
		sessionStorage.removeItem("userData");
		sessionStorage.removeItem("isAuthenticated");
		router.push("/signin");
	};

	const handleLogoutCancel = () => {
		setOpenLogoutDialog(false);
	};

	//Need to remove when backend solve
	const normalizedAllowedMenus: Record<string, any> = {};
	Object.entries(allowedMenus).forEach(([key, value]) => {
		normalizedAllowedMenus[key] = value;
	});

	console.log({ menuItems });

	console.log({ allowedMenus });
	return (
		<>
			<Box
				className={styles.scrollContainer}
				sx={{
					position: "fixed",
					left: 0,
					top: 65,
					bottom: 0,
					width: expanded ? 280 : 56,
					transition: "all 0.3s ease",
					overflowX: "hidden",
					overflowY: "auto",
					zIndex: 1200,
					display: "flex",
					flexDirection: "column",
				}}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}>
				<List sx={{ p: 0, flex: 1 }}>
					{menuItems.map(
						(item) =>
							//need to enable to show role based authentication
							(item.subItems
								? normalizedAllowedMenus[item.text] &&
								  normalizedAllowedMenus[item.text].size > 0
								: normalizedAllowedMenus[item.text]) && ( // 👈 check inline
								<React.Fragment key={item.text}>
									<ListItem
										button
										className={`${styles.menuItem} ${
											selectedItem === item.text ? styles.active : ""
										} ${!expanded ? styles.collapsed : ""}`}
										onClick={() => handleMenuClick(item)}
										sx={{
											position: "relative",
										}}>
										{selectedItem === item.text && (
											<Box className={styles.activeIndicator} />
										)}
										<Tooltip
											title={!expanded ? item.text : ""}
											placement='right'>
											<ListItemIcon
												className={styles.menuIcon}
												sx={{ color: "#1a365d !important" }}>
												{item.icon}
											</ListItemIcon>
										</Tooltip>
										{expanded && (
											<>
												<ListItemText
													primary={item.text}
													className={styles.menuText}
												/>
												{item.subItems && (
													<Box
														className={styles.expandIcon}
														sx={{ color: "#1a365d !important" }}>
														{expandedMenu === item.text ? (
															<ExpandLess />
														) : (
															<ExpandMore />
														)}
													</Box>
												)}
											</>
										)}
									</ListItem>
									{item.subItems && (
										<Collapse
											in={expandedMenu === item.text && expanded}
											timeout='auto'
											unmountOnExit>
											<List component='div' className={styles.nestedMenu}>
												{item.subItems.map((subItem) => (
													<ListItem
														button
														key={subItem.text}
														onClick={() => handleSubItemClick(subItem)}
														className={`${styles.menuItem} ${
															selectedItem === subItem.text ? styles.active : ""
														}`}
														sx={{
															position: "relative",
														}}>
														{selectedItem === subItem.text && (
															<Box className={styles.activeIndicator} />
														)}
														<ListItemIcon
															className={styles.menuIcon}
															sx={{ color: "#1a365d !important" }}>
															{subItem.icon}
														</ListItemIcon>
														<ListItemText
															primary={subItem.text}
															className={styles.menuText}
														/>
													</ListItem>
												))}
											</List>
										</Collapse>
									)}
								</React.Fragment>
								// )
							)
					)}
				</List>

				{/* Bottom section with separator and logout */}
			</Box>

			{/* Logout Confirmation Dialog */}
			<Dialog
				open={openLogoutDialog}
				onClose={handleLogoutCancel}
				aria-labelledby='logout-dialog-title'
				aria-describedby='logout-dialog-description'>
				<DialogTitle id='logout-dialog-title'>Confirm Logout</DialogTitle>
				<DialogContent id='logout-dialog-description'>
					Are you sure you want to logout?
				</DialogContent>
				<DialogActions>
					<Button onClick={handleLogoutCancel} color='primary'>
						No
					</Button>
					<Button onClick={handleLogoutConfirm} color='error' autoFocus>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default SideMenu;
