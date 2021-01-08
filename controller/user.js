const User = require('../models/User');
const logger = require('../loaders/logger');
const moment = require('moment');

exports.signup = async function(first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  logger.log("info", "Starting user signup function");
  // Signup user
  try{
    await User.create({
      first_name: first_name,
      last_name: last_name,
      username: username,
      email: email,
      password: password,
      gender: gender,
      phone_number: phone_number,
      stream_link: stream_link,
      twitch: twitch,
      twitter: twitter,
      facebook: facebook,
      instagram: instagram,
      youtube: youtube,
      /*
      salt: '',
      status: 'PendingEmail',
      created: 1,
      updated: 1,
      */
    });
    return {success: 'Creation success'};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.get = async function(id) {
  logger.log("info", "Starting user get function");
  // Get user
  try{
    let user = await User.findOne({where:{id}});
    return {success: user};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.update = async function(id, first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  logger.log("info", "Starting user update function");
  // Update user
  try{
    console.log('aqui');
    await User.update({
      first_name: first_name,
      last_name: last_name,
      username: username,
      email: email,
      password: passwordData.passwordHash,
      salt: passwordData.salt,
      gender: gender,
      phone_number: phone_number,
      stream_link: stream_link,
      twitch: twitch,
      twitter: twitter,
      facebook: facebook,
      instagram: instagram,
      youtube: youtube,
      updated: moment().unix(),
    },{
      where:{id}
    });
    return {success: 'Update success'};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.delete = async function(id) {
  logger.log("info", "Starting user delete function");
  // Delete user
  try{
    let user = await User.destroy({where:{id}});
    return {success: user};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

/*
 User Checks
*/

exports.checkUsername = async function(username){
  logger.log("info", "Starting check username function");
  let userFound = await User.findOne({
    where:{username}
  });
  return userFound ? 1 : 0;
};

exports.checkId = async function(id){
  logger.log("info", "Starting check id function");
  let userFound = await User.findOne({
    where:{id}
  });
  return userFound ? 1 : 0;
};