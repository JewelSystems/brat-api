import API from '../api/userPermission';

interface IUpdatePermission{
  updated_user: string,
  updater_user: string,
  permission: string,
}

export default{
  async removePermission(packet: IUpdatePermission){
    return await API.removePermission(packet.updated_user, packet.updater_user, packet.permission);
  },

  async addPermission(packet: IUpdatePermission){
    return await API.addPermission(packet.updated_user, packet.updater_user, packet.permission);
  },
};