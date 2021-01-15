const Controller = require('../controller/event');

exports.create = async function(name, donationLink) {
  let response = await Controller.create(name, donationLink);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "createEvent", data:[response.success]};
};

exports.get = async function(id) {
  let response = await Controller.get(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "getEvent", data:[response.success]};
};

exports.update = async function(id, name, donationLink) {
  let response = await Controller.update(id, name, donationLink);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "updateEvent", data:[response.success]};
};

exports.delete = async function(id) {
  let response = await Controller.delete(id);
  if (response.error) {
    return {"status": 403, "msg": response.error};
  }
  //Successful request
  return {"status": 200, "msg": "deleteEvent", data:[response.success]};
};