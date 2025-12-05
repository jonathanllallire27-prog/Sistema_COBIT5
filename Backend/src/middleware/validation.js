const { body, param, validationResult } = require('express-validator');

// Validaciones de usuario
const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('role')
    .optional()
    .isIn(['admin', 'auditor', 'audit_leader', 'process_owner', 'reviewer'])
    .withMessage('Rol inválido')
];

const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido'),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
];

// Validaciones de auditoría
const validateAuditCreation = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre de la auditoría es requerido')
    .isLength({ min: 3, max: 200 }).withMessage('El nombre debe tener entre 3 y 200 caracteres'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 }).withMessage('La descripción no debe exceder 1000 caracteres'),
  
  body('start_date')
    .optional()
    .isISO8601().withMessage('Fecha de inicio inválida'),
  
  body('end_date')
    .optional()
    .isISO8601().withMessage('Fecha de fin inválida'),
  
  body('scope_processes')
    .optional()
    .isArray().withMessage('Los procesos deben ser un array')
];

const validateAssessment = [
  body('compliance')
    .isIn(['compliant', 'partially_compliant', 'non_compliant', 'not_applicable'])
    .withMessage('Estado de cumplimiento inválido'),
  
  body('score')
    .optional()
    .isInt({ min: 0, max: 5 }).withMessage('El score debe estar entre 0 y 5'),
  
  body('notes')
    .optional()
    .isLength({ max: 2000 }).withMessage('Las notas no deben exceder 2000 caracteres')
];

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateAuditCreation,
  validateAssessment,
  handleValidationErrors
};