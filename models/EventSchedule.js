const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');
const EventRun = require('./EventRun');
const EventExtra = require('./EventExtra');

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
    allowNull: false
  },
  event_run_id:{
    type: DataTypes.BIGINT(20),
  },
  event_extra_id:{
    type: DataTypes.BIGINT(20),
  },
  setup_time:{
    type: DataTypes.BIGINT(20)
  },
  extra_time:{
    type: DataTypes.BIGINT(20)
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

EventSchedule.belongsTo(EventRun, {
  foreignKey: 'event_run_id',
});

EventSchedule.belongsTo(EventExtra, {
  foreignKey: 'event_extra_id',
});

module.exports = EventSchedule;
