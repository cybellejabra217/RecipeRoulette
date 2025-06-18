const Recipe = require('../Models/recipe');  
const User = require('../Models/user');  
const Cuisine = require('../Models/cuisine');  
const { Op } = require('sequelize');

/**
 * Service: Create a New Recipe
 * 
 * Creates a new recipe in the system by validating the input data and storing it in the database.
 * 
 * @param {Object} recipeData 
 * @param {string} recipeData.title 
 * @param {string} recipeData.description 
 * @param {string} recipeData.ingredients 
 * @param {string} recipeData.instructions 
 * @param {string} recipeData.difficultyLevel 
 * @param {number} recipeData.cuisineID 
 * @param {number} recipeData.calories 
 * @param {number} recipeData.userID 
 * @param {string} recipeData.dietaryPreferences 
 * 
 * @throws {Error} If any required field is missing or invalid.
 * 
 * @returns {Object} An object containing the unique ID of the newly created recipe.
 */
const createRecipe = async (recipeData) => {

    // checks if recipe data received is of type object
    if (!recipeData || typeof recipeData !== 'object') {
        throw new Error('Invalid recipe data provided');
    }
    
    // sets the recipe data
    const {
        title,
        description,
        ingredients,
        instructions,
        difficultyLevel,
        cuisineID,
        calories,
        userID,
        dietaryPreferences
    } = recipeData;

    // chceks if title is valid
    if (typeof title !== 'string' || !title.trim()) {
        throw new Error('A valid title is required');
    }

    if (userID == null) {
        throw new Error('A valid user ID is required for creating a recipe');
    }

    try {

        // creates aa new recipe with all needed fields
        const newRecipe = await Recipe.create({
            Title: title.trim(),
            Description: description || null,
            Ingredients: ingredients || null,
            Instructions: instructions || null,
            DifficultyLevel: difficultyLevel || null,
            CuisineID: cuisineID || null,
            Calories: (calories >= 0) ? calories : null,
            UserID: userID,
            DietaryPreferences: dietaryPreferences || null,
        });

        // returns the newly created recipe's id
        return { recipe_id: newRecipe.RecipeID };
    } catch (error) {
        console.error('Error creating recipe:', { error, recipeData });
        throw new Error('Failed to create recipe');
    }
};


/**
 * Service: Get Recipes by Criteria
 * 
 * Retrieves recipes based on dietary preferences, calorie limits, and preferred cuisine.
 * 
 * @param {string} dietaryPreferences 
 * @param {number} calorieLimitPerMeal
 * @param {number} preferredCuisine 
 * 
 * @throws {Error} If calorie limit is invalid.
 * 
 * @returns {Array} An array of recipes that match the specified criteria.
 */
const getRecipesByCriteria = async (dietaryPreferences, calorieLimitPerMeal, preferredCuisine) => {
    
    // checks if calories is valid
    if (typeof calorieLimitPerMeal !== 'number' || calorieLimitPerMeal <= 0) {
        throw new Error('A valid calorie limit is required');
    }

    try {

        // uses find all to get all recipes with the required criteria
        const recipes = await Recipe.findAll({
            where: {
                DietaryPreferences: dietaryPreferences || { [Op.not]: null },
                Calories: {
                    [Op.lte]: calorieLimitPerMeal,
                },
                CuisineID: preferredCuisine || { [Op.not]: null },
            },
            include: [
                {
                    model: Cuisine,
                    as: 'cuisine',
                    attributes: ['CuisineName'],
                },
            ],
        });

        // returns recipes found
        return recipes;
    } catch (error) {
        console.error('Error retrieving recipes by criteria:', { error, dietaryPreferences, calorieLimitPerMeal, preferredCuisine });
        throw new Error('Failed to retrieve recipes by criteria');
    }
};

/**
 * Service: Get Recipes by User
 * 
 * Retrieves all recipes created by a specific user.
 * 
 * @param {string} username - The username of the user whose recipes are being retrieved.
 * 
 * @throws {Error} If the username is invalid.
 * 
 * @returns {Array} An array of recipes created by the specified user.
 */
const getRecipesByUser = async (username) => {

    // checks if username valid
    if (typeof username !== 'string' || !username.trim()) {
        throw new Error('A valid username is required');
    }

    try {

        // uses find all to get all recipes submitted by specific user
        const recipes = await Recipe.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    where: { Username: username.trim() },
                    attributes: [],
                },
            ],
        });

        // returns recipes found
        return recipes;
    } catch (error) {
        console.error('Error retrieving recipes by user:', { error, username });
        throw new Error('Failed to retrieve recipes by user');
    }
};


/**
 * Service: Get Recipe Details
 * 
 * Retrieves detailed information about a specific recipe by its ID.
 * 
 * @param {number} recipeId - The unique ID of the recipe.
 * 
 * @throws {Error} If the recipe ID is invalid or if the recipe is not found.
 * 
 * @returns {Object} An object containing detailed information about the recipe.
 */
const getRecipeDetails = async (recipeId) => {

    // checks if recipe id is a valid number
    if (typeof recipeId !== 'number' || recipeId <= 0) {
        throw new Error('A valid recipe ID is required');
    }

    try {

        // uses find one to get the specific recipe
        const recipe = await Recipe.findOne({
            where: { RecipeID: recipeId },
            include: [
                {
                    model: Cuisine,
                    as: 'cuisine',
                    attributes: ['CuisineName'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['Username'],
                },
            ],
        });

        if (!recipe) {
            throw new Error('Recipe not found');
        }

        // returns recipe
        return recipe;
    } catch (error) {
        console.error('Error retrieving recipe details:', { error, recipeId });
        throw new Error('Failed to retrieve recipe details');
    }
};

/**
 * Service: Search Recipes
 * 
 * Searches for recipes based on a query string that matches the title, ingredients, or dietary preferences.
 * 
 * @param {string} searchQuery - The search query for finding recipes.
 * 
 * @throws {Error} If the search query is invalid.
 * 
 * @returns {Array} An array of recipes that match the search query.
 */
const searchRecipes = async (searchQuery) => {
    try {

        // sends query and retreives all recipes
        const query = `%${searchQuery.trim()}%`;
        const recipes = await Recipe.findAll({
            where: {
                [Op.or]: [
                    { Title: { [Op.like]: query } },
                    { Ingredients: { [Op.like]: query } },
                    { DietaryPreferences: { [Op.like]: query } },
                ],
            },
            include: [
                {
                    model: Cuisine,
                    as: 'cuisine',
                    attributes: ['CuisineName'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['Username'],
                },
            ],
        });

        // returns the recipes
        return recipes;
    } catch (error) {
        console.error('Error searching recipes:', { error, searchQuery });
        throw new Error('Failed to search recipes');
    }
};

module.exports = {
    createRecipe,
    getRecipesByCriteria,
    getRecipesByUser,
    getRecipeDetails,
    searchRecipes,
};
