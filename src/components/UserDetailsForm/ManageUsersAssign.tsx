import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  SelectChangeEvent,
} from '@mui/material';

const StyledButton = ({ sx, ...props }: any) => (
  <Button
    {...props}
    sx={{
      borderRadius: 2,
      px: { xs: 2, sm: 3 },
      py: 1,
      fontSize: { xs: '0.75rem', sm: '0.875rem' },
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
        transform: 'translateY(-2px)',
      },
      ...sx,
    }}
  />
);

interface ManageUsersAssignProps {
  user: {
    name: string;
    role: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ManageUsersAssign: React.FC<ManageUsersAssignProps> = ({ user, onSubmit, onCancel }) => {
  const [role, setRole] = useState(user.role || '');
  const [error, setError] = useState('');

  const handleRoleChange = (e: SelectChangeEvent) => {
    setRole(e.target.value);
    setError('');
  };

  const validateForm = () => {
    if (!role) {
      setError('Role is required');
      return false;
    }
    return true;
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 500,
        mx: 'auto',
        bgcolor: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        mt: 2,
        mb: 4,
      }}
    >
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!error}>
              <InputLabel sx={{ color: '#0288d1' }}>Role</InputLabel>
              <Select
                value={role}
                onChange={handleRoleChange}
                label="Role"
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0288d1',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#01579b',
                  },
                }}
              >
                <MenuItem value="Paramedic">Paramedic</MenuItem>
                <MenuItem value="Admin Staff">Admin Staff</MenuItem>
                <MenuItem value="Administrator">Administrator</MenuItem>
              </Select>
              {error && (
                <Typography variant="caption" color="error">
                  {error}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ManageUsersAssign;