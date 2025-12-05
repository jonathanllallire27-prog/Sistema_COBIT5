const express = require('express');
const router = express.Router();
const {
  createFinding,
  getFindingsByAudit,
  updateFinding,
  deleteFinding
} = require('../controllers/finding.controller');
const { auth } = require('../middleware/auth');

router.use(auth);

router.post('/audit/:auditId', createFinding);
router.get('/audit/:auditId', getFindingsByAudit);
router.put('/:id', updateFinding);
router.delete('/:id', deleteFinding);

module.exports = router;