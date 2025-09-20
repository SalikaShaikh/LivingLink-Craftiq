// routes/maintenance.js
const express = require('express');
const router = express.Router();
const MaintenanceRequest = require('../models/MaintenanceRequest');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     MaintenanceRequest:
 *       type: object
 *       required:
 *         - category
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the maintenance request
 *         resident:
 *           type: string
 *           description: ID of the resident who submitted the request
 *         category:
 *           type: string
 *           enum: [electrician, plumber, carpenter, cleaner]
 *           description: The category of maintenance
 *         description:
 *           type: string
 *           description: Description of the maintenance issue
 *         status:
 *           type: string
 *           enum: [pending, ongoing, done]
 *           description: The status of the request
 *         updatedBy:
 *           type: string
 *           description: ID of the maintenance staff who updated the status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the request was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the request was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Maintenance request management endpoints
 */

/**
 * @swagger
 * /api/maintenance:
 *   post:
 *     summary: Submit a maintenance request (Resident only)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - description
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [electrician, plumber, carpenter, cleaner]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Maintenance request submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceRequest'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Resident submits maintenance request
router.post('/', protect, authorizeRoles('resident'), async (req, res) => {
  try {
    const { category, description } = req.body;
    if (!category || !description) return res.status(400).json({ message: 'Category and description required' });
    if (!['electrician', 'plumber', 'carpenter', 'cleaner'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    const request = new MaintenanceRequest({
      resident: req.user._id,
      category,
      description,
      status: 'pending',
    });
    await request.save();
    res.status(201).json({ message: 'Maintenance request submitted', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/maintenance/my-requests:
 *   get:
 *     summary: Get resident's own maintenance requests
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resident's maintenance requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MaintenanceRequest'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Resident views their own maintenance requests
router.get('/my-requests', protect, authorizeRoles('resident'), async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ resident: req.user._id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/maintenance:
 *   get:
 *     summary: Get all maintenance requests (Maintenance staff only)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all maintenance requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MaintenanceRequest'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Maintenance staff views all requests
router.get('/', protect, authorizeRoles('maintenance'), async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate('resident', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/maintenance/{id}/status:
 *   put:
 *     summary: Update maintenance request status (Maintenance staff only)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance request ID
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
 *         description: Maintenance request status updated
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Request not found
 *       500:
 *         description: Server error
 */

// Maintenance staff updates status
router.put('/:id/status', protect, authorizeRoles('maintenance'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'ongoing', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    request.status = status;
    request.updatedBy = req.user._id;
    await request.save();
    res.json({ message: 'Maintenance request status updated', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;