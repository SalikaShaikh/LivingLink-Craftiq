// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - date
 *         - timeSlot
 *         - purpose
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the booking
 *         resident:
 *           type: string
 *           description: ID of the resident who made the booking
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the booking
 *         timeSlot:
 *           type: string
 *           description: The time slot of the booking
 *         purpose:
 *           type: string
 *           description: The purpose of the booking
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: The status of the booking
 *         approvedBy:
 *           type: string
 *           description: ID of the secretary who approved/rejected the booking
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the booking was created
 */

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Facility booking management endpoints
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Request a facility booking (Resident only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - timeSlot
 *               - purpose
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               timeSlot:
 *                 type: string
 *               purpose:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking request submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request or slot already booked
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Resident requests booking
router.post('/', protect, authorizeRoles('resident'), async (req, res) => {
  try {
    const { date, timeSlot, purpose } = req.body;
    if (!date || !timeSlot || !purpose) return res.status(400).json({ message: 'All fields required' });

    // Check if slot is available (no approved booking overlapping)
    const existingBooking = await Booking.findOne({
      date: new Date(date),
      timeSlot,
      status: 'approved',
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'Requested slot already booked' });
    }

    const booking = new Booking({
      resident: req.user._id,
      date: new Date(date),
      timeSlot,
      purpose,
      status: 'pending',
    });
    await booking.save();
    res.status(201).json({ message: 'Booking request submitted', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/bookings/my-bookings:
 *   get:
 *     summary: Get resident's own bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resident's bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Resident views their own bookings
router.get('/my-bookings', protect, authorizeRoles('resident'), async (req, res) => {
  try {
    const bookings = await Booking.find({ resident: req.user._id })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings (Secretary only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Secretary views all bookings
router.get('/', protect, authorizeRoles('secretary'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('resident', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Approve or reject a booking (Secretary only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
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
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Booking status updated
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */

// Secretary approves or rejects booking
router.put('/:id', protect, authorizeRoles('secretary'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = status;
    booking.approvedBy = req.user._id;
    await booking.save();
    res.json({ message: `Booking ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;