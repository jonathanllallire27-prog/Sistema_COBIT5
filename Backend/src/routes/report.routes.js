const express = require('express');
const router = express.Router();
const {
    generateReport,
    generateExecutiveSummaryReport,
    generateComplianceReport,
    generateFindingsReportHandler,
    generateRiskReport,
    generateControlStatusReportHandler,
    generateTrendsReport,
    generateActionPlanReportHandler,
    getReportData,
    generateReportsForAll,
    generateReports,
    submitReportJob,
    getJobStatus,
    getAvailableReports
} = require('../controllers/report.controller');
const { auth } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(auth);

// ==================== REPORTES POR AUDITORÍA ====================

// Reporte completo de auditoría (PDF)
router.get('/audit/:auditId/pdf', generateReport);

// Resumen ejecutivo
router.get('/audit/:auditId/executive-summary', generateExecutiveSummaryReport);

// Cumplimiento por dominio COBIT
router.get('/audit/:auditId/compliance', generateComplianceReport);

// Reporte de hallazgos
router.get('/audit/:auditId/findings', generateFindingsReportHandler);

// Evaluación de riesgos
router.get('/audit/:auditId/risk-assessment', generateRiskReport);

// Estado de controles
router.get('/audit/:auditId/control-status', generateControlStatusReportHandler);

// Análisis de tendencias
router.get('/audit/:auditId/trends', generateTrendsReport);

// Plan de acción
router.get('/audit/:auditId/action-plan', generateActionPlanReportHandler);

// Datos JSON del reporte
router.get('/audit/:auditId/json', getReportData);

// Tipos de reportes disponibles
router.get('/audit/:auditId/available', getAvailableReports);

// ==================== GENERACIÓN MASIVA ====================

// Generar reportes para todas las auditorías
router.post('/generate-all', generateReportsForAll);

// Generar reportes con filtros
router.post('/generate', generateReports);

// ==================== TRABAJOS EN BACKGROUND ====================

// Enviar trabajo de generación
router.post('/submit', submitReportJob);

// Consultar estado de trabajo
router.get('/jobs/:jobId', getJobStatus);

module.exports = router;