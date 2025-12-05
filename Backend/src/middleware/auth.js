const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso denegado. No se proporcionó token.' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    
    // Buscar usuario
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.is_active) {
      throw new Error('Usuario no encontrado o inactivo');
    }

    // Agregar usuario a la request
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido o expirado.' 
    });
  }
};

// Middleware para verificar roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción.'
      });
    }
    next();
  };
};

module.exports = { auth, authorize };

module.exports = { auth, authorize };