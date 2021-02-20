import Controller from '../controller/eventExtra';

interface APIResponse{
  status: number;
  msg: string;
  data?: any;
}

export default {
  async getExtras(): Promise<APIResponse>{
    let response = await Controller.getExtras();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listExtras", data:[response.success]};
  }
};