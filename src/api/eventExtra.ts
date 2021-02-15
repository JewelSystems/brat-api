import Controller from '../controller/eventExtra';

export default {
  async getExtras(){
    let response = await Controller.getExtras();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "listExtras", data:[response.success]};
  }
};