const PDFDocument = require('pdfkit');

// Colores del tema
const colors = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dark: '#1F2937',
  light: '#F3F4F6',
  white: '#FFFFFF'
};

const severityColors = {
  critical: '#7C3AED',
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981'
};

const complianceColors = {
  compliant: '#10B981',
  partially_compliant: '#F59E0B',
  non_compliant: '#EF4444',
  not_applicable: '#6B7280'
};

// Función auxiliar para agregar encabezado a cada página
const addHeader = (doc, title, auditName) => {
  doc.rect(0, 0, doc.page.width, 80).fill(colors.primary);
  doc.fillColor(colors.white)
    .fontSize(22)
    .font('Helvetica-Bold')
    .text(title, 50, 25);
  doc.fontSize(12)
    .font('Helvetica')
    .text(auditName, 50, 52);
  doc.moveDown(4);
  doc.fillColor(colors.dark);
};

// Función auxiliar para pie de página
const addFooter = (doc, pageNum, totalPages) => {
  const bottom = doc.page.height - 40;
  doc.fontSize(8)
    .fillColor(colors.secondary)
    .text(
      `Página ${pageNum} de ${totalPages} | Generado el ${new Date().toLocaleDateString('es-ES')} | Sistema COBIT 5 Audit`,
      50,
      bottom,
      { align: 'center', width: doc.page.width - 100 }
    );
};

// Función auxiliar para crear sección
const addSection = (doc, title, yPos = null) => {
  if (yPos) doc.y = yPos;
  doc.moveDown(0.5);
  doc.fontSize(14)
    .fillColor(colors.primary)
    .font('Helvetica-Bold')
    .text(title);
  doc.moveTo(50, doc.y + 2)
    .lineTo(doc.page.width - 50, doc.y + 2)
    .stroke(colors.primary);
  doc.moveDown(0.5);
  doc.fillColor(colors.dark).font('Helvetica');
};

// Función auxiliar para crear tabla simple
const addTable = (doc, headers, rows, options = {}) => {
  const startY = doc.y;
  const colWidth = (doc.page.width - 100) / headers.length;

  // Headers
  doc.rect(50, startY, doc.page.width - 100, 25).fill(colors.light);
  doc.fillColor(colors.dark).font('Helvetica-Bold').fontSize(10);
  headers.forEach((header, i) => {
    doc.text(header, 55 + (i * colWidth), startY + 8, { width: colWidth - 10 });
  });

  // Rows
  doc.font('Helvetica').fontSize(9);
  let y = startY + 25;
  rows.forEach((row, rowIdx) => {
    if (y > doc.page.height - 100) {
      doc.addPage();
      y = 100;
    }

    const bgColor = rowIdx % 2 === 0 ? colors.white : '#F9FAFB';
    doc.rect(50, y, doc.page.width - 100, 22).fill(bgColor);
    doc.fillColor(colors.dark);

    row.forEach((cell, i) => {
      doc.text(String(cell || '-'), 55 + (i * colWidth), y + 6, { width: colWidth - 10 });
    });
    y += 22;
  });

  doc.y = y + 10;
};

// ==================== GENERADORES DE REPORTES ====================

// 1. Reporte Completo de Auditoría (Original mejorado)
const generateAuditReport = (audit, assessments, findings) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, bufferPages: true });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Portada
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(colors.primary);
      doc.fillColor(colors.white)
        .fontSize(36)
        .font('Helvetica-Bold')
        .text('INFORME DE AUDITORÍA', 50, 200, { align: 'center' });
      doc.fontSize(24)
        .font('Helvetica')
        .text(audit.name, 50, 260, { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(14)
        .text(`Estado: ${audit.status}`, { align: 'center' });
      doc.text(`Fecha: ${new Date(audit.start_date).toLocaleDateString('es-ES')} - ${new Date(audit.end_date).toLocaleDateString('es-ES')}`, { align: 'center' });
      doc.moveDown(4);
      doc.fontSize(10)
        .text('Sistema de Gestión de Auditorías COBIT 5', { align: 'center' });
      doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });

      // Página 2: Resumen Ejecutivo
      doc.addPage();
      addHeader(doc, 'Resumen Ejecutivo', audit.name);

      const totalAssessments = assessments.length;
      const compliant = assessments.filter(a => a.compliance === 'compliant').length;
      const partiallyCompliant = assessments.filter(a => a.compliance === 'partially_compliant').length;
      const nonCompliant = assessments.filter(a => a.compliance === 'non_compliant').length;
      const complianceRate = totalAssessments > 0 ? (compliant / totalAssessments * 100) : 0;

      // Métricas principales
      doc.fontSize(12).fillColor(colors.dark);
      const metricsY = doc.y;

      // Cuadros de métricas
      const boxWidth = 120;
      const boxHeight = 60;
      const metrics = [
        { label: 'Total Controles', value: totalAssessments, color: colors.primary },
        { label: 'Cumplidos', value: compliant, color: colors.success },
        { label: 'Parciales', value: partiallyCompliant, color: colors.warning },
        { label: 'No Cumplidos', value: nonCompliant, color: colors.danger }
      ];

      metrics.forEach((m, i) => {
        const x = 50 + (i * (boxWidth + 15));
        doc.rect(x, metricsY, boxWidth, boxHeight).fill(m.color);
        doc.fillColor(colors.white)
          .fontSize(24)
          .font('Helvetica-Bold')
          .text(String(m.value), x, metricsY + 10, { width: boxWidth, align: 'center' });
        doc.fontSize(9)
          .font('Helvetica')
          .text(m.label, x, metricsY + 40, { width: boxWidth, align: 'center' });
      });

      doc.y = metricsY + boxHeight + 30;

      // Tasa de cumplimiento
      doc.fillColor(colors.dark)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(`Tasa de Cumplimiento: ${complianceRate.toFixed(1)}%`, { align: 'center' });
      doc.moveDown(2);

      // Hallazgos resumen
      addSection(doc, 'Resumen de Hallazgos');
      if (findings.length > 0) {
        const findingsBySeverity = findings.reduce((acc, f) => {
          acc[f.severity] = (acc[f.severity] || 0) + 1;
          return acc;
        }, {});

        Object.entries(findingsBySeverity).forEach(([severity, count]) => {
          doc.fillColor(severityColors[severity] || colors.secondary)
            .fontSize(11)
            .text(`• ${severity.toUpperCase()}: ${count} hallazgo(s)`, { indent: 20 });
        });
      } else {
        doc.fontSize(11).text('No se encontraron hallazgos en esta auditoría.', { indent: 20 });
      }

      // Página 3+: Detalle de Evaluaciones
      doc.addPage();
      addHeader(doc, 'Detalle de Evaluaciones', audit.name);

      assessments.forEach((assessment, index) => {
        if (doc.y > doc.page.height - 150) {
          doc.addPage();
          addHeader(doc, 'Detalle de Evaluaciones (cont.)', audit.name);
        }

        const statusColor = complianceColors[assessment.compliance] || colors.secondary;

        doc.fontSize(11)
          .font('Helvetica-Bold')
          .fillColor(colors.dark)
          .text(`${index + 1}. ${assessment.Control?.control_code || 'N/A'}`, { continued: true });

        doc.font('Helvetica')
          .text(` - ${assessment.Control?.control_statement?.substring(0, 80) || 'Sin descripción'}...`);

        doc.fontSize(10)
          .fillColor(statusColor)
          .text(`   Estado: ${assessment.compliance || 'Pendiente'}`, { continued: true });

        doc.fillColor(colors.secondary)
          .text(`  |  Puntuación: ${assessment.score || 'N/A'}`);

        if (assessment.notes) {
          doc.fillColor(colors.secondary)
            .fontSize(9)
            .text(`   Notas: ${assessment.notes.substring(0, 100)}...`);
        }
        doc.moveDown(0.5);
      });

      // Página de Hallazgos
      if (findings.length > 0) {
        doc.addPage();
        addHeader(doc, 'Hallazgos Detallados', audit.name);

        findings.forEach((finding, index) => {
          if (doc.y > doc.page.height - 120) {
            doc.addPage();
            addHeader(doc, 'Hallazgos Detallados (cont.)', audit.name);
          }

          const sevColor = severityColors[finding.severity] || colors.secondary;

          doc.rect(50, doc.y, doc.page.width - 100, 3).fill(sevColor);
          doc.y += 8;

          doc.fontSize(12)
            .font('Helvetica-Bold')
            .fillColor(colors.dark)
            .text(`${index + 1}. ${finding.title}`);

          doc.fontSize(10)
            .font('Helvetica')
            .fillColor(sevColor)
            .text(`Severidad: ${finding.severity.toUpperCase()}`, { continued: true });

          doc.fillColor(colors.secondary)
            .text(`  |  Estado: ${finding.status}`);

          doc.fillColor(colors.dark)
            .text(finding.description || 'Sin descripción', { indent: 10 });

          if (finding.action_plan) {
            doc.fillColor(colors.success)
              .fontSize(9)
              .text(`Plan de Acción: ${finding.action_plan}`, { indent: 10 });
          }
          doc.moveDown(1);
        });
      }

      // Agregar números de página
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        addFooter(doc, i + 1, pages.count);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// 2. Resumen Ejecutivo
const generateExecutiveSummary = (audit, assessments, findings) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, bufferPages: true });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      addHeader(doc, 'RESUMEN EJECUTIVO', audit.name);

      // Información general
      addSection(doc, 'Información General');
      doc.fontSize(11);
      doc.text(`Nombre: ${audit.name}`);
      doc.text(`Estado: ${audit.status}`);
      doc.text(`Período: ${new Date(audit.start_date).toLocaleDateString('es-ES')} - ${new Date(audit.end_date).toLocaleDateString('es-ES')}`);
      doc.moveDown();

      // KPIs
      addSection(doc, 'Indicadores Clave');
      const total = assessments.length;
      const compliant = assessments.filter(a => a.compliance === 'compliant').length;
      const rate = total > 0 ? (compliant / total * 100).toFixed(1) : 0;

      doc.fontSize(11);
      doc.text(`• Tasa de Cumplimiento: ${rate}%`);
      doc.text(`• Controles Evaluados: ${total}`);
      doc.text(`• Controles Cumplidos: ${compliant}`);
      doc.text(`• Hallazgos Totales: ${findings.length}`);
      doc.text(`• Hallazgos Críticos/Altos: ${findings.filter(f => ['critical', 'high'].includes(f.severity)).length}`);
      doc.moveDown();

      // Conclusiones
      addSection(doc, 'Conclusiones y Recomendaciones');
      if (parseFloat(rate) >= 80) {
        doc.fillColor(colors.success).text('✓ La auditoría muestra un nivel de cumplimiento satisfactorio.');
      } else if (parseFloat(rate) >= 60) {
        doc.fillColor(colors.warning).text('⚠ Se requieren mejoras en algunos controles.');
      } else {
        doc.fillColor(colors.danger).text('✗ Se identificaron deficiencias significativas que requieren atención inmediata.');
      }

      doc.fillColor(colors.dark).moveDown();

      if (findings.length > 0) {
        doc.text('Principales hallazgos a atender:');
        findings.slice(0, 5).forEach((f, i) => {
          doc.fontSize(10).text(`${i + 1}. ${f.title} (${f.severity.toUpperCase()})`, { indent: 15 });
        });
      }

      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        addFooter(doc, i + 1, pages.count);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// 3. Reporte de Cumplimiento por Dominio
const generateComplianceByDomainReport = (audit, assessments, findings) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, bufferPages: true });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      addHeader(doc, 'CUMPLIMIENTO POR DOMINIO COBIT 5', audit.name);

      // Agrupar por dominio
      const byDomain = assessments.reduce((acc, a) => {
        const domain = a.Control?.CobitProcess?.domain || 'Otros';
        if (!acc[domain]) {
          acc[domain] = { total: 0, compliant: 0, partial: 0, nonCompliant: 0 };
        }
        acc[domain].total++;
        if (a.compliance === 'compliant') acc[domain].compliant++;
        else if (a.compliance === 'partially_compliant') acc[domain].partial++;
        else if (a.compliance === 'non_compliant') acc[domain].nonCompliant++;
        return acc;
      }, {});

      const domainNames = {
        'EDM': 'Evaluar, Dirigir y Monitorear',
        'APO': 'Alinear, Planificar y Organizar',
        'BAI': 'Construir, Adquirir e Implementar',
        'DSS': 'Entregar, Dar Servicio y Soporte',
        'MEA': 'Monitorear, Evaluar y Valorar'
      };

      Object.entries(byDomain).forEach(([domain, data]) => {
        addSection(doc, `${domain} - ${domainNames[domain] || domain}`);

        const rate = data.total > 0 ? (data.compliant / data.total * 100).toFixed(1) : 0;

        doc.fontSize(11);
        doc.text(`Total de controles: ${data.total}`);
        doc.fillColor(colors.success).text(`Cumplidos: ${data.compliant}`);
        doc.fillColor(colors.warning).text(`Parcialmente cumplidos: ${data.partial}`);
        doc.fillColor(colors.danger).text(`No cumplidos: ${data.nonCompliant}`);
        doc.fillColor(colors.primary).text(`Tasa de cumplimiento: ${rate}%`);
        doc.fillColor(colors.dark);
        doc.moveDown();
      });

      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        addFooter(doc, i + 1, pages.count);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// 4. Reporte de Hallazgos
const generateFindingsReport = (audit, findings) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, bufferPages: true, layout: 'landscape' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      addHeader(doc, 'REPORTE DE HALLAZGOS', audit.name);

      if (findings.length === 0) {
        doc.fontSize(14).text('No se encontraron hallazgos para esta auditoría.', { align: 'center' });
      } else {
        // Tabla de hallazgos
        const headers = ['#', 'Título', 'Severidad', 'Estado', 'Responsable', 'Fecha Límite'];
        const rows = findings.map((f, i) => [
          i + 1,
          (f.title || '').substring(0, 40),
          (f.severity || '').toUpperCase(),
          f.status || '-',
          f.owner?.name || 'Sin asignar',
          f.due_date ? new Date(f.due_date).toLocaleDateString('es-ES') : '-'
        ]);

        addTable(doc, headers, rows);

        // Detalle por severidad
        doc.addPage();
        addHeader(doc, 'DETALLE POR SEVERIDAD', audit.name);

        ['critical', 'high', 'medium', 'low'].forEach(severity => {
          const filtered = findings.filter(f => f.severity === severity);
          if (filtered.length > 0) {
            addSection(doc, `${severity.toUpperCase()} (${filtered.length})`);
            filtered.forEach((f, i) => {
              doc.fontSize(10)
                .fillColor(severityColors[severity])
                .text(`${i + 1}. ${f.title}`);
              doc.fillColor(colors.secondary)
                .fontSize(9)
                .text(`   ${f.description?.substring(0, 150) || 'Sin descripción'}...`);
              doc.moveDown(0.3);
            });
            doc.moveDown();
          }
        });
      }

      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        addFooter(doc, i + 1, pages.count);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// 5. Evaluación de Riesgos
const generateRiskAssessmentReport = (audit, findings) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, bufferPages: true });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      addHeader(doc, 'EVALUACIÓN DE RIESGOS', audit.name);

      addSection(doc, 'Matriz de Riesgos');
      doc.fontSize(11);
      doc.text('Los riesgos se clasifican según su impacto y probabilidad:');
      doc.moveDown();

      // Calcular risk score para cada hallazgo
      const risksWithScore = findings.map(f => ({
        ...f,
        riskScore: (f.likelihood || 3) * (f.impact || 3)
      })).sort((a, b) => b.riskScore - a.riskScore);

      const headers = ['Hallazgo', 'Impacto', 'Probabilidad', 'Score', 'Nivel'];
      const rows = risksWithScore.map(f => {
        const level = f.riskScore >= 15 ? 'CRÍTICO' : f.riskScore >= 10 ? 'ALTO' : f.riskScore >= 5 ? 'MEDIO' : 'BAJO';
        return [
          (f.title || '').substring(0, 30),
          f.impact || 3,
          f.likelihood || 3,
          f.riskScore,
          level
        ];
      });

      addTable(doc, headers, rows);

      addSection(doc, 'Resumen de Riesgos');
      const critical = risksWithScore.filter(r => r.riskScore >= 15).length;
      const high = risksWithScore.filter(r => r.riskScore >= 10 && r.riskScore < 15).length;
      const medium = risksWithScore.filter(r => r.riskScore >= 5 && r.riskScore < 10).length;
      const low = risksWithScore.filter(r => r.riskScore < 5).length;

      doc.fillColor(colors.danger).text(`Riesgos Críticos: ${critical}`);
      doc.fillColor('#DC2626').text(`Riesgos Altos: ${high}`);
      doc.fillColor(colors.warning).text(`Riesgos Medios: ${medium}`);
      doc.fillColor(colors.success).text(`Riesgos Bajos: ${low}`);

      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        addFooter(doc, i + 1, pages.count);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// 6. Estado de Controles
const generateControlStatusReport = (audit, assessments) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, bufferPages: true, layout: 'landscape' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      addHeader(doc, 'ESTADO DE CONTROLES', audit.name);

      const headers = ['Código', 'Control', 'Dominio', 'Cumplimiento', 'Puntuación', 'Estado'];
      const rows = assessments.map(a => [
        a.Control?.control_code || '-',
        (a.Control?.control_statement || '').substring(0, 35) + '...',
        a.Control?.CobitProcess?.domain || '-',
        a.compliance || 'Pendiente',
        a.score || '-',
        a.status || '-'
      ]);

      addTable(doc, headers, rows);

      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        addFooter(doc, i + 1, pages.count);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// 7. Plan de Acción
const generateActionPlanReport = (audit, findings) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, bufferPages: true });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      addHeader(doc, 'PLAN DE ACCIÓN', audit.name);

      addSection(doc, 'Acciones Correctivas');

      const findingsWithAction = findings.filter(f => f.action_plan || f.status !== 'closed');

      if (findingsWithAction.length === 0) {
        doc.fontSize(12).text('No hay acciones pendientes para esta auditoría.', { align: 'center' });
      } else {
        findingsWithAction.forEach((f, i) => {
          if (doc.y > doc.page.height - 150) {
            doc.addPage();
            addHeader(doc, 'PLAN DE ACCIÓN (cont.)', audit.name);
          }

          doc.fontSize(12)
            .font('Helvetica-Bold')
            .fillColor(colors.dark)
            .text(`${i + 1}. ${f.title}`);

          doc.fontSize(10)
            .font('Helvetica')
            .fillColor(severityColors[f.severity] || colors.secondary)
            .text(`Severidad: ${f.severity?.toUpperCase() || 'N/A'}`, { continued: true });

          doc.fillColor(colors.secondary)
            .text(`  |  Estado: ${f.status || 'Abierto'}`);

          doc.fillColor(colors.dark);
          doc.text(`Responsable: ${f.owner?.name || 'Sin asignar'}`);
          doc.text(`Fecha Límite: ${f.due_date ? new Date(f.due_date).toLocaleDateString('es-ES') : 'No definida'}`);

          if (f.action_plan) {
            doc.moveDown(0.3);
            doc.fillColor(colors.primary)
              .font('Helvetica-Bold')
              .text('Plan de Acción:');
            doc.font('Helvetica')
              .fillColor(colors.dark)
              .text(f.action_plan, { indent: 10 });
          }

          doc.moveDown(1);
          doc.moveTo(50, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke(colors.light);
          doc.moveDown(0.5);
        });
      }

      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        addFooter(doc, i + 1, pages.count);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateAuditReport,
  generateExecutiveSummary,
  generateComplianceByDomainReport,
  generateFindingsReport,
  generateRiskAssessmentReport,
  generateControlStatusReport,
  generateActionPlanReport
};