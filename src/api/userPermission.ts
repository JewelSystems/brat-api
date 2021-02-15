import Controller from '../controller/userPermission';

export default{
  async removePermission(updatedUser: string, updaterUser: string, permission: string) {
    let response = await Controller.removePermission(updatedUser, updaterUser, permission);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "removePermission", data:[response.success]};
  },

  async addPermission(updatedUser: string, updaterUser: string, permission: string) {
    let response = await Controller.addPermission(updatedUser, updaterUser, permission);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "addPermission", data:[response.success]};
  }
};