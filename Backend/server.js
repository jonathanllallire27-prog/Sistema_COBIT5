// server.js - VERSIÓN CORREGIDA
require('dotenv').config();
const app = require('./src/app');
const { sequelize, syncModels } = require('./src/models');
const loadCobitData = require('./src/utils/cobitLoader');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await sequelize.authenticate();
    
    // Sincronizar modelos (esto también define las relaciones)
    await syncModels(false);
    
    // Cargar datos iniciales de COBIT
    await loadCobitData();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.clear();
      console.log('\n✅ Backend funcionando correctamente en http://localhost:' + PORT + '\n');
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejar cierre elegante
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await sequelize.close();
  console.log('✅ Conexiones cerradas.');
  process.exit(0);
});

startServer();