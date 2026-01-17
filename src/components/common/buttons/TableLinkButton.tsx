import {
    Button
  } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import styles from './styles.module.scss';

interface TableLinkButtonProps {
  text:String;
  icon:any;
  color?: any;
  onClick?:any;
  customColor?: string;
}

const TableLinkButton = ({ text,icon,color="secondary",onClick,customColor }: TableLinkButtonProps) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      className={styles.buttonMargin}
      color={color}
      size="small"
      startIcon={icon}
      sx={customColor ? {
        borderColor: customColor,
        color: customColor,
        borderRadius: 2,
        px: 2,
        py: 0.5,
        fontSize: '0.75rem',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(23, 74, 124, 0.1)',
        '&:hover': {
          borderColor: customColor,
          backgroundColor: customColor,
          color: 'white',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(23, 74, 124, 0.2)',
        }
      } : {
        borderRadius: 2,
        px: 2,
        py: 0.5,
        fontSize: '0.75rem',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      {text}
    </Button>
  );
};

export default TableLinkButton; 