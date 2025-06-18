const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); 

// import jwt secret and expiry from .env
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Generates a JWT token based on the provided payload.
 * @param {Object} payload - The data to be included in the JWT token.
 * @returns {string} - The generated JWT token.
 * @throws {Error} - If the token cannot be generated due to an invalid payload or missing environment variables.
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifies the validity of the provided JWT token.
 * @param {string} token - The JWT token to be verified.
 * @returns {Object} - The decoded token data if the token is valid.
 * @throws {Error} - If the token is expired, invalid, or any other error occurs during verification.
 */
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Token is invalid');
        } else {
            throw new Error('Invalid or expired token');
        }
    }
};

module.exports = {
    generateToken,
    verifyToken,
};
