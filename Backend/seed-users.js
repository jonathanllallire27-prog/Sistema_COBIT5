const bcrypt = require('bcryptjs');
const db = require('./src/models');

async function seedUsers() {
  try {
    // Conectar a la BD
    await db.sequelize.authenticate();
    console.log('✓ Conectado a la BD');

    // Sincronizar modelos
    await db.sequelize.sync({ force: true });
    console.log('✓ BD sincronizada');

    // Crear usuarios de prueba
    const users = [
      {
        name: 'Administrador',
        email: 'admin@example.com',
        password: await bcrypt.hash('Admin123', 10),
        role: 'admin'
      },
      {
        name: 'Auditor',
        email: 'auditor@example.com',
        password: await bcrypt.hash('Auditor123', 10),
        role: 'auditor'
      },
      {
        name: 'Líder de Auditoría',
        email: 'leader@example.com',
        password: await bcrypt.hash('Leader123', 10),
        role: 'audit_leader'
      }
    ];

    for (const userData of users) {
      const user = await db.User.create(userData);
      console.log(`✓ Usuario creado: ${user.email} (${user.role})`);
    }

    console.log('\n✅ Usuarios de prueba creados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedUsers();
