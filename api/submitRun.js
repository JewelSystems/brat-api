const Controller = require('../controller/submitRun');

exports.getSubmitRuns = async function() {
  let response = await Controller.getSubmitRuns();
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "getSubmitRuns", data:[response.success]};
};

exports.update = async function(id, reviewed, approved, waiting) {
  let response = await Controller.update(id, reviewed, approved, waiting);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateSubmitRuns", data:[response.success], "type": "adminBroadcast"};
};

exports.updateSubmitRunNRunIncentives = async function(id, reviewed, approved, waiting, incentives) {
  let response = await Controller.updateSubmitRunNRunIncentives(id, reviewed, approved, waiting, incentives);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateSubmitRunsNRunIncentives", data:[response.success], "type": "adminBroadcast"};
};

exports.refuseSubmitRunNRemoveIncentives = async function(id, reviewed, approved, waiting) {
  let response = await Controller.refuseSubmitRunNRemoveIncentives(id, reviewed, approved, waiting);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateSubmitRunNRemoveIncentives", data:[response.success], "type": "adminBroadcast"};
};