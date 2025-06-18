const sequelize = require('../Config/DBConfig');
const { Review, User, Recipe } = require('../Models/index');

/**
 * Service: Create a Review
 * 
 * Creates a new review for a recipe by validating the input data and storing it in the database.
 * 
 * @param {Object} reviewData
 * @param {string} reviewData.content - The content of the review.
 * @param {Date} reviewData.reviewDate - The date the review was written.
 * @param {number} reviewData.recipeID - The ID of the recipe being reviewed.
 * @param {number} reviewData.userID - The ID of the user submitting the review.
 * @param {number} reviewData.value - The rating value of the review (1 to 5).
 * 
 * @throws {Error} If any required field is missing or invalid.
 * 
 * @returns {Object} An object containing the unique ID of the newly created review.
 */
const createReview = async (reviewData) => {

    // checks validity of data received
    if (!reviewData || typeof reviewData !== 'object') {
        throw new Error('Invalid review data');
    }

    // the fields of the object
    const { content, reviewDate, recipeID, userID, value } = reviewData;

    // checks validity of recipe id, user id and value
    if (typeof recipeID !== 'number' || recipeID <= 0) {
        throw new Error('A valid recipe ID is required to create a review');
    }
    if (typeof userID !== 'number' || userID <= 0) {
        throw new Error('A valid user ID is required to create a review');
    }
    if (typeof value !== 'number' || value < 1 || value > 5) {
        throw new Error('A valid review value between 1 and 5 is required');
    }

    try {

        // creates the review and adds to database
        const review = await Review.create({
            Content: content || null,
            ReviewDate: reviewDate || new Date(),
            RecipeID: recipeID,
            UserID: userID,
            Value: value
        });

        return { review_id: review.ReviewID };
    } catch (error) {
        console.error('Error creating review:', { error, reviewData });
        throw new Error('Failed to create review');
    }
};



/**
 * Service: Get Reviews by Recipe ID
 * 
 * Retrieves all reviews for a specific recipe based on its ID.
 * 
 * @param {number} recipeId - The unique ID of the recipe.
 * 
 * @throws {Error} If the recipe ID is invalid.
 * 
 * @returns {Array} An array of reviews for the specified recipe.
 */
const getReviewsByRecipeId = async (recipeId) => {

    // checks validity of recipe id
    if (typeof recipeId !== 'number' || recipeId <= 0) {
        throw new Error('A valid recipe ID is required');
    }

    try {
        // finds all reviews of the recipe
        const reviews = await Review.findAll({
            where: { RecipeID: recipeId },
            include: [{
                model: User,
                as: 'user'
            }]
        });

        // returns the fetched reviews
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews by recipe ID:', { error, recipeId });
        throw new Error('Failed to fetch reviews by recipe ID');
    }
};


/**
 * Service: Get Reviews by User
 * 
 * Retrieves all reviews written by a specific user.
 * 
 * @param {string} username - The username of the user whose reviews are being retrieved.
 * 
 * @throws {Error} If the username is invalid.
 * 
 * @returns {Array} An array of reviews written by the specified user.
 */
const getReviewsByUser = async (username) => {

    // checks validity of username
    if (typeof username !== 'string' || !username.trim()) {
        throw new Error('A valid username is required');
    }

    try {

        // finds all reviews of a user
        const reviews = await Review.findAll({
            include: [{
                model: User,
                as: 'user',
                where: { Username: username.trim() },
                attributes: [],
            }]
        });

        // returns the fetched reviews
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews by user:', { error, username });
        throw new Error('Failed to fetch reviews by user');
    }
};


/**
 * Service: Update Average Rating
 * 
 * Updates the average rating for a recipe based on all its reviews.
 * 
 * @param {number} recipeId - The unique ID of the recipe whose average rating is being updated.
 * 
 * @throws {Error} If the recipe ID is invalid or if the average rating update fails.
 */
const updateAverageRating = async (recipeId) => {

    // checks validity of recipe id
    if (typeof recipeId !== 'number' || recipeId <= 0) {
        throw new Error('A valid recipe ID is required to update average rating');
    }

    try {

        //  finds all reviews of recipe
        const result = await Review.findAll({
            where: { RecipeID: recipeId },
            attributes: [[sequelize.fn('AVG', sequelize.col('Value')), 'avgRating']],
        });

        // calculates the average rating
        const avgRating = result[0] ? result[0].get('avgRating') : 0;

        // updates it
        await Recipe.update({ AverageRating: avgRating }, {
            where: { RecipeID: recipeId }
        });
    } catch (error) {
        console.error('Error updating average rating:', { error, recipeId });
        throw new Error('Failed to update average rating');
    }
};


/**
 * Service: Delete Review
 * 
 * Deletes a specific review by its ID.
 * 
 * @param {number} reviewId - The unique ID of the review to be deleted.
 * 
 * @throws {Error} If the review ID is invalid or if the review deletion fails.
 */
const deleteReview = async (reviewId) => {

    // checks validity of review id
    if (typeof reviewId !== 'number' || reviewId <= 0) {
        throw new Error('A valid review ID is required to delete a review');
    }

    try {
        // deletes it from database
        const result = await Review.destroy({
            where: { ReviewID: reviewId }
        });
        if (result === 0) {
            throw new Error('Review not found');
        }
    } catch (error) {
        console.error('Error deleting review:', { error, reviewId });
        if (error.message === 'Review not found') {
            throw error; 
        }
        throw new Error('Failed to delete review');
    }
};

module.exports = {
    createReview,
    getReviewsByRecipeId,
    getReviewsByUser,
    updateAverageRating,
    deleteReview
};
