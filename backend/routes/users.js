// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/residents:
 *   get:
 *     summary: Get list of residents (Treasurer/Secretary only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of residents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Treasurer or Secretary can get list of residents
router.get('/residents', protect, authorizeRoles('treasurer', 'secretary'), async (req, res) => {
  try {
    const residents = await User.find({ role: 'resident' }).select('-password');
    res.json(residents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;