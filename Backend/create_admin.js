#!/usr/bin/env node
require('dotenv').config();
const { sequelize, User } = require('./src/models');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    await sequelize.authenticate();
    
    // Verificar si ya existe un usuario admin
    let admin = await User.findOne({ where: { email: 'admin@cobit.com' } });
    
    if (admin) {
      console.log('ℹ️  El usuario admin ya existe\n');
      console.log('📧 Email: admin@cobit.com');
      console.log('🔐 Contraseña: admin123\n');
    } else {
      // Crear el usuario admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      admin = await User.create({
        name: 'Administrador',
        email: 'admin@cobit.com',
        password: hashedPassword,
        role: 'admin',
        is_active: true
      });
      
      console.log('✅ Usuario administrador creado exitosamente\n');
      console.log('📧 Email: admin@cobit.com');
      console.log('🔐 Contraseña: admin123\n');
      console.log('⚠️  Guarda estas credenciales en un lugar seguro\n');
    }
    
    // Mostrar todos los usuarios
    const users = await User.findAll();
    console.log(`📋 Total de usuarios: ${users.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

createAdminUser();
