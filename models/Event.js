const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let Event = sequelize.define('Event', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  donation_link: {
    type: DataTypes.STRING(100),
    allowNull: false
  },  
  active: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: false,
  modelName: 'Event',
  tableName: 'events',
});

module.exports = Event;
