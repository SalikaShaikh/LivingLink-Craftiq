// backend/routes/complaints.js
const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Complaint:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the complaint
 *         content:
 *           type: string
 *           description: The complaint content
 *         anonymous:
 *           type: boolean
 *           description: Whether the complaint is anonymous
 *         submittedBy:
 *           type: string
 *           description: ID of the resident who submitted the complaint
 *         status:
 *           type: string
 *           enum: [pending, ongoing, done]
 *           description: The status of the complaint
 *         updatedBy:
 *           type: string
 *           description: ID of the user who updated the complaint status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the complaint was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the complaint was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Complaint management endpoints
 */

/**
 * @swagger
 * /api/complaints:
 *   post:
 *     summary: Submit an anonymous complaint (Resident only)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Complaint submitted anonymously
 *       400:
 *         description: Bad request - content required
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Resident submits complaint anonymously
router.post('/', protect, authorizeRoles('resident'), async (req, res) => {
  try {
    console.log('User making complaint:', req.user);
    
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Complaint content required' });
    
    const complaint = new Complaint({
      content,
      anonymous: true,
      submittedBy: req.user._id,
      status: 'pending',
    });
    
    await complaint.save();
    res.status(201).json({ message: 'Complaint submitted anonymously' });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/complaints:
 *   get:
 *     summary: Get complaints (role-based access)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaints based on user role
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Complaint'
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */

// Get complaints - different access based on role
router.get('/', protect, async (req, res) => {
  try {
    console.log('User requesting complaints:', req.user);
    console.log('User role:', req.user.role);
    console.log('User ID:', req.user._id);
    console.log('User ID type:', typeof req.user._id);
    
    if (req.user.role === 'resident') {
      // Ensure we're using the correct ID format for querying
      let userId;
      try {
        // Try to convert to ObjectId if it's a string
        userId = mongoose.Types.ObjectId.isValid(req.user._id) 
          ? new mongoose.Types.ObjectId(req.user._id) 
          : req.user._id;
      } catch (error) {
        userId = req.user._id; // Use as-is if conversion fails
      }
      
      console.log('Querying with user ID:', userId);
      
      // Residents see only their own complaints
      const complaints = await Complaint.find({ submittedBy: userId }).sort({ createdAt: -1 });
      console.log('Found complaints for resident:', complaints.length);
      
      res.json(complaints);
    } else if (req.user.role === 'secretary' || req.user.role === 'security') {
      // Secretary and Security see all complaints (anonymous)
      const complaints = await Complaint.find().sort({ createdAt: -1 });
      console.log('All complaints for admin:', complaints.length);
      
      // Remove submittedBy info for anonymity
      const anonymousComplaints = complaints.map(c => ({
        _id: c._id,
        content: c.content,
        status: c.status,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        updatedBy: c.updatedBy,
      }));
      res.json(anonymousComplaints);
    } else {
      console.log('Access denied: Invalid user role', req.user.role);
      res.status(403).json({ message: 'Access denied. Invalid user role.' });
    }
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a debug endpoint to check what's happening
router.get('/debug', protect, async (req, res) => {
  try {
    console.log('=== DEBUG START ===');
    console.log('User from token:', req.user);
    console.log('User ID:', req.user._id);
    console.log('User role:', req.user.role);
    
    // Check all complaints in database
    const allComplaints = await Complaint.find().populate('submittedBy', 'name email');
    console.log('All complaints in DB:', allComplaints.length);
    
    // Check complaints for this specific user
    let userId;
    try {
      userId = mongoose.Types.ObjectId.isValid(req.user._id) 
        ? new mongoose.Types.ObjectId(req.user._id) 
        : req.user._id;
    } catch (error) {
      userId = req.user._id;
    }
    
    const userComplaints = await Complaint.find({ submittedBy: userId });
    console.log('Complaints for this user:', userComplaints.length);
    
    console.log('=== DEBUG END ===');
    
    res.json({
      userFromToken: req.user,
      allComplaintsCount: allComplaints.length,
      userComplaintsCount: userComplaints.length,
      userComplaints: userComplaints
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: 'Debug error', error: error.message });
  }
});

/**
 * @swagger
 * /api/complaints/{id}:
 *   put:
 *     summary: Update complaint status (Secretary/Security only)
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, ongoing, done]
 *     responses:
 *       200:
 *         description: Complaint status updated
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Server error
 */

// Secretary and Security update complaint status
router.put('/:id', protect, authorizeRoles('secretary', 'security'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'ongoing', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    
    complaint.status = status;
    complaint.updatedBy = req.user._id;
    await complaint.save();
    
    res.json({ message: 'Complaint status updated', complaint });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;