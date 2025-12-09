const express = require('express');
const router = express.Router();
const { 
  createAudit, 
  getAudits, 
  getAuditById,
  getAuditDashboard,
  getGlobalDashboard,
  updateAudit,
  deleteAudit
} = require('../controllers/audit.controller');
const { generateAssessmentsForAudit } = require('../controllers/audit.controller');
const { auth } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas globales y específicas primero (sin parámetro :id)
router.get('/dashboard', getGlobalDashboard);
router.get('/', getAudits);
router.post('/', createAudit);

// Rutas con parámetro :id después
router.get('/:id/dashboard', getAuditDashboard);
router.post('/:id/generate-assessments', generateAssessmentsForAudit);
router.get('/:id', getAuditById);
router.put('/:id', updateAudit);
router.delete('/:id', deleteAudit);

module.exports = router;