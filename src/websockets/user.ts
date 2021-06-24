import API from '../api/user';

interface IUpdateUser {
  user_id: number
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  stream_link?: string
  twitch?: string
  twitter?: string
  facebook?: string
  instagram?: string
  youtube?: string
}

export default{
  async getUserRuns(packet: {id: string}) {
    return await API.getUserRuns(packet.id);
  },

  async getUsers(){
    return await API.getUsers();
  },

  async updateUser(packet: IUpdateUser) {
    console.log(packet);
    return await API.updateUser(
      packet.user_id,
      packet.first_name,
      packet.last_name,
      packet.email,
      packet.phone_number,
      packet.stream_link,
      packet.twitch,
      packet.twitter,
      packet.facebook,
      packet.instagram,
      packet.youtube
    );
  },
};
