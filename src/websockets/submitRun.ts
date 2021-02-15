import API from '../api/submitRun';

export default{
  async getSubmitRuns(){
    return await API.getSubmitRuns();
  }
};