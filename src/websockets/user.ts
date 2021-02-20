import API from '../api/user';

export default{
  async getUserRuns(packet: {id: string}) {
    return await API.getUserRuns(packet.id);
  },

  async getUsers(){
    return await API.getUsers();
  }

};
