const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let SubmitRun = sequelize.define('SubmitRun', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  event_id: {
    type: DataTypes.BIGINT(20),
    references: 'events',
    referencesKey: 'id',
    allowNull: false
  },
  run_id:{
    type: DataTypes.BIGINT(20),
    references: 'runs',
    referencesKey: 'id',
    allowNull: false
  },
  reviewed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  approved: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'SubmitRun',
  tableName: 'submit_runs',
});

module.exports = SubmitRun;
