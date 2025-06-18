const User = require('../Models/user');
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');
const moment = require('moment');

// utility function to validate email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Service: Register a New User
 * 
 * Registers a new user in the system by validating the input, ensuring unique username and email,
 * hashing the password for security, and storing the user's data in the database.
 * 
 * @param {string} username - The desired username for the new user. Must be non-empty.
 * @param {string} password - The password for the new user. Must be non-empty.
 * @param {string} confirmPassword - Re-entered password for confirmation. Must match `password`.
 * @param {string} email - The user's email address. Must be a valid format and unique.
 * 
 * @throws {Error} If any validation fails, such as missing input, mismatched passwords, invalid email,
 * or duplicate username/email.
 * 
 * @returns {number} The unique ID of the newly registered user.
 */
const registerUser = async (username, password, confirmPassword, email) => {

    // validates username, email and password
    if (!username?.trim()) throw new Error("Username is required");

    if (!email?.trim() || !isValidEmail(email)) throw new Error("A valid email address is required");

    if (!password?.trim()) throw new Error("Password is required");

    // checks if password and confirm password match
    if (password !== confirmPassword) throw new Error("Passwords do not match");

    try {
        // finds existing user (if any)
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { Username: username.trim() },
                    { Email: email.trim() }
                ]
            }
        });

        // if existing user found, throws error
        if (existingUser) throw new Error("User with the given username or email already exists");

        // hashes the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // creates new user and adds to database
        const newUser = await User.create({
            Username: username.trim(),
            Password: hashedPassword,
            Email: email.trim(),
            JoinDate: moment().format('YYYY-MM-DD')
        });

        return newUser.UserID;
    } catch (error) {
        console.error("Error in registering user:", { username, email, error: error.message });
        throw new Error("Failed to register user");
    }
};

/**
 * Service: Log in a User
 * 
 * Authenticates a user by validating the input, finding the user in the database by username,
 * and comparing the provided password with the stored hashed password.
 * 
 * @param {string} username - The username of the user trying to log in. Must be non-empty.
 * @param {string} password - The password of the user trying to log in. Must be non-empty.
 * 
 * @throws {Error} If the username or password is missing, or if the credentials are invalid (user not found or password mismatch).
 * 
 * @returns {Object} An object containing a success message and the user's unique ID.
 * 
 */
const loginUser = async (username, password) => {

    // validates username and password
    if (!username?.trim()) throw new Error("Username is required");
    if (!password?.trim()) throw new Error("Password is required");

    try {
        // finds user according to username
        const user = await User.findOne({ where: { Username: username.trim() } });

        // compares the passwords of user found and the inputted password (removes hashing for comparison)
        if (!user || !(await bcrypt.compare(password, user.Password))) {
            throw new Error("Invalid credentials");
        }

        return {

            // if match, logs in successfully
            message: "Logged in successfully!",
            userId: user.UserID
        };
    } catch (error) {
        console.error("Error in logging in user:", { username, error: error.message });
        throw new Error("Failed to log in user");
    }
};

module.exports = {
    registerUser,
    loginUser
};
