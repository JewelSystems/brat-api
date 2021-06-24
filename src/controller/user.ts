import crypto from 'crypto';
import logger from '../loaders/logger';
import User from '../models/User';
import UserPermission from '../models/UserPemission';
import userLog from '../controller/userLog';
import { getManager } from 'typeorm';
import Permission from '../models/Permission';

import {UserRepo, UserPermissionRepo} from '../loaders/typeorm';

interface CtrlResponse{
  success?: any;
  error?: string;
}

interface IUpdateObj{
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  stream_link?: string
  twitch?: string
  twitter?: string
  facebook?: string
  instagram?: string
  youtube?: string
}

export default {
  async checkUsername(username: string): Promise<User | undefined | never>{
    logger.log("info", "Starting check username function");
    try{
      const user = await UserRepo.findOne({
        where: { username }
      });
      return user;
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      throw(error);
    }
  },

  async checkId(id: string): Promise<User | undefined | never>{
    logger.log("info", "Starting check id function");
    try{
      const user = await UserRepo.findOne({
        where: { id }
      });
      return user;
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      throw(error);
    }
  },

  async create(
    firstName: string, 
    lastName: string, 
    username: string, 
    nickname: string,  
    email: string,  
    password: string, 
    gender: string,  
    birthday: string, 
    phoneNumber: string, 
    streamLink: string, 
    twitch: string, 
    twitter: string, 
    facebook: string, 
    instagram: string, 
    youtube: string): Promise<CtrlResponse>{
    logger.log("info", "Starting user create function");
    try{
      //Create User
      const user: User = UserRepo.create({
        first_name: firstName,
        last_name: lastName,
        username,
        nickname,
        email,
        password,
        gender,
        birthday,
        phone_number: phoneNumber,
        stream_link: streamLink,
        twitch,
        twitter,
        facebook,
        instagram,
        youtube,
        salt: '',
        status: '',
        created: 0,
        updated: 0
      });
      
      await UserRepo.save(user);

      //Create UserPermission
      const userPermission: UserPermission = UserPermissionRepo.create({
        user_id: user.id,
        permission_id: 8,
      });

      await UserPermissionRepo.save(userPermission);

      //Create Log
      userLog.log(user.id, user.id, "user_create");

      return {success: 'Creation success'};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async get(id: string): Promise<CtrlResponse>{
    logger.log("info", "Starting user get function");
    try{
      //const entityManager = getManager();
      //const user = await entityManager.query('SELECT users.id, users.first_name, users.last_name, users.username, users.email, users.gender, users.phone_number, users.stream_link, users.twitch, users.twitter, users.facebook, users.instagram, users.youtube, GROUP_CONCAT(permissions.permission) as `permissions` FROM users, user_permissions, permissions WHERE users.id = ' +id+ ' AND users.id = user_permissions.user_id AND user_permissions.permission_id = permissions.id GROUP BY users.id');
      //console.log(user);
      const userTemp = await UserRepo
        .createQueryBuilder("user")
        .leftJoinAndSelect(UserPermission, "user_permissions", `user_permissions.user_id = '${id}'`)
        .leftJoinAndSelect(Permission, "permissions", `permissions.id = user_permissions.permission_id`)
        .where(`user.id = ${id}`)
        .select(
          [
            "user.id as id",
            "user.first_name as first_name",
            "user.last_name as last_name",
            "user.username as username",
            "user.email as email",
            "user.gender as gender",
            "user.phone_number as phone_number",
            "user.stream_link as stream_link",
            "user.twitch as twitch",
            "user.twitter as twitter",
            "user.facebook as facebook",
            "user.instagram as instagram",
            "user.youtube as youtube",
            "permissions.permission as 'permissions'"
          ]
        )
        .getRawMany();

      let permissions = '';
      for(let item of userTemp){
        if(!permissions) {
          permissions += item.permissions;
        }else{
          permissions += ","+item.permissions;
        }
      }

      if(!permissions || permissions === "null") throw "An user should have permissions";
      userTemp[0].permissions = permissions;

      return { success: [userTemp[0]] };
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async getUserRuns(id: string): Promise<CtrlResponse>{
    logger.log("info", "Starting get user runs function");
    try{
      const entityManager = getManager();
      const sqlQuery = 'SELECT events.name as event, games.name as game, runs.category as category, runs.platform as platform, runs.preferred_time_slot as time_slot, submit_runs.waiting, submit_runs.reviewed, submit_runs.approved FROM run_runners, runs, games, submit_runs, events WHERE run_runners.runner_id = ' + id + ' AND runs.id = run_runners.run_id AND games.id = runs.game_id AND submit_runs.run_id = runs.id AND submit_runs.event_id = events.id';
      const userRuns = await entityManager.query(sqlQuery);

      return {success: userRuns};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async login(username: string, password: string): Promise<boolean> {
    const userFound= await UserRepo.findOne({
      where: { username }
    });
    
    if(userFound){
      let salt = userFound.salt;
      let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
      hash.update(password);
      let value = hash.digest('hex');
      if (value == userFound.password) return true;
    }

    return false;
  },

  async getUsers(): Promise<CtrlResponse>{
    logger.log("info", "Starting get all users function");
    // Get users
    try{
      const entityManager = getManager();
      const users = await entityManager.query('SELECT users.id, users.first_name, users.last_name, users.username, users.email, GROUP_CONCAT(permissions.permission) as `permissions` FROM users, user_permissions, permissions WHERE users.id = user_permissions.user_id AND user_permissions.permission_id = permissions.id GROUP BY users.id');

      for(let user of users){
        user.permissions = user.permissions.split(',');
      }
      
      return {success: users};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async updateUser(
    id: number,
    first_name?: string,
    last_name?: string,
    email?: string,
    phone_number?: string,
    stream_link?: string,
    twitch?: string,
    twitter?: string,
    facebook?: string,
    instagram?: string,
    youtube?: string): Promise<CtrlResponse>{
    logger.log("info", "Starting update user function");
    // Get users
    try{
      let obj: IUpdateObj = {};
      if(first_name) obj.first_name = first_name;
      if(last_name) obj.last_name = last_name;
      if(email) obj.email = email;
      if(phone_number) obj.phone_number = phone_number;
      if(stream_link) obj.stream_link = stream_link;
      if(twitch) obj.twitch = twitch;
      if(twitter) obj.twitter = twitter;
      if(facebook) obj.facebook = facebook;
      if(instagram) obj.instagram = instagram;
      if(youtube) obj.youtube = youtube;
      
      await UserRepo.update({id}, obj);
      return {success: id};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

};