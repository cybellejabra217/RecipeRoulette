const express = require('express');
const router = express.Router();
const { registerUserController, loginUserController } = require('../Controllers/LoginController');
const { loginValidation } = require('../Validators/LoginValidator');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: API endpoints related to user authentication (register, login)
 */

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Create a new user by providing a username, password, confirmPassword, and email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request. User already exists or invalid input.
 *       500:
 *         description: Internal server error.
 */
router.post('/register', loginValidation, registerUserController);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log in an existing user
 *     description: Authenticate a user by providing their username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful and returns the authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: integer
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request. Invalid credentials or missing fields.
 *       401:
 *         description: Unauthorized. Incorrect username or password.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/login', loginUserController);

module.exports = router;
