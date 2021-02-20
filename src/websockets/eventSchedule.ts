import API from '../api/eventSchedule';

interface ISchedule{
  id: string;
  data: string;
  setups: ISetup[];
}

interface ISetup{
  type: string,
  event_id: string,
  event_name: string,
  event_date: string,
  game: string,
  duration: number,
  order: number
}

export default{
  async getEventSchedule(){
    return await API.getEventSchedule();
  },

  async updateEventSchedule(packet: ISchedule){
    return await API.updateEventSchedule(packet.data);
  },

  async createSetupEventSchedule(packet: ISchedule){
    return await API.createSetupEventSchedule(packet.data, packet.setups);
  },
  
  async deleteEventSchedule(packet: ISchedule){
    return await API.deleteEventSchedule(packet.id);
  }
};