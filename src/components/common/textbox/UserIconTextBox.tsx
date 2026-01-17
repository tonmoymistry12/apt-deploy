import {
    TextField,
    InputAdornment
  } from '@mui/material';

  import { Person } from '@mui/icons-material';

import styles from './styles.module.scss';

interface UserIconTextBox {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  label: string;
  placeholder: string;
}

const UserIconTextBox = ({ label, value, onChange, placeholder }: UserIconTextBox) => {
  return (
    <TextField
        fullWidth
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="outlined"
        className={styles.formField}
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <Person sx={{ color: '#1a365d' }} />
                </InputAdornment>
            ),
        }}
    />
  );
};

export default UserIconTextBox; 