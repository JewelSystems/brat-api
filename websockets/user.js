const API = require('../api/user');

exports.get = async function(packet){
  return await API.get(packet.id);
};
