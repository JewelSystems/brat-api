import logger from '../loaders/logger';
import BidwarOption from '../models/BidwarOption';
import EventRun from '../models/EventRun';
import EventRunIncentive from '../models/EventRunIncentive';
import EventRunBidwarOption from '../models/EventRunBidwarOption';
import RunIncentive from '../models/RunIncentive';
import RunRunner from '../models/RunRunner';
import SubmitRun from '../models/SubmitRun';
import {SubmitRunRepo, EventRunIncentiveRepo, EventRunRepo, EventRunBidwarOptionRepo, RunIncentiveRepo} from '../loaders/typeorm';

interface CtrlResponse{
  success?: any;
  error?: string;
}

interface ISubmitRun{
  id: string;
  reviewed: boolean;
  approved: boolean;
  waiting: boolean;
  event_run?: EventRun | null;
}

interface IIncentive{
  id: string;
  run_id: string;
  type: string;
  comment: string;
  name: string;
  options: IOption[];
  goal?: number;
}

interface IOption{
  id: string;
  name: string;
}

interface IGetSubmitRun{
  id: string;
  event_name: string;
  game_name: string;
  category: string;
  platform: string;
  time_slot: string;
  reviewed: boolean;
  approved: boolean;
  waiting: boolean;
  runner: string;
  incentives: {
    id: string;
    run_id: string;
    type: string;
    comment: string;
    name: string;
    BidwarOptions: {
      id: string;
      option: string;
      incentive_id: string
    }[];
  }[];
  approved_incentives: Record<string, any>;//{},
  goals: Record<string, any>;//{}
}

export default{
  async getSubmitRuns(): Promise<CtrlResponse> {
    logger.log("info", "Starting get submit runs function");
    try{
      const submitRuns = await SubmitRunRepo
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
          ]
        )
        .getRawMany();

      let resp: IGetSubmitRun[] = [];
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
        const respIdx = resp.length-1;
        if(submitRun.run_incentives_id && submitRun.run_incentives_id != curIncentiveId){
          curIncentiveId = submitRun.run_incentives_id;
          resp[respIdx].incentives.push({
            "id": submitRun.run_incentives_id,
            "run_id": submitRun.run_incentives_run_id,
            "type": submitRun.run_incentives_type,
            "comment": submitRun.run_incentives_comment,
            "name": submitRun.run_incentives_name,
            "BidwarOptions": []
          });

          if(submitRun.reviewed && resp[respIdx].incentives.length > 0){
            const incentiveIdx = resp[respIdx].incentives.length-1;
            const incentiveFound = await EventRunIncentiveRepo.findOne({ incentive_id: Number(resp[respIdx].incentives[incentiveIdx].id) });
            if(incentiveFound){
              resp[respIdx].approved_incentives[submitRun.run_incentives_id] = 'true';
              if(incentiveFound.goal !== 0) resp[respIdx].goals[resp[respIdx].incentives[incentiveIdx].id] = incentiveFound.goal;
            }else{
              resp[respIdx].approved_incentives[submitRun.run_incentives_id] = 'false';
            }
          }

        }
        if(submitRun.bidwar_options_id){
          let incentivesIdx = resp[respIdx].incentives.length-1;
          resp[respIdx].incentives[incentivesIdx].BidwarOptions.push({
            "id": submitRun.bidwar_options_id,
            "option": submitRun.bidwar_options_option,
            "incentive_id":submitRun.bidwar_options_incentive_id
          });
        }
      }
  
      return {success: resp};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async update(id: string, reviewed: boolean, approved: boolean, waiting: boolean): Promise<CtrlResponse> {
    logger.log("info", "Starting submit run update function");
    // Update submit run
    try{      
      await SubmitRunRepo.update(id,{
        reviewed: reviewed,
        approved: approved,
        waiting: waiting
      });
        
      const resp: ISubmitRun = {
        id: id,
        reviewed: reviewed,
        approved: approved,
        waiting: waiting,
      };

      const submitRun = await SubmitRunRepo.findOne({ id: Number(id) });
      //Create or remove evaluated submitted runs from event_runs table.
      let newEvtRun = null;
      let evtRun = null;

      if(submitRun){
        if(approved){
          evtRun = await EventRunRepo.findOne({ run_id: submitRun.run_id });
          
          if(!evtRun){
            if(waiting){
              newEvtRun = EventRunRepo.create({event_id: submitRun.event_id, run_id: submitRun.run_id, date: '01-01-2021'});
              await EventRunRepo.save(newEvtRun);
            }else{
              newEvtRun = EventRunRepo.create({event_id: submitRun.event_id, run_id: submitRun.run_id, date: '01-01-2021'});
              await EventRunRepo.save(newEvtRun);
            }
          }
        }else{
          await EventRunRepo.delete({ run_id: submitRun.run_id });
        }
      }

      if(newEvtRun) resp.event_run = newEvtRun;
      else resp.event_run = evtRun;

      return {success: resp};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async refuseSubmitRunNRemoveIncentives(id: string, reviewed: boolean, approved: boolean, waiting: boolean): Promise<CtrlResponse> {
    logger.log("info", "Starting submit run with incentives refuse function");
    // Remove submit run with incentives
    try{      
      await SubmitRunRepo.update(id,{
        reviewed: reviewed,
        approved: approved,
        waiting: waiting
      });
      
      const submitRun = await SubmitRunRepo.findOne({ id: Number(id) });
        
      const resp = {
        id: id,
        reviewed: reviewed,
        approved: approved,
        waiting: waiting,
      };

      if(submitRun){
        //TODO atualizar array de approve quando remover
        const eventRun = await EventRunRepo.findOne({ run_id: submitRun.run_id });
        if(eventRun){
          const incentives = await EventRunIncentiveRepo.find({ where:{ event_run_id: eventRun.id } });
          for(let incentive of incentives){
            const options = await EventRunBidwarOptionRepo.find({ where:{ event_run_incentive_id: incentive.id } });
            for(let option of options){
              EventRunBidwarOptionRepo.delete(option.id);
            }
            EventRunIncentiveRepo.delete(incentive.id);
          }
          EventRunRepo.delete(eventRun.id);
        }
      }
      
      return {success: resp};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  },

  async updateSubmitRunNRunIncentives(id: string, reviewed: boolean, approved: boolean, waiting: boolean, incentives: IIncentive[]): Promise<CtrlResponse> {
    logger.log("info", "Starting submit run with incentives update function");
    // Update submit run
    try{
      //const runIncentivesRepository = getRepository(RunIncentive);
      //const eventRunIncentivesRepository = getRepository(EventRunIncentive);
      //const eventRunBidwarOptionRepository = getRepository(EventRunBidwarOption);

      let eventRunId = await this.update(id, reviewed, approved, waiting);
      const eventRunInfo = eventRunId.success;
      let approvedIncentives: any = {};
      let goals: any = {};

      const allIncentives = await RunIncentiveRepo.find({ where:{run_id: eventRunInfo.event_run.run_id} });

      for(let incentive of allIncentives){
        const curIncentive = incentives.filter((element: IIncentive) => Number(element.id) === Number(incentive.id));
        const eventRunIncentiveFound = await EventRunIncentiveRepo.findOne({ where:{incentive_id: incentive.id} });
        
        if(curIncentive.length > 0){
          if(eventRunIncentiveFound){
            //If the event run incentive was found, update it's values.
            await EventRunIncentiveRepo.update(curIncentive[0].id, {
              "event_run_id": eventRunInfo.event_run.id,
              "incentive_id": Number(curIncentive[0].id),
              "goal": Number(curIncentive[0].goal) ? Number(curIncentive[0].goal) : 0
            });
          }else{
            //If the event run incentive wasn't found, create it.
            const eventRunIncentive = EventRunIncentiveRepo.create({
              "event_run_id": Number(eventRunInfo.event_run.id),
              "incentive_id": Number(curIncentive[0].id),
              "cur_value": 0,
              "goal": Number(curIncentive[0].goal) ? Number(curIncentive[0].goal) : 0
            });
            await EventRunIncentiveRepo.save(eventRunIncentive);

            if(curIncentive[0].options && curIncentive[0].options.length > 0){
              for(let option of curIncentive[0].options){
                const eventRunBidwarOption = EventRunBidwarOptionRepo.create({
                  "event_run_incentive_id": Number(eventRunIncentive.id),
                  "bidwar_option_id": Number(option.id),
                  "cur_value": 0
                });
                await EventRunBidwarOptionRepo.save(eventRunBidwarOption);
              }
            }
          }
          approvedIncentives[incentive.id] = true;
          if(curIncentive[0].goal !== 0) goals[incentive.id] = curIncentive[0].goal;
        }else{
          if(eventRunIncentiveFound){
            await EventRunBidwarOptionRepo.delete({ event_run_incentive_id: eventRunIncentiveFound.id });
            await EventRunIncentiveRepo.delete({ incentive_id: incentive.id });
          }
          approvedIncentives[incentive.id] = false;
        }
      }

      const resp = {
        id: id,
        reviewed: reviewed,
        approved: approved,
        waiting: waiting,
        approved_incentives: approvedIncentives,
        goals: goals
      };
      
      return {success: resp};
    }catch(error){
      logger.log("error", "DB Error: " + JSON.stringify(error));
      return {error: "Server error"};
    }
  }
};