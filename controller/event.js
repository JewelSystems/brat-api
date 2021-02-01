const Event = require('../models/Event');
const logger = require('../loaders/logger');
const moment = require('moment');

exports.create = async function(name, donationLink, start, end) {
  logger.log("info", "Starting event create function");
  // Create event
  try{
    const event = await Event.create({
      name: name,
      donation_link: donationLink,
      start: start,
      end: end,
      active: "N",
    });
    const resp = {
      id: event.id,
      name: event.name,
      donation_link: event.donation_link,
      start: moment(event.start).format("YYYY[-]MM[-]DD"),
      end: moment(event.end).format("YYYY[-]MM[-]DD"),
      active: event.active
    };
    return {success: resp};
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

exports.update = async function(id, name, donationLink, start, end) {
  logger.log("info", "Starting event update function");
  // Update event
  try{
    await Event.update({
      name: name,
      donation_link: donationLink,
      start: start,
      end: end
    },{
      where:{id}
    });
    const event = await Event.findOne({ where:{id} });
    const resp = {
      id: event.id,
      name: event.name,
      donation_link: event.donation_link,
      start: moment(event.start).format("YYYY[-]MM[-]DD"),
      end: moment(event.end).format("YYYY[-]MM[-]DD"),
      active: event.active
    };
    return {success: resp};

  }catch(error){
    console.log(error);
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

exports.getEvents = async function() {
  logger.log("info", "Starting get all events function");
  // Get events
  try{
    const events = await Event.findAll();
    resp = [];
    for(let event in events){
      resp.push(events[event].dataValues);
    }
    return {success: resp};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.updateEventState = async function(id) {
  logger.log("info", "Starting event state update function");
  // Update event state
  try{
    const event = await Event.findOne({ where:{id} });
    let active = null;
    if(event.dataValues.active === 'N'){
      await Event.update({
        active: 'A',
      },
      {
        where:{id},
      });
      active = 'A';
    }else if(event.dataValues.active === 'A'){
      await Event.update({
        active: 'D',
      },
      {
        where:{id},
      });
      active = 'D';
    }
    resp = {
      "id": id,
      "active": active,
    };
    return {success: resp};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};