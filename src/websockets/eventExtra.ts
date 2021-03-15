import API from '../api/eventExtra';

interface INewExtra{
  type: string,
  time: number,
}

export default{
  async create(packet: INewExtra){
    return await API.create(packet.type, packet.time);
  },
  async getExtras() {
    return await API.getExtras();
  }
};
