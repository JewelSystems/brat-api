import Controller from '../controller/submitRun';

export default{
  async getSubmitRuns() {
    let response = await Controller.getSubmitRuns();
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "getSubmitRuns", data:[response.success]};
  }
};