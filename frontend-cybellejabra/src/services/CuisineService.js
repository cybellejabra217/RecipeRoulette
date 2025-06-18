import http from "../http-common";
import { getTokenBearer } from "../utils/Utils";

/**
 * Sends a GET request to the backend to fetch all available cuisines.
 * 
 * @async
 * @function getCuisines
 * @returns {Promise<Object>} - A promise that resolves to the data containing all cuisines from the backend.
 * @throws {Error} - Throws an error if the HTTP request fails or if the response contains an error message.
 * The error message will be from either the backend response or the request itself.
 */
const getCuisines = async () => {
    try {
        // make HTTP request to endpoint 
        const result = await http.get(`/getAllCuisines`, {
            headers: {
                Authorization: getTokenBearer()
            }
        });

        // returns the data
        return result.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.error : error.message);
    }
};


const CuisineService = {
    getCuisines
};

export default CuisineService;
