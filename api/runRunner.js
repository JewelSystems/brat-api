const Controller = require('../controller/runRunner');

exports.create = async function(runnerId, runId) {
  let response = await Controller.create(runnerId, runId);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "createRunRunner", data:[response.success]};
};

exports.get = async function(id) {
  let response = await Controller.get(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "getRunRunner", data:[response.success]};
};

exports.update = async function(id, runnerId, runId) {
  let response = await Controller.update(id, runnerId, runId);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateRunRunner", data:[response.success]};
};

exports.delete = async function(id) {
  let response = await Controller.delete(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "deleteRunRunner", data:[response.success]};
};