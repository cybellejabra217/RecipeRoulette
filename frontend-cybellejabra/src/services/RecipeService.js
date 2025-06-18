
import http from "../http-common";
import { getTokenBearer } from "../utils/Utils";

/**
 * Sends a POST request to create a new recipe.
 * 
 * @async
 * @function createRecipe
 * @param {Object} recipeData - An object containing the recipe details to be created.
 * @param {string} recipeData.name - The name of the recipe.
 * @param {string} recipeData.ingredients - The ingredients required for the recipe.
 * @param {string} recipeData.instructions - The cooking instructions for the recipe.
 * @param {string} recipeData.cuisineId - The ID of the cuisine associated with the recipe.
 * @returns {Promise<Object>} - A promise that resolves to the server's response with the created recipe data.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const createRecipe = async (recipeData) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.post(`/createRecipe`, recipeData, {
            headers: {
                Authorization: getTokenBearer()
            }
        });
        return result.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};


/**
 * Sends a GET request to retrieve recipes by specific criteria.
 * 
 * @async
 * @function getRecipesByCriteria
 * @param {Object} criteria - An object containing the criteria for filtering recipes.
 * @param {string} [criteria.cuisineId] - The ID of the cuisine to filter recipes by.
 * @param {string} [criteria.diet] - The diet type (e.g., vegan, vegetarian) to filter recipes by.
 * @param {string} [criteria.prepTime] - The preparation time to filter recipes by.
 * @returns {Promise<Array>} - A promise that resolves to an array of recipes matching the given criteria.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const getRecipesByCriteria = async (criteria) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.get(`/recipesByCriteria`, {
            headers: {
                Authorization: getTokenBearer()
            },
            params: criteria
        });
        return result.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};


/**
 * Sends a GET request to retrieve recipes submitted by a specific user.
 * 
 * @async
 * @function getRecipesByUser
 * @param {string} username - The username of the user whose recipes are to be retrieved.
 * @returns {Promise<Array>} - A promise that resolves to an array of recipes submitted by the user.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const getRecipesByUser = async (username) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.get(`/recipesByUser/${username}`, {
            headers: {
                Authorization: getTokenBearer()
            }
        });
        return result.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};


/**
 * Sends a GET request to retrieve details of a specific recipe.
 * 
 * @async
 * @function getRecipeDetails
 * @param {string} recipeId - The ID of the recipe whose details are to be retrieved.
 * @returns {Promise<Object>} - A promise that resolves to the details of the specified recipe.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const getRecipeDetails = async (recipeId) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.get(`/recipedetails`, {
            headers: {
                Authorization: getTokenBearer()
            },
            params: { recipeId }
        });
        return result.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};


/**
 * Sends a GET request to search for recipes based on a query string.
 * 
 * @async
 * @function search
 * @param {string} searchQuery - The search query to filter recipes.
 * @returns {Promise<Array>} - A promise that resolves to an array of recipes matching the search query.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const search = async (searchQuery) => {
    try {
        
        // make HTTP request to endpoint with authorization
        const result = await http.get(`/searchRecipes`, {
            headers: {
                Authorization: getTokenBearer()
            },
            params: { searchQuery }
        });
        console.log(result.data.data);
        return result.data.data;
        } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};

const RecipeService = {
    createRecipe,
    getRecipesByCriteria,
    getRecipesByUser,
    getRecipeDetails,
    search
};

export default RecipeService;
