const express = require('express');
const router = express.Router();
const { generateReport, getReportData, generateReportsForAll, generateReports, submitReportJob, getJobStatus } = require('../controllers/report.controller');
const { auth } = require('../middleware/auth');

router.use(auth);
router.post('/generate-all', generateReportsForAll);
router.post('/generate', generateReports);
router.post('/submit', submitReportJob);
router.get('/jobs/:jobId', getJobStatus);
router.get('/audit/:auditId/pdf', generateReport);
router.get('/audit/:auditId/json', getReportData);

module.exports = router;