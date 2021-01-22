const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');
const Game = require('./Game');
const RunRunner = require('./RunRunner');

let Run = sequelize.define('Run', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  game_id: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  estimated_time: {
    type: DataTypes.BIGINT(10),
    allowNull: false
  },
  preferred_time_slot:{
    type: DataTypes.STRING(10),
    allowNull: false
  },
  platform:{
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  sequelize,
  timestamps: false,
  modelName: 'Run',
  tableName: 'runs',
});

Run.belongsTo(Game, {
  foreignKey: 'game_id',
});

Run.hasMany(RunRunner, {
  foreignKey: 'run_id'
});


module.exports = Run;
