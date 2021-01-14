const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

const Permission = require('./Permission');

let UserPermission = sequelize.define('UserPermission', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT(20),
    references: 'users',
    referencesKey: 'id',
    allowNull: false,
  },
  permission_id: {
    type: DataTypes.BIGINT(20),
    references: 'permissions',
    referencesKey: 'id',
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'UserPermission',
  tableName: 'user_permissions',
});

module.exports = UserPermission;