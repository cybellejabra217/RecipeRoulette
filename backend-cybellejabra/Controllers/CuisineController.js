const { getCuisines, getCuisineIdByName, getCuisineNameById } = require("../Services/CuisineService");

/**
 * Retrieves all available cuisines.
 * It uses the `getCuisines` service to fetch a list of cuisines.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - A JSON response containing the cuisines or an error message.
 */
const getCuisinesController = async (req, res) => {
    try {

        // fetches the cuisines using the service getCuisines
        const cuisines = await getCuisines();
        res.status(200).json({ data: cuisines });
    } catch (error) {

        // catches error
        console.error('Error in getCuisinesController:', error);
        res.status(500).json({ error: "Error fetching cuisines" });
    }
};

/**
 * Retrieves the cuisine ID based on the cuisine name.
 * It uses the `getCuisineIdByName` service to fetch the cuisine ID.
 * @param {Object} req - The request object, with a `cuisineName` parameter in the URL.
 * @param {Object} res - The response object.
 * @returns {Object} - A JSON response containing the cuisine ID or an error message.
 */
const getCuisineIdByNameController = async (req, res) => {
    const { cuisineName } = req.params;
    
    // validates cuisine name
    if (typeof cuisineName !== 'string' || !cuisineName.trim()) {
        return res.status(400).json({ error: 'A valid cuisine name is required.' });
    }

    try {

        // uses getCuisineIdByName service to fetch the cuisine id
        const cuisineId = await getCuisineIdByName(cuisineName.trim());
        res.status(200).json({ data: { cuisineId } });
    } catch (error) {
        if (error.message.includes("not found")) {
            res.status(404).json({ error: "Cuisine not found" });
        } else {
            console.error('Error in getCuisineIdByNameController:', error);
            res.status(500).json({ error: `Error fetching cuisine ID: ${error.message}` });
        }
    }
};

/**
 * Retrieves the cuisine name based on the cuisine ID.
 * It uses the `getCuisineNameById` service to fetch the cuisine name.
 * @param {Object} req - The request object, with a `cuisineId` parameter in the URL.
 * @param {Object} res - The response object.
 * @returns {Object} - A JSON response containing the cuisine name or an error message.
 */
const getCuisineNameByIdController = async (req, res) => {
    const { cuisineId } = req.params;

    // parses the id
    const parsedId = parseInt(cuisineId, 10);

    // checks if it is not a number or less than 0
    if (isNaN(parsedId) || parsedId <= 0) {

        // returns error
        return res.status(400).json({ error: 'A valid cuisine ID is required.' });
    }

    try {

        // else we use service getCuisineNameById to fetch the cuisine name
        const cuisineName = await getCuisineNameById(parsedId);
        res.status(200).json({ data: { cuisineName } });
    } catch (error) {
        if (error.message.includes("Cuisine not found")) {
            res.status(404).json({ error: "Cuisine not found" });
        } else {
            console.error('Error in getCuisineNameByIdController:', error);
            res.status(500).json({ error: `Error retrieving cuisine name: ${error.message}` });
        }
    }
};

module.exports = {
    getCuisinesController,
    getCuisineIdByNameController,
    getCuisineNameByIdController
};
