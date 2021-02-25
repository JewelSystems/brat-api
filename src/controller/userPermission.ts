import logger from '../loaders/logger';

import userLog from '../controller/userLog';
import { getManager } from 'typeorm';

interface CtrlResponse{
  success?: any;
  error?: string;
}

export default{
  async removePermission(updatedUser: string, updaterUser: string, permission: string): Promise<CtrlResponse> {
    logger.log("info", "Starting remove permission function");
    // remove permission from user
    try{
      const SQLQuery = "DELETE FROM user_permissions WHERE user_permissions.user_id ='" + updatedUser + "'AND user_permissions.permission_id = (SELECT permissions.id FROM permissions WHERE permissions.permission = '" + permission + "' )";
      const entityManager = getManager();
      await entityManager.query(SQLQuery);

      userLog.log(Number(updatedUser), Number(updaterUser), "unset_permission_"+permission);
      return {success: "OK"};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async addPermission(updatedUser: string, updaterUser: string, permission: string): Promise<CtrlResponse> {
    logger.log("info", "Starting add permission function");
    // remove permission from user
    try{
      const SQLQuery = "INSERT INTO user_permissions(user_id, permission_id) VALUES ('" + updatedUser + "',(SELECT permissions.id FROM permissions WHERE permissions.permission = '" + permission + "'))";
      const entityManager = getManager();
      await entityManager.query(SQLQuery);

      userLog.log(Number(updatedUser), Number(updaterUser), "set_permission_"+permission);
      return {success: "OK"};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};