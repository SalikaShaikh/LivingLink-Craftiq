// routes/visitors.js
const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Visitor:
 *       type: object
 *       required:
 *         - name
 *         - flatNumber
 *         - dateOfVisit
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the visitor
 *         resident:
 *           type: string
 *           description: ID of the resident who added the visitor
 *         name:
 *           type: string
 *           description: Visitor's name
 *         flatNumber:
 *           type: string
 *           description: Flat number to visit
 *         dateOfVisit:
 *           type: string
 *           format: date
 *           description: Date of visit
 *         time:
 *           type: string
 *           description: Time of visit (for security-added visitors)
 *         approved:
 *           type: boolean
 *           description: Whether the visitor is approved
 *         addedBy:
 *           type: string
 *           enum: [resident, security]
 *           description: Who added the visitor
 *         approvedBy:
 *           type: string
 *           description: ID of the security personnel who approved the visitor
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the visitor was added
 */

/**
 * @swagger
 * tags:
 *   name: Visitors
 *   description: Visitor management endpoints
 */

/**
 * @swagger
 * /api/visitors:
 *   post:
 *     summary: Add expected visitor (Resident only)
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - flatNumber
 *               - dateOfVisit
 *             properties:
 *               name:
 *                 type: string
 *               flatNumber:
 *                 type: string
 *               dateOfVisit:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Visitor added for approval
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Resident adds expected visitor (requires approval)
router.post('/', protect, authorizeRoles('resident'), async (req, res) => {
  try {
    const { name, flatNumber, dateOfVisit } = req.body;
    if (!name || !flatNumber || !dateOfVisit) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const visitor = new Visitor({
      resident: req.user._id,
      name,
      flatNumber, // Changed from contactNumber to flatNumber
      dateOfVisit: new Date(dateOfVisit),
      approved: false,
      addedBy: 'resident'
    });
    await visitor.save();
    res.status(201).json({ message: 'Visitor added for approval', visitor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/visitors/security:
 *   post:
 *     summary: Add visitor directly (Security only)
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - flatNumber
 *               - dateOfVisit
 *               - time
 *             properties:
 *               name:
 *                 type: string
 *               flatNumber:
 *                 type: string
 *               dateOfVisit:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Visitor added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Security adds visitor directly (auto-approved)
router.post('/security', protect, authorizeRoles('security'), async (req, res) => {
  try {
    const { name, flatNumber, dateOfVisit, time } = req.body;
    if (!name || !flatNumber || !dateOfVisit || !time) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const visitor = new Visitor({
      name,
      flatNumber,
      dateOfVisit: new Date(dateOfVisit),
      time,
      approved: true, // Auto-approved when added by security
      addedBy: 'security',
      approvedBy: req.user._id // Security user who added the visitor
    });
    await visitor.save();
    res.status(201).json({ message: 'Visitor added successfully', visitor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/visitors/my-visitors:
 *   get:
 *     summary: Get resident's own visitors
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resident's visitors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Visitor'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Resident views their own visitors
router.get('/my-visitors', protect, authorizeRoles('resident'), async (req, res) => {
  try {
    const visitors = await Visitor.find({ resident: req.user._id })
      .sort({ dateOfVisit: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/visitors:
 *   get:
 *     summary: Get all visitors (Security/Secretary only)
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all visitors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Visitor'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Security views all visitors (expected + approved)
router.get('/', protect, authorizeRoles('security','secretary'), async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate('resident', 'name email')
      .populate('approvedBy', 'name')
      .sort({ dateOfVisit: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/visitors/{id}/approve:
 *   put:
 *     summary: Approve visitor (Security only)
 *     tags: [Visitors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Visitor ID
 *     responses:
 *       200:
 *         description: Visitor approved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visitor'
 *       400:
 *         description: Security-added visitors are already approved
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Visitor not found
 *       500:
 *         description: Server error
 */

// Security approves resident's visitor on arrival
router.put('/:id/approve', protect, authorizeRoles('security'), async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    
    // Only approve visitors added by residents (not security)
    if (visitor.addedBy === 'security') {
      return res.status(400).json({ message: 'Security-added visitors are already approved' });
    }
    
    visitor.approved = true;
    visitor.approvedBy = req.user._id;
    await visitor.save();
    res.json({ message: 'Visitor approved', visitor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;