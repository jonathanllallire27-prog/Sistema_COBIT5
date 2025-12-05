const { CobitProcess, Control } = require('../models');

// Obtener todos los procesos COBIT
const getProcesses = async (req, res) => {
  try {
    const processes = await CobitProcess.findAll({
      order: [
        ['domain', 'ASC'],
        ['process_code', 'ASC']
      ]
    });
    
    // Agrupar por dominio
    const processesByDomain = processes.reduce((acc, process) => {
      if (!acc[process.domain]) {
        acc[process.domain] = [];
      }
      acc[process.domain].push(process);
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        processes,
        byDomain: processesByDomain
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo procesos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener procesos'
    });
  }
};

// Obtener proceso por ID
const getProcessById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const process = await CobitProcess.findByPk(id, {
      include: [{ model: Control, as: 'controls' }]
    });
    
    if (!process) {
      return res.status(404).json({
        success: false,
        message: 'Proceso no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: process
    });
  } catch (error) {
    console.error('Error obteniendo proceso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proceso'
    });
  }
};

// Obtener controles por proceso
const getControlsByProcess = async (req, res) => {
  try {
    const { processId } = req.params;
    
    const controls = await Control.findAll({
      where: { process_id: processId },
      include: [CobitProcess],
      order: [['control_code', 'ASC']]
    });
    
    res.json({
      success: true,
      data: controls
    });
    
  } catch (error) {
    console.error('Error obteniendo controles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener controles'
    });
  }
};

// Obtener todos los controles
const getControls = async (req, res) => {
  try {
    const controls = await Control.findAll({
      include: [CobitProcess],
      order: [
        ['control_code', 'ASC']
      ]
    });
    
    res.json({
      success: true,
      data: controls
    });
    
  } catch (error) {
    console.error('Error obteniendo controles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener controles'
    });
  }
};

module.exports = {
  getProcesses,
  getProcessById,
  getControlsByProcess,
  getControls
};