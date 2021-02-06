const Controller = require('../controller/runIncentive');

exports.update = async function(incentive) {
  let response = await Controller.update(incentive);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateIncentive", data:[response.success], "type": "adminBroadcast"};
};

exports.getRunIncentives = async function(scheduleId) {
  let response = await Controller.getRunIncentives(scheduleId);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "getRunIncentives", data:[response.success]};
};