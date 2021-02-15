import API from '../api/event';

export default{
  async getEvents() {
    return await API.getEvents();
  },

  async updateEventState(packet: any){
    return await API.updateEventState(packet.id);
  },

  async update(packet: any){
    return await API.update(packet.id, packet.name, packet.donation_link, packet.start, packet.end);
  },

  async create(packet: any){
    return await API.create(packet.name, packet.donation_link, packet.start, packet.end);
  },
};
