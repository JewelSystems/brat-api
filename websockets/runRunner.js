const API = require('../api/runRunner');

exports.create = async function(packet){
  return await API.create(packet.runner_id, packet.run_id);
};

exports.get = async function(packet){
  return await API.get(packet.id);
};

exports.update = async function(packet){
  return await API.update(packet.id, packet.runner_id, packet.run_id);
};

exports.delete = async function(packet){
  return await API.delete(packet.id);
};