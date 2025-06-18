const { registerUser, loginUser } = require("../Services/LoginService");
const { validationResult } = require('express-validator');
const { generateToken } = require('../middleware/jwt');
const { findUserByUsername, findUserByEmail } = require('../Services/UserService');

/**
 * Checks if a user exists based on the username and email.
 * @param {string} username - The username to check.
 * @param {string} email - The email to check.
 * @returns {Object|null} - Returns the user if found by username or email, otherwise null.
 * @throws {Error} - Throws an error if username or email are not provided.
 */
const checkIfUserExists = async (username, email) => {

    // validates username and email
    if (typeof username !== 'string' || !username.trim() || typeof email !== 'string' || !email.trim()) {
        throw new Error('Username and email must be provided.');
    }

    // uses the services findUserByUsername and findUserByEmail to check if user already exists
    const userByUsername = await findUserByUsername(username.trim());
    const userByEmail = await findUserByEmail(email.trim());

    // if found, return username or email of the existing user
    return userByUsername || userByEmail;
};

/**
 * Handles user registration by validating input and calling the `registerUser` service.
 * @param {Object} req - The request object containing the user's details.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with success message or error details.
 */
const registerUserController = async (req, res) => {

    // receives the username password confirmpassword and email
    const { username, password, confirmPassword, email } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    // validates all are inputted (no field left empty)
    if (typeof username !== 'string' || !username.trim() ||
        typeof password !== 'string' || !password.trim() ||
        typeof confirmPassword !== 'string' || !confirmPassword.trim() ||
        typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ message: "All fields (username, password, confirmPassword, email) are required." });
    }

    try {
        
        // checks if user exists already
        const userExists = await checkIfUserExists(username, email);

        // if yes, cannot register
        if (userExists) {
            return res.status(400).json({
                message: "Username or email already exists. Please choose a different one."
            });
        }

        // otherwise register the user
        const userId = await registerUser(username.trim(), password.trim(), confirmPassword.trim(), email.trim());
        res.status(201).json({ userId, message: "User registered successfully!" });

    } catch (error) {
        console.error("Error registering user:", error);

        if (error.message.toLowerCase().includes('passwords do not match')) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        if (error.message.toLowerCase().includes('invalid input')) {
            return res.status(400).json({ message: "Invalid input. Please check your details." });
        }

        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

/**
 * Handles user login by validating input and calling the `loginUser` service.
 * @param {Object} req - The request object containing the login credentials.
 * @param {Object} res - The response object to send the result.
 * @returns {Object} - A JSON response with login success message, user ID, and token or error details.
 */
const loginUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // validates username and password
    if (typeof username !== 'string' || !username.trim() ||
        typeof password !== 'string' || !password.trim()) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {

        // send username and password to loginUser service and get result
        const result = await loginUser(username.trim(), password.trim());

        // if no result, then user doesnt exist
        if (!result) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // otherwise generate json web token
        const token = generateToken({ userId: result.userId, username: username.trim() });
        res.status(200).json({ message: "Login successful!", userId: result.userId, token });

    } catch (error) {
        console.error("Error logging in:", error);

        if (error.message.toLowerCase().includes('invalid credentials')) {
            return res.status(401).json({ message: "Incorrect username or password. Please try again." });
        }

        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};

module.exports = {
    registerUserController,
    loginUserController
};
