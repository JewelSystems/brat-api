const User = require('../models/User');
const logger = require('../loaders/logger');

const db = require('../loaders/sequelize');
const Log = require('../models/UserLog');

exports.signup = async function(first_name, last_name, username, nickname, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  logger.log("info", "Starting user signup function");
  // Signup user
  try{
    const user = await User.create({
      first_name: first_name,
      last_name: last_name,
      username: username,
      nickname: nickname,
      email: email,
      password: password,
      gender: gender,
      birthday: birthday,
      phone_number: phone_number,
      stream_link: stream_link,
      twitch: twitch,
      twitter: twitter,
      facebook: facebook,
      instagram: instagram,
      youtube: youtube,
      salt: '',
      status: '',
      created: '',
      updated: '',
    });
    Log.log(user.id, user.id, "user_create");
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
    let user = await db.query('SELECT users.id, users.first_name, users.last_name, users.username, users.email, users.gender, users.phone_number, users.stream_link, users.twitch, users.twitter, users.facebook, users.instagram, users.youtube, GROUP_CONCAT(permissions.permission) as `permissions` FROM users, user_permissions, permissions WHERE users.id = ' +id+ ' AND users.id = user_permissions.user_id AND user_permissions.permission_id = permissions.id GROUP BY users.id');
    return {success: user};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.update = async function(id, first_name, last_name, username, nickname, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube) {
  logger.log("info", "Starting user update function");
  // Update user
  try{
    await User.update({
      first_name: first_name,
      last_name: last_name,
      username: username,
      email: email,
      gender: gender,
      phone_number: phone_number,
      stream_link: stream_link,
      twitch: twitch,
      twitter: twitter,
      facebook: facebook,
      instagram: instagram,
      youtube: youtube,
      nickname: nickname,
      birthday: birthday,
    },{
      where:{id}
    });
    Log.log(id, id, "user_update");
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
    Log.log(id, id, "user_delete");
    return {success: user};
  }catch(error){
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.getUsers = async function() {
  logger.log("info", "Starting get all users function");
  // Get users
  try{
    const users = await db.query('SELECT users.id, users.first_name, users.last_name, users.username, users.email, GROUP_CONCAT(permissions.permission) as `permissions` FROM users, user_permissions, permissions WHERE users.id = user_permissions.user_id AND user_permissions.permission_id = permissions.id GROUP BY users.id');
    resp = [];
    for (user in users[0]){
      resp.push({"id": users[0][user].id, "first_name": users[0][user].first_name, "last_name": users[0][user].last_name, "username": users[0][user].username, "email": users[0][user].email, "permissions": users[0][user].permissions.split(',')});
    }
    return {success: resp};
  }catch(error){
    console.log(error);
    logger.log("error", "DB Error: " + JSON.stringify(error));
    return {error: "Server error"};
  }
};

exports.getUserRuns = async function(id) {
  logger.log("info", "Starting get user runs function");
  // Get user runs
  try{
    const sqlQuery = 'SELECT events.name as event, games.name as game, runs.category as category, runs.platform as platform, runs.preferred_time_slot as time_slot, submit_runs.waiting, submit_runs.reviewed, submit_runs.approved FROM run_runners, runs, games, submit_runs, events WHERE run_runners.runner_id = ' + id + ' AND runs.id = run_runners.run_id AND games.id = runs.game_id AND submit_runs.run_id = runs.id AND submit_runs.event_id = events.id';
    const userRuns = await db.query(sqlQuery);
    /*
    resp = [];
    for (run in userRuns[0]){
      resp.push({"event": userRuns[0][run].event, "first_name": users[0][user].first_name, "last_name": users[0][user].last_name, "username": users[0][user].username, "email": users[0][user].email, "permissions": users[0][user].permissions.split(',')});
    }
    */
    return {success: userRuns};
  }catch(error){
    console.log(error);
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