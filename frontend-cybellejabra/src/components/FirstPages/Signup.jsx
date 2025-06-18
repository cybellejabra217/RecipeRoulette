import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Link,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoginService from "../../services/LoginService";
import './FirstPages.css'; 

const Signup = () => {

  // sets all the states (username, password, confirm password, email and loading)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // to be able to navigate

  /**
   * Validates the input fields for username, password, confirm password, and email.
   * Ensures all fields are filled, email is valid, password is strong, and passwords match.
   * 
   * @function validateInputs
   * @returns {boolean} - Returns `true` if all inputs are valid, `false` otherwise.
   */
  const validateInputs = () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim() || !email.trim()) {
      toast.error("Please fill all fields");
      return false;
    }

    // checks if email is valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // password must be at least 6 characters long
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    // checks if password and confirm password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  /**
   * Handles the signup process by validating the inputs, sending the signup data to the backend, 
   * and handling responses for success or error conditions.
   * 
   * @async
   * @function handleSignup
   * @returns {Promise<void>} - No return value. It updates UI states based on signup result.
   */
  const handleSignup = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {

      // sends the data to register the user
      const userData = { username, password, email, confirmPassword };
      const result = await LoginService.register(userData);

      // checks for success or errors (if success, redirected to login)
      if (result?.status === 201) {
        toast.success("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);

      } else if (result?.status === 409) {
        toast.error("User already exists. Please try a different username or email.");

      } else {
        toast.error(result?.message || "Signup failed. Please try again.");
      }

      // catches any errors
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background"> 
      <Box className="login-container">
        <Typography variant="h4" textAlign="center" gutterBottom>
          Sign Up
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <Box textAlign="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignup}
              disabled={loading}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>
          </Box>
        </Box>
        <Grid container justifyContent="center" mt={2}>
          <Typography variant="body2"> 
            Already have an account?{" "} 
            <Link href="/login" onClick={(e) => { 
               e.preventDefault();
               navigate("/login"); // redirects user to login if press on "Already have an account?"
               }}
               > 
              Login here
            </Link>
          </Typography> 
        </Grid>
      </Box>
    </div>
  );
};

export default Signup;
