import Controller from '../controller/eventExtra';

interface APIResponse{
  status: number;
  msg: string;
  data?: any;
  type?: string;
}

export default {
  async create(type: string, time: number): Promise<APIResponse>{
    let response = await Controller.create(type, time);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "createEventExtra", data:[response.success], "type": "adminBroadcast"};
  },

  async getExtras(): Promise<APIResponse>{
    let response = await Controller.getExtras();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listExtras", data:[response.success]};
  }
};