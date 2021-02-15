import Controller from '../controller/event';

export default {
  async getEvents(){
    let response = await Controller.getEvents();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listGames", data:[response.success]};
  },

  async updateEventState(id: string) {
    let response = await Controller.updateEventState(id);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateEventState", data:[response.success], "type": "adminBroadcast"};
  },

  async update(id: string, name: string, donationLink: string, start: string, end: string) {
    let response = await Controller.update(id, name, donationLink, start, end);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateEvent", data:[response.success], "type": "adminBroadcast"};
  },

  async create(name: string, donationLink: string, start: string, end: string) {
    let response = await Controller.create(name, donationLink, start, end);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "createEvent", data:[response.success], "type": "adminBroadcast"};
  }
};