const Controller = require('../controller/userPermission');

exports.removePermission = async function(updatedUser, updaterUser, permission) {
  let response = await Controller.removePermission(updatedUser, updaterUser, permission);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "removePermission", data:[response.success]};
};

exports.addPermission = async function(updatedUser, updaterUser, permission) {
  let response = await Controller.addPermission(updatedUser, updaterUser, permission);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "addPermission", data:[response.success]};
};