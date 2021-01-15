const API = require('../api/userPermission');

exports.removePermission = async function(packet){
  return await API.removePermission(packet.user, packet.permission);
};

exports.addPermission = async function(packet){
  return await API.addPermission(packet.user, packet.permission);
};