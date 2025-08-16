// server.js  (paste this entire file into backend/server.js)
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- CONFIG ---------- */
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_livinglink'; // change for production

/* ---------- In-memory stores ---------- */
let users = [];       // {id, name, email, password(hashed), role, flatNumber, phone}
let complaints = [];  // {id, userId|null, title, description, status, createdAt, updatedAt}
let bills = [];       // {id, userId, amount, dueDate, status}
let visitors = [];    // {id, name, purpose, flatNumber, approvedByResident, entryTime, timeOut, loggedBy}
let notices = [];     // {id, title, description, createdAt, createdBy}

/* ---------- helpers ---------- */
function nextId(arr) {
  return arr.length ? arr[arr.length - 1].id + 1 : 1;
}

/* ---------- Auth helpers ---------- */
function authenticateToken(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // { id, role, name, flatNumber }
    next();
  });
}
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

/* ---------- Swagger setup ---------- */
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LivingLink API",
      version: "1.0.0",
      description: "API docs for LivingLink residential society management (in-memory demo)"
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      },
      schemas: {
        RegisterUser: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            role: { type: "string", example: "resident" },
            flatNumber: { type: "string" },
            phone: { type: "string" }
          },
          required: ["name", "email", "password", "role"]
        },
        LoginUser: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" }
          },
          required: ["email", "password"]
        },
        Complaint: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            anonymous: { type: "boolean" }
          }
        },
        Bill: {
          type: "object",
          properties: {
            userId: { type: "integer" },
            amount: { type: "number" },
            dueDate: { type: "string", format: "date" }
          }
        },
        Visitor: {
          type: "object",
          properties: {
            name: { type: "string" },
            purpose: { type: "string" },
            flatNumber: { type: "string" },
            approvedByResident: { type: "boolean" }
          }
        },
        Notice: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" }
          }
        }
      }
    }
  },
  apis: ["./server.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * tags:
 *  - name: Auth
 *  - name: Complaints
 *  - name: Bills
 *  - name: Visitors
 *  - name: Notices
 */

/* ----------------- AUTH ----------------- */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       200:
 *         description: User registered
 */
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, flatNumber, phone } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing required fields' });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' });
  const hashed = bcrypt.hashSync(password, 8);
  const newUser = { id: nextId(users), name, email, password: hashed, role, flatNumber: flatNumber || null, phone: phone || null };
  users.push(newUser);
  return res.status(200).json({ message: "User registered successfully", userId: newUser.id });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login success
 */
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const passOk = bcrypt.compareSync(password, user.password);
  if (!passOk) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name, flatNumber: user.flatNumber }, JWT_SECRET, { expiresIn: '8h' });
  return res.status(200).json({ token, role: user.role });
});

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     tags: [Auth]
 *     summary: Get all registered users (for debugging only)
 *     responses:
 *       200:
 *         description: List of registered users
 */
app.get('/api/auth/users', (req, res) => {
  res.status(200).json(users);
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current logged-in user info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 */
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  
  // Don't send hashed password
  const { password, ...safeUser } = user;
  return res.status(200).json(safeUser);
});


/* ----------------- COMPLAINTS ----------------- */
/**
 * @swagger
 * /api/complaints:
 *   post:
 *     tags: [Complaints]
 *     summary: Create a complaint (can be anonymous)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Complaint'
 *     responses:
 *       200:
 *         description: Complaint submitted
 */
app.post('/api/complaints', (req, res) => {
  // optional token support: if token provided, attach userId
  let userId = null;
  const auth = req.headers['authorization'];
  if (auth) {
    const parts = auth.split(' ');
    if (parts[1]) {
      try { const decoded = jwt.verify(parts[1], JWT_SECRET); userId = decoded.id; } catch (e) { /* ignore invalid token */ }
    }
  }
  const { title, description, anonymous } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Missing title or description' });
  const newComplaint = {
    id: nextId(complaints),
    userId: anonymous ? null : userId,
    title,
    description,
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  complaints.push(newComplaint);
  return res.status(200).json({ message: "Complaint submitted successfully", complaintId: newComplaint.id });
});

/**
 * @swagger
 * /api/complaints:
 *   get:
 *     tags: [Complaints]
 *     summary: Get all complaints (admin/staff)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: list of complaints
 */
app.get('/api/complaints', authenticateToken, authorizeRoles('secretary', 'treasurer', 'maintenance', 'security'), (req, res) => {
  return res.status(200).json(complaints);
});

/* ----------------- BILLS ----------------- */
/**
 * @swagger
 * /api/bills:
 *   post:
 *     tags: [Bills]
 *     summary: Generate a maintenance bill (treasurer/admin)
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bill'
 *     responses:
 *       200:
 *         description: Bill generated
 */
app.post('/api/bills', authenticateToken, authorizeRoles('treasurer', 'secretary'), (req, res) => {
  const { userId, amount, dueDate } = req.body;
  if (!userId || !amount || !dueDate) return res.status(400).json({ error: 'Missing bill fields' });
  const newBill = { id: nextId(bills), userId, amount, dueDate, status: 'pending' };
  bills.push(newBill);
  return res.status(200).json({ message: "Bill generated successfully" });
});

/**
 * @swagger
 * /api/bills/{userId}:
 *   get:
 *     tags: [Bills]
 *     summary: Get bills for a user
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: array of bills
 */
app.get('/api/bills/:userId', authenticateToken, (req, res) => {
  const userId = Number(req.params.userId);
  if (req.user.role !== 'treasurer' && req.user.role !== 'secretary' && req.user.id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const userBills = bills.filter(b => b.userId === userId);
  return res.status(200).json(userBills);
});

/* ----------------- VISITORS ----------------- */
/**
 * @swagger
 * /api/visitors:
 *   post:
 *     tags: [Visitors]
 *     summary: Log a visitor (guard or resident can create)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Visitor'
 *     responses:
 *       200:
 *         description: Visitor logged
 */
app.post('/api/visitors', (req, res) => {
  const { name, purpose, flatNumber, approvedByResident } = req.body;
  if (!name || !purpose || !flatNumber) return res.status(400).json({ error: 'Missing visitor fields' });
  let loggedBy = null;
  const auth = req.headers['authorization'];
  if (auth) {
    const parts = auth.split(' ');
    if (parts[1]) {
      try { const decoded = jwt.verify(parts[1], JWT_SECRET); loggedBy = decoded.id; } catch (e) { /* ignore */ }
    }
  }
  const newVisitor = {
    id: nextId(visitors),
    name,
    purpose,
    flatNumber,
    approvedByResident: !!approvedByResident,
    entryTime: new Date().toISOString(),
    timeOut: null,
    loggedBy
  };
  visitors.push(newVisitor);
  return res.status(200).json({ message: "Visitor log created successfully", visitorId: newVisitor.id });
});

/* ----------------- NOTICES ----------------- */
/**
 * @swagger
 * /api/notices:
 *   post:
 *     tags: [Notices]
 *     summary: Post a notice (admin/secretary)
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notice'
 *     responses:
 *       200:
 *         description: Notice posted
 */
app.post('/api/notices', authenticateToken, authorizeRoles('secretary', 'treasurer'), (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Missing title or description' });
  const newNotice = { id: nextId(notices), title, description, createdAt: new Date().toISOString(), createdBy: req.user.id };
  notices.push(newNotice);
  return res.status(200).json({ message: "Notice posted successfully", noticeId: newNotice.id });
});

/**
 * @swagger
 * /api/notices:
 *   get:
 *     tags: [Notices]
 *     summary: Get all notices
 *     responses:
 *       200:
 *         description: list notices
 */
app.get('/api/notices', (req, res) => {
  return res.status(200).json(notices);
});

/* ----------------- Simple dashboard route ----------------- */
app.get('/api/dashboard', authenticateToken, (req, res) => {
  // Very small example payload; frontend will show role-specific data
  const role = req.user.role;
  if (role === 'resident') {
    const myBills = bills.filter(b => b.userId === req.user.id);
    const myComplaints = complaints.filter(c => c.userId === req.user.id);
    return res.json({ role, myBills, myComplaints, notices });
  }
  // for staff
  return res.json({ role, counts: { users: users.length, complaints: complaints.length, bills: bills.length, visitors: visitors.length } });
});

/* ---------- Start server ---------- */
app.listen(PORT, () => {
  console.log(`LivingLink backend running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});
