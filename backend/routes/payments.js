// routes/payments.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - amount
 *         - month
 *         - year
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the payment
 *         resident:
 *           type: string
 *           description: ID of the resident who made the payment
 *         amount:
 *           type: number
 *           description: The payment amount
 *         month:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           description: The month the payment is for
 *         year:
 *           type: integer
 *           description: The year the payment is for
 *         receiptNumber:
 *           type: string
 *           description: Unique receipt number
 *         paidAt:
 *           type: string
 *           format: date-time
 *           description: The date the payment was made
 * 
 *     PaymentMonth:
 *       type: object
 *       properties:
 *         _id:
 *           type: object
 *           properties:
 *             month:
 *               type: integer
 *             year:
 *               type: integer
 *         count:
 *           type: integer
 *           description: Number of payments for this month/year
 */

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management endpoints
 */

/**
 * @swagger
 * /api/payments/my-payments:
 *   get:
 *     summary: Get resident's payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of payments to return (for dashboard)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, month]
 *         description: Sort order - 'date' for recent first, 'month' for by year/month
 *     responses:
 *       200:
 *         description: List of resident's payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/my-payments', protect, authorizeRoles('resident'), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const sort = req.query.sort || 'date';
    
    let query = Payment.find({ resident: req.user._id });
    
    // Apply sorting
    if (sort === 'month') {
      query = query.sort({ year: -1, month: -1 });
    } else {
      query = query.sort({ paidAt: -1 });
    }
    
    // Apply limit if specified
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    const payments = await query;
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Make a maintenance fee payment (Resident only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - month
 *               - year
 *             properties:
 *               amount:
 *                 type: number
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Payment successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Bad request or already paid for this month
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', protect, authorizeRoles('resident'), async (req, res) => {
  try {
    const { amount, month, year } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Valid amount required' });
    if (!month || month < 1 || month > 12) return res.status(400).json({ message: 'Valid month required (1-12)' });
    if (!year || year < 2000 || year > 2100) return res.status(400).json({ message: 'Valid year required' });
    
    const existingPayment = await Payment.findOne({
      resident: req.user._id,
      month,
      year
    });
    
    if (existingPayment) {
      return res.status(400).json({ message: 'Already paid for this month' });
    }
    
    const receiptNumber = uuidv4();
    const payment = new Payment({
      resident: req.user._id,
      amount,
      month,
      year,
      receiptNumber,
      paidAt: new Date(),
    });
    
    await payment.save();
    res.status(201).json({ message: 'Payment successful', payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/payments/all:
 *   get:
 *     summary: Get all payments with amount details (Treasurer only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filter by month (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *     responses:
 *       200:
 *         description: List of payments with amount details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   resident:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                   amount:
 *                     type: number
 *                     description: The amount paid
 *                   month:
 *                     type: integer
 *                   year:
 *                     type: integer
 *                   receiptNumber:
 *                     type: string
 *                   paidAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/all', protect, authorizeRoles('treasurer'), async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = {};
    
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }
    
    const payments = await Payment.find(query)
      .populate('resident', 'name email')
      .sort({ paidAt: -1 });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/payments/months:
 *   get:
 *     summary: Get unique months with payments (Treasurer only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unique months with payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMonth'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/months', protect, authorizeRoles('treasurer'), async (req, res) => {
  try {
    const months = await Payment.aggregate([
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' } // Added total amount per month
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);
    res.json(months);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;