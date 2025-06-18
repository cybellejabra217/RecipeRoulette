
/**
 * Retrieves the JWT token from the local storage.
 * This function looks for the 'token' item in local storage and returns it as a plain string.
 * 
 * @returns {string|null} - The JWT token stored in local storage, or null if not found.
 */
const getToken = () => {
  return localStorage.getItem("token"); // Retrieve as plain string
};

/**
 * Formats the JWT token by adding the 'Bearer' prefix.
 * This function retrieves the token from local storage and, if it exists, formats it as 'Bearer <token>'.
 * If no token is found, it returns an empty string.
 * 
 * @returns {string} - The formatted JWT token as 'Bearer <token>', or an empty string if no token is found.
 */
const getTokenBearer = () => {
  const token = getToken();
  console.log("Retrieved Token:", token);
  return token ? `Bearer ${token}` : "";
};


module.exports = {
    getToken,
    getTokenBearer,
}