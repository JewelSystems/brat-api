const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let Run = sequelize.define('Run', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  game_id: {
    type: DataTypes.BIGINT(20),
    references: 'games',
    referencesKey: 'id',
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  estimated_time: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  preferred_time_slot:{
    type: DataTypes.STRING(10),
    allowNull: false
  }
}, {
  sequelize,
  timestamps: false,
  modelName: 'Run',
  tableName: 'runs',
});

module.exports = Run;
