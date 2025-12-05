const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { User } = require('../models');

// Obtener todos los usuarios (solo admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
    });
  }
});

// Obtener usuario por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }
    
    // Solo admin o el usuario mismo puede ver el perfil
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado',
      });
    }
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
    });
  }
});

// Crear nuevo usuario (solo admin)
router.post('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos',
      });
    }
    
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado',
      });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'auditor',
      is_active: true,
    });
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
    });
  }
});

// Actualizar usuario (solo admin o el usuario mismo)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    
    // Solo admin o el usuario mismo puede actualizar
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado',
      });
    }
    
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role && req.user.role === 'admin') user.role = role;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
    });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }
    
    await user.destroy();
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
    });
  }
});

module.exports = router;
