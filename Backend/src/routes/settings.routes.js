const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');

// Simulación de configuración del sistema
let systemSettings = {
  organization_name: 'AuditSys',
  organization_email: 'admin@auditsys.com',
  theme: 'auto',
  notifications_email: true,
  notifications_system: true,
};

// Obtener configuración
router.get('/', auth, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    data: systemSettings,
  });
});

// Actualizar configuración
router.put('/', auth, authorize('admin'), (req, res) => {
  try {
    const { organization_name, organization_email, theme, notifications_email, notifications_system } = req.body;
    
    if (organization_name) systemSettings.organization_name = organization_name;
    if (organization_email) systemSettings.organization_email = organization_email;
    if (theme) systemSettings.theme = theme;
    if (notifications_email !== undefined) systemSettings.notifications_email = notifications_email;
    if (notifications_system !== undefined) systemSettings.notifications_system = notifications_system;
    
    res.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: systemSettings,
    });
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar configuración',
    });
  }
});

module.exports = router;
