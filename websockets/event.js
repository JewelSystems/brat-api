const API = require('../api/event');

exports.create = async function(packet){
  return await API.create(packet.name, packet.donation_link. packet.date);
};

exports.get = async function(packet){
  return await API.get(packet.id);
};

exports.update = async function(packet){
  return await API.update(packet.id, packet.name, packet.donation_link, packet.date);
};

exports.delete = async function(packet){
  return await API.delete(packet.id);
};

exports.getEvents = async function(){
  return await API.getEvents();
};