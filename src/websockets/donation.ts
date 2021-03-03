import API from '../api/donation';

interface IDonation{
  first_name: string;
  last_name: string;
  email: string;
  value: string;
  incentive_id: string;
  option: string;
}

export default{
  async updateIncentiveNCreateDonation(packet: IDonation){
    return await API.updateIncentiveNCreateDonation(packet.first_name, packet.last_name, packet.email, packet.value, packet.incentive_id, packet.option);
  }

};
