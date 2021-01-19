const Controller = require('../controller/eventExtra');

exports.create = async function(eventId, type, time) {
  let response = await Controller.create(eventId, type, time);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "createEventExtra", data:[response.success]};
};

exports.get = async function(id) {
  let response = await Controller.get(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "getEventExtra", data:[response.success]};
};

exports.update = async function(id, eventId, type, time) {
  let response = await Controller.update(id, eventId, type, time);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateEventExtra", data:[response.success]};
};

exports.delete = async function(id) {
  let response = await Controller.delete(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "deleteEventExtra", data:[response.success]};
};

exports.getExtras = async function() {
  let response = await Controller.getExtras();
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "listExtras", data:[response.success]};
};