import API from '../api/runIncentive';

export default{
  async update(packet: any){
    return await API.update(packet);
  },

  async getRunIncentives(packet: any){
    return await API.getRunIncentives(packet.id);
  }
};