const Event = require('../models/Event');
const logger = require('../loaders/logger');

exports.create = async function(name, donationLink) {
  logger.log("info", "Starting event create function");
  // Create event
  try{
    await Event.create({
      name: name,
      donation_link: donationLink,
      active: true,
    });
    return {success: 'Creation success'};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.get = async function(id) {
  logger.log("info", "Starting get event function");
  // Get event
  try{
    let event = await Event.findOne({where:{id}});
    return {success: event};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.update = async function(id, name, donationLink) {
  logger.log("info", "Starting event update function");
  // Update event
  try{
    await Event.update({
      name: name,
      donation_link: donationLink
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
  logger.log("info", "Starting event delete function");
  // Delete event
  try{
    await Event.update({
      active: false,
    },{
      where:{id}
    });
    return {success: 'Success Remotion'};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};