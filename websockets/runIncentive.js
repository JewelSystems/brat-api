const API = require('../api/runIncentive');

exports.update = async function(packet){
  return await API.update(packet);
};

exports.getRunIncentives = async function(packet){
  return await API.getRunIncentives(packet.id);
};