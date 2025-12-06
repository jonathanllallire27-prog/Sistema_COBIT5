const express = require('express');
const router = express.Router();
const { 
  createAudit, 
  getAudits, 
  getAuditById,
  getAuditDashboard,
  getGlobalDashboard
} = require('../controllers/audit.controller');
const { generateAssessmentsForAudit } = require('../controllers/audit.controller');
const { auth } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

router.get('/dashboard', getGlobalDashboard);
router.get('/:id/dashboard', getAuditDashboard);
router.get('/', getAudits);
router.post('/', createAudit);
router.post('/:id/generate-assessments', generateAssessmentsForAudit);
router.get('/:id', getAuditById);

module.exports = router;