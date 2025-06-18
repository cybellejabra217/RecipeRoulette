const {
    createRecipe,
    getRecipesByCriteria,
    getRecipesByUser,
    getRecipeDetails,
    searchRecipes
} = require('../Services/RecipeService');

const { getCuisineIdByName, getCuisineNameById } = require('../Services/CuisineService');
const { findUsernameByUserId } = require('../Services/UserService');
const { getPixabayImages } = require('../External API/recipeImage');
const jwt = require('jsonwebtoken');

/**
 * Extracts the userId from the JWT token.
 * @param {string} token - The JWT token containing userId.
 * @returns {Object|null} - Returns userId if token is valid, otherwise null.
 * @throws {Error} - Throws error if token verification fails.
 */
const getUserIdFromToken = (token) => {
    try {

        // decode token and retrieve user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // return user id
        return decoded.userId;
    } catch (error) {

        // otherwise return null
        console.error('Token verification failed:', error);
        return null;
    }
};


/**
 * Controller to handle recipe creation.
 * Validates required fields, checks token, and creates the recipe.
 * @param {Object} req - The request object containing the recipe details.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with success message or error details.
 */
const createRecipeController = async (req, res) => {
    const recipeData = req.body;

    // setting required fields
    const requiredFields = ['title', 'description', 'ingredients', 'instructions', 'difficultyLevel', 'cuisineName', 'calories', 'dietaryPreferences'];

    // checks if any field missing
    for (const field of requiredFields) {
        if (!recipeData[field]) {
            return res.status(400).json({ error: `Missing required field: ${field}` });
        }
    }

    try {

        // checks for authorization
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token missing or malformed.' });
        }

        // gets token and uses helper function to get user id from tken
        const token = authHeader.split(' ')[1];
        const userId = getUserIdFromToken(token);

        // if expired token return error
        if (!userId) {
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }

        // get cuisine id using getCuisineIdByName service
        const cuisineId = await getCuisineIdByName(recipeData.cuisineName.trim());

        if (!cuisineId) {
            return res.status(400).json({ error: 'Invalid cuisine name provided.' });
        }

        // update recipe data by adding cuisine id and user id instead of cuisine name
        const newRecipeData = {
            ...recipeData,
            cuisineID: cuisineId,
            userID: userId
        };

        // create the recipe and send result
        const result = await createRecipe(newRecipeData);
        res.status(201).json({ message: "Recipe created successfully!", recipe: result });
    } catch (error) {
        console.error("Error creating recipe:", error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

/**
 * Controller to handle fetching recipes by specified criteria (dietary preferences, calories, and cuisine).
 * @param {Object} req - The request object containing the criteria.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with the filtered recipes or error details.
 */
const getRecipesByCriteriaController = async (req, res) => {
    const { dietaryPreferences, calorieLimitPerMeal, preferredCuisine } = req.body;

    // validates all data fields
    if (!dietaryPreferences || !calorieLimitPerMeal || !preferredCuisine) {
        return res.status(400).json({ error: "dietaryPreferences, calorieLimitPerMeal, and preferredCuisine are required." });
    }

    if (typeof calorieLimitPerMeal !== 'number' || calorieLimitPerMeal <= 0) {
        return res.status(400).json({ error: "calorieLimitPerMeal must be a positive number." });
    }

    try {

        // gets authorization
        const authHeader = req.headers['authorization'];

        // checks if valid
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token missing or malformed.' });
        }

        // gets token from authorization header
        const token = authHeader.split(' ')[1];

        // uses helper function to get use id from token
        const userId = getUserIdFromToken(token);


        // returns if invalid token
        if (!userId) {
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }

        // gets the cuisine id
        const cuisineId = await getCuisineIdByName(preferredCuisine.trim());

        if (!cuisineId) {
            return res.status(404).json({ error: 'Preferred cuisine not found.' });
        }

        // searches for recipes with specified dietary preferences etc
        const recipes = await getRecipesByCriteria(dietaryPreferences.trim(), calorieLimitPerMeal, cuisineId);

        res.status(200).json({ data: recipes });
    } catch (error) {
        console.error("Error fetching recipes by criteria:", error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};


/**
 * Controller to handle fetching recipes by a user's ID.
 * @param {Object} req - The request object containing the user ID (via token).
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with the user's recipes or error details.
 */
const getRecipesByUserController = async (req, res) => {
    const { username } = req.params;

    // validates username
    if (!username || typeof username !== 'string' || !username.trim()) {
        return res.status(400).json({ error: 'A valid username is required.' });
    }

    try {

        // gets authorization
        const authHeader = req.headers['authorization'];

        // checks if valid
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token missing or malformed.' });
        }

        // gets token from authorization
        const token = authHeader.split(' ')[1];

        // uses helper function to get user id
        const userId = getUserIdFromToken(token);

        // returns of token invalid
        if (!userId) {
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }

        // gets the recipes by the user
        const recipes = await getRecipesByUser(username.trim());
        res.status(200).json({ data: recipes });
    } catch (error) {
        console.error("Error fetching recipes by user:", error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

/**
 * Controller to handle fetching details of a specific recipe by recipe ID.
 * @param {Object} req - The request object containing the recipe ID.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with the recipe details or error details.
 */
const getRecipeDetailsController = async (req, res) => {
    const { recipeId } = req.query;

    console.log("Recipe id retrieved:", recipeId);

    // parses the recipe id and checks if valid
    const parsedRecipeId = parseInt(recipeId, 10);
    if (isNaN(parsedRecipeId) || parsedRecipeId <= 0) {
        return res.status(400).json({ error: 'A valid recipeId is required.' });
    }

    try {

        // gets the recipe details for the required recipe
        const recipe = await getRecipeDetails(parsedRecipeId);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found." });
        }

        // gets cuisine name from the cuisine id and username from the user id and uses external api to gte image
        const [cuisineName, imageUrl, username] = await Promise.all([
            recipe.CuisineID ? getCuisineNameById(recipe.CuisineID) : Promise.resolve("N/A"),
            getPixabayImages(recipe.Title),
            recipe.UserID ? findUsernameByUserId(recipe.UserID) : Promise.resolve("Recipe Roulette")
        ]);

        console.log("image url is: " + imageUrl)
        recipe.cuisineName = cuisineName || "N/A";
        recipe.imageUrl = imageUrl;
        recipe.Username = username || "Recipe Roulette";

        // the final recipe data is sent
        console.log("Final Recipe Data with imageUrl:", recipe); 
        res.status(200).json({ data: recipe, imageUrl: imageUrl });
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};


/**
 * Controller to handle searching recipes based on a search query.
 * @param {Object} req - The request object containing the search query.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with the search results or error details.
 */
const searchRecipesController = async (req, res) => {
    const { searchQuery } = req.query;

    // stringifies the search query
    console.log(`Received search query: ${JSON.stringify(searchQuery)}`);

    // gets the cuisine, dietary preference and query from the search query received
    const cuisine = searchQuery.cuisine
    const dietaryPreference = searchQuery.dietaryPreference
    const query = searchQuery.searchQuery


    try {
        // checks for authorization and validity
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token missing or malformed.' });
        }

        // gets token and uses helper function to get user id
        const token = authHeader.split(' ')[1];
        const userId = getUserIdFromToken(token);

        if (!userId) {
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }

        // searches for the recipes according to query
        const recipes = await searchRecipes(query.trim());

        // filters the recipe if they match the cuisine and dietary preference
        const filteredRecipes = recipes.filter((recipe) => {
            

            const matchesCuisine = cuisine && cuisine != 0 ? recipe.CuisineID == cuisine : true;
            const matchesDietary = dietaryPreference && dietaryPreference != 'All'
              ? recipe.DietaryPreferences.trim() == dietaryPreference.trim()
              : true;

            return matchesCuisine && matchesDietary;
          });

          // gets the cuisine name and pixabay image
        const enhancedRecipes = await Promise.all(filteredRecipes.map(async (recipe) => {
            const [cuisineName, imageUrl] = await Promise.all([
                getCuisineNameById(recipe.CuisineID),
                getPixabayImages(recipe.Title)
            ]);

            // gets the username
            const username = recipe.UserID ? await findUsernameByUserId(recipe.UserID) : "Recipe Roulette";

            // returns the data
            return {
                ...recipe.toJSON(),
                cuisineName: cuisineName,
                imageUrl: imageUrl || '/path/to/default/image.jpg',
                Username: username
            };
        }));

        res.status(200).json({ data: enhancedRecipes });
    } catch (error) {
        console.error("Error searching recipes:", error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

// exports the modules
module.exports = {
    createRecipeController,
    getRecipesByCriteriaController,
    getRecipesByUserController,
    getRecipeDetailsController,
    searchRecipesController
};
