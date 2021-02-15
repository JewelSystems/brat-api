import Controller from '../controller/run';

export default {
  async create(runnerId: string, gameId: string, category: string, estimatedTime: number, preferredTime: string, platform: string, incentives: any){
    let response = await Controller.create(runnerId, gameId, category, estimatedTime, preferredTime, platform, incentives);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listGames", data:[response.success]};
  },

  async createRunNGame(runnerId: string, category: string, estimatedTime: number, preferredTime: string, platform: string, name: string, year: string, incentives: any) {
    let response = await Controller.createRunNGame(runnerId, category, estimatedTime, preferredTime, platform, name, year, incentives);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "createRunNGame", data:[response.success]};
  }
};