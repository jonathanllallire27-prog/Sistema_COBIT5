#!/usr/bin/env node
require('dotenv').config();
const { sequelize, User } = require('./src/models');

const setupAdminUser = async () => {
  try {
    await sequelize.authenticate();
    
    // Eliminar usuario admin anterior si existe
    await User.destroy({ where: { email: 'admin@cobit.com' } });
    console.log('🗑️  Usuario anterior eliminado (si existía)\n');
    
    // Crear nuevo usuario admin
    // IMPORTANTE: Pasamos la contraseña en TEXTO PLANO
    // El modelo User tiene un hook beforeCreate que automáticamente hashea la contraseña
    const password = 'admin123';
    
    console.log(`📝 Creando usuario con contraseña en texto plano...`);
    console.log(`   Contraseña: ${password}\n`);
    
    const user = await User.create({
      name: 'Administrador',
      email: 'admin@cobit.com',
      password: password,  // TEXTO PLANO - el hook lo hacheará
      role: 'admin',
      is_active: true
    });
    
    console.log('✅ Usuario administrador creado:\n');
    console.log(`   📧 Email: admin@cobit.com`);
    console.log(`   🔐 Contraseña: admin123`);
    console.log(`   👤 Rol: admin\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

setupAdminUser();
