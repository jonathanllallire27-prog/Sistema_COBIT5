const { Assessment, Control, Evidence, CobitProcess } = require('../models');

// Obtener evaluaciones de una auditoría
const getAssessmentsByAudit = async (req, res) => {
  try {
    const { auditId } = req.params;
    
    const assessments = await Assessment.findAll({
      where: { audit_id: auditId },
      include: [
        {
          model: Control,
          include: [CobitProcess]
        },
        {
          model: Evidence
        }
      ],
      order: [['createdAt', 'ASC']]
    });
    
    res.json({
      success: true,
      data: assessments
    });
    
  } catch (error) {
    console.error('Error obteniendo evaluaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener evaluaciones'
    });
  }
};

// Actualizar evaluación
const updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { compliance, score, notes, evidence_summary, status } = req.body;
    
    const assessment = await Assessment.findByPk(id);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no encontrada'
      });
    }
    
    // Verificar que el usuario tenga acceso a la auditoría
    // (Se podría agregar lógica adicional aquí)
    
    await assessment.update({
      compliance,
      score,
      notes,
      evidence_summary,
      status: status || 'completed'
    });
    
    res.json({
      success: true,
      message: 'Evaluación actualizada exitosamente',
      data: assessment
    });
    
  } catch (error) {
    console.error('Error actualizando evaluación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar evaluación'
    });
  }
};

// Agregar evidencia a evaluación
const addEvidence = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó archivo'
      });
    }
    
    const assessment = await Assessment.findByPk(assessmentId);
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no encontrada'
      });
    }
    
    const evidence = await Evidence.create({
      assessment_id: assessmentId,
      filename: req.file.originalname,
      filepath: req.file.path,
      filetype: req.file.mimetype,
      filesize: req.file.size,
      uploaded_by: req.user.id,
      description: req.body.description || ''
    });
    
    res.status(201).json({
      success: true,
      message: 'Evidencia agregada exitosamente',
      data: evidence
    });
    
  } catch (error) {
    console.error('Error agregando evidencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar evidencia'
    });
  }
};

module.exports = {
  getAssessmentsByAudit,
  updateAssessment,
  addEvidence
};