const RunRunner = require('../models/RunRunner');
const logger = require('../loaders/logger');

exports.create = async function(runnerId, runId) {
  logger.log("info", "Starting run runner create function");
  // Create run runner
  try{
    await RunRunner.create({
      runner_id: runnerId,
      run_id: runId
    });
    return {success: 'Creation success'};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.get = async function(id) {
  logger.log("info", "Starting get run runner function");
  // Get run runner
  try{
    let runRunner = await RunRunner.findOne({where:{id}});
    return {success: runRunner};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.update = async function(id, runnerId, runId) {
  logger.log("info", "Starting run runner update function");
  // Update run runner
  try{
    await RunRunner.update({
      runner_id: runnerId,
      run_id: runId
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
  logger.log("info", "Starting run runner delete function");
  // Delete run runner
  try{
    let runRunner = await RunRunner.destroy({where:{id}});
    return {success: runRunner};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};