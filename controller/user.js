const crypto = require('crypto');

const User = require('../models/User');
const redis = require('../loaders/redis');
const logger = require('../loaders/logger');
const user = require('../routes/user');

exports.signup = async function(first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  logger.log("info", "Starting user signup function");
  // Verify if user already exists
  let userFound = await User.findOne({
    where:{username}
  });
  if (userFound) {
    return {error: "Username already exists"};
  }
  // Signup user
  let signup = await User.signup(first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube);
  if (!signup) {
    return {error: "Unsuccessful database insertion"};
  }
  return {success: signup};
};

exports.get = async function(id) {
  logger.log("info", "Starting user get function");
  // Verify if user exists
  let userFound = await User.findOne({
    where:{id}
  });
  if (!userFound) {
    return {error: "User not found"};
  }
  // Get user
  let get = await User.get(id);
  if (!get) {
    return {error: "Unsuccessful database get"};
  }
  return {success: get};
};

exports.update = async function(id, first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  logger.log("info", "Starting user update function");
  // Verify if user exists
  let userFound = await User.findOne({
    where:{id}
  });
  if (!userFound) {
    return {error: "User not found"};
  }
  // Update user
  let update = await User.update(id, first_name, last_name, username, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube);
  if (!update) {
    return {error: "Unsuccessful database update"};
  }
  return {success: update};
};

exports.delete = async function(id) {
  logger.log("info", "Starting user delete function");
  // Verify if user exists
  let userFound = await User.findOne({
    where:{id}
  });
  if (!userFound) {
    return {error: "User not found"};
  }
  // Delete user
  let del = await User.delete(id);
  if (!del) {
    return {error: "Unsuccessful database remotion"};
  }
  return {success: "Successful database remotion"};
};

exports.checkUsername = async function(id, username){
  logger.log("info", "Starting check username function");
  let curUsername = await User.findOne({
    where:{id}
  });
  if(curUsername){
    if(curUsername.username === username){
      return false;
    }
  }

  let userFound = await User.findOne({
    where:{username}
  });
  if (userFound){ return true};
  return false;
};