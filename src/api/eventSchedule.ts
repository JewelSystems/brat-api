import Controller from '../controller/eventSchedule';

interface APIResponse{
  status: number;
  msg: string;
  data?: any;
  type?: string;
}

interface ISetup{
  type: string,
  event_id: string,
  event_name: string,
  event_date: string,
  game: string,
  duration: number,
  order: number
}

export default{
  async create(order:string, type: string, event_run_id: string, event_extra_id: string, extra_time: string,  shouldGetRun?: boolean): Promise<APIResponse> {
    let response = await Controller.create(order, type, event_run_id, event_extra_id, extra_time, shouldGetRun);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "createEventSchedule", data:[response.success], "type": "adminBroadcast"};

  },

  async getEventSchedule(): Promise<APIResponse> {
    let response = await Controller.getEventSchedule();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listEvents", data:[response.success]};
  },

  async updateEventSchedule(data: string): Promise<APIResponse> {
    let response = await Controller.updateEventSchedule(data);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateEventSchedule", data:[response.success], "type": "adminBroadcast"};
  },

  async createSetupEventSchedule(data: string, setups: ISetup[]): Promise<APIResponse> {
    let response = await Controller.createSetupEventSchedule(data, setups);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "createSetupEventSchedule", data:[response.success], "type": "adminBroadcast"};
  },

  async deleteEventSchedule(id: string): Promise<APIResponse> {
    let response = await Controller.deleteEventSchedule(id);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "deleteEventSchedule", data:[response.success], "type": "adminBroadcast"};
  }
};