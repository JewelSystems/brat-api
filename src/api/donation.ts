import Controller from '../controller/donation';

interface APIResponse{
  status: number;
  msg: string;
  data?: any;
}

export default {
  async updateIncentiveDonation(first_name: string, last_name: string, email: string, value: string, incentive_id: string, option: string): Promise<APIResponse> {
    let response = await Controller.updateIncentiveDonation(first_name, last_name, email, value, incentive_id, option);
    if (response.error) {
      return {"status": 403, "msg": response.error};
    }
    //Successful request
    return {"status": 200, "msg": "updateDonation", data:[response.success]};
  }
};