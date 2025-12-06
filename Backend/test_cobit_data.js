#!/usr/bin/env node
require('dotenv').config();
const { sequelize, Control, CobitProcess } = require('./src/models');

const checkCobitData = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa\n');

    const controlCount = await Control.count();
    const processCount = await CobitProcess.count();

    console.log(`📊 Datos COBIT cargados:`);
    console.log(`   - Procesos: ${processCount}`);
    console.log(`   - Controles: ${controlCount}\n`);

    if (controlCount === 0) {
      console.log('❌ No hay controles en la base de datos.');
      console.log('   Por favor, reinicia el servidor para cargar los datos.\n');
    } else {
      console.log('✅ Los datos se han cargado correctamente.');
      
      // Mostrar algunos controles como muestra
      const samples = await Control.findAll({ limit: 5 });
      console.log('\n📋 Muestra de controles:');
      samples.forEach(c => {
        console.log(`   - ${c.control_code}: ${c.control_statement.substring(0, 60)}...`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

checkCobitData();
