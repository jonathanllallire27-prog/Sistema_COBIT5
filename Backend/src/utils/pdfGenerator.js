const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateAuditReport = (audit, assessments, findings) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      // Colectar chunks del PDF
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // Encabezado
      doc.fontSize(20).text('Informe de Auditoría', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Auditoría: ${audit.name}`);
      doc.fontSize(12).text(`Estado: ${audit.status}`);
      doc.text(`Fecha de inicio: ${new Date(audit.start_date).toLocaleDateString()}`);
      doc.text(`Fecha de fin: ${new Date(audit.end_date).toLocaleDateString()}`);
      doc.moveDown();
      
      // Resumen ejecutivo
      doc.fontSize(16).text('Resumen Ejecutivo', { underline: true });
      doc.moveDown(0.5);
      
      const totalAssessments = assessments.length;
      const compliant = assessments.filter(a => a.compliance === 'compliant').length;
      const nonCompliant = assessments.filter(a => a.compliance === 'non_compliant').length;
      const complianceRate = totalAssessments > 0 ? (compliant / totalAssessments * 100).toFixed(2) : 0;
      
      doc.fontSize(12).text(`Total de controles evaluados: ${totalAssessments}`);
      doc.text(`Controles cumplidos: ${compliant}`);
      doc.text(`Controles no cumplidos: ${nonCompliant}`);
      doc.text(`Tasa de cumplimiento: ${complianceRate}%`);
      doc.moveDown();
      
      // Hallazgos
      if (findings.length > 0) {
        doc.fontSize(16).text('Hallazgos Principales', { underline: true });
        doc.moveDown(0.5);
        
        findings.forEach((finding, index) => {
          doc.fontSize(12).text(`${index + 1}. ${finding.title}`);
          doc.fontSize(10).text(`   Severidad: ${finding.severity.toUpperCase()}`);
          doc.fontSize(10).text(`   Estado: ${finding.status}`);
          doc.moveDown(0.5);
        });
      }
      
      // Detalle de evaluaciones
      doc.addPage();
      doc.fontSize(16).text('Detalle de Evaluaciones', { align: 'center', underline: true });
      doc.moveDown();
      
      assessments.forEach((assessment, index) => {
        doc.fontSize(12).text(`${index + 1}. ${assessment.Control.control_code}: ${assessment.Control.control_statement}`);
        doc.fontSize(10).text(`   Cumplimiento: ${assessment.compliance}`);
        doc.fontSize(10).text(`   Puntuación: ${assessment.score || 'N/A'}`);
        doc.fontSize(10).text(`   Notas: ${assessment.notes || 'Sin notas'}`);
        doc.moveDown(0.5);
      });
      
      // Pie de página
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).text(
          `Página ${i + 1} de ${totalPages} - Generado el ${new Date().toLocaleDateString()}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
      }
      
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateAuditReport };