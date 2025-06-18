const express = require('express');
const router = express.Router();
const { 
    createReviewController,
    getReviewsByRecipeIdController,
    getReviewsByUserController,
    deleteReviewController
} = require('../Controllers/ReviewController');
const { reviewValidation } = require('../Validators/ReviewValidator');

const authenticateJWT = require('../middleware/authenticateMiddleware'); 

/**
 * @swagger
 * /createReview:
 *   post:
 *     summary: Create a new review for a recipe
 *     description: Allow authenticated users to create a review for a recipe by providing the recipe ID, review content, and rating value.
 *     tags:
 *       - Review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeID:
 *                 type: integer
 *               content:
 *                 type: string
 *               value:
 *                 type: integer
 *                 description: Rating value (e.g., from 1 to 5).
 *     responses:
 *       201:
 *         description: "Review created successfully"
 *       400:
 *         description: "Invalid review data"
 *       401:
 *         description: "Unauthorized or invalid token"
 *       500:
 *         description: "Internal server error"
 */
router.post('/createReview', reviewValidation, authenticateJWT, createReviewController);

/**
 * @swagger
 * /getReviewsByRecipe/{recipeId}:
 *   get:
 *     summary: Get reviews for a specific recipe
 *     description: Retrieve all reviews for a recipe by its ID.
 *     tags:
 *       - Review
 *     parameters:
 *       - name: recipeId
 *         in: path
 *         required: true
 *         description: The ID of the recipe to fetch reviews for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Reviews fetched successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ReviewID:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       value:
 *                         type: integer
 *                       formattedDate:
 *                         type: string
 *                         example: "10/12/24"
 *                 recipeId:
 *                   type: integer
 *       400:
 *         description: "Invalid recipe ID"
 *       500:
 *         description: "Internal server error"
 */
router.get('/getReviewsByRecipe/:recipeId', authenticateJWT, getReviewsByRecipeIdController);

/**
 * @swagger
 * /getReviewsByUser/{username}:
 *   get:
 *     summary: Get reviews by a specific user
 *     description: Fetch all reviews made by a user by their username.
 *     tags:
 *       - Review
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user whose reviews are to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ReviewID:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       value:
 *                         type: integer
 *                       formattedDate:
 *                         type: string
 *                         example: "10/12/24"
 *       400:
 *         description: "Invalid username"
 *       500:
 *         description: "Internal server error"
 */
router.get('/getReviewsByUser/:username', authenticateJWT, getReviewsByUserController);

/**
 * @swagger
 * /deleteReview/{reviewId}/{recipeId}:
 *   post:
 *     summary: Delete a review by its ID
 *     description: Allow a user to delete their own review for a recipe using the review ID and recipe ID.
 *     tags:
 *       - Review
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         required: true
 *         description: The ID of the review to delete.
 *         schema:
 *           type: integer
 *       - name: recipeId
 *         in: path
 *         required: true
 *         description: The ID of the recipe associated with the review.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Review deleted successfully"
 *       400:
 *         description: "Invalid review or recipe ID"
 *       403:
 *         description: "You can only delete your own reviews"
 *       500:
 *         description: "Internal server error"
 */
router.post('/deleteReview/:reviewId/:recipeId', authenticateJWT, deleteReviewController);

module.exports = router;
