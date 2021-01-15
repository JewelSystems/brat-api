const API = require('../api/eventExtra');

exports.create = async function(packet){
  return await API.create(packet.event_id, packet.type, packet.time);
};

exports.get = async function(packet){
  return await API.get(packet.id);
};

exports.update = async function(packet){
  return await API.update(packet.id, packet.event_id, packet.type, packet.time);
};

exports.delete = async function(packet){
  return await API.delete(packet.id);
};