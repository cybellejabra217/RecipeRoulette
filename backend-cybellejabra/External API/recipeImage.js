const axios = require('axios');

/**
 * Fetches an image from Pixabay based on the provided search query.
 * It sends a request to the Pixabay API to search for relevant images.
 * @param {string} query - The search term (e.g., recipe name or ingredient) to fetch an image for.
 * @returns {string|null} - Returns the URL of the first image found, or null if no images are found.
 *                           If an error occurs, it returns the path to a default image.
 */
const getPixabayImages = async (query) => {
  const apiKey = '43955200-5a24d9cb7bbebf682d3f5634a'; // api key
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo`; // url for request

  try {
    // sends the request
    const response = await axios.get(url);
    if (response.data.hits.length > 0) {
      // retrieve very first picture
      return response.data.hits[0].webformatURL; 
    } else {
      return null; 
    }
  } catch (error) {
    // otherwise, return path to a default image
    console.error('Error fetching images from Pixabay:', error.message);
    return '/path/to/default/image.jpg'; 
    }
};

module.exports = {
  getPixabayImages,
};
