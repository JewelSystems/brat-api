const crypto = require('crypto');

const User = require('../models/User');
const redis = require('../loaders/redis');
const logger = require('../loaders/logger');

exports.login = async function(username, password) {
  logger.log("info", "Starting login function");
  // Verify if login exists
  let userFound = await User.findOne({where:{username}});
  if (!userFound) {
    return {error: "User not found"};
  }
  // Verify login matches
  let login = await User.login(username, password);
  if (!login) {
    return {error: "Username and password does not match"};
  }
  // Verify if token exists
  let token;
  let tokenFound;
  do {
    tokenFound = false;
    token = crypto.randomBytes(64).toString('hex');
    tokenFound = await redis.get(`user-${token}`);
  } while (tokenFound);
  saveToken = await redis.set(`user-${token}`, 'auth', 'EX', 3600);
  return {
    id: userFound.id,
    token
  };
};


exports.redisAuthCheck = async function(token){
  logger.log("info", "Starting redis authentication check function");
  tokenFound = await redis.get(`user-${token}`);
  if(!tokenFound){
    return {
      error: "Token not found"
    };
  }
  return {
    success: "Token found"
  };
};
