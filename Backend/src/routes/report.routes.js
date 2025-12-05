const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/report.controller');
const { auth } = require('../middleware/auth');

router.use(auth);
router.get('/audit/:auditId/pdf', generateReport);

module.exports = router;