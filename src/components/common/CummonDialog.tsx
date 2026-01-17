// In @/components/common/CommonDialog.tsx (rename from CummonDialog.tsx)
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from "@mui/material";
import styles from "./styles.module.scss";

interface CommonDialogProps {
	open: boolean;
	title: string;
	onClose: () => void;
	onSubmit?: (data?: any) => void;
	children: React.ReactNode;
	maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
	submitLabel?: string;
	cancelLabel?: string;
	showActions?: boolean;
	isSubmitButton?: boolean;
	hideDefaultButtons?: boolean;
}

const CummonDialog: React.FC<CommonDialogProps> = ({
	open,
	title,
	onClose,
	children,
	maxWidth = "sm",
	submitLabel = "Submit",
	cancelLabel = "Cancel",
	showActions = true,
	hideDefaultButtons = false,
	onSubmit,
	isSubmitButton = true,
}) => {
	console.log("CommonDialog open:", open, "title:", title); // Debug log
	return (
		<Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
			<DialogTitle className={styles.commonDialogHeader}>{title}</DialogTitle>
			<DialogContent dividers>{children}</DialogContent>
			{showActions && !hideDefaultButtons && (
				<DialogActions>
					{isSubmitButton && (
						<Button
							onClick={onSubmit}
							type='submit'
							variant='contained'
							sx={{
								bgcolor: "#174a7c",
								color: "#fff",
								fontWeight: 700,
								"&:hover": { bgcolor: "#103a61" },
							}}>
							{submitLabel}
						</Button>
					)}
					<Button onClick={onClose} variant='outlined'>
						{cancelLabel}
					</Button>
				</DialogActions>
			)}
		</Dialog>
	);
};

export default CummonDialog;
