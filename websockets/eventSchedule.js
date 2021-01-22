const API = require('../api/eventSchedule');

exports.getEventSchedule = async function(){
  return await API.getEventSchedule();
};