import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '&.MuiInputLabel-shrink': {
            backgroundColor: '#ffffff',
            padding: '0 4px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused, &.MuiFormLabel-filled': {
            backgroundColor: '#ffffff',
            padding: '0 4px',
          },
          transformOrigin: 'left !important',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75) !important',
            backgroundColor: '#ffffff',
            padding: '0 4px',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
        },
        notchedOutline: {
          '& legend': {
            '& span': {
              padding: 0,
            },
          },
        },
      },
    },
  },
});

export default theme;