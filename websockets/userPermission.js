const API = require('../api/userPermission');

exports.removePermission = async function(packet){
  return await API.removePermission(packet.updated_user, packet.updater_user, packet.permission);
};

exports.addPermission = async function(packet){
  return await API.addPermission(packet.updated_user, packet.updater_user, packet.permission);
};