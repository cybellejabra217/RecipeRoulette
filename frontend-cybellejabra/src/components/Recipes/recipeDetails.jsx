import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import RecipeService from "../../services/RecipeService";
import ReviewService from "../../services/ReviewService";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import "./recipeDetails.css";

const RecipeDetails = () => {

    // sets all the states
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [reviewRating, setReviewRating] = useState(1);
    const [reviewLoading, setReviewLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * Fetches recipe details using the provided recipe ID.
     * If no recipe ID is available or the fetch fails, navigates back to the homepage.
     * @async
     * @function fetchRecipeDetails
     */
    const fetchRecipeDetails = useCallback(async () => {
        if (!recipeId) {
            toast.error("No recipe ID provided.");
            navigate("/homepage"); // navigates to homepage upon error
            return;
        }

        try {   

            // use getRecipeDetails service to get thr recipe details
            const response = await RecipeService.getRecipeDetails(recipeId);
            setRecipe(response.data);
            setImageURL(response.imageUrl);
        } catch (error) {

            // if not found, navigate to homepage with error
            console.error("Error fetching recipe details:", error);
            toast.error(error.response?.data?.error || "Failed to fetch recipe details.");
            navigate("/homepage");
        } finally {
            setLoading(false);
        }
    }, [recipeId, navigate]);

    useEffect(() => {
        fetchRecipeDetails();
    }, [fetchRecipeDetails]);

    /**
     * Returns the URL of the rating image based on the given rating value.
     * @function getRatingImage
     * @param {number} rating - The rating value (1 to 5).
     * @returns {string|null} The URL of the corresponding rating image or null if the rating is invalid.
     */
    const getRatingImage = (rating) => {

        // switch case to get the image url based on rating value
        switch (rating) {
            case 1:
                return "/1star.png"; 
            case 2:
                return "/2star.png";
            case 3:
                return "/3star.png";
            case 4:
                return "/4star.png";
            case 5:
                return "/5star.png";
            default:
                return null;
        }
    };


    /**
     * Opens the review modal and fetches the reviews for the current recipe.
     * @async
     * @function openReviewModal
     */
    const openReviewModal = async () => {
        setIsReviewModalOpen(true);
        setReviewLoading(true);
        try {

            // get the reviews for the recipe and display them
            const response = await ReviewService.getReviewsByRecipeId(recipeId);
            setReviews(response.reviews || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error(error.response?.data?.error || "Failed to fetch reviews.");
        } finally {
            setReviewLoading(false);
        }
    };

    /**
     * Closes the review modal and resets review input fields.
     * @function closeReviewModal
     */
    const closeReviewModal = () => {

        // resets everything
        setIsReviewModalOpen(false);
        setNewReview("");
        setReviewRating(1);
    };

    /**
     * Adds a new review for the current recipe.
     * Validates the review content and rating before submission.
     * @async
     * @function handleAddReview
     */
    const handleAddReview = async () => {
        if (!newReview.trim() || reviewRating < 1 || reviewRating > 5) {
            toast.error("Please provide a valid review and rating (1-5).");
            return;
        }
        try {
            // parses the recipe id
            const recipeID = parseInt(recipeId);

            // format and add the review data
            const reviewData = { recipeID: recipeID, content: newReview.trim(), value: reviewRating };

            // send to createReview service to create the review with the specified data
            await ReviewService.createReview(reviewData);
            toast.success("Review added successfully!");

            // retrieve all reviews for the recipe to portray them
            const response = await ReviewService.getReviewsByRecipeId(recipeId);
            setReviews(response.reviews || []);
            setNewReview("");
            setReviewRating(1);
        } catch (error) {
            console.error("Error adding review:", error);
            toast.error(error.response?.data?.error || "Failed to add review.");
        }
    };

    // show loading (the circle that spins)
    if (loading) {
        return <CircularProgress />;
    }

    // if recipe isnt found
    if (!recipe) {
        return <p>Recipe not found.</p>;
    }

    // data fields for recipe
    const {
        Title,
        Description,
        Ingredients,
        Instructions,
        DifficultyLevel,
        Calories,
        DietaryPreferences,
        AverageRating,
        cuisine
    } = recipe;

    const cuisineName = cuisine?.CuisineName || "N/A";

    return (
        <div className="recipe-details-container">
            <Typography variant="h4" className="recipe-title">{Title}</Typography>
            <img
                src={imageURL}
                alt={`${Title} Image`}
                onError={(e) => (e.target.src = "/defaultImage.jpg")}
                className="recipe-image"
            />
            <div className="recipe-meta">
                <Typography variant="body1"><strong>Cuisine:</strong> {cuisineName}</Typography>
                <Typography variant="body1"><strong>Description:</strong> {Description}</Typography>
                <Typography variant="body1"><strong>Ingredients:</strong> {Ingredients}</Typography>
                <Typography variant="body1"><strong>Instructions:</strong> {Instructions}</Typography>
                <Typography variant="body1"><strong>Difficulty Level:</strong> {DifficultyLevel}</Typography>
                <Typography variant="body1"><strong>Calories:</strong> {Calories}</Typography>
                <Typography variant="body1"><strong>Dietary Preferences:</strong> {DietaryPreferences}</Typography>
                <Typography variant="body1"><strong>Average Rating:</strong> {AverageRating || "No Ratings Yet"}</Typography>
            </div>
            <Button variant="contained" color="primary" onClick={openReviewModal}>
                Check Reviews
            </Button>

            {/* Review Modal */}
            <Dialog open={isReviewModalOpen} onClose={closeReviewModal}>
                <DialogTitle>Reviews</DialogTitle>
                <DialogContent>
                    {reviewLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            {reviews.length === 0 ? (
                                <Typography>No reviews yet.</Typography>
                            ) : (
                                <List>
                                    {reviews.map((review) => (
                                        <ListItem
                                            key={review.ReviewID}
                                            component={Link}
                                            to={`/profile/${review.user?.UserID || "anonymous"}`} 
                                            sx={{ textDecoration: "none", color: "inherit" }} 
                                        >
                                        <ListItemText
                                                primary={
                                                    <strong>{review?.user?.Username || "Anonymous"}:</strong>
                                                }
                                                secondary={
                                                    <>
                                                        {review.Content}<br/>
                                                        Rating: 
                                                        <img
                                                        src={getRatingImage(review.Value)}
                                                        alt={`Rating: ${review.Value}`}
                                                        style={{ marginLeft: "8px", width: "70px"}} 
                                                        />
                                                    </>
                                                    
                                                }

                                                
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </>
                    )}

                    <TextField
                        label="Add your review"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />
                    <TextField
                        label="Rating (1-5)"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        inputProps={{ min: 1, max: 5 }}
                        style={{ marginBottom: 16 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeReviewModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddReview} color="primary">
                        Add Review
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RecipeDetails;
