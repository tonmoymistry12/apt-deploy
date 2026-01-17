import { Box } from "@mui/material";

const LeftImageSection = () => {
	return (
		<Box
			sx={{
				display: { xs: "none", lg: "flex" },
				width: "55%",
				position: "relative",
				flexDirection: "column",
				bgcolor: "#ffffff",
				"&::after": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background:
						"linear-gradient(135deg, rgba(26, 54, 93, 0.4), rgba(26, 54, 93, 0.3))",
					zIndex: 1,
				},
			}}>
			{/* Background Image Section - 65% */}
			<Box
				sx={{
					height: "100%",
					position: "relative",
					background: `url(/images/dashboard.jpeg)`,
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
					backgroundSize: "contain",
					zIndex: 0,
					mx: "auto",
					width: "110%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			/>
		</Box>
	);
};

export default LeftImageSection;
