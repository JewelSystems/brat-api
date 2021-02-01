const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let BidwarOption = sequelize.define('BidwarOption', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  incentive_id: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
  option: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'BidwarOption',
  tableName: 'bidwar_options',
});

module.exports = BidwarOption;
