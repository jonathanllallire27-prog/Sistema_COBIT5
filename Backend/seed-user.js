require('dotenv').config();
const { sequelize, syncModels } = require('./src/models');

async function seedUser() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✓ Conexión a base de datos establecida');

    // Sync models (esto define las relaciones)
    await syncModels(false);
    console.log('✓ Modelos sincronizados');

    // Importar User aquí después de syncModels
    const { User } = require('./src/models');

    // Delete existing test users
    await User.destroy({ where: { email: 'admin@example.com' } });
    await User.destroy({ where: { email: 'auditor@example.com' } });
    console.log('✓ Usuarios anteriores eliminados');

    // Create admin user (password will be hashed by the model hook)
    const adminUser = await User.create({
      name: 'Administrator',
      email: 'admin@example.com',
      password: 'Admin123',  // Will be hashed by the before hook
      role: 'admin',
      is_active: true
    });

    console.log('✓ Usuario administrador creado exitosamente');
    console.log('  Email: admin@example.com');
    console.log('  Password: Admin123');

    // Create test auditor
    await User.create({
      name: 'Auditor Prueba',
      email: 'auditor@example.com',
      password: 'Auditor123',  // Will be hashed by the before hook
      role: 'auditor',
      is_active: true
    });
    
    console.log('✓ Usuario auditor creado exitosamente');
    console.log('  Email: auditor@example.com');
    console.log('  Password: Auditor123');

    console.log('\n✓ Seed completado exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedUser();
