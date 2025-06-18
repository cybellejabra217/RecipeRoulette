const UserService = require("../Services/UserService"); 
const RecipeService = require('../Services/RecipeService'); 
const ReviewService = require('../Services/ReviewService'); 
const { getPixabayImages } = require('../External API/recipeImage'); 
const moment = require('moment'); 
const { validationResult } = require('express-validator'); 
const jwt = require('jsonwebtoken'); 
const { HfInference } = require('@huggingface/inference'); // library for AI text generation

/**
 * Controller to handle user profile information, including details like username, bio, recipes, and reviews.
 * @param {Object} req - The request object containing either the user ID from the body or JWT token.
 * @param {Object} res - The response object to send the user profile data or error details.
 * @returns {Object} - A JSON response with the user's profile data or error message.
 */
const userProfileController = async (req, res) => {

    let userId;

    // get user ID from request body or JWT token.
    if (req.body.id && Number.isInteger(Number(req.body.id))) {
        userId = Number(req.body.id);

    } 

    else {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
    }

    console.log("search for user: " + userId);

    try {
        // fetch user details, recipes, and reviews.
        const { Username, JoinDate, Bio } = await UserService.findUser(userId);
        const [recipes, reviews] = await Promise.all([
            RecipeService.getRecipesByUser(Username),
            ReviewService.getReviewsByUser(Username)
        ]);

        // ehnance recipes and reviews with additional data like images.
        const enhancedRecipes = await Promise.all(recipes.map(async (recipe) => {
            const imageUrl = await getPixabayImages(recipe.Title);
            return {
                ...recipe.toJSON(),
                imageUrl: imageUrl || '/path/to/default/image.jpg',
                recipeId: recipe.RecipeID
            };
        }));

        // get recipe details and image
        const enhancedReviews = await Promise.all(reviews.map(async (review) => {
            const reviewedRecipe = await RecipeService.getRecipeDetails(review.RecipeID);
            const imageUrl = await getPixabayImages(reviewedRecipe.Title);
            return {
                ...review.toJSON(),
                recipeTitle: reviewedRecipe.Title,
                recipeId: reviewedRecipe.RecipeID,
                imageUrl: imageUrl || '/path/to/default/image.jpg',
                ratingImage: `/images/${review.value}star.png`
            };
        }));

        // formats join date and send response
        const formattedJoinDate = moment(JoinDate).format('DD/MM/YY');
        res.status(200).json({
            success: true,
            data: {
                joinDate: formattedJoinDate,
                username: Username,
                bio: Bio,
                recipes: enhancedRecipes,
                reviews: enhancedReviews
            }
        });
    } catch (error) {
        console.error("Error loading profile:", error);
        res.status(500).json({ success: false, message: "Error loading profile. Please try again later." });
    }
};

/**
 * Controller to handle updating the user's bio.
 * @param {Object} req - The request object containing the new bio in the body.
 * @param {Object} res - The response object to send the result of the bio update or error details.
 * @returns {Object} - A JSON response indicating success or failure of the bio update.
 */
const updateUserBioController = async (req, res) => {
    // validate request body.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    // get user ID from token
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { newBio } = req.body;
    try {
        // update user bio in the database.
        const updatedUser = await UserService.updateUserBio(userId, newBio.trim());
        res.status(200).json({ success: true, message: "User bio updated successfully", data: updatedUser });
    } catch (error) {
        console.error("Error updating user bio:", error);
        res.status(500).json({ success: false, message: "Error updating bio. Please try again later." });
    }
};

/**
 * Controller to handle AI-based text generation using Hugging Face API.
 * @param {Object} req - The request object containing the input text (question) for text generation.
 * @param {Object} res - The response object to send the AI-generated text or error details.
 * @returns {Object} - A JSON response with the generated text or error message.
 */
const generateText = async (req, res) => {
    console.log("body request:" + JSON.stringify(req.body));
    try {
        // use Hugging Face API to generate text based on input.
        const hf = process.env.HUGGING_FACE_TOKEN;
            const result = await hf.textGeneration({
            model: 'meta-llama/Meta-Llama-3-8B-Instruct', // the model used
            inputs: req.body.question, // type of input
        });

        // send the result (generated text)
        res.status(200).json({ success: true, message: result.generated_text });
    } catch (error) {
        console.error("Error getting data:", error);
        res.status(500).json({ success: false, message: error });
    }
};

/**
 * Controller to handle viewing another user's profile by username.
 * @param {Object} req - The request object containing the username in the URL params.
 * @param {Object} res - The response object to send the user's profile data or error details.
 * @returns {Object} - A JSON response with the user's profile data or error message.
 */
const viewUserProfileController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username } = req.params;
    try {
        // check if the user exists and fetch their data
        const [userExists, joinDate, bio] = await Promise.all([
            UserService.checkIfUserExists(username),
            UserService.getUserJoinDate(username),
            UserService.getUserBio(username)
        ]);

        if (!userExists) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // get and enhance the user's recipes and reviews
        const [recipes, reviews] = await Promise.all([
            RecipeService.getRecipesByUser(username),
            ReviewService.getReviewsByUser(username)
        ]);

        const enhancedRecipes = await Promise.all(recipes.map(async (recipe) => {
            const imageUrl = await getPixabayImages(recipe.Title);
            return {
                ...recipe.toJSON(),
                imageUrl: imageUrl || '/path/to/default/image.jpg',
                recipeId: recipe.RecipeID
            };
        }));

        const enhancedReviews = await Promise.all(reviews.map(async (review) => {
            const reviewedRecipe = await RecipeService.getRecipeDetails(review.RecipeID);
            const imageUrl = await getPixabayImages(reviewedRecipe.Title);
            return {
                ...review.toJSON(),
                recipeTitle: reviewedRecipe.Title,
                recipeId: reviewedRecipe.RecipeID,
                imageUrl: imageUrl || '/path/to/default/image.jpg',
                reviewId: review.ReviewID
            };
        }));

        const formattedJoinDate = moment(joinDate).format('DD/MM/YY');
        res.status(200).json({
            success: true,
            data: {
                joinDate: formattedJoinDate,
                username: username,
                bio: bio,
                recipes: enhancedRecipes,
                reviews: enhancedReviews
            }
        });
    } catch (error) {
        console.error("Error loading user profile:", error);
        res.status(500).json({ success: false, message: "Error loading user profile. Please try again later." });
    }
};

/**
 * Controller to handle retrieving a user's information by their username.
 * @param {Object} req - The request object containing the username in the URL params.
 * @param {Object} res - The response object to send the user data or error details.
 * @returns {Object} - A JSON response with the user data or error message.
 */
const getUserByUsernameController = async (req, res) => {

    // checks for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
        });
    }

    // gets username
    const { username } = req.params;

    try {

        // sends request to get user by username
        const user = await UserService.getUserByUsername(username.trim());

        if (!user) {

            // sends error if user not found
            return res.status(404).json({ 
                success: false, 
                message: "User not found." 
            });
        }

        // sends the user if found
        res.status(200).json({ 
            success: true, 
            data: user 
        });
    } catch (error) {
        console.error("Error fetching user by username:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching user. Please try again later." 
        });
    }
};


/**
 * Controller to handle retrieving a user's join date by their username.
 * @param {Object} req - The request object containing the username in the URL params.
 * @param {Object} res - The response object to send the user's join date or error details.
 * @returns {Object} - A JSON response with the user's join date or error message.
 */
const getUserJoinDateController = async (req, res) => {

    // checks for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
        });
    }

    // gets username from params
    const { username } = req.params;

    try {
        // get the join date using the username fetched
        const joinDate = await UserService.getUserJoinDate(username.trim());

        if (!joinDate) {
            return res.status(404).json({ 
                success: false, 
                message: "Join date not found for the specified user." 
            });
        }

        // format the date
        const formattedJoinDate = moment(joinDate).format('DD/MM/YY');

        res.status(200).json({ 
            success: true, 
            data: { joinDate: formattedJoinDate } 
        });
    } catch (error) {
        console.error("Error fetching user join date:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching join date. Please try again later." 
        });
    }
};

/**
 * Controller to handle retrieving a user's bio by their username.
 * @param {Object} req - The request object containing the username in the URL params.
 * @param {Object} res - The response object to send the user's bio or error details.
 * @returns {Object} - A JSON response with the user's bio or error message.
 */
const getUserBioController = async (req, res) => {

    // check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
        });
    }

    // get username from params
    const { username } = req.params;

    try {

        // use username to get bio
        const bio = await UserService.getUserBio(username.trim());

        if (bio === undefined || bio === null) {
            return res.status(404).json({ 
                success: false, 
                message: "Bio not found for the specified user." 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: { bio } 
        });
    } catch (error) {
        console.error("Error fetching user bio:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching bio. Please try again later." 
        });
    }
};

// exports the modules
module.exports = {
    userProfileController,
    updateUserBioController,
    viewUserProfileController,
    getUserByUsernameController,
    getUserJoinDateController,
    getUserBioController,
    generateText
};
