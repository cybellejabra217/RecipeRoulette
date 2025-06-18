import http from "../http-common";
import { getTokenBearer } from "../utils/Utils";

/**
 * Sends a POST request to update the user's bio.
 * 
 * @async
 * @function updateUserBio
 * @param {string} newBio - The new bio to be set for the user.
 * @returns {Promise<Object>} - A promise that resolves to the server's response containing the updated bio data.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const updateUserBio = async (newBio) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.post(`/updateUserBio`, { newBio }, {
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
 * Sends a POST request to retrieve the current user's profile by user ID.
 * 
 * @async
 * @function getUser
 * @param {string} id - The ID of the user whose profile is to be fetched.
 * @returns {Promise<Object>} - A promise that resolves to the user's profile data.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const getUser = async (id) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.post(`/myProfile`,{ id }, {
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
 * Sends a GET request to retrieve a user's profile by username.
 * 
 * @async
 * @function getUserByUsername
 * @param {string} username - The username of the user whose profile is to be fetched.
 * @returns {Promise<Object>} - A promise that resolves to the user's profile data.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const getUserByUsername = async (username) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.get(`/getUserByUsername/${username}`, {
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
 * Sends a GET request to retrieve the user's join date by username.
 * 
 * @async
 * @function getUserJoinDate
 * @param {string} username - The username of the user whose join date is to be fetched.
 * @returns {Promise<string>} - A promise that resolves to the user's join date.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const getUserJoinDate = async (username) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.get(`/getUserJoinDate/${username}`, {
            headers: {
                Authorization: getTokenBearer()
            }
        });
        return result.data.joinDate;  
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};

/**
 * Sends a GET request to retrieve the user's bio by username.
 * 
 * @async
 * @function getUserBio
 * @param {string} username - The username of the user whose bio is to be fetched.
 * @returns {Promise<string>} - A promise that resolves to the user's bio.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const getUserBio = async (username) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.get(`/getUserBio/${username}`, {
            headers: {
                Authorization: getTokenBearer()
            }
        });
        return result.data.bio;  
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};


/**
 * Sends a POST request to generate text based on a question using AI.
 * 
 * @async
 * @function generateText
 * @param {string} question - The question for which AI-generated text is to be retrieved.
 * @returns {Promise<string>} - A promise that resolves to the generated text from the AI.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const generateText = async (question) => {
    try {

        // make HTTP request to endpoint with authorization
        const result = await http.post(`/generateText`, { question }, {
            headers: {
                Authorization: getTokenBearer()
            }
        });

        return result.data.message;
        } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};

const UserService = {
    updateUserBio,
    getUserByUsername,
    getUserJoinDate,
    getUserBio,
    getUser,
    generateText
};

export default UserService;
