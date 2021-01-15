const EventExtra = require('../models/EventExtra');
const logger = require('../loaders/logger');

exports.create = async function(eventId, type, time) {
  logger.log("info", "Starting event extra create function");
  // Create event extra
  try{
    await EventExtra.create({
      event_id: eventId,
      type: type,
      time: time,
    });
    return {success: 'Creation success'};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.get = async function(id) {
  logger.log("info", "Starting get event extra function");
  // Get event extra
  try{
    let eventExtra = await EventExtra.findOne({where:{id}});
    return {success: eventExtra};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.update = async function(id, eventId, type, time) {
  logger.log("info", "Starting event extra update function");
  // Update event extra
  try{
    await EventExtra.update({
      event_id: eventId,
      type: type,
      time: time,
    },{
      where:{id}
    });
    return {success: 'Update success'};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.delete = async function(id) {
  logger.log("info", "Starting event extra delete function");
  // Delete event extra
  try{
    let eventExtra = await EventExtra.destroy({where:{id}});
    return {success: eventExtra};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};