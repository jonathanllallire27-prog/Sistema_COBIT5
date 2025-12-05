const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const CobitProcess = sequelize.define('CobitProcess', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  domain: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  process_code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  process_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  process_goals: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  }
}, {
  tableName: 'cobit_processes',
  timestamps: true
});

module.exports = CobitProcess;