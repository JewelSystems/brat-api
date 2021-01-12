const API = require('../api/auth');

exports.login = async function(packet){
  return await API.login(packet.username, packet.password);
};
