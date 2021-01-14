const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');
//const User = require('./User');
const Permission = require('./Permission');

let UserPermission = sequelize.define('UserPermission', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
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

UserPermission.get = async function(user_id) {
  try{
    let user_permission = await UserPermission.findOne({where:{user_id}});
    //console.log("encontrei permission_id: " + user_permission.permission_id);
    let permission = await Permission.get(user_permission.permission_id);
    //console.log("A permissão é: ", permission);
    return permission;
  }catch(error){
    //console.log("erro: " + error);
    return "";
  }
};

module.exports = UserPermission;