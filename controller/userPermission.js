//const UserPermission = require('../models/UserPermission');
const logger = require('../loaders/logger');

const db = require('../loaders/sequelize');
const Log = require('../models/UserLog');

exports.removePermission = async function(updatedUser, updaterUser, permission) {
  logger.log("info", "Starting remove permission function");
  // remove permission from user
  try{
    const SQLQuery = "DELETE FROM user_permissions WHERE user_permissions.user_id ='" + updatedUser + "'AND user_permissions.permission_id = (SELECT permissions.id FROM permissions WHERE permissions.permission = '" + permission + "' )";
    await db.query(SQLQuery);
    Log.log(updatedUser, updaterUser, "unset_permission_"+permission);
    return {success: "OK"};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.addPermission = async function(updatedUser, updaterUser, permission) {
  logger.log("info", "Starting add permission function");
  // remove permission from user
  try{
    const SQLQuery = "INSERT INTO user_permissions(user_id, permission_id) VALUES ('" + updatedUser + "',(SELECT permissions.id FROM permissions WHERE permissions.permission = '" + permission + "'))";
    await db.query(SQLQuery);
    Log.log(updatedUser, updaterUser, "set_permission_"+permission);
    return {success: "OK"};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};