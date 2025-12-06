require('dotenv').config();
const { syncModels, User } = require('../models');
const bcrypt = require('bcryptjs');
(async () => {
  try {
    await syncModels(false);
    const user = await User.findOne({ where: { email: 'admin@cobit.com' } });
    if (!user) return console.log('No user');
    console.log('Hash from DB:', user.password);
    console.log('Compare admin123 =>', await bcrypt.compare('admin123', user.password));
    console.log('Compare wrong =>', await bcrypt.compare('x', user.password));
  } catch (e) { console.error(e); }
})();
