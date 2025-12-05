const { User } = require('../models');
const bcrypt = require('bcryptjs');

const seedAdminUser = async () => {
  try {
    // Verificar si ya existe un admin
    const adminExists = await User.findOne({ where: { email: 'admin@cobit.com' } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.create({
        name: 'Administrador',
        email: 'admin@cobit.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Usuario administrador creado:');
      console.log('   Email: admin@cobit.com');
      console.log('   Contraseña: admin123');
    } else {
      console.log('ℹ️  Usuario administrador ya existe');
    }
    
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  require('dotenv').config();
  const { sequelize, syncModels } = require('../models');
  
  (async () => {
    await syncModels(false);
    await seedAdminUser();
    process.exit(0);
  })();
}

module.exports = seedAdminUser;