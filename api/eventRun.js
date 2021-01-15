const Controller = require('../controller/eventRun');

exports.create = async function(eventId, runId, date, runTime) {
  let response = await Controller.create(eventId, runId, date, runTime);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "createEventRun", data:[response.success]};
};

exports.get = async function(id) {
  let response = await Controller.get(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "getEventRun", data:[response.success]};
};

exports.update = async function(id, eventId, runId, date, runTime) {
  let response = await Controller.update(id, eventId, runId, date, runTime);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateEventRun", data:[response.success]};
};

exports.delete = async function(id) {
  let response = await Controller.delete(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "deleteEventRun", data:[response.success]};
};