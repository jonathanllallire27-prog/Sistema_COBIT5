const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./auth.routes');
const auditRoutes = require('./audit.routes');
const assessmentRoutes = require('./assessment.routes');
const findingRoutes = require('./finding.routes');
const cobitRoutes = require('./cobit.routes');
const reportRoutes = require('./report.routes');
const usersRoutes = require('./users.routes');
const settingsRoutes = require('./settings.routes');

// Definir rutas base
router.use('/auth', authRoutes);
router.use('/audits', auditRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/findings', findingRoutes);
router.use('/cobit', cobitRoutes);
router.use('/reports', reportRoutes);
router.use('/users', usersRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;