import API from '../api/runIncentive';

interface IIncentive{
  id: string;
  name: string;
  comment: string;
  bidwar_options: {id: string; option: string; incentive_id: string}[];
  goal?: number;
}

export default{
  async update(packet: IIncentive){
    return await API.update(packet);
  },

  async getRunIncentives(packet: {id: string}){
    return await API.getRunIncentives(packet.id);
  }
};