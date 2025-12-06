#!/usr/bin/env node
require('dotenv').config();
const { sequelize, syncModels, Audit, Assessment } = require('./src/models');

const reinitializeDatabase = async () => {
  try {
    console.log('⚠️  Reinicializando base de datos...\n');
    
    // Sincronizar modelos con force=true para recrear todas las tablas
    await syncModels(true);
    
    console.log('✅ Base de datos reestablecida exitosamente\n');
    console.log('📋 Auditorías: 0');
    console.log('📋 Evaluaciones: 0');
    console.log('\n✅ La base de datos está lista para empezar de nuevo.\n');

  } catch (error) {
    console.error('❌ Error reinicializando base de datos:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

reinitializeDatabase();
