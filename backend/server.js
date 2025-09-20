// server.js - Entry point of backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Swagger setup
const swaggerOptions = {
  definition: {  // Change from 'swaggerDefinition' to 'definition'
    openapi: '3.0.0',
    info: {
      title: 'LivingLink API',
      version: '1.0.0',
      description: 'API documentation for LivingLink residential society management',
    },
    servers: [
      { 
        url: 'http://localhost:5000',
        description: 'Development server' 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'], // Make sure this path is correct
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import routes
const authRoutes = require('./routes/auth');
const noticeRoutes = require('./routes/notices');
const complaintRoutes = require('./routes/complaints');
const paymentRoutes = require('./routes/payments');
const bookingRoutes = require('./routes/bookings');
const visitorRoutes = require('./routes/visitors');
const maintenanceRoutes = require('./routes/maintenance');
const financeRoutes = require('./routes/finances');
const userRoutes = require('./routes/users');

// Routes middleware
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '🏠 LivingLink API Server is running!',
    documentation: 'Visit /api-docs for Swagger API documentation',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      notices: '/api/notices',
      payments: '/api/payments',
      complaints: '/api/complaints',
      bookings: '/api/bookings',
      visitors: '/api/visitors',
      maintenance: '/api/maintenance',
      finances: '/api/finances',
      users: '/api/users'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));