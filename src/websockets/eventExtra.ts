import API from '../api/eventExtra';

export default{
  async getExtras() {
    return await API.getExtras();
  }

};
