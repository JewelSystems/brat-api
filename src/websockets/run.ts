import API from '../api/run';

export default{
  async create(packet: any) {
    return await API.create(packet.runner_id, packet.game_id, packet.category, packet.estimated_time, packet.preferred_time_slot, packet.platform, packet.incentives);
  },

  async createRunNGame(packet: any) {
    return await API.createRunNGame(packet.runner_id, packet.category, packet.estimated_time, packet.preferred_time_slot, packet.platform, packet.name, packet.year, packet.incentives);
  }


};
