const { Audit, Assessment, Control, CobitProcess, User, Finding } = require('../models');

// Crear nueva auditoría
const createAudit = async (req, res) => {
  try {
    const { name, description, start_date, end_date, scope_processes } = req.body;
    
    const audit = await Audit.create({
      name,
      description,
      start_date,
      end_date,
      scope_processes: scope_processes || [],
      created_by: req.user.id,
      status: 'planned'
    });
    
    // Crear evaluaciones para los controles
    let createdAssessments = 0;
    let controls;
    
    if (scope_processes && scope_processes.length > 0) {
      // Si hay procesos en el scope, obtener sus controles
      controls = await Control.findAll({
        where: { process_id: scope_processes }
      });
    } else {
      // Si no hay procesos, obtener TODOS los controles disponibles
      controls = await Control.findAll();
    }
    
    if (controls.length > 0) {
      const assessments = controls.map(control => ({
        audit_id: audit.id,
        control_id: control.id,
        status: 'pending'
      }));
      
      const resAss = await Assessment.bulkCreate(assessments);
      createdAssessments = Array.isArray(resAss) ? resAss.length : 0;
    }

    // Respond with created audit and created assessments count
    return res.status(201).json({
      success: true,
      data: audit,
      createdAssessments
    });
  } catch (error) {
    console.error('Error creando auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear auditoría'
    });
  }
};

// Obtener todas las auditorías
const getAudits = async (req, res) => {
  try {
    const audits = await Audit.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: audits
    });
    
  } catch (error) {
    console.error('Error obteniendo auditorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener auditorías'
    });
  }
};

// Obtener auditoría por ID
const getAuditById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const audit = await Audit.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Assessment,
          include: [
            {
              model: Control,
              include: [CobitProcess]
            }
          ]
        },
        {
          model: Finding,
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'name', 'email']
            },
            {
              model: Control,
              attributes: ['id', 'control_code']
            }
          ]
        }
      ]
    });
    
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: audit
    });
    
  } catch (error) {
    console.error('Error obteniendo auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener auditoría'
    });
  }
};

// Actualizar auditoría
const updateAudit = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const audit = await Audit.findByPk(id);
    
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }
    
    // Verificar permisos (solo creador o admin puede modificar)
    if (audit.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar esta auditoría'
      });
    }
    
    await audit.update(updates);
    
    res.json({
      success: true,
      message: 'Auditoría actualizada exitosamente',
      data: audit
    });
    
  } catch (error) {
    console.error('Error actualizando auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar auditoría'
    });
  }
};

// Eliminar auditoría
const deleteAudit = async (req, res) => {
  try {
    const { id } = req.params;
    
    const audit = await Audit.findByPk(id);
    
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }
    
    // Verificar permisos (solo creador o admin puede eliminar)
    if (audit.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta auditoría'
      });
    }
    
    await audit.destroy();
    
    res.json({
      success: true,
      message: 'Auditoría eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('Error eliminando auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar auditoría'
    });
  }
};

// Obtener dashboard de auditoría
const getAuditDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    
    const audit = await Audit.findByPk(id, {
      include: [
        {
          model: Assessment,
          include: [Control]
        },
        {
          model: Finding
        }
      ]
    });
    
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }
    
    // Calcular métricas
    const totalAssessments = audit.Assessments.length;
    const completedAssessments = audit.Assessments.filter(a => a.status === 'completed').length;
    const compliantAssessments = audit.Assessments.filter(a => a.compliance === 'compliant').length;
    const complianceRate = totalAssessments > 0 ? (compliantAssessments / totalAssessments * 100) : 0;
    
    // Hallazgos por severidad
    const findingsBySeverity = audit.Findings.reduce((acc, finding) => {
      acc[finding.severity] = (acc[finding.severity] || 0) + 1;
      return acc;
    }, {});
    
    // Hallazgos por estado
    const findingsByStatus = audit.Findings.reduce((acc, finding) => {
      acc[finding.status] = (acc[finding.status] || 0) + 1;
      return acc;
    }, {});
    
    // Promedio de scores
    const validScores = audit.Assessments
      .filter(a => a.score !== null && a.score !== undefined)
      .map(a => a.score);
    
    const averageScore = validScores.length > 0 
      ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
      : 0;
    
    res.json({
      success: true,
      data: {
        audit: {
          id: audit.id,
          name: audit.name,
          status: audit.status,
          start_date: audit.start_date,
          end_date: audit.end_date
        },
        metrics: {
          totalAssessments,
          completedAssessments,
          pendingAssessments: totalAssessments - completedAssessments,
          compliantAssessments,
          complianceRate: complianceRate.toFixed(2),
          averageScore: averageScore.toFixed(2),
          totalFindings: audit.Findings.length,
          findingsBySeverity,
          findingsByStatus
        }
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener dashboard'
    });
  }
};

// Exported functions will be assigned after all handlers are defined

// Obtener dashboard global de auditorías
const getGlobalDashboard = async (req, res) => {
  try {
    // Obtener todas las auditorías con sus evaluaciones y hallazgos
    const audits = await Audit.findAll({
      include: [
        { model: Assessment },
        { model: Finding }
      ]
    });

    const totalAudits = audits.length;
    const activeAudits = audits.filter(a => a.status === 'in_progress' || a.status === 'planned').length;

    // Calcular compliance por auditoría y luego promedio
    const complianceRates = audits.map(a => {
      const totalAssessments = (a.Assessments || []).length;
      const compliantAssessments = (a.Assessments || []).filter(as => as.compliance === 'compliant').length;
      return totalAssessments > 0 ? (compliantAssessments / totalAssessments * 100) : null;
    }).filter(x => x !== null);

    const complianceRate = complianceRates.length > 0 ? (complianceRates.reduce((s, v) => s + Number(v), 0) / complianceRates.length) : 0;

    // Agregar hallazgos globales
    const findings = audits.reduce((acc, a) => acc.concat(a.Findings || []), []);
    const totalFindings = findings.length;
    const findingsBySeverity = findings.reduce((acc, f) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1;
      return acc;
    }, {});

    // Promedio de scores global
    const scores = audits.reduce((acc, a) => acc.concat((a.Assessments || []).map(as => as.score).filter(s => s !== null && s !== undefined)), []);
    const averageScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const closedFindings = findings.filter(f => f.status === 'closed').length;
    const openFindings = totalFindings - closedFindings;

    res.json({
      success: true,
      data: {
        metrics: {
          totalAudits,
          activeAudits,
          complianceRate: Number(Number(complianceRate).toFixed(2)),
          totalFindings,
          openFindings,
          findingsBySeverity,
          averageScore: Number(Number(averageScore).toFixed(2))
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo dashboard global:', error);
    res.status(500).json({ success: false, message: 'Error al obtener dashboard global' });
  }
};

module.exports = {
  createAudit,
  getAudits,
  getAuditById,
  updateAudit,
  deleteAudit,
  getAuditDashboard,
  getGlobalDashboard
};

// Generar evaluaciones faltantes para una auditoría (por procesos en scope o todos los controles)
const generateAssessmentsForAudit = async (req, res) => {
  try {
    const { id } = req.params;
    const audit = await Audit.findByPk(id);
    if (!audit) {
      return res.status(404).json({ success: false, message: 'Auditoría no encontrada' });
    }

    const scope = audit.scope_processes || [];
    let controls;
    
    if (scope.length > 0) {
      // Si hay procesos en el scope, obtener sus controles
      controls = await Control.findAll({ where: { process_id: scope } });
    } else {
      // Si no hay procesos, obtener TODOS los controles disponibles
      controls = await Control.findAll();
    }

    // find existing assessments for this audit
    const existing = await Assessment.findAll({ where: { audit_id: audit.id } });
    const existingControlIds = new Set(existing.map(e => e.control_id));

    const toCreate = controls.filter(c => !existingControlIds.has(c.id)).map(c => ({
      audit_id: audit.id,
      control_id: c.id,
      status: 'pending'
    }));

    const created = toCreate.length > 0 ? await Assessment.bulkCreate(toCreate) : [];

    return res.json({ success: true, createdCount: Array.isArray(created) ? created.length : 0 });
  } catch (error) {
    console.error('Error generating assessments:', error);
    return res.status(500).json({ success: false, message: 'Error generando evaluaciones' });
  }
};

// export helper
module.exports.generateAssessmentsForAudit = generateAssessmentsForAudit;