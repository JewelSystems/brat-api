import API from '../api/eventSchedule';

export default{
  async getEventSchedule(){
    return await API.getEventSchedule();
  },

  async updateEventSchedule(packet: any){
    return await API.updateEventSchedule(packet.data);
  },

  async createSetupEventSchedule(packet: any){
    return await API.createSetupEventSchedule(packet.data, packet.setups);
  },
  
  async deleteEventSchedule(packet: any){
    return await API.deleteEventSchedule(packet.id);
  }
};