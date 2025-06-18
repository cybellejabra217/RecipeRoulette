const express = require('express');
const router = express.Router();
const {
    userProfileController,
    updateUserBioController,
    viewUserProfileController,
    getUserByUsernameController,
    getUserJoinDateController,
    getUserBioController,
    generateText
} = require('../Controllers/UserController');

const authenticateJWT = require('../middleware/authenticateMiddleware');

/**
 * @swagger
 * /myProfile:
 *   post:
 *     summary: Get the logged-in user's profile
 *     description: Fetch the user's profile, including recipes and reviews.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully fetched user profile
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal server error
 */
router.post('/myProfile', authenticateJWT, userProfileController);

/**
 * @swagger
 * /userProfile/{username}:
 *   get:
 *     summary: Get another user's profile by username
 *     description: Fetch a user's profile, including their recipes and reviews.
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user whose profile is being fetched
 *         schema:
 *           type: string
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully fetched user profile
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/userProfile/:username', authenticateJWT, viewUserProfileController);

/**
 * @swagger
 * /updateUserBio:
 *   post:
 *     summary: Update user's bio
 *     description: Update the logged-in user's bio.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully updated user bio
 *       401:
 *         description: Unauthorized, invalid token
 *       400:
 *         description: Bad request, missing or invalid bio
 *       500:
 *         description: Internal server error
 */
router.post('/updateUserBio', authenticateJWT, updateUserBioController);

/**
 * @swagger
 * /getUserByUsername/{username}:
 *   get:
 *     summary: Get a user by username
 *     description: Fetch basic details of a user by their username.
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user
 *         schema:
 *           type: string
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully fetched user data
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/getUserByUsername/:username', authenticateJWT, getUserByUsernameController);

/**
 * @swagger
 * /getUserJoinDate/{username}:
 *   get:
 *     summary: Get a user's join date by username
 *     description: Fetch the join date of a user by their username.
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user
 *         schema:
 *           type: string
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully fetched join date
 *       404:
 *         description: Join date not found
 *       500:
 *         description: Internal server error
 */
router.get('/getUserJoinDate/:username', authenticateJWT, getUserJoinDateController);

/**
 * @swagger
 * /getUserBio/{username}:
 *   get:
 *     summary: Get a user's bio by username
 *     description: Fetch the bio of a user by their username.
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user
 *         schema:
 *           type: string
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully fetched bio
 *       404:
 *         description: Bio not found
 *       500:
 *         description: Internal server error
 */
router.get('/getUserBio/:username', authenticateJWT, getUserBioController);

/**
 * @swagger
 * /generateText:
 *   post:
 *     summary: Generate text using Hugging Face API
 *     description: Generate a response to a question using the Meta Llama model from Hugging Face.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question to ask the model
 *                 example: "What is the capital of France?"
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully generated text
 *       500:
 *         description: Internal server error
 */
router.post('/generateText', authenticateJWT, generateText);

module.exports = router;
