/**
 * @swagger
 * tags:
 *   - name: Cuisine
 *     description: API endpoints related to cuisines
 */

const express = require('express');
const router = express.Router();
const {
    getCuisinesController,
    getCuisineIdByNameController,
    getCuisineNameByIdController,
} = require('../Controllers/CuisineController');

const authenticateJWT = require('../middleware/authenticateMiddleware'); 

/**
 * @swagger
 * /getCuisineIdByName/{cuisineName}:
 *   get:
 *     tags:
 *       - Cuisine
 *     summary: Get cuisine ID by name
 *     description: Retrieve the ID of a cuisine by its name.
 *     parameters:
 *       - name: cuisineName
 *         in: path
 *         required: true
 *         description: The name of the cuisine.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the cuisine ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cuisineId:
 *                   type: integer
 *       400:
 *         description: A valid cuisine name is required.
 *       404:
 *         description: Cuisine not found.
 *       500:
 *         description: Error fetching cuisine ID.
 */
router.get('/getCuisineIdByName/:cuisineName', authenticateJWT, getCuisineIdByNameController);

/**
 * @swagger
 * /getCuisineNameById/{cuisineId}:
 *   get:
 *     tags:
 *       - Cuisine
 *     summary: Get cuisine name by ID
 *     description: Retrieve the name of a cuisine by its ID.
 *     parameters:
 *       - name: cuisineId
 *         in: path
 *         required: true
 *         description: The ID of the cuisine.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved the cuisine name.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cuisineName:
 *                   type: string
 *       400:
 *         description: A valid cuisine ID is required.
 *       404:
 *         description: Cuisine not found.
 *       500:
 *         description: Error fetching cuisine name.
 */
router.get('/getCuisineNameById/:cuisineId', authenticateJWT, getCuisineNameByIdController);

/**
 * @swagger
 * /getAllCuisines:
 *   get:
 *     tags:
 *       - Cuisine
 *     summary: Get all cuisines
 *     description: Retrieve a list of all available cuisines.
 *     responses:
 *       200:
 *         description: A list of cuisines.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cuisineId:
 *                     type: integer
 *                   cuisineName:
 *                     type: string
 *       500:
 *         description: Error retrieving cuisines.
 */
router.get('/getAllCuisines', authenticateJWT, getCuisinesController);

module.exports = router;
