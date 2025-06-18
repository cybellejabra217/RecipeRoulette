// import all needed libraries and components
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/FirstPages/Login";
import Signup from "./components/FirstPages/Signup";
import Homepage from "./components/Homepage/Homepage";
import SearchRecipes from "./components/Recipes/SearchRecipes";
import RecipeDetails from "./components/Recipes/recipeDetails";
import ProfilePage from "./components/Profile/ProfilePage";
import ProfileUser from "./components/Profile/ProfileUser";
import {
    AppBar,
    Toolbar,
    Button
  } from "@mui/material";
  
// protects the routes
const ProtectedRoute = ({ isLoggedIn, children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false); // state for login status
    const navigate = useNavigate(); // to be able to navigate
    useEffect(() => {
        const token = localStorage.getItem("token"); // checks if token is present in local storage
        setIsLoggedIn(!!token); // sets login state based on token

        // if logged in, redirected to homepage directly
        if(isLoggedIn) {
            navigate('/homepage')
            console.log(123);
        }

    }, []);

    // handles logout
    const handleLogout = () => {

        // removes the token
        localStorage.removeItem("token");

        // sets isLoggedIn to false
        setIsLoggedIn(false);

        // navigated to login page
        navigate("/login");
    };

    return (
        <div className="App">
            <div>
                {/* header with navigation and lgout */}
                <AppBar position="static" color="primary">
                    { isLoggedIn && <Toolbar>
                    
                        <Button color="inherit" onClick={() => navigate("/homepage")}>
                            Home
                        </Button>
                    
                        <Button color="inherit" onClick={() => navigate("/profile")}>
                            My Profile
                        </Button>
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            sx={{ marginLeft: "auto" }}
                        >
                            Logout
                        </Button>
                    </Toolbar>}
                </AppBar>

                <Routes>
                    {/* public routes (token shouldnt be present)*/}
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* protected routes (token must be present) */}
                    <Route
                        path="/homepage"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Homepage handleLogout={handleLogout} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/searchRecipes"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <SearchRecipes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recipeDetails/:recipeId"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <RecipeDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile/:id"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <ProfileUser />
                            </ProtectedRoute>
                        }
                    />

                    {/* default route */}
                    <Route path="/" element={isLoggedIn ? <Navigate to="/homepage" /> : <Navigate to="/login" />} />

                    {/* fallback route */}
                    <Route path="*" element={<h2>404 - Page Not Found</h2>} />
                </Routes>
                <ToastContainer />
            </div>
        </div>
    );
}

export default App;
