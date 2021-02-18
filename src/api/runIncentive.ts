import Controller from '../controller/runIncentive';

export default{
  async update(incentive: any) {
    let response = await Controller.update(incentive);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateIncentive", data:[response.success], "type": "adminBroadcast"};
  },

  async getRunIncentives(scheduleId: string) {
    let response = await Controller.getRunIncentives(scheduleId);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "getRunIncentives", data:[response.success]};
  }
};