import { getRepository } from 'typeorm';
import Controller from '../controller/userPermission';
import Permission from '../models/Permission';
import UserPermission from '../models/UserPemission';

interface APIResponse{
  status: number;
  msg: string;
  data?: any;
}

export default{
  async removePermission(updatedUser: string, updaterUser: string, permission: string): Promise<APIResponse> {
    let response = await Controller.removePermission(updatedUser, updaterUser, permission);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "removePermission", data:[response.success]};
  },

  async addPermission(updatedUser: string, updaterUser: string, permission: string): Promise<APIResponse> {
    //Check if the user already have this permission
    const found = await getRepository(UserPermission).findOne({ user_id: Number(updatedUser), permission_id: (await getRepository(Permission).findOne({permission: permission}))?.id });
    if(found) return {"status": 403, "msg": "User already have this permission"};

    let response = await Controller.addPermission(updatedUser, updaterUser, permission);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "addPermission", data:[response.success]};
  }
};