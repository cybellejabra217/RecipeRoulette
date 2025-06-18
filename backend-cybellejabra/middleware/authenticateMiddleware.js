
const jwt = require('jsonwebtoken');

/**
 * Middleware function to authenticate the JWT token in the request.
 * It checks the presence and validity of the token from the Authorization header.
 * @param {Object} req - The request object, which contains the incoming HTTP request.
 * @param {Object} res - The response object, used to send the response back to the client.
 * @param {Function} next - The next middleware function to be executed if authentication is successful.
 * @returns {void}
 * @throws {Error} - Responds with an error message if the token is missing, invalid, or expired.
 */
const authenticateJWT = (req, res, next) => {
    
    // retrives the authentication header
    const authHeader = req.headers.authorization;
    console.log(`Authentication Header: ${authHeader}`);

    // if retrieved
    if (authHeader) {

        // checks for token extracted and checks for validity
        const token = authHeader.split(' ')[1];
        console.log(`Token extracted: ${token}`);

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(403).json({ error: "Invalid token." });
            }

            req.user = user;
            next();
        });
    } else {

        // else it is undefined
        console.log("Authentication Header: undefined");
        res.status(401).json({ error: "Authorization header missing or malformed." });
    }
};

module.exports = authenticateJWT;
