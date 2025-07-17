const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication for admin endpoints
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: alkisax
 *                 default: alkisax
 *               password:
 *                 type: string
 *                 example: 123
 *                 default: 123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing or invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authController.login)

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth login callback
 *     tags: [Auth]
 *     description: Handles the OAuth callback from Google. Redirects to frontend with token on success, or with an error on failure.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The authorization code returned from Google
 *     responses:
 *       302:
 *         description: Redirect to frontend with token and email on success
 *         headers:
 *           Location:
 *             description: Redirect URL including token and email query params
 *             schema:
 *               type: string
 *       400:
 *         description: Missing authorization code from Google
 *       401:
 *         description: Email not found in database (user not registered)
 */
router.get('/google/callback', authController.googleLogin)

module.exports = router


// https://accounts.google.com/o/oauth2/auth?client_id={apo_to_google}&redirect_uri={apo_to_google}&response_type={apo_to_auth.service}&scope=email%20profile&access_type=offline

// αυτό είναι του combined app
//https://accounts.google.com/o/oauth2/auth?client_id=37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/login/google/callback&response_type=code&scope=email%20profile&access_type=offline
