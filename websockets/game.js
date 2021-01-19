const API = require('../api/game');

exports.create = async function(packet){
  return await API.create(packet.name, packet.year);
};

exports.get = async function(packet){
  return await API.get(packet.id);
};

exports.update = async function(packet){
  return await API.update(packet.id, packet.name, packet.year);
};

exports.delete = async function(packet){
  return await API.delete(packet.id);
};

exports.getGames = async function(){
  return await API.getGames();
};