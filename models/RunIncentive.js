const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');
const BidwarOption = require('./BidwarOption');

let RunIncentive = sequelize.define('RunIncentive', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  run_id: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },  
  comment: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  name:{
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  sequelize,
  timestamps: false,
  modelName: 'RunIncentive',
  tableName: 'run_incentives',
});

RunIncentive.hasMany(BidwarOption, {
  foreignKey: 'incentive_id'
});

module.exports = RunIncentive;
