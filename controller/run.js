const Run = require('../models/Run');
const logger = require('../loaders/logger');

exports.create = async function(gameId, category, estimatedTime, preferredTime, platform) {
  logger.log("info", "Starting run create function");
  // Create run
  try{
    await Run.create({
      game_id: gameId,
      category: category,
      estimated_time: estimatedTime,
      preferred_time_slot: preferredTime,
      platform: platform
    });
    return {success: 'Creation success'};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.get = async function(id) {
  logger.log("info", "Starting get run function");
  // Get run
  try{
    let run = await Run.findOne({where:{id}});
    return {success: run};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.update = async function(id, gameId, category, estimatedTime, preferredTime, platform) {
  logger.log("info", "Starting run update function");
  // Update run
  try{
    await Run.update({
      game_id: gameId,
      category: category,
      estimated_time: estimatedTime,
      preferred_time_slot: preferredTime,
      platform: platform
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
  logger.log("info", "Starting run delete function");
  // Delete run
  try{
    let run = await Run.destroy({where:{id}});
    return {success: run};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};