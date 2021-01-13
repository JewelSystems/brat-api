const API = require('../api/auth');

exports.login = async function(packet){
  const resp = await API.login(packet.username, packet.password);
  console.log("resposta da api: " + resp);
  return resp;
};
