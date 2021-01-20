const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let EventRun = sequelize.define('EventRun', {
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

module.exports = EventRun;
