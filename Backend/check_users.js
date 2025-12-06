#!/usr/bin/env node
require('dotenv').config();
const { sequelize, User } = require('./src/models');

const checkUsers = async () => {
  try {
    await sequelize.authenticate();
    
    const users = await User.findAll();
    
    console.log(`✅ Total de usuarios: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      console.log('   Necesitas crear un usuario admin\n');
    } else {
      console.log('👤 Usuarios disponibles:');
      users.forEach(u => {
        console.log(`   - ${u.email} (${u.role})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

checkUsers();
