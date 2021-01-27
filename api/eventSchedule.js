const Controller = require('../controller/eventSchedule');

exports.getEventSchedule = async function() {
  let response = await Controller.getEventSchedule();
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "listEvents", data:[response.success]};
};

exports.updateEventSchedule = async function(data) {
  let response = await Controller.updateEventSchedule(data);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateEventSchedule", data:[response.success], "type": "broadcast"};
};

exports.deleteEventSchedule = async function(id) {
  let response = await Controller.deleteEventSchedule(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "deleteEventSchedule", data:[response.success], "type": "broadcast"};
};

exports.createSetupEventSchedule = async function(data, setups) {
  let response = await Controller.createSetupEventSchedule(data, setups);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "createSetupEventSchedule", data:[response.success], "type": "broadcast"};
};