const API = require('../api/event');

exports.create = async function(packet){
  return await API.create(packet.name, packet.donation_link);
};

exports.get = async function(packet){
  return await API.get(packet.id);
};

exports.update = async function(packet){
  return await API.update(packet.id, packet.name, packet.donation_link);
};

exports.delete = async function(packet){
  return await API.delete(packet.id);
};