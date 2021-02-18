import API from '../api/submitRun';

export default{
  async getSubmitRuns(){
    return await API.getSubmitRuns();
  },

  async updateSubmitRun(packet: any){
    return await API.update(packet.id, packet.reviewed, packet.approved, packet.waiting);
  },

  async refuseSubmitRunNRemoveIncentives(packet: any){
    return await API.refuseSubmitRunNRemoveIncentives(packet.id, packet.reviewed, packet.approved, packet.waiting);
  },
  
  async updateSubmitRunNRunIncentives(packet: any){
    return await API.updateSubmitRunNRunIncentives(packet.id, packet.reviewed, packet.approved, packet.waiting, packet.incentives);
  }
};