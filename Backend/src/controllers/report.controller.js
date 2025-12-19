const { Audit, Assessment, Finding, Control, CobitProcess, User, ReportJob } = require('../models');
const {
  generateAuditReport,
  generateExecutiveSummary,
  generateComplianceByDomainReport,
  generateFindingsReport,
  generateRiskAssessmentReport,
  generateControlStatusReport,
  generateActionPlanReport
} = require('../utils/pdfGenerator');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Función auxiliar para obtener datos de auditoría
const getAuditData = async (auditId) => {
  const audit = await Audit.findByPk(auditId, {
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email']
      }
    ]
  });

  if (!audit) {
    throw new Error('Auditoría no encontrada');
  }

  const assessments = await Assessment.findAll({
    where: { audit_id: auditId },
    include: [
      {
        model: Control,
        include: [CobitProcess]
      }
    ]
  });

  const findings = await Finding.findAll({
    where: { audit_id: auditId },
    include: [
      {
        model: Control,
        attributes: ['id', 'control_code']
      },
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }
    ],
    order: [['severity', 'DESC']]
  });

  return { audit, assessments, findings };
};

// 1. Generar reporte PDF completo (principal)
const generateReport = async (req, res) => {
  try {
    const { auditId } = req.params;
    const { audit, assessments, findings } = await getAuditData(auditId);

    const pdfBuffer = await generateAuditReport(audit, assessments, findings);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="informe-auditoria-${auditId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(error.message === 'Auditoría no encontrada' ? 404 : 500).json({
      success: false,
      message: error.message || 'Error al generar reporte'
    });
  }
};

// 2. Resumen Ejecutivo
const generateExecutiveSummaryReport = async (req, res) => {
  try {
    const { auditId } = req.params;
    const { audit, assessments, findings } = await getAuditData(auditId);

    const pdfBuffer = await generateExecutiveSummary(audit, assessments, findings);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resumen-ejecutivo-${auditId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando resumen ejecutivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar resumen ejecutivo'
    });
  }
};

// 3. Reporte de Cumplimiento por Dominio
const generateComplianceReport = async (req, res) => {
  try {
    const { auditId } = req.params;
    const { audit, assessments, findings } = await getAuditData(auditId);

    const pdfBuffer = await generateComplianceByDomainReport(audit, assessments, findings);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="cumplimiento-dominio-${auditId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando reporte de cumplimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte de cumplimiento'
    });
  }
};

// 4. Reporte de Hallazgos
const generateFindingsReportHandler = async (req, res) => {
  try {
    const { auditId } = req.params;
    const { audit, findings } = await getAuditData(auditId);

    const pdfBuffer = await generateFindingsReport(audit, findings);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="hallazgos-${auditId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando reporte de hallazgos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte de hallazgos'
    });
  }
};

// 5. Evaluación de Riesgos
const generateRiskReport = async (req, res) => {
  try {
    const { auditId } = req.params;
    const { audit, findings } = await getAuditData(auditId);

    const pdfBuffer = await generateRiskAssessmentReport(audit, findings);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="evaluacion-riesgos-${auditId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando evaluación de riesgos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar evaluación de riesgos'
    });
  }
};

// 6. Estado de Controles
const generateControlStatusReportHandler = async (req, res) => {
  try {
    const { auditId } = req.params;
    const { audit, assessments } = await getAuditData(auditId);

    const pdfBuffer = await generateControlStatusReport(audit, assessments);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="estado-controles-${auditId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando estado de controles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar estado de controles'
    });
  }
};

// 7. Análisis de Tendencias (placeholder - usa datos históricos si existen)
const generateTrendsReport = async (req, res) => {
  try {
    const { auditId } = req.params;
    const { audit, assessments, findings } = await getAuditData(auditId);

    // Por ahora usa el resumen ejecutivo - en producción se agregarían datos históricos
    const pdfBuffer = await generateExecutiveSummary(audit, assessments, findings);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="tendencias-${auditId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando análisis de tendencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar análisis de tendencias'
    });
  }
};

// 8. Plan de Acción
const generateActionPlanReportHandler = async (req, res) => {
  try {
    const { auditId } = req.params;
    const { audit, findings } = await getAuditData(auditId);

    const pdfBuffer = await generateActionPlanReport(audit, findings);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="plan-accion-${auditId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando plan de acción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar plan de acción'
    });
  }
};

// Obtener datos del reporte en JSON
const getReportData = async (req, res) => {
  try {
    const { auditId } = req.params;
    const { audit, assessments, findings } = await getAuditData(auditId);

    // Calcular métricas
    const totalAssessments = assessments.length;
    const completedAssessments = assessments.filter(a => a.status === 'completed').length;
    const compliantAssessments = assessments.filter(a => a.compliance === 'compliant').length;
    const complianceRate = totalAssessments > 0 ? (compliantAssessments / totalAssessments * 100) : 0;

    // Agrupar por dominio
    const assessmentsByDomain = assessments.reduce((acc, assessment) => {
      const domain = assessment.Control?.CobitProcess?.domain || 'Unknown';
      if (!acc[domain]) {
        acc[domain] = {
          total: 0,
          completed: 0,
          compliant: 0,
          averageScore: 0
        };
      }

      acc[domain].total++;
      if (assessment.status === 'completed') acc[domain].completed++;
      if (assessment.compliance === 'compliant') acc[domain].compliant++;

      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        audit,
        assessments,
        findings,
        metrics: {
          totalAssessments,
          completedAssessments,
          complianceRate: complianceRate.toFixed(2),
          totalFindings: findings.length,
          findingsBySeverity: findings.reduce((acc, f) => {
            acc[f.severity] = (acc[f.severity] || 0) + 1;
            return acc;
          }, {}),
          assessmentsByDomain
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo datos de reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos de reporte'
    });
  }
};

// Generar reportes para todas las auditorías
const generateReportsForAll = async (req, res) => {
  try {
    const audits = await Audit.findAll();

    const outDir = path.join(__dirname, '../../uploads/reports');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const results = [];

    for (const audit of audits) {
      try {
        const { assessments, findings } = await getAuditData(audit.id);
        const pdfBuffer = await generateAuditReport(audit, assessments, findings);
        const filename = `audit-report-${audit.id}.pdf`;
        const filePath = path.join(outDir, filename);
        await fs.promises.writeFile(filePath, pdfBuffer);

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const url = `${baseUrl}/uploads/reports/${filename}`;

        results.push({ auditId: audit.id, url });
      } catch (innerErr) {
        console.error(`Error generando reporte para auditoría ${audit.id}:`, innerErr);
        results.push({ auditId: audit.id, error: innerErr.message });
      }
    }

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error generando reportes para todas las auditorías:', error);
    res.status(500).json({ success: false, message: 'Error generando reportes' });
  }
};

// Enviar trabajo de generación en background
const submitReportJob = async (req, res) => {
  try {
    const filters = req.body || {};
    const createdBy = req.user?.id || null;
    const job = await ReportJob.create({
      filters,
      created_by: createdBy,
      status: 'pending',
      progress: 0
    });
    res.status(202).json({
      success: true,
      data: { jobId: job.id },
      message: 'Job submitted'
    });
  } catch (error) {
    console.error('Error submitting report job:', error);
    res.status(500).json({ success: false, message: 'Error submitting report job' });
  }
};

// Obtener estado de trabajo
const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await ReportJob.findByPk(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Error fetching job status:', error);
    res.status(500).json({ success: false, message: 'Error fetching job status' });
  }
};

// Generar reportes según filtros
const generateReports = async (req, res) => {
  try {
    const { dateFrom, dateTo, status, creatorId, all } = req.body || {};

    if (all) {
      return generateReportsForAll(req, res);
    }

    const where = {};
    if (status && status !== 'all') where.status = status;
    if (creatorId) where.created_by = creatorId;
    if (dateFrom && dateTo) {
      where.start_date = { [Op.between]: [new Date(dateFrom), new Date(dateTo)] };
    } else if (dateFrom) {
      where.start_date = { [Op.gte]: new Date(dateFrom) };
    } else if (dateTo) {
      where.start_date = { [Op.lte]: new Date(dateTo) };
    }

    const audits = await Audit.findAll({ where });

    const outDir = path.join(__dirname, '../../uploads/reports');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const results = [];

    for (const audit of audits) {
      try {
        const { assessments, findings } = await getAuditData(audit.id);
        const pdfBuffer = await generateAuditReport(audit, assessments, findings);
        const filename = `audit-report-${audit.id}.pdf`;
        const filePath = path.join(outDir, filename);
        await fs.promises.writeFile(filePath, pdfBuffer);

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const url = `${baseUrl}/uploads/reports/${filename}`;

        results.push({ auditId: audit.id, url });
      } catch (innerErr) {
        console.error(`Error generando reporte para auditoría ${audit.id}:`, innerErr);
        results.push({ auditId: audit.id, error: innerErr.message });
      }
    }

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error generando reportes filtrados:', error);
    res.status(500).json({ success: false, message: 'Error generando reportes filtrados' });
  }
};

// Obtener tipos de reportes disponibles
const getAvailableReports = async (req, res) => {
  try {
    const reportTypes = [
      { id: 'audit_complete', name: 'Informe Completo de Auditoría', formats: ['pdf'] },
      { id: 'executive_summary', name: 'Resumen Ejecutivo', formats: ['pdf'] },
      { id: 'compliance_by_domain', name: 'Cumplimiento por Dominio', formats: ['pdf'] },
      { id: 'findings_report', name: 'Reporte de Hallazgos', formats: ['pdf'] },
      { id: 'risk_assessment', name: 'Evaluación de Riesgos', formats: ['pdf'] },
      { id: 'control_status', name: 'Estado de Controles', formats: ['pdf'] },
      { id: 'trend_analysis', name: 'Análisis de Tendencias', formats: ['pdf'] },
      { id: 'action_plan', name: 'Plan de Acción', formats: ['pdf'] }
    ];

    res.json({ success: true, data: reportTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error obteniendo tipos de reporte' });
  }
};

module.exports = {
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
  submitReportJob,
  getJobStatus,
  generateReports,
  getAvailableReports
};