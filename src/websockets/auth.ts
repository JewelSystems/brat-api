import API from '../api/auth';

export default{
  async login(packet: any){
    const resp = await API.checkToken(packet.token);
    return resp;
  }

};
