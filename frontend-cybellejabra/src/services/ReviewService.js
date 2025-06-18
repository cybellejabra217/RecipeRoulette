import http from "../http-common";
import { getTokenBearer } from "../utils/Utils";

/**
 * Sends a POST request to create a new review for a recipe.
 * 
 * @async
 * @function createReview
 * @param {Object} reviewData - An object containing the review details to be created.
 * @param {string} reviewData.username - The username of the person creating the review.
 * @param {string} reviewData.recipeId - The ID of the recipe being reviewed.
 * @param {number} reviewData.rating - The rating given to the recipe (usually from 1 to 5).
 * @param {string} reviewData.comment - The textual comment of the review.
 * @returns {Promise<Object>} - A promise that resolves to the server's response with the created review data.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const createReview = async (reviewData) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.post(`/createReview`, reviewData, {
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
 * Sends a GET request to retrieve all reviews for a specific recipe.
 * 
 * @async
 * @function getReviewsByRecipeId
 * @param {string} recipeId - The ID of the recipe for which reviews are to be fetched.
 * @returns {Promise<Array>} - A promise that resolves to an array of reviews for the specified recipe.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const getReviewsByRecipeId = async (recipeId) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.get(`/getReviewsByRecipe/${recipeId}`, {
            headers: {
                Authorization: getTokenBearer()
            }
        });
        console.log("reviews: ", result.data);
        return result.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};

/**
 * Sends a GET request to retrieve all reviews submitted by a specific user.
 * 
 * @async
 * @function getReviewsByUser
 * @param {string} username - The username of the user whose reviews are to be fetched.
 * @returns {Promise<Array>} - A promise that resolves to an array of reviews submitted by the specified user.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const getReviewsByUser = async (username) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.get(`/getReviewsByUser/${username}`, {
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
 * Sends a POST request to delete a specific review.
 * 
 * @async
 * @function deleteReview
 * @param {string} reviewId - The ID of the review to be deleted.
 * @param {string} recipeId - The ID of the recipe to which the review belongs.
 * @returns {Promise<string>} - A promise that resolves to a success message confirming the review deletion.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const deleteReview = async (reviewId, recipeId) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.post(`/deleteReview/${reviewId}/${recipeId}`,{}, {
            headers: {
                Authorization: getTokenBearer()
            }
        });
        return result.data.message;  
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};

const ReviewService = {
    createReview,
    getReviewsByRecipeId,
    getReviewsByUser,
    deleteReview
};

export default ReviewService;
