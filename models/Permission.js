const { DataTypes } = require('sequelize');
const sequelize = require('../loaders/sequelize');

let Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.BIGINT(20),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  permission: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'Permission',
  tableName: 'permissions',
});

Permission.get = async function(id) {
  try{
    let permissionFound = await Permission.findOne({where:{id}});
    return permissionFound.permission;
  }catch(error){
    console.log("erro: " + error);
    return error;
  }
};

module.exports = Permission;