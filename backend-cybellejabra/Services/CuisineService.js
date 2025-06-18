const Cuisine = require('../Models/cuisine');

/**
 * Retrieves all cuisines from the database.
 * @returns {Promise<Array>} An array of cuisine records.
 * @throws {Error} If there is a failure while fetching cuisines.
 */
const getCuisines = async () => {
    try {

        // uses find all to retrieve all cuisines from database
        const cuisines = await Cuisine.findAll();

        // returns the fetched cuisines
        return cuisines;
    } catch (error) {

        // throws error
        console.error("Error fetching all cuisines:", error);
        throw new Error('Failed to retrieve cuisines');
    }
};

/**
 * Retrieves the ID of a cuisine based on its name.
 * @param {string} cuisineName - The name of the cuisine.
 * @returns {Promise<number>} The ID of the cuisine.
 * @throws {Error} If the cuisine name is invalid or not found.
 */
const getCuisineIdByName = async (cuisineName) => {

    // checks if received cuisineName is a string and for spacing
    if (typeof cuisineName !== 'string' || !cuisineName.trim()) {
        throw new Error('Invalid cuisine name provided');
    }

    try {
        // uses find one to retrieve specific cuisine id 
        const cuisine = await Cuisine.findOne({
            where: { CuisineName: cuisineName.trim() },
            attributes: ['CuisineID'],
        });

        // throws error if not found
        if (!cuisine) {
            throw new Error(`Cuisine with name "${cuisineName}" not found`);
        }

        // returns the found cuisine id
        return cuisine.CuisineID;
    } catch (error) {
        console.error(`Error fetching cuisine ID for name "${cuisineName}":`, error);
        throw new Error('Failed to fetch cuisine ID by name');
    }
};


/**
 * Retrieves the name of a cuisine based on its ID.
 * @param {number} cuisineId - The ID of the cuisine.
 * @returns {Promise<string>} The name of the cuisine.
 * @throws {Error} If the cuisine ID is invalid or not found.
 */
const getCuisineNameById = async (cuisineId) => {

    // checks if retrieved data is number and not negative
    if (typeof cuisineId !== 'number' || cuisineId <= 0) {
        throw new Error('Invalid cuisine ID provided');
    }

    try {

        // uses find one to retrieve specific cuisine name
        const cuisine = await Cuisine.findOne({
            where: { CuisineID: cuisineId },
            attributes: ['CuisineName'],
        });

        if (!cuisine) {

            // throws errors if not found
            throw new Error(`Cuisine with ID "${cuisineId}" not found`);
        }

        // returns the cuisine name retrieved
        return cuisine.CuisineName;
    } catch (error) {
        console.error(`Error retrieving cuisine name for ID "${cuisineId}":`, error);
        throw new Error('Failed to retrieve cuisine name by ID');
    }
};

module.exports = {
    getCuisines,
    getCuisineIdByName,
    getCuisineNameById,
};
