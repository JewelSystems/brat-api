import Controller from '../controller/run';

interface APIResponse{
  status: number;
  msg: string;
  data?: any;
}

interface IIncentive{
  type: string;
  comment: string;
  name: string;
  options: IOption[];
}

interface IOption{
  name: string
}

export default {
  async create(runnerId: string, gameId: string, category: string, estimatedTime: number, preferredTime: string, platform: string, incentives: IIncentive[]): Promise<APIResponse>{
    let response = await Controller.create(runnerId, gameId, category, estimatedTime, preferredTime, platform, incentives);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listGames", data:[response.success]};
  },

  async createRunNGame(runnerId: string, category: string, estimatedTime: number, preferredTime: string, platform: string, name: string, year: string, incentives: IIncentive[]): Promise<APIResponse>{
    let response = await Controller.createRunNGame(runnerId, category, estimatedTime, preferredTime, platform, name, year, incentives);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "createRunNGame", data:[response.success]};
  }
};