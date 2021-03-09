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

interface INewSchedule{
  order: string,
  type: string,
  event_run_id: string,
  event_extra_id: string,
  extra_time: string,
  shouldGetRun: boolean
}

export default{
  async create(packet: INewSchedule){
    return await API.create(packet.order, packet.type, packet.event_run_id, packet.event_extra_id, packet.extra_time, packet.shouldGetRun);
  },

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