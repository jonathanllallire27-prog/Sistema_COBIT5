const { sequelize } = require('../utils/database');

// Importar modelos
const User = require('./User');
const Audit = require('./Audit');
const Control = require('./Control');
const Finding = require('./Finding');
const Assessment = require('./Assessment');
const Evidence = require('./Evidence');
const CobitProcess = require('./CobitProcess');
const ReportJob = require('./ReportJob');

// Definir relaciones
const defineRelationships = () => {
  // Usuario puede crear múltiples auditorías
  User.hasMany(Audit, { foreignKey: 'created_by' });
  Audit.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

  // Auditoría tiene múltiples evaluaciones
  Audit.hasMany(Assessment, { foreignKey: 'audit_id' });
  Assessment.belongsTo(Audit, { foreignKey: 'audit_id' });

  // Control puede estar en múltiples evaluaciones
  Control.hasMany(Assessment, { foreignKey: 'control_id' });
  Assessment.belongsTo(Control, { foreignKey: 'control_id' });

  // Control pertenece a un proceso COBIT
  CobitProcess.hasMany(Control, { foreignKey: 'process_id' });
  Control.belongsTo(CobitProcess, { foreignKey: 'process_id' });

  // Auditoría tiene múltiples hallazgos
  Audit.hasMany(Finding, { foreignKey: 'audit_id' });
  Finding.belongsTo(Audit, { foreignKey: 'audit_id' });

  // Hallazgo puede estar relacionado con un control
  Control.hasMany(Finding, { foreignKey: 'control_id' });
  Finding.belongsTo(Control, { foreignKey: 'control_id' });

  // Hallazgo tiene un dueño (usuario)
  User.hasMany(Finding, { foreignKey: 'owner_id' });
  Finding.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

  // Evaluación puede tener múltiples evidencias
  Assessment.hasMany(Evidence, { foreignKey: 'assessment_id' });
  Evidence.belongsTo(Assessment, { foreignKey: 'assessment_id' });

  // Hallazgo puede tener múltiples evidencias
  Finding.hasMany(Evidence, { foreignKey: 'finding_id' });
  Evidence.belongsTo(Finding, { foreignKey: 'finding_id' });

  // Evidencia es subida por un usuario
  User.hasMany(Evidence, { foreignKey: 'uploaded_by' });
  Evidence.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });
  // Report jobs table
  // No special relationships required currently
};

// Definir relaciones inmediatamente al importar
defineRelationships();

// Sincronizar modelos
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Modelos sincronizados correctamente.');
  } catch (error) {
    console.error('Error sincronizando modelos:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Audit,
  Control,
  Finding,
  Assessment,
  Evidence,
  CobitProcess,
  ReportJob,
  syncModels
};