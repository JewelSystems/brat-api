const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');
const Event = require('./Event');
const Run = require('./Run');

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
  waiting: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'SubmitRun',
  tableName: 'submit_runs',
});

SubmitRun.belongsTo(Event, {
  foreignKey: 'event_id',
});

SubmitRun.belongsTo(Run, {
  foreignKey: 'run_id',
});

module.exports = SubmitRun;
