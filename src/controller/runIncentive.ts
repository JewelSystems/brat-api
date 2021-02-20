import RunIncentive from '../models/RunIncentive';
import logger from '../loaders/logger';
import { getRepository } from 'typeorm';
import BidwarOption from '../models/BidwarOption';
import EventSchedule from '../models/EventSchedule';

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
      const bidwarOptionRepository = getRepository(BidwarOption);
      const runIncentiveRepository = getRepository(RunIncentive);

      if(!incentive.goal){
        for(let option of incentive.bidwar_options){
          bidwarOptionRepository.update(option.id, {
            option: option.option,
          });
        }
      }
            
      runIncentiveRepository.update(incentive.id, {
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
      const eventScheduleRepository = getRepository(EventSchedule);

      const runIncentives = await eventScheduleRepository
        .createQueryBuilder("event_schedule")
        .leftJoinAndSelect("event_schedule.event_run_id", "event_run")
        .leftJoinAndSelect("event_run.run_id", "run")
        .leftJoinAndSelect(RunIncentive, "run_incentive", "run_incentive.run_id = run.id")
        .leftJoinAndSelect(BidwarOption, "bidwar_options", "bidwar_options.incentive_id = run_incentive.id")
        .select([
          'run_incentive.id as id',
          'run_incentive.name as name',
          "bidwar_options.option as 'option'"
        ])
        .where(`event_schedule.id = ${scheduleId}`)
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