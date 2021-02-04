const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let EventRunBidwarOption = sequelize.define('EventRunBidwarOption', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  event_run_incentive_id: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
  bidwar_option_id: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
  cur_value: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'EventRunBidwarOption',
  tableName: 'event_run_bidwar_options',
});

module.exports = EventRunBidwarOption;
