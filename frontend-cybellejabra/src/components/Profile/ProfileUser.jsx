import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CardMedia, Grid, Avatar, Button } from "@mui/material";
import UserService from "../../services/UserService";
import { useParams, useNavigate } from "react-router-dom";
import './profile.css';

const ProfileUser = () => {

  const navigate = useNavigate(); // to be able to navigate
  const { id } = useParams();

  // sets states
  const [profileData, setProfileData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  /**
   * Fetches the profile data for the user with the given ID.
   * The data is fetched using `UserService.getUser` and stored in `profileData`.
   * The `loading` state is used to manage the loading status of the component.
   */
  const fetchProfile = async () => {
      try {

        // fetches the profile according to id sent
        const response = await UserService.getUser(id);
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /**
   * Navigates to the recipe details page for the specified recipe ID.
   * @param {string} recipeId - The ID of the recipe to view.
   */
  const handleRecipeClick = (recipeId) => {
    navigate(`/recipeDetails/${recipeId}`);
  };

  // to show that profile is loading
  if (!profileData) {
    return <Typography>Loading...</Typography>;
  }

  // sets profile data fields
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

                <Typography variant="h6">{review.recipeTitle}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {review.Content}
                </Typography>
                <Typography variant="caption" display="block" sx={{ marginTop: 1 }}>
                  Reviewed on: {review.ReviewDate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProfileUser;
