import API from '../api/eventRun';

export default{
  async getEventRuns(){
    const resp = await API.getEventRuns();
    return resp;
  }

};
