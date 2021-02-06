const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');
const Run = require('../models/Run');
const RunIncentive = require('../models/RunIncentive');

let EventRun = sequelize.define('EventRun', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  event_id: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
  run_id:{
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'EventRun',
  tableName: 'event_runs',
});

EventRun.belongsTo(Run, {
  foreignKey: 'run_id',
});

module.exports = EventRun;
