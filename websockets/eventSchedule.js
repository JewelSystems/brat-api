const API = require('../api/eventSchedule');

exports.getEventSchedule = async function(){
  return await API.getEventSchedule();
};

exports.updateEventSchedule = async function(packet){
  return await API.updateEventSchedule(packet.data);
};

exports.deleteEventSchedule = async function(packet){
  return await API.deleteEventSchedule(packet.id);
};

exports.createSetupEventSchedule = async function(packet){
  return await API.createSetupEventSchedule(packet.data, packet.setups);
};