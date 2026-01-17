import {
    Button
  } from '@mui/material';
import styles from './styles.module.scss';

interface CustomPrimaryButton {
  text: String,
  size?: any,
  type: any,
  startIcon?: React.ReactNode,
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  sx?: any
}

const CustomPrimaryButton = ({ text, size, type, startIcon, onClick, sx }: CustomPrimaryButton) => {
  return (
    <Button
        type={type}
        fullWidth
        variant="contained"
        size= {size}
        className={styles.submitButton}
        sx={{
            py: 1.2,
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: '10px',
            ...sx
        }}
        startIcon={startIcon}
        onClick={onClick}
    >
        {text}
    </Button>
  );
};

export default CustomPrimaryButton; 