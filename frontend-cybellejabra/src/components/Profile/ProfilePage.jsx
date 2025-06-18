import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Avatar,
  TextField,
  Button,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  InputLabel,

} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UserService from "../../services/UserService";
import RecipeService from "../../services/RecipeService";
import ReviewService from "../../services/ReviewService";
import { useNavigate } from "react-router-dom";
import CuisineService from "../../services/CuisineService";
import './profile.css';

const ProfilePage = () => {
  const navigate = useNavigate(); // to be able to navigate

  // sets the states (profileData, loading etc.)
  const [profileData, setProfileData] = useState();
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [bioEditing, setBioEditing] = useState(false);
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState("Mexican");
  const [selectedDietaryPreference, setSelectedDietaryPreference] = useState("None");

  // sets default for recipe data fields
  const [recipeData, setRecipeData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    difficultyLevel: "",
    averageRating: 0,
    cuisineName: "Mexican",
    calories: 0,
    dietaryPreferences: "None",
  });

  useEffect(() => {

    // fetches the profile details
    const fetchProfile = async () => {
      try {

        // gets user
        const response = await UserService.getUser(); 
        setProfileData(response.data);
        setBio(response.data.bio || ""); // Load bio if available
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // fetch cuisines 
    const fetchCuisines = async () => {
      try {

        // get all cuisines using service getCuisines 
        const response = await CuisineService.getCuisines(); 
        setCuisines(response.data);
        if(response?.data?.length > 0) {
          setSelectedCuisine(response.data[0].CuisineName)
        }
      } catch (error) {
        console.error("Error fetching cuisines:", error);
      }
    };
  
    fetchCuisines();

  }, []);

  /**
   * Handles recipe form submission.
   * It sends the recipe data to the backend to create a new recipe.
   * After successful creation, it fetches updated user profile data.
   *
   * @param {Object} e - The event object.
   */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await RecipeService.createRecipe(recipeData);
  
      // after successfully adding, fetch the profile data again (refresh)
      const profileResponse = await UserService.getUser();
      setProfileData(profileResponse.data); // Update profile data with latest recipes
  
      // reset form data after successful submission
      setRecipeData({
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        difficultyLevel: "",
        cuisineName: "Mexican",
        calories: 0,
        dietaryPreferences: "None",
      });
    } catch (error) {
      console.error("Error adding recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigates to the recipe details page when a recipe title is clicked.
   * @param {number} recipeId - The ID of the recipe to view details for.
   */
  const handleRecipeClick = (recipeId) => {
    navigate(`/recipeDetails/${recipeId}`);
  };
  
  /**
   * Handles deleting a review.
   * Sends a request to the ReviewService to delete the selected review.
   * @param {Object} review - The review object to delete.
   */
  const handleDeleteReview = async (review) => {
    try {
      console.log(review);

      // send request to deleteReview service to delete review
      await ReviewService.deleteReview(review.ReviewID, review.RecipeID); 

      // update profile data
      setProfileData((prevData) => ({
        ...prevData,
        reviews: prevData.reviews.filter((review) => review.ReviewID !== review.ReviewID),
      }));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  /**
   * Handles changes in the recipe form fields.
   * Updates the corresponding recipe data state.
   * @param {Object} e - The event object.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prevData) => ({ ...prevData, [name]: value }));
  };

  /**
   * Handles updating the user's bio.
   * Sends the updated bio to the backend and updates the profile view.
   */
  const handleBioUpdate = async () => {
    try {
      const response = await UserService.updateUserBio(bio);
      setProfileData((prev) => ({ ...prev, bio })); // update profile view
      setBioEditing(false); // exot editing mode
      console.log("Bio updated successfully:", response);
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  // to show if page loading
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  // if profile not found
  if (!profileData) {
    return <Typography>No profile data found</Typography>;
  }

  const { username, joinDate, reviews } = profileData;

  return (
    <Box className = "profile-container">
      {/* Profile Header */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <Avatar sx={{ width: 100, height: 100, marginRight: 2 }}>
          {username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h4">{username}</Typography>
          <Typography variant="subtitle1">Joined on: {joinDate}</Typography>
        </Box>
      </Box>

      {/* Bio Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6">Bio:</Typography>
        {bioEditing ? (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 1 }}>
            <TextField
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Enter your bio"
              fullWidth
            />
            <Button variant="contained" onClick={handleBioUpdate}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setBioEditing(false)}>
              Cancel
            </Button>
          </Box>
        ) : (
          <Box sx={{ marginTop: 1 }}>
            <Typography variant="body1">{bio || "No bio available"}</Typography>
            <Button
              variant="text"
              onClick={() => setBioEditing(true)}
              sx={{ marginTop: 1 }}
            >
              Edit Bio
            </Button>
          </Box>
        )}
      </Box>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="add-recipe-content"
          id="add-recipe-header"
        >
          <Typography>Add a New Recipe</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              value={recipeData.title}
              onChange={handleChange}
              fullWidth
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={recipeData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Ingredients (comma-separated)"
              name="ingredients"
              value={recipeData.ingredients}
              onChange={handleChange}
              fullWidth
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Instructions"
              name="instructions"
              value={recipeData.instructions}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Difficulty Level"
              name="difficultyLevel"
              value={recipeData.difficultyLevel}
              onChange={handleChange}
              select
              fullWidth
              required
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </TextField>
            
            <InputLabel id="cuisine-label">Cuisine</InputLabel>
            <Select
              labelId="cuisine-label"
              name="cuisineName" 
              value={selectedCuisine}
              onChange={(e) => {
                setSelectedCuisine(e.target.value)
                recipeData.cuisineName = e.target.value
              }}
              fullWidth
              required
              sx={{ marginBottom: 2 }}
              disabled={loading}
            >
              {cuisines.map((cuisine) => (
                <MenuItem key={cuisine.CuisineID} value={cuisine.CuisineName}>
                  {cuisine.CuisineName}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Calories"
              name="calories"
              type="number"
              value={recipeData.calories}
              onChange={(e) => {
                const value = Math.max(0, e.target.value);
                handleChange({ target: { name: 'calories', value } });
              }}              
              fullWidth required
              sx={{ marginBottom: 2 }}
            />
            
            <InputLabel id="dietary-label">Dietary Preference</InputLabel>
            <Select
              labelId="dietary-label"
              value={selectedDietaryPreference}
              onChange={(e) => {
                setSelectedDietaryPreference(e.target.value)
                recipeData.dietaryPreferences = e.target.value
              }}
              disabled={loading}
              fullWidth
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Vegan">Vegan</MenuItem>
              <MenuItem value="Vegetarian">Vegetarian</MenuItem>
              <MenuItem value="Pescetarian">Pescetarian</MenuItem>
              <MenuItem value="Gluten-Free">Gluten-Free</MenuItem>
              <MenuItem value="Lactose-Free">Lactose-Free</MenuItem>
            </Select>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                marginTop: 3
              }}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Recipe"}
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="recipe-list-content"
          id="recipe-list-header"
        >
          <Typography>My Recipes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {profileData.recipes?.length > 0 ? (
            <Grid container spacing={2}>
              {profileData.recipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.RecipeID}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={recipe.imageUrl}
                      alt={recipe.Title}
                    />
                    <CardContent>
                      <Button
                        className="title-button"
                            fullWidth
                            onClick={() => handleRecipeClick(recipe.RecipeID)}
                            sx={{ textAlign: "left", fontWeight: "bold" }}
                        >
                          {recipe.Title}
                      </Button>
                      <Typography variant="body2" color="textSecondary">
                        {recipe.Description}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ marginTop: 1 }}>
                        Calories: {recipe.Calories}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No recipes found</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Reviews Section */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        My Reviews
      </Typography>
      <Grid container spacing={2}>
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} key={review.ReviewID}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={review.imageUrl}
                alt={review.recipeTitle}
              />
              <CardContent>
                <Button
                  className="title-button"
                      fullWidth
                      onClick={() => handleRecipeClick(review.RecipeID)}
                      sx={{ textAlign: "left", fontWeight: "bold" }}
                  >
                    {review.recipeTitle}
                </Button>
                <Typography variant="body2" color="textSecondary">
                  {review.Content}
                </Typography>
                <Typography variant="caption" display="block" sx={{ marginTop: 1 }}>
                  Reviewed on: {review.ReviewDate}
                </Typography>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteReview(review)}
                  sx={{ marginTop: 1 }}
                >
                  Delete
                </Button>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProfilePage;