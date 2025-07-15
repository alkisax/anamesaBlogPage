const express = require('express');
const router = express.Router();
const upload = require('../services/multer.service');
const uploadController = require('../controllers/upload.controller');

/**
 * @swagger
 * /api/uploads:
 *   get:
 *     summary: Get all uploaded files
 *     tags: [Uploads]
 *     responses:
 *       200:
 *         description: A list of uploaded files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Upload'
 *       500:
 *         description: Server error
 */
router.get('/', uploadController.renderUploadPage);

/**
 * @swagger
 * /api/uploads:
 *   post:
 *     summary: Upload a new file
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               image:
 *                 type: file
 *                 format: binary
 *     responses:
 *       200:
 *         description: file uploaded successfully
 *       500:
 *         description: Upload failed
 */
router.post('/', upload.single('image'), uploadController.uploadFile);

module.exports = router;
