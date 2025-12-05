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

module.exports = {
  createFinding,
  getFindingsByAudit,
  updateFinding,
  deleteFinding
};