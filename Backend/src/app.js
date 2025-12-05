// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Importar rutas
const apiRoutes = require('./routes/api.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'COBIT Audit System API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rutas API centralizadas
app.use('/api', apiRoutes);

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
});

// Manejo de errores global
app.use(errorHandler);

module.exports = app;