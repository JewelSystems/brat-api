import Controller from '../controller/submitRun';

interface APIResponse{
  status: number;
  msg: string;
  data?: any;
  type?: string;
}

interface IIncentive{
  id: string;
  run_id: string;
  type: string;
  comment: string;
  name: string;
  options: IOption[];
  goal?: number;
}

interface IOption{
  id: string;
  name: string;
}

export default{
  async getSubmitRuns(): Promise<APIResponse> {
    let response = await Controller.getSubmitRuns();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "getSubmitRuns", data:[response.success]};
  },

  async update(id: string, reviewed: boolean, approved: boolean, waiting: boolean): Promise<APIResponse> {
    let response = await Controller.update(id, reviewed, approved, waiting);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateSubmitRuns", data:[response.success], "type": "adminBroadcast"};
  },

  async refuseSubmitRunNRemoveIncentives(id: string, reviewed: boolean, approved: boolean, waiting: boolean): Promise<APIResponse> {
    let response = await Controller.refuseSubmitRunNRemoveIncentives(id, reviewed, approved, waiting);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateSubmitRunNRemoveIncentives", data:[response.success], "type": "adminBroadcast"};
  },

  async updateSubmitRunNRunIncentives(id: string, reviewed: boolean, approved: boolean, waiting: boolean, incentives: IIncentive[]): Promise<APIResponse> {
    let response = await Controller.updateSubmitRunNRunIncentives(id, reviewed, approved, waiting, incentives);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateSubmitRunsNRunIncentives", data:[response.success], "type": "adminBroadcast"};
  }
};