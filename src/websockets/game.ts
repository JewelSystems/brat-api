import API from '../api/game';

interface IGame{
  id: string;
  name: string;
  year: string;
}

export default{
  async getGames() {
    return await API.getGames();
  },

  async update(packet: IGame){
    return await API.update(packet.id, packet.name, packet.year);
  }

};
