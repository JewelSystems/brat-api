import API from '../api/run';

interface IRun{
  runner_id: string;
  game_id: string;
  category: string;
  estimated_time: number;
  preferred_time_slot: string;
  platform: string;
  incentives: IIncentive[];

  name: string;
  year: string;
}

interface IIncentive{
  type: string;
  comment: string;
  name: string;
  options: IOption[];
}

interface IOption{
  name: string
}

export default{
  async create(packet: IRun) {
    return await API.create(packet.runner_id, packet.game_id, packet.category, packet.estimated_time, packet.preferred_time_slot, packet.platform, packet.incentives);
  },

  async createRunNGame(packet: IRun) {
    return await API.createRunNGame(packet.runner_id, packet.category, packet.estimated_time, packet.preferred_time_slot, packet.platform, packet.name, packet.year, packet.incentives);
  }
};
