import Controller from '../controller/runIncentive';

interface APIResponse{
  status: number;
  msg: string;
  data?: any;
  type?: string;
}

interface IIncentive{
  id: string;
  name: string;
  comment: string;
  bidwar_options: {id: string; option: string; incentive_id: string}[];
  goal?: number;
}

export default{
  async update(incentive: IIncentive): Promise<APIResponse> {
    let response = await Controller.update(incentive);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateIncentive", data:[response.success], "type": "adminBroadcast"};
  },

  async getRunIncentives(scheduleId: string): Promise<APIResponse> {
    let response = await Controller.getRunIncentives(scheduleId);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "getRunIncentives", data:[response.success]};
  }
};