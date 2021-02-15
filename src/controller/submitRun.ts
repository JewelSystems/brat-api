import { getRepository } from 'typeorm';
import logger from '../loaders/logger';
import BidwarOption from '../models/BidwarOption';
import RunIncentive from '../models/RunIncentive';
import RunRunner from '../models/RunRunner';
import SubmitRun from '../models/SubmitRun';

export default{
  async getSubmitRuns() {
    logger.log("info", "Starting get submit runs function");
    try{

      const submitRunsRepository = getRepository(SubmitRun);

      const submitRuns = await submitRunsRepository
        .createQueryBuilder("submit_runs")
        .leftJoinAndSelect("submit_runs.event_id", "event")
        .leftJoinAndSelect("submit_runs.run_id", "run")
        .leftJoinAndSelect("run.game_id", "game")
        .leftJoinAndSelect(RunRunner, "run_runner", "run_runner.run_id = run.id")
        .leftJoinAndSelect("run_runner.runner_id", "user")
        .leftJoinAndSelect(RunIncentive, "run_incentives", "run_incentives.run_id = run.id")
        .leftJoinAndSelect(BidwarOption, "bidwar_options", "bidwar_options.incentive_id = run_incentives.id")
        .select(
          [
            "submit_runs.id as id", 
            "event.name as event_name",
            "game.name as game_name",
            "run.category as category",
            "run.platform as platform",
            "run.preferred_time_slot as time_slot",
            "submit_runs.reviewed as reviewed",
            "submit_runs.approved as approved",
            "submit_runs.waiting as waiting",
            "user.nickname as runner",
            "run_incentives",
            "bidwar_options"
            //"incentives": [],
            //"approved_incentives": {},
            //"goals": {}
          ]
        )
        .getRawMany();

      let resp: any[] = [];
      let curId = '';
      let curIncentiveId = '';
      for(let submitRun of submitRuns){
        if(submitRun.id != curId){
          curId = submitRun.id;
          resp.push({
            "id": submitRun.id,
            "event_name": submitRun.event_name,
            "game_name": submitRun.game_name,
            "category": submitRun.category,
            "platform": submitRun.platform,
            "time_slot": submitRun.time_slot,
            "reviewed": submitRun.reviewed,
            "approved": submitRun.approved,
            "waiting": submitRun.waiting,
            "runner": submitRun.runner,
            "incentives": [],
            "approved_incentives": {},
            "goals": {}
          });
        }
        const arrIdx = resp.length-1;
        if(submitRun.run_incentives_id && submitRun.run_incentives_id != curIncentiveId){
          curIncentiveId = submitRun.run_incentives_id;
          resp[arrIdx].incentives.push({
            "id": submitRun.run_incentives_id,
            "run_id": submitRun.run_incentives_run_id,
            "type": submitRun.run_incentives_type,
            "comment": submitRun.run_incentives_comment,
            "name": submitRun.run_incentives_name,
            "BidwarOptions": []
          });
          //TODO existance verification like commented below
          resp[arrIdx].approved_incentives[submitRun.run_incentives_id] = 'true';
          if(submitRun.run_incentives_type === 'none') resp[arrIdx].goals[submitRun.run_incentives_id] = 100;
        }
        if(submitRun.bidwar_options_id){
          let incentivesIdx = resp[arrIdx].incentives.length-1;
          resp[arrIdx].incentives[incentivesIdx].BidwarOptions.push({
            "id": submitRun.bidwar_options_id,
            "option": submitRun.bidwar_options_option,
            "incentive_id":submitRun.bidwar_options_incentive_id
          });
        }

        /*
        if(value.reviewed && resp[submitRun].incentives.length > 0){
          for(incentive in resp[submitRun].incentives){
            const incentiveFound = await EventRunIncentive.findOne({ where:{ incentive_id: resp[submitRun].incentives[incentive].id } });
            if(incentiveFound) { 
              resp[submitRun].approved_incentives[resp[submitRun].incentives[incentive].id] = true;
              if(incentiveFound.dataValues.goal !== 0) resp[submitRun].goals[resp[submitRun].incentives[incentive].id] = incentiveFound.dataValues.goal;
            }else{
              resp[submitRun].approved_incentives[resp[submitRun].incentives[incentive].id] = false;
            }
          }
        }
        */
      }
  
      return {success: resp};
    }catch(error){
      console.log(error);
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },
};