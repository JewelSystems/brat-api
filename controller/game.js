const Game = require('../models/Game');
const logger = require('../loaders/logger');

exports.create = async function(name, year) {
  logger.log("info", "Starting game create function");
  // Create game
  try{
    await Game.create({
      name: name,
      year: year
    });
    return {success: 'Creation success'};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.get = async function(id) {
  logger.log("info", "Starting get game function");
  // Get game
  try{
    let game = await Game.findOne({where:{id}});
    return {success: game};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.update = async function(id, name, year) {
  logger.log("info", "Starting game update function");
  // Update game
  try{
    await Game.update({
      name: name,
      year: year
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
  logger.log("info", "Starting game delete function");
  // Delete game
  try{
    let user = await Game.destroy({where:{id}});
    return {success: user};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};