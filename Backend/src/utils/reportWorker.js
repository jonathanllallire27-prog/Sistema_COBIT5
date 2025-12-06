const path = require('path');
const fs = require('fs');
const { Audit, Assessment, Finding, Control, CobitProcess, ReportJob } = require('../models');
const { generateAuditReport } = require('./../utils/pdfGenerator');

let isRunning = false;

const processPendingJobs = async () => {
  if (isRunning) return;
  isRunning = true;

  try {
    const pendingJobs = await ReportJob.findAll({ where: { status: 'pending' }, order: [['createdAt', 'ASC']] });
    for (const job of pendingJobs) {
      try {
        await job.update({ status: 'processing', progress: 0 });

        const filters = job.filters || {};
        const where = {};
        if (filters.status && filters.status !== 'all') where.status = filters.status;
        if (filters.creatorId) where.created_by = filters.creatorId;
        if (filters.dateFrom && filters.dateTo) {
          where.start_date = { $between: [new Date(filters.dateFrom), new Date(filters.dateTo)] };
        } else if (filters.dateFrom) {
          where.start_date = { $gte: new Date(filters.dateFrom) };
        } else if (filters.dateTo) {
          where.start_date = { $lte: new Date(filters.dateTo) };
        }

        // Use Sequelize Op for compatibility
        const { Op } = require('sequelize');
        const whereOp = {};
        if (filters.status && filters.status !== 'all') whereOp.status = filters.status;
        if (filters.creatorId) whereOp.created_by = filters.creatorId;
        if (filters.dateFrom && filters.dateTo) whereOp.start_date = { [Op.between]: [new Date(filters.dateFrom), new Date(filters.dateTo)] };
        else if (filters.dateFrom) whereOp.start_date = { [Op.gte]: new Date(filters.dateFrom) };
        else if (filters.dateTo) whereOp.start_date = { [Op.lte]: new Date(filters.dateTo) };

        const audits = await Audit.findAll({ where: whereOp });

        const outDir = path.join(__dirname, '../../uploads/reports');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

        const results = [];
        let processed = 0;
        for (const audit of audits) {
          try {
            const assessments = await Assessment.findAll({ where: { audit_id: audit.id }, include: [ { model: Control, include: [CobitProcess] } ] });
            const findings = await Finding.findAll({ where: { audit_id: audit.id } });
            const pdfBuffer = await generateAuditReport(audit, assessments, findings);
            const filename = `audit-report-${audit.id}.pdf`;
            const filePath = path.join(outDir, filename);
            await fs.promises.writeFile(filePath, pdfBuffer);
            const baseUrl = `${process.env.APP_URL || 'http://localhost:' + (process.env.PORT || 5000)}`;
            const url = `${baseUrl.replace(/\/$/, '')}/uploads/reports/${filename}`;
            results.push({ auditId: audit.id, url });
          } catch (err) {
            results.push({ auditId: audit.id, error: err.message });
          }
          processed++;
          const prog = Math.round((processed / (audits.length || 1)) * 100);
          await job.update({ progress: prog });
        }

        await job.update({ status: 'completed', result_urls: results, progress: 100 });
      } catch (jobErr) {
        console.error('Job processing error:', jobErr);
        await job.update({ status: 'failed', error: jobErr.message });
      }
    }
  } catch (err) {
    console.error('Error in report worker:', err);
  } finally {
    isRunning = false;
  }
};

// Polling loop
const startWorker = (intervalMs = 5000) => {
  setInterval(() => {
    processPendingJobs();
  }, intervalMs);
  // also kick off immediately
  processPendingJobs();
};

module.exports = { startWorker, processPendingJobs };
