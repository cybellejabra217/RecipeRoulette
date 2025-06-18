import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoginService from "../../services/LoginService";
import { Box, TextField, Button, Typography, Link, CircularProgress } from "@mui/material";
import './FirstPages.css';

const Login = ({ setIsLoggedIn, isLoggedIn }) => {

  // sets all states (username, password and loading)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // to be able to navigate

  useEffect(() => {

    // if logged in, user is navigated to homepage
    if (isLoggedIn) {
      navigate("/homepage");
    }
  }, [isLoggedIn, navigate]);

  /**
   * Validates the input fields (username and password).
   * 
   * @function validateInputs
   * @returns {boolean} - Returns true if both fields are filled, false otherwise.
   */
  const validateInputs = () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill all fields");
      return false;
    }
    return true;
  };

  /**
   * Handles the login process. It validates the inputs, attempts to log in, 
   * and handles various error cases or success messages.
   * 
   * @async
   * @function handleLogin
   * @returns {Promise<void>} - No return value. It updates UI states based on login result.
   */
  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {

      // login with username and password
      const response = await LoginService.login({ username, password });

      // if successful login, set the token and redirect to homepage
      if (response?.status === 200 && response.data?.token) {
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
        navigate("/homepage"); // navigates to homepage
        toast.success("Login successful!");
      } else {
        toast.error("Username or password incorrect. Please try again.");
      }

    } 
    
    // handles error if invalid credentials
    catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        toast.error("Invalid credentials. Please try again."); // sends toast error


      } 
      
      else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } 
      
      else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } 
    
    finally {
      setLoading(false); // sets loading to false
    }
  };

  return (
    <div className="login-background">
      <Box
        className="login-container"
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          paddingTop: 4, 
        }}
      >
        {/* welcome message */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" gutterBottom>
            Welcome to Recipe Roulette!
          </Typography>
        </Box>

        {/* login form */}
        <Typography variant="h4" textAlign="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Box textAlign="center" mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
              disabled={loading}
              sx={{ py: 1 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </Box>
        </Box>
        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup"); // redirects user to signup if press on "Dont have an account?"
              }}
            >
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Login;
