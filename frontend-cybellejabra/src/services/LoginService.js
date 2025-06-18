import http from "../http-common";

/**
 * Sends a POST request to register a new user.
 * 
 * @async
 * @function register
 * @param {Object} userData - An object containing the user's registration data.
 * @param {string} userData.username - The username of the user.
 * @param {string} userData.password - The password of the user.
 * @param {string} userData.email - The email address of the user.
 * @returns {Promise<Object>} - A promise that resolves to the server's response upon successful registration.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const register = (userData) => {
    console.log("Registering user with data:", userData);

    // make HTTP request to endpoint 
    return http.post("/register", userData); 
};

/**
 * Sends a POST request to log in a user.
 * 
 * @async
 * @function login
 * @param {Object} userData - An object containing the user's login credentials.
 * @param {string} userData.username - The username of the user.
 * @param {string} userData.password - The password of the user.
 * @returns {Promise<Object>} - A promise that resolves to the server's response upon successful login.
 * @throws {Error} - Throws an error if the HTTP request fails.
 */
const login = (userData) => {

    // make HTTP request to endpoint 
    return http.post("/login", userData); 
};

export default {
    register,
    login,
};
