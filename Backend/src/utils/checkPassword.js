const bcrypt = require('bcryptjs');
const hash = '$2a$10$Ugmj78iuO.l5oeRD6EWB9e8Z8X5W.V597giMtAAbDUHoSwxjTYo96';
(async () => {
  const ok = await bcrypt.compare('admin123', hash);
  console.log('compare admin123 =>', ok);
  const ok2 = await bcrypt.compare('Admin123', hash);
  console.log('compare Admin123 =>', ok2);
})();
