import API from '../api/auth';

export default{
  async login(packet: {token: string}){
    const resp = await API.checkToken(packet.token);
    return resp;
  }

};
