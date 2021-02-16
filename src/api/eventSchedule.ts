import Controller from '../controller/eventSchedule';

export default{
  async getEventSchedule() {
    let response = await Controller.getEventSchedule();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listEvents", data:[response.success]};
  },

  async updateEventSchedule(data: any) {
    let response = await Controller.updateEventSchedule(data);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateEventSchedule", data:[response.success], "type": "adminBroadcast"};
  },

  async createSetupEventSchedule(data:any, setups:any) {
    let response = await Controller.createSetupEventSchedule(data, setups);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "createSetupEventSchedule", data:[response.success], "type": "adminBroadcast"};
  },

  async deleteEventSchedule(id: string) {
    let response = await Controller.deleteEventSchedule(id);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "deleteEventSchedule", data:[response.success], "type": "adminBroadcast"};
  }
};