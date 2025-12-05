const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Audit = sequelize.define('Audit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  start_date: {
    type: DataTypes.DATE
  },
  end_date: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('planned', 'in_progress', 'review', 'completed', 'cancelled'),
    defaultValue: 'planned'
  },
  scope_processes: {
    type: DataTypes.ARRAY(DataTypes.INTEGER)
  },
  scoring_config: {
    type: DataTypes.JSON,
    defaultValue: {
      compliant: 100,
      partially_compliant: 50,
      non_compliant: 0,
      not_applicable: null
    }
  }
}, {
  tableName: 'audits',
  timestamps: true
});

module.exports = Audit;