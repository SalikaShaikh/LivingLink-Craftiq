// routes/finances.js
const express = require('express');
const router = express.Router();
const FinanceRecord = require('../models/FinanceRecord');
const Payment = require('../models/Payment');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     FinanceRecord:
 *       type: object
 *       required:
 *         - description
 *         - amount
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the finance record
 *         description:
 *           type: string
 *           description: Description of the expense
 *         amount:
 *           type: number
 *           description: Amount of the expense
 *         enteredBy:
 *           type: string
 *           description: ID of the treasurer who entered the record
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date the record was created
 * 
 *     FinanceSummary:
 *       type: object
 *       properties:
 *         totalIncome:
 *           type: number
 *           description: Total income from payments
 *         totalExpenses:
 *           type: number
 *           description: Total expenses
 *         balance:
 *           type: number
 *           description: Current balance (income - expenses)
 *         expenses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FinanceRecord'
 */

/**
 * @swagger
 * tags:
 *   name: Finances
 *   description: Financial management endpoints
 */

/**
 * @swagger
 * /api/finances:
 *   post:
 *     summary: Add a finance record/expense (Treasurer only)
 *     tags: [Finances]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - amount
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Finance record added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinanceRecord'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

// Treasurer adds finance record (expense)
router.post('/', protect, authorizeRoles('treasurer'), async (req, res) => {
  try {
    const { description, amount } = req.body;
    if (!description || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid description and amount required' });
    }
    const record = new FinanceRecord({
      description,
      amount,
      enteredBy: req.user._id,
    });
    await record.save();
    res.status(201).json({ message: 'Finance record added', record });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/finances/summary:
 *   get:
 *     summary: Get finance summary
 *     tags: [Finances]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Finance summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinanceSummary'
 *       500:
 *         description: Server error
 */

// All users can get finance summary
router.get('/summary', protect, async (req, res) => {
  try {
    // Total funds collected from payments
    const payments = await Payment.find();
    const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);

    // Total expenses
    const expensesRecords = await FinanceRecord.find();
    const totalExpenses = expensesRecords.reduce((sum, r) => sum + r.amount, 0);

    // Detailed expense list
    res.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      expenses: expensesRecords,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;