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
  return {"status": 200, "msg": "updateEventSchedule", data:[response.success]};
};