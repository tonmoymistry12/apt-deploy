import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Snackbar,
  Alert,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import styles from "./styles.module.scss";
import axiosInstance from "@/common/http";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async () => {
    let isValid = true;
    const newErrors = { email: "", password: "", confirmPassword: "" };

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters, include one uppercase letter, one number, and one special character.";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (!isTermsChecked) {
      setSnackbar({
        open: true,
        message: "Please accept the terms and conditions.",
        severity: "warning",
      });
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      try {
        const response = await axiosInstance.post("traveler/signup", {
          email,
          password,
          t_c: isTermsChecked,
        });
        setSnackbar({
          open: true,
          message: "Signup successful!",
          severity: "success",
        });
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: "Signup failed. Please try again.",
          severity: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Grid container spacing={2} className={styles.signupContainer}>
      <Grid item xs={12} md={5} className={styles.leftSide}>
        <Box className={styles.imageBox}>
          <Image
            src="/images/signup/signup.jpg"
            alt="Signup visuals"
            className={styles.signupImage}
            layout="responsive"
            width={100}
            height={100}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={7} className={styles.rightSide}>
        <Box className={styles.signupForm}>
          <Typography variant="h4" className={styles.signupTitle}>
            Explore the World with Ease – Sign Up Now!
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isTermsChecked}
                onChange={(e) => setIsTermsChecked(e.target.checked)}
              />
            }
            label="I agree to the Terms and Conditions"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isTermsChecked}
            onClick={handleSignup}
          >
            Sign Up
          </Button>
          <Typography variant="body2" className={styles.signupFooter}>
            Already have an account? <a href="/signin">Sign In</a>
          </Typography>
          <Typography variant="body2" className={styles.forgotPassword}>
            <a href="/forgot-password">Forgot Password?</a>
          </Typography>
        </Box>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
