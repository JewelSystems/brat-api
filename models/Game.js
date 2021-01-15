const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let Game = sequelize.define('Game', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  year: {
    type: DataTypes.STRING(4),
    allowNull: false
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'Game',
  tableName: 'games',
});

module.exports = Game;
