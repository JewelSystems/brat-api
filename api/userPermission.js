const Controller = require('../controller/userPermission');

exports.removePermission = async function(id, permission) {
  let response = await Controller.removePermission(id, permission);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "removePermission", data:[response.success]};
};

exports.addPermission = async function(id, permission) {
  let response = await Controller.addPermission(id, permission);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "addPermission", data:[response.success]};
};