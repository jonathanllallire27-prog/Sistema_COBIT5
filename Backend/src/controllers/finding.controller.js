const { Finding, Audit, Control, User } = require('../models');

// Crear hallazgo
const createFinding = async (req, res) => {
  try {
    const { auditId } = req.params;
    const {
      title,
      description,
      severity,
      likelihood,
      impact,
      control_id,
      owner_id,
      action_plan,
      due_date
    } = req.body;
    
    // Verificar que la auditoría existe
    const audit = await Audit.findByPk(auditId);
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }
    
    const finding = await Finding.create({
      audit_id: auditId,
      title,
      description,
      severity: severity || 'medium',
      likelihood: likelihood || 3,
      impact: impact || 3,
      control_id,
      owner_id: owner_id || req.user.id,
      action_plan,
      due_date,
      status: 'open'
    });
    
    res.status(201).json({
      success: true,
      message: 'Hallazgo creado exitosamente',
      data: finding
    });
    
  } catch (error) {
    console.error('Error creando hallazgo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear hallazgo'
    });
  }
};

// (will export after all handlers are defined)

// Obtener hallazgos de una auditoría
const getFindingsByAudit = async (req, res) => {
  try {
    const { auditId } = req.params;
    
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
      order: [
        ['severity', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });
    
    // Calcular nivel de riesgo para cada hallazgo
    const findingsWithRisk = findings.map(finding => {
      const riskScore = finding.likelihood * finding.impact;
      let riskLevel = 'low';
      
      if (riskScore >= 20) riskLevel = 'critical';
      else if (riskScore >= 12) riskLevel = 'high';
      else if (riskScore >= 6) riskLevel = 'medium';
      
      return {
        ...finding.toJSON(),
        risk_score: riskScore,
        risk_level: riskLevel
      };
    });
    
    res.json({
      success: true,
      data: findingsWithRisk
    });
    
  } catch (error) {
    console.error('Error obteniendo hallazgos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener hallazgos'
    });
  }
};

// Actualizar hallazgo
const updateFinding = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const finding = await Finding.findByPk(id);
    
    if (!finding) {
      return res.status(404).json({
        success: false,
        message: 'Hallazgo no encontrado'
      });
    }
    
    // Si se está cerrando el hallazgo, agregar fecha de cierre
    if (updates.status === 'closed' && finding.status !== 'closed') {
      updates.closed_at = new Date();
    }
    
    await finding.update(updates);
    
    res.json({
      success: true,
      message: 'Hallazgo actualizado exitosamente',
      data: finding
    });
    
  } catch (error) {
    console.error('Error actualizando hallazgo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar hallazgo'
    });
  }
};

// Eliminar hallazgo
const deleteFinding = async (req, res) => {
  try {
    const { id } = req.params;
    
    const finding = await Finding.findByPk(id);
    
    if (!finding) {
      return res.status(404).json({
        success: false,
        message: 'Hallazgo no encontrado'
      });
    }
    
    await finding.destroy();
    
    res.json({
      success: true,
      message: 'Hallazgo eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error eliminando hallazgo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar hallazgo'
    });
  }
};

// Export functions after all handlers are defined

// Agregar evidencia a un hallazgo
const addFindingEvidence = async (req, res) => {
  try {
    const { findingId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó archivo'
      });
    }

    const finding = await Finding.findByPk(findingId);

    if (!finding) {
      return res.status(404).json({
        success: false,
        message: 'Hallazgo no encontrado'
      });
    }

    const evidence = await require('../models/Evidence').create({
      finding_id: findingId,
      filename: req.file.originalname,
      filepath: req.file.path,
      filetype: req.file.mimetype,
      filesize: req.file.size,
      uploaded_by: req.user.id,
      description: req.body.description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Evidencia agregada al hallazgo exitosamente',
      data: evidence
    });

  } catch (error) {
    console.error('Error agregando evidencia al hallazgo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar evidencia'
    });
  }
};

module.exports = {
  createFinding,
  getFindingsByAudit,
  updateFinding,
  deleteFinding,
  addFindingEvidence
};