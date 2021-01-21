const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let EventSchedule = sequelize.define('EventSchedule', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  order: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  event_id: {
    type: DataTypes.BIGINT(20),
    references: 'events',
    referencesKey: 'id',
    allowNull: false
  },
  event_run_id:{
    type: DataTypes.BIGINT(20),
    references: 'event_runs',
    referencesKey: 'id',
  },
  event_extra_id:{
    type: DataTypes.BIGINT(20),
    references: 'event_extras',
    referencesKey: 'id',
  },
  setup_time:{
    type: DataTypes.BIGINT(20)
  },
  extra_time:{
    type: DataTypes.BIGINT(20)
  },
  reviewed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  done: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  final_time: {
    type: DataTypes.BIGINT(20)
  }
}, {
  sequelize,
  timestamps: false,
  modelName: 'EventSchedule',
  tableName: 'event_schedule',
});

module.exports = EventSchedule;