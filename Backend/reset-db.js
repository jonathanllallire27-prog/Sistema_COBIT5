require('dotenv').config();
const { sequelize, syncModels } = require('./src/models');

async function resetDatabase() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✓ Conexión a base de datos establecida');

    // Drop all tables
    await sequelize.drop({ cascade: true });
    console.log('✓ Tablas eliminadas');

    // Sync models (recreate tables with new schema)
    await syncModels(false);
    console.log('✓ Modelos recreados con nuevo esquema');

    // Importar User después de sincronizar
    const { User } = require('./src/models');

    // Delete existing test users just in case
    await User.destroy({ where: {} });

    // Create admin user
    const adminUser = await User.create({
      name: 'Administrator',
      email: 'admin@example.com',
      password: 'Admin123',
      role: 'admin',
      is_active: true
    });

    console.log('✓ Usuario administrador creado');

    // Create test auditor
    await User.create({
      name: 'Auditor Prueba',
      email: 'auditor@example.com',
      password: 'Auditor123',
      role: 'auditor',
      is_active: true
    });

    console.log('✓ Usuario auditor creado');
    console.log('\n✅ Base de datos reiniciada exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetDatabase();
