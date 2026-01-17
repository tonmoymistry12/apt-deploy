import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {
    palette: PaletteOptions;
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1a365d',
      dark: '#142c4c',
      light: '#234167',
      contrastText: '#fff'
    },
    secondary: {
      main: '#2c5282',
      dark: '#234167',
      light: 'rgba(44, 82, 130, 0.04)',
      contrastText: '#fff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme; 