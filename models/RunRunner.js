const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');
const User = require('../models/User');

let RunRunners = sequelize.define('RunRunners', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  runner_id: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
  run_id: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'RunRunners',
  tableName: 'run_runners',
});

RunRunners.belongsTo(User, {
  foreignKey: 'runner_id',
});

module.exports = RunRunners;
