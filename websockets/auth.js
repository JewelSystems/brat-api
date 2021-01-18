const API = require('../api/auth');

exports.login = async function(packet){
  const resp = await API.checkToken(packet.token);
  return resp;
};
