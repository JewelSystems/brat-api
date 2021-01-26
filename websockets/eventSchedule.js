const API = require('../api/eventSchedule');

exports.getEventSchedule = async function(){
  return await API.getEventSchedule();
};

exports.updateEventSchedule = async function(packet){
  return await API.updateEventSchedule(packet.data);
};