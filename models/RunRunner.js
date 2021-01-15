const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let RunRunners = sequelize.define('RunRunners', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  runner_id: {
    type: DataTypes.BIGINT(20),
    references: 'users',
    referencesKey: 'id',
    allowNull: false
  },
  run_id: {
    type: DataTypes.BIGINT(20),
    references: 'runs',
    referencesKey: 'id',
    allowNull: false
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'RunRunners',
  tableName: 'run_runners',
});

module.exports = RunRunners;
