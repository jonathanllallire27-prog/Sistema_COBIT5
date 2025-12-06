require('dotenv').config();
const { sequelize, syncModels, User } = require('../models');

(async () => {
  try {
    await syncModels(false);
    const user = await User.findOne({ where: { email: 'admin@cobit.com' } });
    if (!user) {
      console.log('No existe admin@cobit.com');
      process.exit(0);
    }
    console.log('Usuario encontrado:');
    console.log({ id: user.id, email: user.email, name: user.name, role: user.role, passwordHash: user.password });
    process.exit(0);
  } catch (e) {
    console.error('Error checking user', e);
    process.exit(1);
  }
})();
