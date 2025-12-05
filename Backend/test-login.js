require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./src/models');

async function testLogin() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a base de datos establecida\n');

    // Test admin login
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin123';

    console.log(`Probando login con: ${adminEmail} / ${adminPassword}`);
    
    const user = await User.findOne({ where: { email: adminEmail } });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      process.exit(1);
    }

    console.log(`✓ Usuario encontrado: ${user.name}`);

    const isValidPassword = await bcrypt.compare(adminPassword, user.password);
    
    if (isValidPassword) {
      console.log('✓ Contraseña es correcta');
      console.log('\n✅ LOGIN EXITOSO - Puedes loguearte en el sistema');
    } else {
      console.log('❌ Contraseña es incorrecta');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLogin();
