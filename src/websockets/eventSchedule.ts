import API from '../api/eventSchedule';

export default{
  async getEventSchedule(){
    return await API.getEventSchedule();
  }
};