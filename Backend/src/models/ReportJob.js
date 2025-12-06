const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const ReportJob = sequelize.define('ReportJob', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  filters: {
    type: DataTypes.JSON
  },
  result_urls: {
    type: DataTypes.JSON
  },
  error: {
    type: DataTypes.TEXT
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'report_jobs',
  timestamps: true
});

module.exports = ReportJob;
