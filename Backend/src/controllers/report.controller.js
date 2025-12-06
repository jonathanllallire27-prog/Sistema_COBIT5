const { Audit, Assessment, Finding, Control, CobitProcess, User } = require('../models');
const { generateAuditReport } = require('../utils/pdfGenerator');

// Generar reporte PDF
const generateReport = async (req, res) => {
  try {
    const { auditId } = req.params;
    
    // Obtener datos completos de la auditoría
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
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
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
      order: [['severity', 'DESC']]
    });
    
    // Generar PDF
    const pdfBuffer = await generateAuditReport(audit, assessments, findings);
    
    // Configurar headers para descarga
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="audit-report-${auditId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });
    
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte'
    });
  }
};

// Obtener reporte en JSON
const getReportData = async (req, res) => {
  try {
    const { auditId } = req.params;
    
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
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
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
      ]
    });
    
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

module.exports = {
  generateReport,
  getReportData
};

// Generar reportes para todas las auditorías y guardarlos en uploads/reports
const fs = require('fs');
const path = require('path');

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
        const assessments = await Assessment.findAll({
          where: { audit_id: audit.id },
          include: [
            { model: Control, include: [CobitProcess] }
          ]
        });

        const findings = await Finding.findAll({ where: { audit_id: audit.id } });

        const pdfBuffer = await generateAuditReport(audit, assessments, findings);
        const filename = `audit-report-${audit.id}.pdf`;
        const filePath = path.join(outDir, filename);
        await fs.promises.writeFile(filePath, pdfBuffer);

        // Build URL using request host/protocol
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

module.exports.generateReportsForAll = generateReportsForAll;

// Submit a background job for report generation
const { ReportJob } = require('../models');

const submitReportJob = async (req, res) => {
  try {
    const filters = req.body || {};
    const createdBy = req.user?.id || null;
    const job = await ReportJob.create({ filters, created_by: createdBy, status: 'pending', progress: 0 });
    res.status(202).json({ success: true, data: { jobId: job.id }, message: 'Job submitted' });
  } catch (error) {
    console.error('Error submitting report job:', error);
    res.status(500).json({ success: false, message: 'Error submitting report job' });
  }
};

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

module.exports.submitReportJob = submitReportJob;
module.exports.getJobStatus = getJobStatus;

// Generar reportes según filtros (dateFrom, dateTo, status, creatorId, all)
const { Op } = require('sequelize');

const generateReports = async (req, res) => {
  try {
    const { dateFrom, dateTo, status, creatorId, all } = req.body || {};

    // If all requested, delegate to generateReportsForAll
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
        const assessments = await Assessment.findAll({
          where: { audit_id: audit.id },
          include: [ { model: Control, include: [CobitProcess] } ]
        });

        const findings = await Finding.findAll({ where: { audit_id: audit.id } });

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

module.exports.generateReports = generateReports;