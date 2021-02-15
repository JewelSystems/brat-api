import Controller from '../controller/game';

export default {
  async getGames(){
    let response = await Controller.getGames();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listGames", data:[response.success]};
  },

  async update(id: string, name: string, year: string) {
    let response = await Controller.update(id, name, year);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateGame", data:[response.success]};
  }
};