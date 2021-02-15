import logger from '../loaders/logger';
import crypto from 'crypto';
import userController from '../controller/user';
import redis from '../loaders/redis';
import { getManager } from 'typeorm';

export default{
  async login(username: string, password: string){
    logger.log("info", "Starting login function");
    // Verify if username exists
    const userFound = await userController.checkUsername(username);
    if(!userFound){
      return {error: "User not found"};
    }
    // Verify login matches
    let login = await userController.login(username, password);
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
    await redis.set(`user-${token}`, userFound.id, 'EX', 3600);
    return {
      id: userFound.id,
      token
    };
  },

  async redisAuthCheck(token: number){
    logger.log("info", "Starting redis authentication check function");
    const user = await redis.get(`user-${token}`);

    const entityManager = getManager();
    const permissions = await entityManager.query("SELECT GROUP_CONCAT(permissions.permission) as `permissions` FROM user_permissions, permissions WHERE '" + user + "' = user_permissions.user_id AND user_permissions.permission_id = permissions.id");
    
    if(!user){
      return {
        error: "Token not found"
      };
    }
    return {
      success: "Token found",
      user: user,
      permissions: permissions[0].permissions.split(',')
    };
  }
};