require('dotenv').config();
const { syncModels, User } = require('../models');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    await syncModels(false);
    const user = await User.findOne({ where: { email: 'admin@cobit.com' } });
    if (!user) {
      console.log('No existe admin@cobit.com');
      process.exit(1);
    }
    // Assign plain password so the model's beforeUpdate hook hashes it once
    user.password = 'admin123';
    await user.save();
    console.log('✅ Password de admin@cobit.com actualizada a admin123');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
})();
