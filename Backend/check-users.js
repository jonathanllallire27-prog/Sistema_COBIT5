require('dotenv').config();
const { sequelize, User } = require('./src/models');

async function checkUsers() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a base de datos establecida');

    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role', 'is_active']
    });

    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
    } else {
      console.log(`✓ Se encontraron ${users.length} usuarios:\n`);
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role}) - ${user.name}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
