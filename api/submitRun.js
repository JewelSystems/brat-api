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
  return {"status": 200, "msg": "updateSubmitRuns", data:[response.success], "type": "broadcast"};
};