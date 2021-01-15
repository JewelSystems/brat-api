const API = require('../api/eventRun');

exports.create = async function(packet){
  return await API.create(packet.event_id, packet.run_id, packet.date, packet.run_time);
};

exports.get = async function(packet){
  return await API.get(packet.id);
};

exports.update = async function(packet){
  return await API.update(packet.id, packet.event_id, packet.run_id, packet.date, packet.run_time);
};

exports.delete = async function(packet){
  return await API.delete(packet.id);
};