
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  Box,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  FormHelperText
} from '@mui/material';

import styles from './styles.module.scss';
import { forgotPasswordService } from '@/services/forgotPasswordSerive';
import Message from '@/components/common/Message';
import CustomTypography from '@/components/common/CustomTypograpghy';
import CustomPrimaryButton from '@/components/common/buttons/CustomPrimaryButton';
import LinkButton from '@/components/common/buttons/LinkButton';
import UserIconTextBox from '@/components/common/textbox/UserIconTextBox';

interface ForgotPasswordInputs {
    username: string;
  }

function ForgotPasswordForm() {

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
      } = useForm<ForgotPasswordInputs>({
        defaultValues: {
          username: ''
        }
      });
    
      const username = watch('username');
    
      // Register validation rules
      React.useEffect(() => {
        register('username', {
          required: 'Username is required',
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters'
          }
        });
      }, [register]);
    
      const [openSnackbar, setOpenSnackbar] = useState(false);
      const [snackbarMessage, setSnackbarMessage] = useState('');
      const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
      const router = useRouter();
      const theme = useTheme();
      const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    
      const onSubmit = async (data: ForgotPasswordInputs) => {
        try {
          const response = await forgotPasswordService({ userName: data.username });
          setSnackbarMessage(response.message);
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          
        } catch (error: any) {
          setSnackbarMessage(error?.response?.data?.message || 'Invalid credentials. Please try again.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      };
    
      const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
      };

    return (
    <>
        <Box
        sx={{
          width: { xs: '100%', lg: '45%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
          bgcolor: 'white',
          boxShadow: !isMobile ? '-20px 0 40px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        <Container maxWidth="sm" className={styles.formContainer}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <CustomTypography varient="h4" text="Forgot Password" />            
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={styles.formFieldWrapper}>
                  <UserIconTextBox 
                    label="Username" 
                    value={username}
                    onChange={(e) => {
                      setValue('username', e.target.value, {
                        shouldValidate: true
                      });
                    }}
                    placeholder="Enter your username"
                  />
                  {errors.username && (
                    <FormHelperText error className={styles.helperText}>
                      {errors.username.message}
                    </FormHelperText>
                  )}
                </div>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                }}>
                  <LinkButton onClick={() => router.push('/signin')} size="small" text="Back To Sign In"/>
                </Box>
              </Grid>
              <Grid item xs={12}>
               <CustomPrimaryButton text="Submit" size="large" type="submit"/>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
      <Message 
      openSnackbar={openSnackbar} 
      handleCloseSnackbar={handleCloseSnackbar} 
      snackbarSeverity={snackbarSeverity} 
      snackbarMessage={snackbarMessage} 
    />
    </>
    )
}

export default ForgotPasswordForm;