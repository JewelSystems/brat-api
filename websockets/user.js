const API = require('../api/user');

exports.get = async function(packet){
  return await API.get(packet.id);
};

exports.signup = async function(packet){
  return await API.signup(packet.first_name, packet.last_name, packet.username, packet.email, packet.password, packet.gender, packet.birthday, packet.phone_number, packet.stream_link, packet.twitch, packet.twitter, packet.facebook, packet.instagram, packet.youtube);
};

exports.getUsers = async function(){
  return await API.getUsers();
}