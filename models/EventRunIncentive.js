const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let EventRunIncentive = sequelize.define('EventRunIncentive', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  event_run_id: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
  incentive_id: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
  cur_value: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  goal: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: false,
  modelName: 'EventRunIncentive',
  tableName: 'event_run_incentives',
});

module.exports = EventRunIncentive;
