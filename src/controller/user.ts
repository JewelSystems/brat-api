import crypto from 'crypto';
import logger from '../loaders/logger';
import User from '../models/User';
import UserPermission from '../models/UserPemission';
import userLog from '../controller/userLog';
import { getManager, getRepository } from 'typeorm';


interface CtrlResponse{
  success?: any;
  error?: string;
}

export default {
  async checkUsername(username: string): Promise<User | undefined | never>{
    logger.log("info", "Starting check username function");
    try{
      const userRepository = getRepository(User);

      const user = await userRepository.findOne({
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
      const userRepository = getRepository(User);

      const user = await userRepository.findOne({
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
      const userRepository = getRepository(User);

      const user: User = userRepository.create({
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
      
      await userRepository.save(user);

      //Create UserPermission
      const userPermissionRepository = getRepository(UserPermission);

      const userPermission: UserPermission = userPermissionRepository.create({
        user_id: user.id,
        permission_id: 8,
      });

      await userPermissionRepository.save(userPermission);

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
      const entityManager = getManager();
      const user = await entityManager.query('SELECT users.id, users.first_name, users.last_name, users.username, users.email, users.gender, users.phone_number, users.stream_link, users.twitch, users.twitter, users.facebook, users.instagram, users.youtube, GROUP_CONCAT(permissions.permission) as `permissions` FROM users, user_permissions, permissions WHERE users.id = ' +id+ ' AND users.id = user_permissions.user_id AND user_permissions.permission_id = permissions.id GROUP BY users.id');

      return { success: user };
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
      console.log(error);
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async login(username: string, password: string): Promise<boolean> {
    const userRepository = getRepository(User);

    const userFound= await userRepository.findOne({
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
      console.log(error);
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};