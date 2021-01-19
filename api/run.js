const Controller = require('../controller/run');

exports.create = async function(runnerId, gameId, category, estimatedTime, preferredTime, platform) {
  let response = await Controller.create(runnerId, gameId, category, estimatedTime, preferredTime, platform);
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

exports.update = async function(id, gameId, category, estimatedTime, preferredTime, platform) {
  let response = await Controller.update(id, gameId, category, estimatedTime, preferredTime, platform);
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

exports.createRunNGame = async function(runnerId, category, estimatedTime, preferredTime, platform, name, year) {
  let response = await Controller.createRunNGame(runnerId, category, estimatedTime, preferredTime, platform, name, year);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "createRunNGame", data:[response.success]};
};