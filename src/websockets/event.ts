import API from '../api/event';

interface IEvent{
  id: string;
  name: string;
  donation_link: string;
  start: string;
  end: string;
}

export default{
  async getEvents() {
    return await API.getEvents();
  },

  async updateEventState(packet: IEvent){
    return await API.updateEventState(packet.id);
  },

  async update(packet: IEvent){
    return await API.update(packet.id, packet.name, packet.donation_link, packet.start, packet.end);
  },

  async create(packet: IEvent){
    return await API.create(packet.name, packet.donation_link, packet.start, packet.end);
  },
};
