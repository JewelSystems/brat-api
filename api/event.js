const Controller = require('../controller/event');

exports.create = async function(name, donationLink, start, end) {
  let response = await Controller.create(name, donationLink, start, end);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "createEvent", data:[response.success], "type": "adminBroadcast"};
};

exports.get = async function(id) {
  let response = await Controller.get(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "getEvent", data:[response.success]};
};

exports.update = async function(id, name, donationLink, start, end) {
  let response = await Controller.update(id, name, donationLink, start, end);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateEvent", data:[response.success], "type": "adminBroadcast"};
};

exports.delete = async function(id) {
  let response = await Controller.delete(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "deleteEvent", data:[response.success]};
};

exports.getEvents = async function() {
  let response = await Controller.getEvents();
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "listEvents", data:[response.success]};
};

exports.updateEventState = async function(id) {
  let response = await Controller.updateEventState(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateEventState", data:[response.success], "type": "adminBroadcast"};
};