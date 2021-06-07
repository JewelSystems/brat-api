import RunIncentive from '../models/RunIncentive';
import logger from '../loaders/logger';
import BidwarOption from '../models/BidwarOption';
import EventSchedule from '../models/EventSchedule';
import EventRunIncentive from '../models/EventRunIncentive';

import {BidwarOptionRepo, RunIncentiveRepo, EventScheduleRepo} from '../loaders/typeorm';

interface CtrlResponse{
  success?: any;
  error?: string;
}

interface IIncentive{
  id: string;
  name: string;
  comment: string;
  bidwar_options: {id: string; option: string; incentive_id: string}[];
  goal?: number;
}

export default{
  async update(incentive: IIncentive): Promise<CtrlResponse> {
    logger.log("info", "Starting incentive update function");
    // Update incentive
    try{
      await RunIncentiveRepo.findOneOrFail(incentive.id);
      
      if(!incentive.goal){
        for(let option of incentive.bidwar_options){
          BidwarOptionRepo.update(option.id, {
            option: option.option,
          });
        }
      }
            
      RunIncentiveRepo.update(incentive.id, {
        name: incentive.name,
        comment: incentive.comment
      });


      return {success: incentive};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async getRunIncentives(scheduleId: string): Promise<CtrlResponse> {
    logger.log("info", "Starting incentive run get function");
    // get run incentives
    try{
      const runIncentives = await EventScheduleRepo
        .createQueryBuilder("event_schedule")
        .leftJoinAndSelect(EventRunIncentive, "event_run_incentive", "event_run_incentive.event_run_id = event_schedule.event_run_id")
        .leftJoinAndSelect(RunIncentive, "run_incentive", "run_incentive.id = event_run_incentive.incentive_id")
        .leftJoinAndSelect(BidwarOption, "bidwar_options", "bidwar_options.incentive_id = run_incentive.id")
        .where(`event_schedule.id = ${scheduleId}`)
        .select([
          'event_run_incentive.incentive_id as id',
          'run_incentive.name as name',
          "bidwar_options.option as 'option'"
        ])
        .getRawMany();

      const resp = [];
  
      for(let incentive of runIncentives){
        if(incentive.id !== null){
          let found = resp.find(element => element.id === incentive.id);
          if(found){
            found.options.push(incentive.option);
          }else{
            resp.push({
              "id": incentive.id,
              "incentive": incentive.name,
              "options": incentive.option !== null ? [incentive.option] : []
            });
          }
        }
      }
  
      return {success: resp};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};