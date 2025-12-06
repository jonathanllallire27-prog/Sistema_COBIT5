#!/usr/bin/env node
require('dotenv').config();
const { sequelize, User } = require('./src/models');
const bcrypt = require('bcryptjs');

const testPasswordVerification = async () => {
  try {
    await sequelize.authenticate();
    
    // Obtener el usuario admin
    const user = await User.findOne({ where: { email: 'admin@cobit.com' } });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('👤 Usuario encontrado: admin@cobit.com\n');
    
    // Probar comparación de contraseña
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    console.log(`🔐 Contraseña introducida: ${testPassword}`);
    console.log(`🔐 Hash en BD: ${user.password.substring(0, 30)}...`);
    console.log(`✅ ¿Contraseña válida? ${isValid}\n`);
    
    if (!isValid) {
      console.log('⚠️  Rehashing password...');
      const newHash = await bcrypt.hash(testPassword, 10);
      await user.update({ password: newHash });
      console.log('✅ Contraseña actualizada\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

testPasswordVerification();
