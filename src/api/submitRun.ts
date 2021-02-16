import Controller from '../controller/submitRun';

export default{
  async getSubmitRuns() {
    let response = await Controller.getSubmitRuns();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "getSubmitRuns", data:[response.success]};
  },

  async update(id: string, reviewed: boolean, approved: boolean, waiting: boolean) {
    let response = await Controller.update(id, reviewed, approved, waiting);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateSubmitRuns", data:[response.success], "type": "adminBroadcast"};
  },


  async refuseSubmitRunNRemoveIncentives(id: string, reviewed: boolean, approved: boolean, waiting: boolean) {
    let response = await Controller.refuseSubmitRunNRemoveIncentives(id, reviewed, approved, waiting);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateSubmitRunNRemoveIncentives", data:[response.success], "type": "adminBroadcast"};
  }
};