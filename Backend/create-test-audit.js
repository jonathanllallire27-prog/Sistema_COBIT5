require('dotenv').config();
const { sequelize, syncModels } = require('./src/models');

async function createTestAudit() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a base de datos establecida');

    await syncModels(false);
    console.log('✓ Modelos sincronizados');

    const { Audit, User } = require('./src/models');

    // Get admin user
    const admin = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (!admin) {
      console.log('❌ Usuario admin no encontrado');
      process.exit(1);
    }

    // Create test audit
    const audit = await Audit.create({
      name: 'Auditoría Inicial - Dominio EDM',
      description: 'Evaluación inicial del dominio EDM (Ensure Delivery and Support) de COBIT 5',
      status: 'in_progress',
      start_date: new Date('2024-01-15'),
      end_date: new Date('2024-02-15'),
      created_by: admin.id,
      scope_processes: [1, 2, 3, 4, 5],
      scoring_config: {
        compliant: 100,
        partially_compliant: 50,
        non_compliant: 0,
        not_applicable: null
      }
    });

    console.log('✓ Auditoría de prueba creada:');
    console.log(`  ID: ${audit.id}`);
    console.log(`  Nombre: ${audit.name}`);
    console.log(`  Estado: ${audit.status}`);

    console.log('\n✅ Datos de prueba creados exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestAudit();
