const Controller = require('../controller/run');

exports.create = async function(gameId, category, estimatedTime, preferredTime) {
  let response = await Controller.create(gameId, category, estimatedTime, preferredTime);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "createRun", data:[response.success]};
};

exports.get = async function(id) {
  let response = await Controller.get(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "getRun", data:[response.success]};
};

exports.update = async function(id, gameId, category, estimatedTime, preferredTime) {
  let response = await Controller.update(id, gameId, category, estimatedTime, preferredTime);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateRun", data:[response.success]};
};

exports.delete = async function(id) {
  let response = await Controller.delete(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "deleteRun", data:[response.success]};
};