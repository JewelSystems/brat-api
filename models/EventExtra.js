const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let EventExtra = sequelize.define('EventExtra', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  event_id: {
    type: DataTypes.BIGINT(20),
    references: 'events',
    referencesKey: 'id',
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  time: {
    type: DataTypes.BIGINT(20),
    allowNull: false
  }
}, {
  sequelize,
  timestamps: false,
  modelName: 'EventExtra',
  tableName: 'event_extras',
});

module.exports = EventExtra;
