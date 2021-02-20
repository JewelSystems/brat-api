import API from '../api/submitRun';

interface ISubmitRun{
  id: string;
  reviewed: boolean;
  approved: boolean;
  waiting: boolean;
  incentives: IIncentive[];
}

interface IIncentive{
  id: string;
  run_id: string;
  type: string;
  comment: string;
  name: string;
  options: IOption[];
  goal?: number;
}

interface IOption{
  id: string;
  name: string;
}

export default{
  async getSubmitRuns(){
    return await API.getSubmitRuns();
  },

  async updateSubmitRun(packet: ISubmitRun){
    return await API.update(packet.id, packet.reviewed, packet.approved, packet.waiting);
  },

  async refuseSubmitRunNRemoveIncentives(packet: ISubmitRun){
    return await API.refuseSubmitRunNRemoveIncentives(packet.id, packet.reviewed, packet.approved, packet.waiting);
  },
  
  async updateSubmitRunNRunIncentives(packet: ISubmitRun){
    return await API.updateSubmitRunNRunIncentives(packet.id, packet.reviewed, packet.approved, packet.waiting, packet.incentives);
  }
};