const EventRun = require('../models/EventRun');
const logger = require('../loaders/logger');

exports.create = async function(eventId, runId, date, runTime) {
  logger.log("info", "Starting event run create function");
  // Create event run
  try{
    await EventRun.create({
      event_id: eventId,
      run_id: runId,
      date: date,
      run_time: runTime
    });
    return {success: 'Creation success'};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.get = async function(id) {
  logger.log("info", "Starting get event run function");
  // Get event run
  try{
    let eventRun = await EventRun.findOne({where:{id}});
    return {success: eventRun};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.update = async function(id, eventId, runId, date, runTime) {
  logger.log("info", "Starting event run update function");
  // Update event run
  try{
    await EventRun.update({
      event_id: eventId,
      run_id: runId,
      date: date,
      run_time: runTime
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
  logger.log("info", "Starting event run delete function");
  // Delete event run
  try{
    let eventRun = await EventRun.destroy({where:{id}});
    return {success: eventRun};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};