import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent, CardMedia } from "@mui/material";
import "./searchRecipes.css"; 

/**
 * SearchRecipes Component
 * Displays a list of recipes based on the search query.
 */
const SearchRecipes = () => {

    const location = useLocation();
    const navigate = useNavigate(); // to be eable to navigate
    console.log(location);

    const { recipes = [], filters } = location.state || {};

    /**
     * Logs the received recipes for debugging purposes.
     */
    useEffect(() => {
        console.log("SearchRecipes component received recipes:", recipes);
    }, [recipes]);

  /**
   * Navigates to the recipe details page when a recipe title is clicked.
   * @param {number} recipeId - The ID of the recipe to view details for.
   */
    const handleRecipeClick = (recipeId) => {
        navigate(`/recipeDetails/${recipeId}`);
    };

    /**
     * Handles the image loading error by setting a default image.
     *
     * @param {object} e - The image load event.
     */
    const handleImageError = (e) => {
        e.target.src = "/defaultImage.jpg"; // path to default image
    };

    /**
     * Renders the content based on the recipes array.
     */
    const renderContent = () => {
        if (!Array.isArray(recipes)) {
            return <p className="error-message">Invalid data format received.</p>;
        }

        if (recipes.length === 0) {
            return <Typography variant="h6" color="textSecondary">No recipes found for { filters?.searchQuery }.</Typography>;
        }

        return (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 3 }}>
                {recipes.map((recipe) => (
                    <Card key={recipe.RecipeID} sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
                        <CardMedia
                            component="img"
                            alt={recipe.Title || "Recipe Image"}
                            height="200"
                            image={recipe.imageUrl || "/defaultImage.jpg"}
                            onError={handleImageError}
                            loading="lazy"
                        />
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom>
                                <Button
                                className="title-button"
                                    fullWidth
                                    onClick={() => handleRecipeClick(recipe.RecipeID)}
                                    sx={{ textAlign: "left", fontWeight: "bold" }}
                                >
                                    {recipe.Title || "Untitled Recipe"}
                                </Button>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Cuisine: {recipe.cuisineName || (recipe.cuisine?.cuisine_name) || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" noWrap>
                                {recipe.Description
                                    ? recipe.Description.length > 100
                                        ? `${recipe.Description.substring(0, 100)}...`
                                        : recipe.Description
                                    : "No description available."}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    };

    return (
        <div className="search-recipes-container">
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
            Search Results for "{ filters?.searchQuery != "" && filters?.searchQuery}"
            </Typography>
            {renderContent()}
        </div>
    );
};

export default SearchRecipes;
