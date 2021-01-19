const Run = require('../models/Run');
const Game = require('../models/Game');
const RunRunner = require('../models/RunRunner');
const SubmitRun = require('../models/SubmitRun');
const logger = require('../loaders/logger');

exports.create = async function(runnerId, gameId, category, estimatedTime, preferredTime, platform) {
  logger.log("info", "Starting run create function");
  // Create run
  try{
    const run = await Run.create({
      game_id: gameId,
      category: category,
      estimated_time: estimatedTime,
      preferred_time_slot: preferredTime,
      platform: platform
    });
    await RunRunner.create({
      runner_id: runnerId,
      run_id: run.id
    });
    await SubmitRun.create({
      event_id: 1,
      run_id: run.id,
      reviewed: false,
      approved: false,
      waiting: false
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

exports.createRunNGame = async function(runnerId, category, estimatedTime, preferredTime, platform, name, year) {
  logger.log("info", "Starting run and game create function");
  // Create run and game
  try{
    const game = await Game.create({
      name: name,
      year: year,
    });
    const run = await Run.create({
      game_id: game.id,
      category: category,
      estimated_time: estimatedTime,
      preferred_time_slot: preferredTime,
      platform: platform
    });
    await RunRunner.create({
      runner_id: runnerId,
      run_id: run.id
    });
    await SubmitRun.create({
      event_id: 1,
      run_id: run.id,
      reviewed: false,
      approved: false,
      waiting: false
    });
    return {success: 'Creation success'};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};