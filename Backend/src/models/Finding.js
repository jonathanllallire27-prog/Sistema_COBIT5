const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Finding = sequelize.define('Finding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  likelihood: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    },
    defaultValue: 3
  },
  impact: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    },
    defaultValue: 3
  },
  status: {
    type: DataTypes.ENUM('open', 'investigating', 'action_planned', 'in_remediation', 'verification', 'closed'),
    defaultValue: 'open'
  },
  action_plan: {
    type: DataTypes.TEXT
  },
  due_date: {
    type: DataTypes.DATE
  },
  closed_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'findings',
  timestamps: true
});

// Campo virtual para nivel de riesgo
Finding.prototype.getRiskLevel = function() {
  const riskScore = this.likelihood * this.impact;
  if (riskScore >= 20) return 'critical';
  if (riskScore >= 12) return 'high';
  if (riskScore >= 6) return 'medium';
  return 'low';
};

module.exports = Finding;