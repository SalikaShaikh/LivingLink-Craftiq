// routes/notices.js
const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Notice:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the notice
 *         title:
 *           type: string
 *           description: The notice title
 *         content:
 *           type: string
 *           description: The notice content
 *         postedBy:
 *           type: string
 *           description: ID of the user who posted the notice
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the notice was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the notice was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Notices
 *   description: Notice management endpoints
 */

/**
 * @swagger
 * /api/notices:
 *   get:
 *     summary: Get all notices
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of notices to return
 *     responses:
 *       200:
 *         description: List of notices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notice'
 *       500:
 *         description: Server error
 */
router.get('/', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    let query = Notice.find().sort({ createdAt: -1 });
    
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    const notices = await query;
    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/notices:
 *   post:
 *     summary: Create a new notice (Secretary only)
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notice'
 *       400:
 *         description: Bad request - missing title or content
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', protect, authorizeRoles('secretary'), async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content required' });
    const notice = new Notice({ title, content, postedBy: req.user._id });
    await notice.save();
    res.status(201).json({ message: 'Notice posted', notice });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;