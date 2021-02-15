import API from '../api/game';

export default{
  async getGames() {
    return await API.getGames();
  },

  async update(packet: any){
    return await API.update(packet.id, packet.name, packet.year);
  }

};
