const express = require('express');
const router = express.Router();
const { 
  createAudit, 
  getAudits, 
  getAuditById,
  getAuditDashboard 
} = require('../controllers/audit.controller');
const { auth } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

router.get('/dashboard', getAuditDashboard);
router.get('/', getAudits);
router.post('/', createAudit);
router.get('/:id', getAuditById);

module.exports = router;