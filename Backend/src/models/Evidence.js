const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Evidence = sequelize.define('Evidence', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filepath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filetype: {
    type: DataTypes.STRING(50)
  },
  filesize: {
    type: DataTypes.INTEGER
  },
  classification: {
    type: DataTypes.ENUM('public', 'internal', 'confidential', 'secret'),
    defaultValue: 'internal'
  },
  description: {
    type: DataTypes.TEXT
  },
  assessment_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'audit_assessments',
      key: 'id'
    }
  },
  finding_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'findings',
      key: 'id'
    }
  },
  uploaded_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'evidences',
  timestamps: true
});

module.exports = Evidence;