import Controller from '../controller/eventSchedule';

export default{
  async getEventSchedule() {
    let response = await Controller.getEventSchedule();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listEvents", data:[response.success]};
  }

};