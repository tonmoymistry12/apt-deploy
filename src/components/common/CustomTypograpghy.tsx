import {
    Typography
  } from '@mui/material';

interface CustomTypography {
  text:String,
  varient:any, 
}

const CustomTypography = ({ text,varient }: CustomTypography) => {
  return (
    <Typography
        variant={varient}
        sx={{
            fontWeight: 700,
            color: '#1a365d',
            mb: 1,
            fontSize: { lg: '1.75rem', xl: '2rem' }
        }}
    >
        {text}
    </Typography>
  );
};

export default CustomTypography; 