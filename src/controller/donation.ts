import logger from '../loaders/logger';
import { getRepository } from 'typeorm';
import Donation from '../models/Donation';
import EventRunIncentive from '../models/EventRunIncentive';
import EventRunBidwarOption from '../models/EventRunBidwarOption';
import BidwarOption from '../models/BidwarOption';

import {EventRunIncentiveRepo, EventRunBidwarOptionRepo, DonationRepo} from '../loaders/typeorm';

interface CtrlResponse{
  success?: any;
  error?: string;
}

export default{
  async updateIncentiveNCreateDonation(first_name: string, last_name: string, email: string, value: string, incentive_id: string, option_name: string): Promise<CtrlResponse>{
    logger.log("info", "Starting donation create and update function");
    // Update game
    try{
      let eventRunIncentive: EventRunIncentive | undefined;
      let eventRunOption: EventRunBidwarOption | undefined;
      let donation: Donation;

      eventRunIncentive = await EventRunIncentiveRepo.findOneOrFail({ incentive_id: Number(incentive_id) });
      if(eventRunIncentive){
        if(option_name){
          eventRunOption = await EventRunBidwarOptionRepo
            .createQueryBuilder("event_run_bidwar_option")
            .leftJoinAndSelect(BidwarOption, "bidwar_option", `bidwar_option.option = '${option_name}' and bidwar_option.incentive_id = ${incentive_id}`)
            .where(`event_run_incentive_id = ${eventRunIncentive.id} and bidwar_option_id = bidwar_option.id`)
            .select(
              [
                "event_run_bidwar_option.id as id",
                "event_run_bidwar_option.event_run_incentive_id as event_run_incentive_id",
                "event_run_bidwar_option.cur_value as cur_value",
                "event_run_bidwar_option.bidwar_option_id as bidwar_option_id",
              ]
            )
            .getRawOne();
            
          donation = DonationRepo.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            value: Number(value),
            incentive_id: Number(eventRunIncentive?.id),
            option_id: Number(eventRunOption?.id)
          });
        }else{
          donation = DonationRepo.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            value: Number(value),
            incentive_id: Number(eventRunIncentive?.id),
          });
        }

        DonationRepo.save(donation);
        
        if(eventRunOption){
          EventRunBidwarOptionRepo.update(eventRunOption.id, { cur_value: (eventRunOption?.cur_value + Number(value)) });
        }else{
          EventRunIncentiveRepo.update(eventRunIncentive.id, { cur_value: (eventRunIncentive?.cur_value + Number(value)) });
        }

      }

      return {success: 'Update success'};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};