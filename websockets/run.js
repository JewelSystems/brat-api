const API = require('../api/run');

exports.create = async function(packet){
  return await API.create(packet.runner_id, packet.game_id, packet.category, packet.estimated_time, packet.preferred_time_slot, packet.platform);
};

exports.get = async function(packet){
  return await API.get(packet.id);
};

exports.update = async function(packet){
  return await API.update(packet.id, packet.game_id, packet.category, packet.estimated_time, packet.preferred_time_slot, packet.platform);
};

exports.delete = async function(packet){
  return await API.delete(packet.id);
};

exports.createRunNGame = async function(packet){
  return await API.createRunNGame(packet.runner_id, packet.category, packet.estimated_time, packet.preferred_time_slot, packet.platform, packet.name, packet.year);
};