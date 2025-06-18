const express = require('express');
const router = express.Router();
const {
    createRecipeController,
    getRecipesByCriteriaController,
    getRecipesByUserController,
    getRecipeDetailsController,
    searchRecipesController
} = require('../Controllers/RecipeController');
const { recipeValidation } = require('../Validators/RecipeValidator');

const authenticateJWT = require('../middleware/authenticateMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Recipe
 *     description: API endpoints related to recipes
 */

/**
 * @swagger
 * /createRecipe:
 *   post:
 *     summary: Create a new recipe
 *     description: Create a new recipe with title, description, ingredients, instructions, difficulty level, cuisine, calories, and dietary preferences.
 *     tags:
 *       - Recipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: string
 *               instructions:
 *                 type: string
 *               difficultyLevel:
 *                 type: string
 *               cuisineName:
 *                 type: string
 *               calories:
 *                 type: integer
 *               dietaryPreferences:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       400:
 *         description: Missing required fields or invalid data
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 */
router.post('/createRecipe', recipeValidation, authenticateJWT, createRecipeController);

/**
 * @swagger
 * /recipesByCriteria:
 *   get:
 *     summary: Get recipes by criteria
 *     description: Fetch recipes based on dietary preferences, calorie limit per meal, and preferred cuisine.
 *     tags:
 *       - Recipe
 *     parameters:
 *       - name: dietaryPreferences
 *         in: query
 *         required: true
 *         description: Dietary preference (e.g., vegetarian, vegan).
 *         schema:
 *           type: string
 *       - name: calorieLimitPerMeal
 *         in: query
 *         required: true
 *         description: Calorie limit per meal.
 *         schema:
 *           type: number
 *           format: float
 *       - name: preferredCuisine
 *         in: query
 *         required: true
 *         description: Preferred cuisine (e.g., Italian, Asian).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipes fetched successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 */
router.get('/recipesByCriteria', authenticateJWT, getRecipesByCriteriaController);

/**
 * @swagger
 * /recipesByUser/{username}:
 *   get:
 *     summary: Get recipes by user
 *     description: Fetch recipes created by a specific user.
 *     tags:
 *       - Recipe
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username of the user whose recipes are to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipes fetched successfully
 *       400:
 *         description: Invalid username
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 */
router.get('/recipesByUser/:username', authenticateJWT, getRecipesByUserController);

/**
 * @swagger
 * /recipedetails:
 *   get:
 *     summary: Get recipe details
 *     description: Fetch detailed information about a specific recipe.
 *     tags:
 *       - Recipe
 *     parameters:
 *       - name: recipeId
 *         in: query
 *         required: true
 *         description: The ID of the recipe to fetch details for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recipe details fetched successfully
 *       400:
 *         description: Invalid recipe ID
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
router.get('/recipedetails', authenticateJWT, getRecipeDetailsController);

/**
 * @swagger
 * /searchRecipes:
 *   get:
 *     summary: Search for recipes
 *     description: Search for recipes based on a query and optional filters for cuisine and dietary preference.
 *     tags:
 *       - Recipe
 *     parameters:
 *       - name: searchQuery
 *         in: query
 *         required: true
 *         description: The search term to look for in recipe titles and descriptions.
 *         schema:
 *           type: string
 *       - name: cuisine
 *         in: query
 *         required: false
 *         description: Cuisine filter for the search.
 *         schema:
 *           type: integer
 *       - name: dietaryPreference
 *         in: query
 *         required: false
 *         description: Dietary preference filter (e.g., vegetarian, vegan).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipes fetched successfully
 *       400:
 *         description: Invalid search query or parameters
 *       401:
 *         description: Unauthorized or invalid token
 *       500:
 *         description: Internal server error
 */
router.get('/searchRecipes', authenticateJWT, searchRecipesController);

module.exports = router;
