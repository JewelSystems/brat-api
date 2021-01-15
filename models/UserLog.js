const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');
const moment = require('moment');

let UserLog = sequelize.define('UserLog', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  updated_user_id: {
    type: DataTypes.BIGINT(20),
    references: 'users',
    referencesKey: 'id',
    allowNull: false,
  },
  updater_user_id: {
    type: DataTypes.BIGINT(20),
    references: 'users',
    referencesKey: 'id',
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },  
  epoch: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'UserLog',
  tableName: 'user_log',
});

UserLog.log = async function(updatedId, updaterId, type) {
  try{
    await UserLog.create({
      updated_user_id: updatedId,
      updater_user_id: updaterId,
      type: type,
      epoch: moment().unix(),
    });
  }catch(error){
    console.log(error);
  }
};

module.exports = UserLog;