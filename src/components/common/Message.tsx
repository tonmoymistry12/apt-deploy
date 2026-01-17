import {
    Snackbar,
    Alert
  } from '@mui/material';

interface CustomMessage {
  handleCloseSnackbar: () => void;
  disabledDate?: (current: any) => boolean;
  openSnackbar: boolean;
  snackbarSeverity: any;
  snackbarMessage: string
}

const Message = ({ openSnackbar = false, snackbarSeverity, snackbarMessage, handleCloseSnackbar }: CustomMessage) => {
  return (
    <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
  );
};

export default Message; 