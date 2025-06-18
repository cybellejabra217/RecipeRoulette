const {
    createReview,
    getReviewsByRecipeId,
    getReviewsByUser,
    updateAverageRating,
    deleteReview
} = require("../Services/ReviewService");
const { validationResult } = require('express-validator');
const moment = require('moment');
const jwt = require('jsonwebtoken');


/**
 * Controller to handle creating a review for a recipe.
 * @param {Object} req - The request object containing the review data (recipeID, content, value).
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with the status of the review creation or error details.
 */
const createReviewController = async (req, res) => {

    // gets authorization
    const authHeader = req.headers.authorization;

    // checks for validity and gets token
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const userId = user.userId; 
            const { recipeID, content, value } = req.body;

            try {
                const reviewData = {
                    userID: userId,
                    recipeID,
                    content: content.trim() || null,
                    value,
                    reviewDate: new Date()
                };

                // creates the review
                const result = await createReview(reviewData);

                // updates the average rating accordingly
                await updateAverageRating(recipeID);

                res.status(201).json({ message: "Review created successfully", reviewId: result.review_id });
            } catch (error) {
                console.error("Error creating review:", error);

                if (error.message.includes('Validation error')) {
                    return res.status(400).json({ error: "Invalid review data provided." });
                }

                res.status(500).json({ error: "Internal server error. Please try again later." });
            }

        });
    }
    
};

/**
 * Controller to handle fetching reviews for a recipe by its ID.
 * @param {Object} req - The request object containing the recipe ID.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with the fetched reviews or error details.
 */
const getReviewsByRecipeIdController = async (req, res) => {

    // checks for errors (validates received data)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { recipeId } = req.params;

    try {

        // gets the reviews by recipe id
        const reviews = await getReviewsByRecipeId(parseInt(recipeId));

        // formats the date
        const formattedReviews = reviews.map(review => ({
            ...review.toJSON(),
            formattedDate: moment(review.ReviewDate).format('DD/MM/YY')
        }));

        // sends the formatted reviews
        res.status(200).json({ reviews: formattedReviews, recipeId: parseInt(recipeId, 10) });
    } catch (error) {
        console.error("Error fetching reviews by recipe ID:", error);
        res.status(500).json({ error: "Error fetching reviews by recipe ID." });
    }
};

/**
 * Controller to handle fetching reviews by a specific user.
 * @param {Object} req - The request object containing the username.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with the fetched reviews or error details.
 */
const getReviewsByUserController = async (req, res) => {

    // checks for errors (validates received data)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // gets the username
    const { username } = req.params;

    try {

        // gets the reviews by username
        const reviews = await getReviewsByUser(username.trim());

        // formats the date
        const formattedReviews = reviews.map(review => ({
            ...review.toJSON(),
            formattedDate: moment(review.ReviewDate).format('DD/MM/YY')
        }));

        // sends the formatted reviews
        res.status(200).json({ reviews: formattedReviews });
    } catch (error) {
        console.error("Error fetching reviews by user:", error);
        res.status(500).json({ error: "Error fetching reviews by user." });
    }
};

/**
 * Controller to handle deleting a review for a recipe.
 * @param {Object} req - The request object containing the review ID and recipe ID.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with the status of review deletion or error details.
 */
const deleteReviewController = async (req, res) => {

    // checks for errors (validates the recived data)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // gets review id and recipe id from params
    const { reviewId, recipeId } = req.params;
    const userId = req.user.userId; 
    console.log("review id is: " + reviewId)
    console.log("recipeId id is: " + recipeId)
    try {

        // gets the reviews froom recipe id
        const review = await getReviewsByRecipeId(parseInt(recipeId, 10));
        const targetReview = review.find(r => r.ReviewID === parseInt(reviewId, 10));

        if (!targetReview) {
            return res.status(404).json({ error: "Review not found." });
        }

        if (targetReview.UserID !== userId) {
            return res.status(403).json({ error: "Forbidden: You can only delete your own reviews." });
        }

        // deletes the review
        await deleteReview(parseInt(reviewId, 10));

        // updates the average rating
        await updateAverageRating(parseInt(recipeId, 10));

        res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Error deleting review." });
    }
};

module.exports = {
    createReviewController,
    getReviewsByRecipeIdController,
    getReviewsByUserController,
    deleteReviewController
};
