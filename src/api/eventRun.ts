import Controller from '../controller/eventRun';

interface APIResponse{
  status: number;
  msg: string;
  data?: any;
  type?: string;
}

export default{
  async getEventRuns(): Promise<APIResponse> {
    let response = await Controller.getEventRuns();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listEventRuns", data:[response.success]};
  },
};