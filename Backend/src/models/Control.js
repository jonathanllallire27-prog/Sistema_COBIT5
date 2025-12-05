const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Control = sequelize.define('Control', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  control_code: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  control_statement: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  metrics: {
    type: DataTypes.TEXT
  },
  maturity_levels: {
    type: DataTypes.JSON,
    defaultValue: {
      0: 'No existe o incompleto',
      1: 'Inicial/Ad-hoc',
      2: 'Repetible pero intuitivo',
      3: 'Definido y documentado',
      4: 'Gestionado y medido',
      5: 'Optimizado'
    }
  },
  weight: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.0,
    validate: {
      min: 0,
      max: 5
    }
  }
}, {
  tableName: 'controls',
  timestamps: true
});

module.exports = Control;