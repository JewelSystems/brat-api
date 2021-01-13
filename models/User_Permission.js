const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');
//const User = require('./User');
const Permission = require('./Permission');

let User_Permission = sequelize.define('User_Permission', {
  user_id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  permission_id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'User_Permission',
  tableName: 'user_permissions',
});

User_Permission.get = async function(user_id) {
  try{
    let user_permission = await User_Permission.findOne({where:{user_id}});
    console.log("encontrei permission_id: " + user_permission.permission_id);
    let permission = await Permission.get(user_permission.permission_id);
    console.log("A permissão é: ", permission);
    return true;
  }catch(error){
    console.log("erro: " + error);
    return false;
  }
};

module.exports = User_Permission;