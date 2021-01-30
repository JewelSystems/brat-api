const API = require('../api/event');

exports.create = async function(packet){
  return await API.create(packet.name, packet.donation_link, packet.start, packet.end);
};

exports.get = async function(packet){
  return await API.get(packet.id);
};

exports.update = async function(packet){
  return await API.update(packet.id, packet.name, packet.donation_link, packet.start, packet.end);
};

exports.delete = async function(packet){
  return await API.delete(packet.id);
};

exports.getEvents = async function(){
  return await API.getEvents();
};

exports.updateEventState = async function(packet){
  return await API.updateEventState(packet.id);
};