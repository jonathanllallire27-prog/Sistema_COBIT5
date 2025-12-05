const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending'
  },
  compliance: {
    type: DataTypes.ENUM('compliant', 'partially_compliant', 'non_compliant', 'not_applicable')
  },
  score: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 5
    }
  },
  notes: {
    type: DataTypes.TEXT
  },
  evidence_summary: {
    type: DataTypes.TEXT
  },
  audit_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'audits',
      key: 'id'
    }
  },
  control_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'controls',
      key: 'id'
    }
  }
}, {
  tableName: 'audit_assessments',
  timestamps: true
});

module.exports = Assessment;