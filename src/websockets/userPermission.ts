import API from '../api/userPermission';

export default{
  async removePermission(packet: any){
    return await API.removePermission(packet.updated_user, packet.updater_user, packet.permission);
  },

  async addPermission(packet: any){
    return await API.addPermission(packet.updated_user, packet.updater_user, packet.permission);
  },
};